createFramework();


function createFramework() {

    var frames = {
        date : {},
        days : [],
        hours
    
    

    var hourSection = 0.5;
    var hoursAroundNoon = 6; //can be 1 - 12
    
    var numberSquares = 24 / hourSection;
    
    for(var n = 0; n < numberSquares; n++) {
    
        var type = "active";
        if (Math.abs(12 - n*hourSection) > hoursAroundNoon) {
        
            type = "inactive";
                   
        }
        
        var frameObj = {};
        
        frameObj.hour = n*hourSection;
        frameObj.type = type;
    
        frames.push(frameObj);
    
    }


    for(var i = 0; i < frames.length; i++) {
        
        console.log( frames[i].hour, frames[i].type);
        
    }

}




//singleton pattern template
var NameSpaceLabel = {};

NameSpaceLabel.Functionality = (function() {

	//private attributes
	var thisAtt = 'att';
	var thatBit = 2.3;
	
	//private methods
	function thisFunc(someVar) {
		return something;
	}
	
	function anotherFunc(this, that){
		dosomething;
	}
	
	return {
		//public attributes
		thisPubAtt: true,
		thatThis: 3.12,
		
		//public methods
		ThisFunc: function(){
			return thatBit;
		},
		AnotherFunc: function(thisIn){
			doit;
			return something;
		}
	};
})();