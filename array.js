Array.prototype.mean = function(){ 
	return this.reduce(function(previousMean, currentValue, i){
		return previousMean + (1/(i + 1))*(currentValue - previousMean);
	});
};

Array.prototype.median = function() {
 	var values = this;
    values.sort( function(a,b) {return a - b;} );
 
    var half = Math.floor(values.length/2);
 
    if(values.length % 2){
        return values[half];
    } else {
        return (values[half-1] + values[half]) / 2.0;
    }
};

Array.prototype.max = function(){
	return this.reduce(function(p,n){ 
		if(n > p || p === null){ 
			return n;
		} else {
			return p;
		}
	},null);
};

Array.prototype.min = function(){
	return this.reduce(function(p,n){ 
		if(n < p || p === null ){ 
			return n;
		} else {
			return p;
		}
	},null);
};

Array.prototype.sum = function(){
	return this.reduce(function(p,n){
		return p + n;
	}, 0);
};