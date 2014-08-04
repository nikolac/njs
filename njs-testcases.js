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
				njs.traverse(t);
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
		name: "addjquery"
		,group: 'include js'
		,run: function(){
			var msg = ""
				,passed = true
			;

			try{
				njs.jquery(undefined, function(){
					jQuery().jquery;
				});
				
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
		name: "even kids"
		,group: 'generate tree'
		,run: function(){
			var msg = ""
				,passed = true
			;

			try{
				var t = njs.generateTree(3, 0, 2, false);
				njs.printTree(t, function(n){
					return n.__pos;
				});

				njs.printTree(t, function(n){
					return n.__id;
				});
				
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
		name: "odd kids"
		,group: 'generate tree'
		,run: function(){
			var msg = ""
				,passed = true
			;

			try{
				var t = njs.generateTree(3, 0, 3, false);
				njs.printTree(t, function(n){
					return n.__pos;
				});

				njs.printTree(t, function(n){
					return n.__id;
				});
				
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
		name: "mix even odd kids"
		,group: 'generate tree'
		,run: function(){
			var msg = ""
				,passed = true
			;

			try{
				var t = njs.generateTree(3, 2, 4, true);
				njs.printTree(t, function(n){
					return n.__pos;
				});

				njs.printTree(t, function(n){
					return n.__id;
				});
				
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
];

function runAllTests(){
	var results = [];
	njstests.forEach(function(t,i){
		console.group((i + 1 )+ " " + t.group + ": " +t.name);
		
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

