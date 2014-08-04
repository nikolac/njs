var njs = (function(){
	var CURRENT_DIR = document.currentScript.src.match(/.*?(?=\/[a-z0-9-_]+\.js)/gi)[0];
	var JQUERY_VERSION = '1.11.0';
	var BRANCH_COLORS = [
		'#00008B' //Dark blue
		,'#8B0000' // Dark Red
		,'#008B8B' // Dark Cyan
		,'#9400D3' // Dark Violet
		,'#DAA520' // GOLDEN Rod
		,'#006400' // Dark Green
	];
	
	function addJquery(version, cb){
		version = version || JQUERY_VERSION;
		
		includeJs("https://ajax.googleapis.com/ajax/libs/jquery/"+version+"/jquery.min.js", cb);
	}

	var traverse = function(root, modFn, depth, parentId, childCnt){
		depth = depth || 0;

		if(modFn) modFn(root, depth, parentId, childCnt);

		for(var i = 0; root.children && root.children.length && i < root.children.length; i++ ){
			var child = root.children[i];

			traverse(child, modFn, depth + 1, root.id, i);
		}
	};

	var generateTree = function(maxDepth, minChildren, maxChildren, rand){
		minChildren = minChildren || 0;
		maxChildren = maxChildren || 3;
		maxDepth = maxDepth || 2;

		var numChildren
			,tree = {
				name: 'root'
				,children: []
				,depth: 0
				,siblingIndex: 0
				,__color: '#000000'
			}
		;

		function buildTree(tree, childStack){
			childStack = childStack || [tree];
			
			if(childStack.length <= 0 ) return tree;
			
			var node = childStack.pop();
			numChildren = rand ? pick(range(minChildren,maxChildren)):maxChildren - minChildren;

			for(var i = 0; node.depth < maxDepth && i < numChildren; i++){

				var color;

				if(node.depth === 0) {
					color = BRANCH_COLORS[i % BRANCH_COLORS.length];
				} else {
					color = shadeColor( node.__color, (((node.depth + 1)/maxDepth) * 0.5) );
				}

				var child = {
					name: node.name + "" + i
					,children: []
					,depth: node.depth + 1
					,__color: color
					,parent: node

				};

				node.children.push(child);
				childStack.push(child);
			}
			
			return buildTree(tree, childStack);
		}

		buildTree(tree);

		return tree;
	};


	var printTree = function(tree, nameFn, childrenFn){
		childrenFn = childrenFn || function(n){return n.children;};
		nameFn = nameFn || function(n){return n.__pos + " " + n.__id ;};

		var levelMap = []
			,treeStr = ""
			,cssLst = []
		;

		traverse(tree, function(node, d){
			if(!levelMap[d]) levelMap[d] =[];
			levelMap[d].push(node);
			node.__id = numToAlpha(((d) * 26) + levelMap[d].length - 1);
		});

		function setPosition(node, lastPosition, lastChild, evenSibs){
			var position = lastPosition || 0;
			var children = childrenFn(node);

			if(children.length === 0){
				node.__pos = position;
				return position;
			} else {
				var evenNumChildren = children.length % 2 === 0;
				var middleIndex = Math.floor(children.length/2);
				
				children.forEach(function(child, i){
					position = setPosition(child, position, i == children.length - 1, evenNumChildren) + 1;

					if(i == middleIndex - 1 && evenNumChildren){
						node.__pos = position;
						position++;

					} else if(i == middleIndex && !evenNumChildren){
						node.__pos = child.__pos;
					}
				});

				return position - 1;
			}
		}

		function cntr(str, l, ch){
			str = String(str);
			ch = ch || ' ';

			str = str.length < l - 2 ? str.slice(0, l - 2):str;
			var diff = l - str.length;
			var half = Math.floor(diff/2);
			var s = makeStr(ch,half);

			for(var i = 0; i < str.length; i++){
				s += str.charAt(i);
			}

			while(s.length < l){
				s += ch;
			}

			return  s;
		}

		setPosition(tree);

		levelMap.forEach(function(nodes, d){
			var label
				, padLen
				, prevLen
				, pos
				, numEmptyLines = Math.floor(Math.pow((levelMap.length - d ), 2)/2)
				, nodeStr
				, emptyLineStr = ""
				, labelSize = 3

			;


			nodeStr = nodes.reduce(function(prev, node,i){
				label = cntr(nameFn(node), labelSize);
				pos = ((Math.floor(node.__pos)) * labelSize);
				prevLen = prev.length - (i*2);
				padLen = pos - prevLen ;
				cssLst.push("color:"+node.__color);

				return prev + '%c' + emptyStr(padLen) + label;
			}, "" );

			emptyLineStr = makeStr('\n', numEmptyLines);

			treeStr +=  nodeStr + '\n' + emptyLineStr;

		});

		console.log.apply(console, [treeStr].concat( cssLst));

	};

	var CountMap = function() {
	    var map = {};
	    var add = function(key) {
	        if (map[key]) {
	            map[key]++;
	        } else {
	            map[key] = 1;
	        }
	    };
	    
	    return {
	        add: function(key) {
	            return add(key);
	        }
	        ,print: function() {
	            console.log(map);
	        }
	        ,getData: function(){
	        	return map;
	        }
	        ,get:function(key){
	        	return map[key] || 0;
	        }
	   };
	};

	function stopBefore(object, methodName) {
		// stopBefore('Element.prototype.removeChild')
		if (typeof methodName == 'undefined' && typeof object == 'string') {
			var temp = resolvePath(object);
			object = temp.object;
			methodName = temp.methodName;
		}
 
		var originalMethod = object[methodName];
		object[methodName] = function patched() {
			debugger;
			var result = originalMethod.apply(this, arguments);
			return result;
		};
 
		object[methodName].removeBreakpoint = function() {
			object[methodName] = originalMethod;
		};
 
		object[methodName].__original = originalMethod;
		}
	 
	 
	function stopAfter(object, methodName) {
	 
		// stopAfter('jQuery.fn.html')
		if (typeof methodName == 'undefined') {
			var temp = resolvePath(object);
			object = temp.object;
			methodName = temp.methodName;
		}
 
		var originalMethod = object[methodName];
		object[methodName] = function patched() {
			var result = originalMethod.apply(this, arguments);
			debugger;
			return result;
		};
 
		object[methodName].removeBreakpoint = function() {
			object[methodName] = originalMethod;
		};
 
		object[methodName].__original = originalMethod;
	}
	 
	 
	function resolvePath(path) {
		var object = this;
		var parts = path.split('.');
		for (var i = 0, ii = parts.length - 1; i < ii; i++) {
			object = object[parts[i]];
		}
		return {
			object: object,
			methodName: parts[ii]
		};
	}

	function debugAccess(obj, prop, debugGet){
	    var origValue = obj[prop];
	 
	    Object.defineProperty(obj, prop, {
	        get: function () {
	            if ( debugGet )
	                debugger;
	            return origValue;
	        },
	        set: function(val) {
	            debugger;
	            return origValue = val;
	        }
	    });
	}

	function pick(lst){
		lst = lst || [];
		var length = lst.length || -1;

		if(length < 0) return;

		var idx = Math.floor(length * Math.random());

		return lst[idx];
	}

	function range(min,max){
		var r = [];
		for(var i = min; i < max; i++){
			r.push(i);
		}
		return r;
	}

	function merge(a,b){
	    var c = {};
	    for (var attrname in a) { c[attrname] = a[attrname]; }
	    for (attrname in b) { c[attrname] = b[attrname]; }
	    return c;
	}

	function pad(a, n, ch){
		n = n || 2;
		ch = ch || '0';
		
		a = String(a);

		var p = a; 

		while(p.length < n){
			p = ch + p;
		}

		return p;
	}

	function includeJs(path, cb){
		var elm = document.createElement('script');
		elm.src = path;
		elm.id = hash(path);

		elm.onload = cb || function(){};
		document.getElementsByTagName('head')[0].appendChild(elm);
	}

	function hash(str){
		var h = 0
			,i
			,chr
			,len
		;

		str = String(str);

		if (str.length === 0) return h;

		for (i = 0, len = str.length; i < len; i++) {
			chr   = str.charCodeAt(i);
			h  = ((h << 5) - h) + chr;
			h |= 0; // Convert to 32bit integer
		}
		return h;
	}

	function buildMap(list, propertyFn, inMap){
		propertyFn = propertyFn || function(){return;};
		var mp = inMap || {};

		for(var i = 0; i < list.length; i++){
			var item = list[i];
			var key = propertyFn(item);

			mp[key] = item;
		}

		return mp;
	}

	function reduceMap(list, propertyFn, inMap){
		propertyFn = propertyFn || function(){return;};
		var mp = inMap || {};

		for(var i = 0; i < list.length; i++){
			var item = list[i];
			var key = propertyFn(item);

			if(!mp[key]) mp[key] = [];

			mp[key].push(item);
		}

		return mp;
	}

	function emptyStr(len){
		return makeStr(' ', len);
	}

	function makeStr(ch, len){
		if(isNaN(len) || len < 1) return "";
		if(len < 2) return ch;
		return new Array(len + 1).join(ch);
	}

	function alpha(n){
		return String.fromCharCode(97 + n);
	}

	function alphaBack(a){
		return a.charCodeAt(0) - 97;
	}

	function numToAlpha(n){
		var numList = [0];

		function incr(l, i){
			if(i < 0){
				l.unshift(1);
				return l;
			} else if(l[i] == 25){
				l[i] = 0;
				return incr(l, i - 1);
			} else {
				l[i]++;
				return l;
			}
		}
		
		for(var i = 0; i < n; i++){
			numList = incr(numList, numList.length - 1);
		}
		
		return numList.reduce(function(prev, num){
			return prev += alpha(num);
		}, "");
	}
	
	function alphaToNum(str){
		var len = str.length
			,base = 26
			,total = 0
			,num
			,ch
		;

		for(var i = len - 1, j = 0; i >= 0; i--, j++){
			ch = str.charAt(i);
			num = alphaBack(ch);
			
			total += num * (Math.pow(base, j));
		}

		return total;
	}

	function test(){
		includeJs(CURRENT_DIR + "/njs-testcases.js", function(){
			runAllTests();
		});
	}

	function uuid() {
        function s4() {
            return Math.floor((1 + Math.random()) * 0x10000)
                .toString(16)
                .substring(1);
        }

        return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
            s4() + '-' + s4() + s4() + s4();
    }

    function shadeColor(color, percent) {   
        var f = parseInt( color.slice(1) , 16 )
            ,t = percent < 0 ? 0 : 255
            ,p = percent < 0 ? percent * -1 : percent
            
            ,R = f >> 16
            ,G = f >> 8 & 0x00FF
            ,B = f & 0x0000FF
        ;
        
        return "#" + 
            (   
                0x1000000 + ( Math.round( (t - R) * p ) + R ) * 
                0x10000   + ( Math.round( (t - G) * p ) + G ) *
                0x100     + ( Math.round( (t - B) * p ) + B )       
            )
            .toString(16)
            .slice(1)
        ;
    }

	return {
		jquery: function(version){
			return addJquery(version);
		}
		,getCountMap: function(){
			return new CountMap();
		}
		,debugAccess: function(obj, prop, debugGet){
			return debugAccess(obj, prop, debugGet);
		}
		,traverse: function(root, modFn, depth, parentId, childCnt){
			return traverse(root, modFn, depth, parentId, childCnt);
		}
		,stopBefore: function(object, methodName){
			return stopBefore(object, methodName);
		}
		,stopAfter: function(object, methodName){
			return stopAfter(object, methodName);
		}
		,pick: function(lst){
			return pick(lst);
		}
		,keys: function(o){
			return Object.keys(o);
		}
		,merge: function(a,b){
			return merge(a,b);
		}
		,pad: function(a, n, ch){
			return pad(a, n, ch);
		}
		,buildMap: function(list, property, inMap){
			return buildMap(list, property, inMap);
		}
		,generateTree: function(maxDepth, minChildren, maxChildren, rand){
			return generateTree(maxDepth, minChildren, maxChildren, rand);
		}
		,printTree: function(tree, nameFn, childrenFn){
			return printTree(tree, nameFn, childrenFn);
		}
		,hash: function(str){
			return hash(str);
		}
		,includeJs: function(path, cb){
			return includeJs(path, cb);
		}
		,emptyStr: function(len){
			return emptyStr(len);
		}
		,alpha: function(n){
			return alpha(n);
		}
		,alphaBack: function(ch){
			return alphaBack(ch);
		}
		,numToAlpha: function(n){
			return numToAlpha(n);
		}
		,alphaToNum: function(str){
			return alphaToNum(str);
		}
		,range: function(min,max){
			return range(min,max);
		}
		,test: function(){
			return test();
		}
		,makeStr: function(a,b){
			return makeStr(a,b);
		}
		,reduceMap: function(list, propertyFn, inMap){
			return reduceMap(list, propertyFn, inMap);
		}
		,uuid: function(){
			return uuid();
		}
		,shadeColor: function(color, percent){
			return shadeColor(color, percent);
		}
	};
})();

