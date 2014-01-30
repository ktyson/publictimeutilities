//prototype class pattern
var TimespanFilter = (function() {

	//private static attributes


	//private static methods
	//function checkThisOut(someVar) {

	//}

	//return constructor
	return function(filterType) {

		//private attributes
		var filterType = filterType;
        var container;
        
		//privileged methods
		this.build = function(containerEl) {
            
            
            container = containerEl;
            
            var c = [];
            
            c.push("<div id='dropdowns'>FILTER: "); 
            c.push("</select>");
            c.push('Project <input id="' + container + '_proj"></input>');
            c.push(' Assigned To <input id="' + container + '_assTo"></input>');
            c.push(" I <input id='" + container + "_type_I' type='checkbox' checked='true'></input>");
            c.push(" P <input id='" + container + "_type_P' type='checkbox'></input>");
            c.push(" R <input id='" + container + "_type_R' type='checkbox'></input>"); 
            c.push(" Show Closed <input id='" + container + "_showClosed' type='checkbox'></input>");  	
            c.push("</div>");           
            
            $("#" + container).append(c.join(''));	
            
		};
        
        
        
        
		this.passFilter = function(row) {

            var result = false;
            var hasClosed = 0;
            var isType = 0;
            var hasAssTo = 0;
            var hasApp = 0;
            
            if($("#" + container + "_showClosed").is(':checked') == false){
                //check for close
                if(row.status.substring(0,2) == 'CL'){
                    hasClosed--;
                }else{
                    hasClosed++;
                }
            }

console.info(container, "#" + container + "_type_I", row.type == 'I', $("#" + container + "_type_I").is(':checked'));
            //if(hasClosed >= 0){
                //if isType > 0 then the row has a checked type
                if(row.type == 'I' && $("#" + container + "_type_I").is(':checked')){
                    isType++;
                }
                if(row.type == 'P' && $("#" + container + "_type_P").is(':checked')){
                    isType++;
                }
                if(row.type == 'R' && $("#" + container + "_type_R").is(':checked')){
                    isType++;
                }
        

            
                if(isType>0){
                    //if assTo/proj filter exists but does not match, assTo will be less than 0
                    if($("#" + container + "_assTo").val()){
                        if((row.lastName + ' ' + row.lastName).toUpperCase().indexOf($("#" + container + "_assTo").val().toUpperCase()) >= 0){
                            hasAssTo++;
                        }else{
                            hasAssTo--;
                        }
                    }
                    if($("#" + container + "_proj").val()){
                        var symProj = row.sym.substring(3);
                        if(symProj.toUpperCase().indexOf($("#" + container + "_proj").val().toUpperCase()) >= 0){
                            hasApp++;
                        }else{
                            hasApp--;
                        }
                    }
                
                }	
            //}
            
            if(hasClosed >= 0 && isType>0 && hasAssTo >= 0 && hasApp >= 0){
                result = true;
            }
                    
            return result;

		};		

		//constructor code


	}

})();

//public static method
//ClassName.doPublicDeed = function(inputHere) {

//};

//public nonprivileged methods
TimespanFilter.prototype = {
	Build: function(containerEl){
		this.build(containerEl);
	},
    PassFilter: function(row){
        return this.passFilter(row);
    }

};


