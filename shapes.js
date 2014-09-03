

(function(){
	return {
		Gear: (function(){
			return function(config){
				config = config || {};

				 var  rootX = config.x || 0
					, rootY = config.y || 0
					, numTeeth = config.numTeeth || 32
					, toothHeight = config.toothHeight || 20
					, baseRadius = config.baseRadius || 100
					, points = []
					, startAngle = Math.PI/2
				;

				function pts(i){
					 var ang = startAngle + ( ( Math.PI * i ) / numTeeth )
					 	,xRat = Math.cos(ang)
					 	,yRat = Math.sin(ang)
					 	,xBottom = xRat * baseRadius
					 	,yBottom = yRat * baseRadius
					 	,xTop = xRat * ( baseRadius + toothHeight )
					 	,yTop = yRat * ( baseRadius + toothHeight )
					 	,pBottom = { x: xBottom + rootX, y: yBottom + rootY}
					 	,pTop = { x: xTop + rootX, y: yTop + rootY}
					;

					if(i % 2) {
						return [pTop, pBottom];
					} else {
						return [pBottom, pTop];
					}
				}

				for(var i = 0; i < numTeeth * 2; i++){
					points = points.concat(pts(i));
				}

				return points;
			};
		})()
	};
})();