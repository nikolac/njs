var njstests = [
	{
		name: "traverse - baseline"
		,group: 'traverse'
		,run: function(){
			var msg = ""
				,passed = true
				,t = {
					'name': 'root'
					,'children': [
						{
							'name':'firstChild'
							,'children':[]
						}
						,{
							'name':'secondChild'
							,'children':[]
						}
					]
				}
			;

			try{
				njs.traverse(t, function(n, d){
					console.log(njs.makeStr('\t', d) + n.name);
				});
			} catch(e){
				console.error(e);
				passed = false;
				msg = e.toString();
			}

			return {
				passed: passed
				,msg: msg
			};
		}
	}
	,{
		name: "addjquery"
		,group: 'include js'
		,run: function(){
			var msg = ""
				,passed = true
			;

			try{
				njs.jquery(undefined, function(){
					console.log('jquery version', jQuery().jquery);
				});
				
			} catch(e){
				console.error(e);
				passed = false;
				msg = e.toString();
			}

			return {
				passed: passed
				,msg: msg
			};
		}
	}
	,{
		name: "even kids"
		,group: 'generate tree'
		,run: function(){
			var msg = ""
				,passed = true
			;

			try{
				var t = njs.generateTree(3, 0, 2, false);
				njs.printTree(t);
				
			} catch(e){
				console.error(e);
				passed = false;
				msg = e.toString();
			}

			return {
				passed: passed
				,msg: msg
			};
		}
	}
	,{
		name: "long name even"
		,group: 'generate tree'
		,run: function(){
			var msg = ""
				,passed = true
			;

			try{
				var t = njs.generateTree(3, 0, 2, false);
				njs.printTree(t, function(n){
					return njs.numToAlpha(njs.hash(n.name));
				});
				
			} catch(e){
				console.error(e);
				passed = false;
				msg = e.toString();
			}

			return {
				passed: passed
				,msg: msg
			};
		}
	}
	,{
		name: "odd kids"
		,group: 'generate tree'
		,run: function(){
			var msg = ""
				,passed = true
			;

			try{
				var t = njs.generateTree(3, 0, 3, false);
				njs.printTree(t);
				
			} catch(e){
				console.error(e);
				passed = false;
				msg = e.toString();
			}

			return {
				passed: passed
				,msg: msg
			};
		}
	}
	,{
		name: "odd kids deep"
		,group: 'generate tree'
		,run: function(){
			var msg = ""
				,passed = true
			;

			try{
				var t = njs.generateTree(4, 0, 3, false);
				njs.printTree(t);
				
			} catch(e){
				console.error(e);
				passed = false;
				msg = e.toString();
			}

			return {
				passed: passed
				,msg: msg
			};
		}
	}
	,{
		name: "even kids deep"
		,group: 'generate tree'
		,run: function(){
			var msg = ""
				,passed = true
			;

			try{
				var t = njs.generateTree(5, 0, 2, false);
				njs.printTree(t);
				
			} catch(e){
				console.error(e);
				passed = false;
				msg = e.toString();
			}

			return {
				passed: passed
				,msg: msg
			};
		}
	}
	,{
		name: "odd kids wide shallow"
		,group: 'generate tree'
		,run: function(){
			var msg = ""
				,passed = true
			;

			try{
				var t = njs.generateTree(2, 0, 5, false);

				njs.printTree(t);
				
			} catch(e){
				console.error(e);
				passed = false;
				msg = e.toString();
			}

			return {
				passed: passed
				,msg: msg
			};
		}
	}
	,{
		name: "even kids wide shallow"
		,group: 'generate tree'
		,run: function(){
			var msg = ""
				,passed = true
			;

			try{
				var t = njs.generateTree(2, 0, 6, false);
				njs.printTree(t);
				
			} catch(e){
				console.error(e);
				passed = false;
				msg = e.toString();
			}

			return {
				passed: passed
				,msg: msg
			};
		}
	}
	,{
		name: "mix even odd kids"
		,group: 'generate tree'
		,run: function(){
			var msg = ""
				,passed = true
			;

			try{
				var t = njs.generateTree(3, 1, 5, true);
				njs.printTree(t);
				
			} catch(e){
				passed = false;
				msg = e.toString();
			}

			return {
				passed: passed
				,msg: msg
			};
		}
	}
	,{
		name: "count map"
		,group: 'count map'
		,run: function(){
			var msg = ""
				,passed = true
			;

			try{
				var cmap = njs.getCountMap();

				console.log('adding nik');
				cmap.add('nik');
				
				console.log('adding nik');
				cmap.add('nik');

				console.log('asserting nik == 2');
				if(cmap.get('nik') !== 2){
					throw 'expected 2 but got ' + cmap.get('nik');
				}
				console.log('asserting bob == 0');
				if(cmap.get('bob') !== 0){
					throw 'expected 0 but got ' + cmap.get('bob');
				}

				cmap.print();
			} catch(e){
				passed = false;
				msg = e.toString();
			}

			return {
				passed: passed
				,msg: msg
			};
		}
	}
	,{
		name: "rand pick"
		,group: 'pick'
		,run: function(){
			var msg = ""
				,passed = true
			;

			try{
				var l = [0,1,2,3,4,5];
				console.log('picking from', l);
				

				for(var i = 0; i < 20; i++){
					var p = njs.pick(l);

					console.log('picked', p, ', assert',p,'in l');

					if(l.indexOf(p) === -1){
						throw p + " not in list";
					}
				}

			} catch(e){
				passed = false;
				msg = e.toString();
			}

			return {
				passed: passed
				,msg: msg
			};
		}
	}
	,{
		name: "make range"
		,group: 'range'
		,run: function(){
			var msg = ""
				,passed = true
			;

			try{
				var min = 3;
				var max = 20;

				var r = njs.range(min, max);

				console.log("min", min, "max", max, "range", r);

				for( var i = 0; i < r.length; i++){
					var val = r[i];

					if(val < min){
						throw (val + " less than the min ");
					}

					if(val >= max){
						throw (val + " greater than or equal to max");
					}
				}

			} catch(e){
				passed = false;
				msg = e.toString();
			}

			return {
				passed: passed
				,msg: msg
			};
		}
	}
	,{
		name: "hash fn"
		,group: 'hash'
		,run: function(){
			var msg = ""
				,passed = true
			;

			try{
				var h = 0;
				var v = njs.hash(h);

				console.log("hashed", h, 'got',v);

				h = "";
				v = njs.hash(h);

				console.log('hashed', h, 'got', v);

				h = 1;
				v = njs.hash(h);

				console.log('hashed', h, 'got', v);

				h = null;
				v = njs.hash(h);

				console.log('hashed', h, 'got', v);

				h = undefined;
				v = njs.hash(h);

				console.log('hashed', h, 'got', v);

				h = 'nik';
				v = njs.hash(h);

				console.log('hashed', h, 'got', v);

				h = 'bob';
				v = njs.hash(h);

				console.log('hashed', h, 'got', v);

				h = 'kin';
				v = njs.hash(h);

				console.log('hashed', h, 'got', v);

				h = 'nikkanikadfasdfinikkadfanikfadfniadsfinisdfsdfinalkjlwer';
				v = njs.hash(h);

				console.log('hashed', h, 'got', v);
			} catch(e){
				console.error(e);
				passed = false;
				msg = e.toString();
			}

			return {
				passed: passed
				,msg: msg
			};
		}
	}
	,{
		name: "two simple objects"
		,group: 'merge'
		,run: function(){
			var msg = ""
				,passed = true
			;

			try{
				var a = {
					name:'nik'
					,age: '22'
				};

				var b = {
					type: 'person'
					,sex: 'male'
				};

				var c = njs.merge(a,b);

				console.log("merged", a, b, "into", c);

				if(c.name !== a.name) throw "expected " + a.name + " got " + c.name;
				if(c.age !== a.age) throw "expected " + a.age + " got " + c.age;
				if(c.type !== b.type) throw "expected " + b.type + " got " + c.type;
				if(c.sex !== b.sex) throw "expected " + b.sex + " got " + c.sex;


			} catch(e){
				console.error(e);
				passed = false;
				msg = e.toString();
			}

			return {
				passed: passed
				,msg: msg
			};
		}
	}
	,{
		name: "list and object"
		,group: 'merge'
		,run: function(){
			var msg = ""
				,passed = true
			;

			try{
				var a = ['nik', 'collins'];

				var b = {
					type: 'person'
					,sex: 'male'
				};

				var c = njs.merge(a,b);

				console.log("merged", a, b, "into", c);


			} catch(e){
				console.error(e);
				passed = false;
				msg = e.toString();
			}

			return {
				passed: passed
				,msg: msg
			};
		}
	}
	,{
		name: "simple list"
		,group: 'build map'
		,run: function(){
			var msg = ""
				,passed = true
			;

			try{
				var l = [
					{name: 'nik', type:'person' }
					,{name: 'larry', type:'cat' }
					,{name: 'm235i', type:'car' }
				];

				var mp = njs.buildMap(l, function(o){return o.name;});

				console.log(l, "to map", mp);
			} catch(e){
				console.error(e);
				passed = false;
				msg = e.toString();
			}

			return {
				passed: passed
				,msg: msg
			};
		}
	}
	,{
		name: "reduce map"
		,group: 'reduce map'
		,run: function(){
			var msg = ""
				,passed = true
			;

			try{
				var l = [
					{name: 'nik', type:'person' }
					,{name: 'larry', type:'cat' }
					,{name: 'm3', type:'car' }
					,{name: 'm235i', type:'car' }
					,{name: 'm4', type:'car' }
					,{name: 'm6', type:'car' }
					,{name: 'm5', type:'car' }
				];

				var mp = njs.reduceMap(l, function(o){return o.type;});

				console.log(l, "to reduce map", mp);
			} catch(e){
				console.error(e);
				passed = false;
				msg = e.toString();
			}

			return {
				passed: passed
				,msg: msg
			};
		}
	}
	,{
		name: "make str"
		,group: 'make str'
		,run: function(){
			var msg = ""
				,passed = true
			;

			try{
				var s,l,v, r;
				
				l = 5;
				s = ' ';
				v = njs.makeStr(s, l);
				r = '     ';

				console.log('l', l, 'ch', s, 'v', v);
				
				if(v !== r) throw 'expected \''+r+'\' got \''+v +'\'';

				l = 5;
				s = '';
				v = njs.makeStr(s, l);
				r = '';

				console.log('l', l, 'ch', s, 'v', v);
				
				if(v !== r) throw 'expected \''+r+'\' got \''+v +'\'';

				l = 0;
				s = '';
				v = njs.makeStr(s, l);
				r = '';

				console.log('l', l, 'ch', s, 'v', v);
				
				if(v !== r) throw 'expected \''+r+'\' got \''+v +'\'';

				l = 6;
				s = 's';
				v = njs.makeStr(s, l);
				r = 'ssssss';

				console.log('l', l, 'ch', s, 'v', v);

				l = 1;
				s = '\t';
				v = njs.makeStr(s, l);
				r = '\t';

				console.log('l', l, 'ch', s, 'v', v);
				
				if(v !== r) throw 'expected \''+r+'\' got \''+v +'\'';
				
				if(v !== r) throw 'expected \''+r+'\' got \''+v +'\'';

			} catch(e){
				console.error(e);
				passed = false;
				msg = e.toString();
			}

			return {
				passed: passed
				,msg: msg
			};
		}
	}
	,{
		name: "alpha"
		,group: 'alpha'
		,run: function(){
			var msg = ""
				,passed = true
			;

			try{
				var n, e, v;

				n = 0;
				e = 'a';
				v = njs.alpha(n);
				
				console.log('number', n, 'expected', e, 'actual', v);

				if(e !== v) throw 'expected ' + e + ' actual ' + v;

				n = 25;
				e = 'z';
				v = njs.alpha(n);
				
				console.log('number', n, 'expected', e, 'actual', v);

				if(e !== v) throw 'expected ' + e + ' actual ' + v;


			} catch(er){
				console.error(er);
				passed = false;
				msg = er.toString();
			}

			return {
				passed: passed
				,msg: msg
			};
		}
	}
	,{
		name: "alpha back"
		,group: 'alpha back'
		,run: function(){
			var msg = ""
				,passed = true
			;

			try{
				var n, e, v;

				n = 'a';
				e = 0;
				v = njs.alphaBack(n);
				
				console.log('number', n, 'expected', e, 'actual', v);

				if(e !== v) throw 'expected ' + e + ' actual ' + v;

				n = 'z';
				e = 25;
				v = njs.alphaBack(n);
				
				console.log('number', n, 'expected', e, 'actual', v);

				if(e !== v) throw 'expected ' + e + ' actual ' + v;


			} catch(er){
				console.error(er);
				passed = false;
				msg = er.toString();
			}

			return {
				passed: passed
				,msg: msg
			};
		}
	}
	,{
		name: "numToAlpha"
		,group: 'numToAlpha'
		,run: function(){
			var msg = ""
				,passed = true
			;

			try{
				var n, e, v;

				n = 0;
				e = 'a';
				v = njs.numToAlpha(n);
				
				console.log('number', n, 'expected', e, 'actual', v);

				if(e !== v) throw 'expected ' + e + ' actual ' + v;

				n = 25;
				e = 'z';
				v = njs.numToAlpha(n);
				
				console.log('number', n, 'expected', e, 'actual', v);

				if(e !== v) throw 'expected ' + e + ' actual ' + v;

				n = 52;
				e = 'ca';
				v = njs.numToAlpha(n);
				
				console.log('number', n, 'expected', e, 'actual', v);

				if(e !== v) throw 'expected ' + e + ' actual ' + v;

				n = 53;
				e = 'cb';
				v = njs.numToAlpha(n);
				
				console.log('number', n, 'expected', e, 'actual', v);

				if(e !== v) throw 'expected ' + e + ' actual ' + v;

				n = 53;
				e = 'cb';
				v = njs.numToAlpha(n);
				
				console.log('number', n, 'expected', e, 'actual', v);

				if(e !== v) throw 'expected ' + e + ' actual ' + v;

				n = 9006;
				e = 'nik';
				v = njs.numToAlpha(n);
				
				console.log('number', n, 'expected', e, 'actual', v);

				if(e !== v) throw 'expected ' + e + ' actual ' + v;

			} catch(er){
				console.error(er);
				passed = false;
				msg = er.toString();
			}

			return {
				passed: passed
				,msg: msg
			};
		}
	}
	,,{
		name: "alphaToNum"
		,group: 'alphaToNum'
		,run: function(){
			var msg = ""
				,passed = true
			;

			try{
				var n, e, v;

				e = 0;
				n = 'a';
				v = njs.alphaToNum(n);
				
				console.log('number', n, 'expected', e, 'actual', v);

				if(e !== v) throw 'expected ' + e + ' actual ' + v;

				e = 25;
				n = 'z';
				v = njs.alphaToNum(n);
				
				console.log('number', n, 'expected', e, 'actual', v);

				if(e !== v) throw 'expected ' + e + ' actual ' + v;

				e = 52;
				n = 'ca';
				v = njs.alphaToNum(n);
				
				console.log('number', n, 'expected', e, 'actual', v);

				if(e !== v) throw 'expected ' + e + ' actual ' + v;

				e = 53;
				n = 'cb';
				v = njs.alphaToNum(n);
				
				console.log('number', n, 'expected', e, 'actual', v);

				if(e !== v) throw 'expected ' + e + ' actual ' + v;

				e= 53;
				n = 'cb';
				v = njs.alphaToNum(n);
				
				console.log('number', n, 'expected', e, 'actual', v);

				if(e !== v) throw 'expected ' + e + ' actual ' + v;

				e = 9006;
				n = 'nik';
				v = njs.alphaToNum(n);
				
				console.log('number', n, 'expected', e, 'actual', v);

				if(e !== v) throw 'expected ' + e + ' actual ' + v;

			} catch(er){
				console.error(er);
				passed = false;
				msg = er.toString();
			}

			return {
				passed: passed
				,msg: msg
			};
		}
	}
	,{
		name: "functional"
		,group: 'uuid'
		,run: function(){
			var msg = ""
				,passed = true
			;

			try{
				console.log(njs.uuid());
			} catch(er){
				console.error(er);
				passed = false;
				msg = er.toString();
			}

			return {
				passed: passed
				,msg: msg
			};
		}
	}
];

function runAllTests(){
	var results = [];
	njstests.forEach(function(t,i){
		var testName = njs.pad(i + 1 )+ " " + t.group + ": " +t.name;
		
		if(i == njstests.length - 1){
			console.group(testName);
		} else {
			console.groupCollapsed(testName);
		}

		var res = t.run();
		
		results.push({
			group: t.group
			,name: t.name
			,passed: res.passed
			,message: res.msg
		});

		console.log('done');
		console.groupEnd();
	});

	console.table(results);
}

