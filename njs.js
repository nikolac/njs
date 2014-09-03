window.njs = (function(){
	const CURRENT_DIR = document.currentScript.src.match(/.*?(?=\/[a-z0-9-_]+\.js)/gi)[0]
		,JQUERY_VERSION = '1.11.0'
		,BRANCH_COLORS = [
			'#00008B' //Dark blue
			,'#8B0000' // Dark Red
			,'#008B8B' // Dark Cyan
			,'#9400D3' // Dark Violet
			,'#DAA520' // GOLDEN Rod
			,'#006400' // Dark Green
		]
		,VERT = '|'
		,HORZ = '-'
		,LEFT = '\\'
		,RIGHT = '/'
	;
	
	function addJquery(version, cb){
		version = version || JQUERY_VERSION;
		
		includeJs("https://ajax.googleapis.com/ajax/libs/jquery/"+version+"/jquery.min.js", cb);
	}

	var traverse = function(root, modFn, depth, parent, childCnt){
		depth = depth || 0;

		if(modFn) modFn(root, depth, parent, childCnt);

		for(var i = 0; root.children && root.children.length && i < root.children.length; i++ ){
			var child = root.children[i];

			traverse(child, modFn, depth + 1, root, i);
		}
	};

	var generateTree = function(maxDepth, minChildren, maxChildren, rand){
		minChildren = minChildren || 0;
		maxChildren = maxChildren || 3;
		maxDepth = maxDepth || 2;

		var numChildren
			,tree = {
				name: '0'
				,children: []
				,depth: 0
				,siblingIndex: 0
			}
		;

		function buildTree(tree, childStack){
			childStack = childStack || [tree];
			
			if(childStack.length <= 0 ) return tree;
			
			var node = childStack.pop();
			numChildren = rand ? pick(range(minChildren,maxChildren)):maxChildren - minChildren;

			for(var i = 0; node.depth < maxDepth && i < numChildren; i++){

				var child = {
					name: node.name + "" + i
					,children: []
					,depth: node.depth + 1
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
		nameFn =  nameFn || function(n){return n.name ;};

		var levelMap = []
			,treeStr = ""
			,cssLst = []
			,nodeLevels = []
		;

		traverse(tree, function(node, d, parent, childCnt){
			if(!levelMap[d]){
				levelMap[d] =[node];
			} else {
				levelMap[d].push(node);
			}

			if(d === 0){
				node.__color = "#000000";
			} else if(d === 1) {
				node.__color = BRANCH_COLORS[childCnt % BRANCH_COLORS.length];
			} else {
				node.__color = parent.__color;
			}

			node.__id = numToAlpha(((node.depth) * 26) + levelMap[node.depth].length - 1);
			node.__label = nameFn(node) ;
		});

		function setPosition(node, lastPosition){
			lastPosition = lastPosition || 0;
			
			var children = childrenFn(node);
			var fullLabelLength = node.__label.length;

			if(children.length === 0){
				node.__pos = lastPosition + fullLabelLength;
				return lastPosition + fullLabelLength + 1;
			} else {
				children.forEach(function(child){
					lastPosition = setPosition(child, lastPosition);
				});
				
				var rightPos = children[0].__pos;
				var leftPos = children[children.length - 1].__pos;

				node.__pos = leftPos + Math.round((rightPos - leftPos)/2) ;

				return lastPosition;
			}
		}

		setPosition(tree);

		levelMap.reverse();

		levelMap.forEach(function(nodes){
			var nodeStr
				,css = []
			;

			nodeStr = nodes.reduce(function(prev, node,i){
				var prevLen = prev.length - (i*2);
				var padding = emptyStr(node.__pos - prevLen - Math.floor(node.__label.length/2));
				css.push("color:"+node.__color);

				return prev  + padding + '%c' + node.__label;

			}, "");

			nodeLevels.push([nodeStr, css]);
		});

		levelMap.forEach(function(nodes,dep){
			var d = levelMap.length - 1 - dep
				,nodeLevel = nodeLevels[dep][0]
				,css = nodeLevels[dep][1]
				,nodeLevelLength = nodeLevel.length
				,nd = nodeLevel
				,numEmptyLines = 0
				,parentNodes = dep < levelMap.length - 1 ? levelMap[dep + 1] : []
				,maxChildDist = 0
			;

			parentNodes.forEach(function(node){
				var dist = 0;
				if(node.children && node.children.length > 0){
					dist = node.children[node.children.length - 1].__pos - node.children[0].__pos;

					if(dist > maxChildDist){
						maxChildDist = dist;
					}
				}
			});


			numEmptyLines = Math.floor(maxChildDist/2) || 1;

			for(var i = 1;d > 0 && i < numEmptyLines + 1; i++){
				var arr = new Array(nodeLevelLength).join(' ').split("");
				var c = [];


				nodes.forEach(function(n){
					var parentX = n.parent.__pos
						,nodeX = n.__pos

						,parentY = numEmptyLines
						,nodeY = 0
					
						,xDistFromParentOverall = nodeX - parentX
						,yDistFromParentOverall = nodeY - parentY

						,depthRatio =  i / yDistFromParentOverall
						,prevDepthRatio = ( i - 1 ) / yDistFromParentOverall
					
						,nodeXDelta = xDistFromParentOverall * depthRatio
						,prevNodeXDelta = xDistFromParentOverall * prevDepthRatio

						,relNodeX = nodeX + nodeXDelta
						,prevRelNodeX = nodeX + prevNodeXDelta

						,roundRelNodeX = Math.round(relNodeX)
						,roundPrevRelNodeX = Math.round(prevRelNodeX)

						,angle = Math.atan2( 1 , -1 * ( roundPrevRelNodeX - roundRelNodeX ) ) * 180/Math.PI

						,ch = VERT
					;

					if(angle <= 112.5 && angle > 67.5 ){
						ch = VERT;
					} else if(angle <= 67.5 && angle > 22.5){
						ch = RIGHT;
					} else if(angle <= 157.5 && angle > 112.5){
						ch = LEFT;
					} else {
						ch = HORZ;
					}

					if(arr[roundPrevRelNodeX] == ' '){
						arr[roundPrevRelNodeX] = '%c' + ch;
						c.push("color:"+n.__color);
					}
					
					
				});
				css = c.concat(css);
				nd =  arr.join("") + '\n' + nd ;
			}

			cssLst = css.concat(cssLst);

			treeStr =   nd + '\n' + treeStr;
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
	            origValue = val;
	        }
	    });
	}

	function pick(lst, weights){
		var percent = 0.00
			, weightIndexes = []
			, remainingEvenPercent = 0.00
			, rand = Math.random()
			, newMax = 0
		;

		for(var i in weights){
			newMax = percent + weights[i];

			if(rand > percent && rand <= newMax) return lst[i];

			weightIndexes.push(Number(i));
			percent += weights[i];
		}

		remainingEvenPercent = (1 - percent) / (lst.length - weightIndexes.length);

		for(i = 0; i < lst.length; i++){
			if(weightIndexes.indexOf(i) == -1){
				newMax = percent + remainingEvenPercent;

				if(rand > percent && rand <= newMax) return lst[i];
				percent += remainingEvenPercent;
			}
		}

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
			window.runAllTests();
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

    function randInRange(min, max){
    	return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    function keys(o){
		return Object.keys(o);
	}

	var geo = (function(){ 
		function getX(r, ang){
			return Math.cos(ang) * r;
		}

		function getY(r, ang){
			return Math.sin(ang) * r;
		}

		function toRad(deg){
			return ( deg / 360 ) * Math.PI * 2;
		}

		function toDeg(rad){
			return ( rad / ( Math.PI * 2 ) ) * 360;
		}

		function dist(p1, p2){
	    	return Math.sqrt(
	    			Math.pow((p2.x - p1.x), 2) + 
	    			Math.pow((p2.y - p1.y), 2)
	    	);
	    }

		return {
			 getX: getX
			,getY: getY
			,toRad: toRad
			,toDeg: toDeg
			,dist: dist
		};
	})();

	var cal = (function(){

		var timeScales = [
			'MILLI'
			,'SEC'
			,'MIN'
			,'HOUR'
			,'DAY'
			,'WEEK'
			,'MONTH'
			,'QUARTER'
			,'YEAR'
			,'DECADE'
			,'CENTURY'
		];

		function scaleValue(scale){
			return timeScales.indexOf(scale) == -1 ? undefined : timeScales.indexOf(scale);
		}
		
		function getTimeScale(startTime, endTime){
	    	var timeDiff = endTime.getTime() - startTime.getTime();
	    	
	    	 
	    	if(timeDiff <= dayLength){
	    		return "HOUR";
	    	} else if(timeDiff <= monthLength){
	    		return "DAY";
	    	} else if(timeDiff <= yearLength){
	    		return "MONTH";
	    	} else {
	    		return "YEAR";
	    	}
	    }

	    function isSameHour(a,b){
       		return a.getFullYear() === b.getFullYear() &&
       			a.getMonth() === b.getMonth() &&
       			a.getDate() === b.getDate() && 
       			a.getHours() === b.getHours()
       		;
       	}
       	function isSameDay(a,b){
       		return a.getFullYear() === b.getFullYear() &&
       			a.getMonth() === b.getMonth() &&
       			a.getDate() === b.getDate()
       		;
       	}
       	function isSameMonth(a,b){
       		return a.getFullYear() === b.getFullYear() &&
       			a.getMonth() === b.getMonth()
       		;
       	}
       	function isSameYear(a,b){
       		return a.getFullYear() === b.getFullYear();
       	}
       	function getMonthName(d, locale, style){
    		return d.toLocaleString(locale || "en-us", {month: style || 'long'});
    	}

    	function dayStart(d){
       		return new Date(d.getFullYear(), d.getMonth(), d.getDate());
       	}

       	function hourStart(d){
       		return new Date(d.getFullYear(), d.getMonth(), d.getDate(), d.getHours());
       	}

       	function dayEnd(d){
       		return new Date(d.getFullYear(), d.getMonth(), d.getDate() + 1);
       	}

       	function monthStart(d){
       		return new Date(d.getFullYear(), d.getMonth(), 1);
       	}

       	function yearStart(d){
       		return new Date(d.getFullYear(), 0, 1);
       	}

       	function addDays(d, numDays){
       		var dd = new Date(d.getTime());
       		dd.setDate(d.getDate() + numDays);

       		return dd;
       	}

       	function addHours(d, numHours){
       		var dd = new Date(d.getTime());
       		dd.setHours(d.getHours() + numHours);

       		return dd;
       	}
       	function addMonths(d, numMonths){
       		var dd = new Date(d.getTime());
			    dd.setMonth(d.getMonth() + numMonths);

       		return dd;
       	}

       	function addYears(d, numYears){
       		var dd = new Date(d.getTime());
			dd.setYear(d.getFullYear() + numYears);

       		return dd;
       	}

		return {
			getTimeScale: getTimeScale
			,scaleValue: scaleValue
			,isSameHour: isSameHour
			,isSameDay: isSameDay
			,isSameMonth:isSameMonth
			,isSameYear: isSameYear
			,getMonthName: getMonthName
			,dayStart: dayStart
			,hourStart: hourStart
			,dayEnd: dayEnd
			,monthStart: monthStart
			,yearStart: yearStart
			,addDays: addDays
			,addHours: addHours
			,addMonths: addMonths
			,addYears: addYears
		};
	})();

	var md5 = (function(){
		function md5cycle(x, k) {
		    var a = x[0],
		        b = x[1],
		        c = x[2],
		        d = x[3];

		    a = ff(a, b, c, d, k[0], 7, -680876936);
		    d = ff(d, a, b, c, k[1], 12, -389564586);
		    c = ff(c, d, a, b, k[2], 17, 606105819);
		    b = ff(b, c, d, a, k[3], 22, -1044525330);
		    a = ff(a, b, c, d, k[4], 7, -176418897);
		    d = ff(d, a, b, c, k[5], 12, 1200080426);
		    c = ff(c, d, a, b, k[6], 17, -1473231341);
		    b = ff(b, c, d, a, k[7], 22, -45705983);
		    a = ff(a, b, c, d, k[8], 7, 1770035416);
		    d = ff(d, a, b, c, k[9], 12, -1958414417);
		    c = ff(c, d, a, b, k[10], 17, -42063);
		    b = ff(b, c, d, a, k[11], 22, -1990404162);
		    a = ff(a, b, c, d, k[12], 7, 1804603682);
		    d = ff(d, a, b, c, k[13], 12, -40341101);
		    c = ff(c, d, a, b, k[14], 17, -1502002290);
		    b = ff(b, c, d, a, k[15], 22, 1236535329);

		    a = gg(a, b, c, d, k[1], 5, -165796510);
		    d = gg(d, a, b, c, k[6], 9, -1069501632);
		    c = gg(c, d, a, b, k[11], 14, 643717713);
		    b = gg(b, c, d, a, k[0], 20, -373897302);
		    a = gg(a, b, c, d, k[5], 5, -701558691);
		    d = gg(d, a, b, c, k[10], 9, 38016083);
		    c = gg(c, d, a, b, k[15], 14, -660478335);
		    b = gg(b, c, d, a, k[4], 20, -405537848);
		    a = gg(a, b, c, d, k[9], 5, 568446438);
		    d = gg(d, a, b, c, k[14], 9, -1019803690);
		    c = gg(c, d, a, b, k[3], 14, -187363961);
		    b = gg(b, c, d, a, k[8], 20, 1163531501);
		    a = gg(a, b, c, d, k[13], 5, -1444681467);
		    d = gg(d, a, b, c, k[2], 9, -51403784);
		    c = gg(c, d, a, b, k[7], 14, 1735328473);
		    b = gg(b, c, d, a, k[12], 20, -1926607734);

		    a = hh(a, b, c, d, k[5], 4, -378558);
		    d = hh(d, a, b, c, k[8], 11, -2022574463);
		    c = hh(c, d, a, b, k[11], 16, 1839030562);
		    b = hh(b, c, d, a, k[14], 23, -35309556);
		    a = hh(a, b, c, d, k[1], 4, -1530992060);
		    d = hh(d, a, b, c, k[4], 11, 1272893353);
		    c = hh(c, d, a, b, k[7], 16, -155497632);
		    b = hh(b, c, d, a, k[10], 23, -1094730640);
		    a = hh(a, b, c, d, k[13], 4, 681279174);
		    d = hh(d, a, b, c, k[0], 11, -358537222);
		    c = hh(c, d, a, b, k[3], 16, -722521979);
		    b = hh(b, c, d, a, k[6], 23, 76029189);
		    a = hh(a, b, c, d, k[9], 4, -640364487);
		    d = hh(d, a, b, c, k[12], 11, -421815835);
		    c = hh(c, d, a, b, k[15], 16, 530742520);
		    b = hh(b, c, d, a, k[2], 23, -995338651);

		    a = ii(a, b, c, d, k[0], 6, -198630844);
		    d = ii(d, a, b, c, k[7], 10, 1126891415);
		    c = ii(c, d, a, b, k[14], 15, -1416354905);
		    b = ii(b, c, d, a, k[5], 21, -57434055);
		    a = ii(a, b, c, d, k[12], 6, 1700485571);
		    d = ii(d, a, b, c, k[3], 10, -1894986606);
		    c = ii(c, d, a, b, k[10], 15, -1051523);
		    b = ii(b, c, d, a, k[1], 21, -2054922799);
		    a = ii(a, b, c, d, k[8], 6, 1873313359);
		    d = ii(d, a, b, c, k[15], 10, -30611744);
		    c = ii(c, d, a, b, k[6], 15, -1560198380);
		    b = ii(b, c, d, a, k[13], 21, 1309151649);
		    a = ii(a, b, c, d, k[4], 6, -145523070);
		    d = ii(d, a, b, c, k[11], 10, -1120210379);
		    c = ii(c, d, a, b, k[2], 15, 718787259);
		    b = ii(b, c, d, a, k[9], 21, -343485551);

		    x[0] = add32(a, x[0]);
		    x[1] = add32(b, x[1]);
		    x[2] = add32(c, x[2]);
		    x[3] = add32(d, x[3]);

		}

		function cmn(q, a, b, x, s, t) {
		    a = add32(add32(a, q), add32(x, t));
		    return add32((a << s) | (a >>> (32 - s)), b);
		}

		function ff(a, b, c, d, x, s, t) {
		    return cmn((b & c) | ((~b) & d), a, b, x, s, t);
		}

		function gg(a, b, c, d, x, s, t) {
		    return cmn((b & d) | (c & (~d)), a, b, x, s, t);
		}

		function hh(a, b, c, d, x, s, t) {
		    return cmn(b ^ c ^ d, a, b, x, s, t);
		}

		function ii(a, b, c, d, x, s, t) {
		    return cmn(c ^ (b | (~d)), a, b, x, s, t);
		}

		function md51(s) {
		    var n = s.length,
		        state = [1732584193, -271733879, -1732584194, 271733878],
		        i;
		    for (i = 64; i <= s.length; i += 64) {
		        md5cycle(state, md5blk(s.substring(i - 64, i)));
		    }
		    s = s.substring(i - 64);
		    var tail = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
		    for (i = 0; i < s.length; i++)
		        tail[i >> 2] |= s.charCodeAt(i) << ((i % 4) << 3);
		    tail[i >> 2] |= 0x80 << ((i % 4) << 3);
		    if (i > 55) {
		        md5cycle(state, tail);
		        for (i = 0; i < 16; i++) tail[i] = 0;
		    }
		    tail[14] = n * 8;
		    md5cycle(state, tail);
		    return state;
		}

		/* there needs to be support for Unicode here,
		 * unless we pretend that we can redefine the MD-5
		 * algorithm for multi-byte characters (perhaps
		 * by adding every four 16-bit characters and
		 * shortening the sum to 32 bits). Otherwise
		 * I suggest performing MD-5 as if every character
		 * was two bytes--e.g., 0040 0025 = @%--but then
		 * how will an ordinary MD-5 sum be matched?
		 * There is no way to standardize text to something
		 * like UTF-8 before transformation; speed cost is
		 * utterly prohibitive. The JavaScript standard
		 * itself needs to look at this: it should start
		 * providing access to strings as preformed UTF-8
		 * 8-bit unsigned value arrays.
		 */
		function md5blk(s) { /* I figured global was faster.   */
		    var md5blks = [],
		        i; /* Andy King said do it this way. */
		    for (i = 0; i < 64; i += 4) {
		        md5blks[i >> 2] = s.charCodeAt(i) + (s.charCodeAt(i + 1) << 8) + (s.charCodeAt(i + 2) << 16) + (s.charCodeAt(i + 3) << 24);
		    }
		    return md5blks;
		}

		var hex_chr = '0123456789abcdef'.split('');

		function rhex(n) {
		    var s = '',
		        j = 0;
		    for (; j < 4; j++)
		        s += hex_chr[(n >> (j * 8 + 4)) & 0x0F] + hex_chr[(n >> (j * 8)) & 0x0F];
		    return s;
		}

		function hex(x) {
		    for (var i = 0; i < x.length; i++)
		        x[i] = rhex(x[i]);
		    return x.join('');
		}

		function md5(s) {
		    return hex(md51(s));
		}

		/* this function is much faster,
		so if possible we use it. Some IEs
		are the only ones I know of that
		need the idiotic second function,
		generated by an if clause.  */

		function add32(a, b) {
		    return (a + b) & 0xFFFFFFFF;
		}

		return md5;
	})();

	function ordinalSufix(num){
	    if( num <= 0 )  return "";

	    switch(num % 100){
	        case 11:
	        case 12:
	        case 13:
	            return  "th";
	    }

	    switch(num % 10){
	        case 1:
	            return "st";
	        case 2:
	            return "nd";
	        case 3:
	            return "rd";
	        default:
	            return "th";
	    }
	}



	return {
		jquery: addJquery
		,CountMap: CountMap
		,debugAccess: debugAccess
		,traverse: traverse
		,stopBefore: stopBefore
		,stopAfter: stopAfter
		,pick: pick
		,keys: keys
		,merge: merge
		,pad: pad
		,buildMap: buildMap
		,generateTree: generateTree
		,printTree: printTree
		,hash: hash
		,includeJs: includeJs
		,emptyStr: emptyStr
		,alpha: alpha
		,alphaBack: alphaBack
		,numToAlpha: numToAlpha
		,alphaToNum: alphaToNum
		,range: range
		,makeStr: makeStr
		,reduceMap: reduceMap
		,uuid: uuid
		,shadeColor: shadeColor
		,randInRange: randInRange
		,geo: geo
		,md5: md5
		,ordinalSufix: ordinalSufix
		,cal: cal
	};
})();

