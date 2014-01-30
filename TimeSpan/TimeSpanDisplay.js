var TimespanDisplay = (function () {
    
    "use strict";
	//private static attributes
    var UPPER_LIMIT_DAYS = 18000;

	//private static methods


    
	//return constructor
	return function (containerEl) {

		//private attributes
        var container = containerEl;
        var rows = [];
        var currDateSet;
        var currDateStop;
        var currFilter;

		//privileged methods
        this.build = function (setType, setArray) {
     
            currFilter = new TimespanFilter(setType);
            
            
            rows = setArray.rows;
            
            //prep NOTE - do once
            //attach datetimes to rows
            $.each(rows, function(idx, row){
                row.openDT = new Date(row.openDate);
                if(row.closeDate.length == 0){
        
                    row.closeDT = new Date();
                }
                row.closeDT = new Date(row.closeDate);
            });
            //sort
            rows.sort(function(a, b) {
                //return a.openDT > b.openDT;
                return a.sym.toUpperCase().localeCompare(b.sym.toUpperCase());
            });

            
            var today = new Date();
            
            var c = [];
            
            
            currFilter.Build(container);
            
            
            
            c.push("<div id='ctrlDisplay'>");
            c.push("<input id='" + container + "_show' value='Show' type='button'></input>");
            c.push("<input id='" + container + "_clear' value='Clear' type='button'></input>");
            c.push("<input id='" + container + "_shiftLeft' value='<-' type='button'></input>");
            c.push("<input id='" + container + "_shiftRight' value='->' type='button'></input>");
            c.push("</div>");
          
            c.push("<div id='" + container + "_showDate'></div>");
            c.push("<div id='" + container + "_slider'></div>");
            c.push("<div class='showDays' id='" + container + "_showDays'></div>");
          
            
            $("#"+container).append(c.join(''));
            
            var me = this;
            $( "#" + container + "_slider" ).slider({
                min: 1199167200000,
                max: today.getTime(),
                step: 86400000,
                values: [today.getTime() - (86400000*30), today.getTime()],
                range: true,
                change: function(e, ui){
//console.info("changed date settings");
                    me.setDates();
                    //me.showSpan();
                }
            
            });
            
            $( "#" + container + "_show" ).on("click", function(){

                me.showSpan();
            });

            $( "#" + container + "_clear" ).on("click", function(){

                $("#" + container + "_showDays").html('');

            });
            
            $( "#" + container + "_shiftLeft" ).on("click", function(){
                shiftDates("left");
            });
            
            $( "#" + container + "_shiftRight" ).on("click", function(){
                shiftDates("right");
            }); 
            
            function shiftDates(whichDirection){

                var daysToMove = me.getDays(currDateSet, currDateStop);
console.info(whichDirection, daysToMove);
                //default to right
                var newVal1 = currDateSet + Math.floor(daysToMove * 86400000);
                var newVal2 = currDateStop  + Math.floor(daysToMove * 86400000);
                if(whichDirection == "left"){
                    newVal1 = currDateSet - Math.floor(daysToMove * 86400000);
                    newVal2 = currDateStop - Math.floor(daysToMove * 86400000);
                }else{

                }
                $("#" + container + "_slider").slider("values", [newVal1, newVal2]);
                me.setDates();  
                me.showSpan();
            }
            
            
        
        };
        
        this.showSpan = function(){
            
            var numDays = this.getDays(currDateSet, currDateStop);
                      
            if(numDays <= 0) throw "Invalid time span";
            
            var dayHolderLen = Math.floor($("#" + container + "_showDays").width() / (numDays) + 0);
        
            $("#" + container + "_showDays").html('');
            for(var d = 0; d < numDays; d++){
        
                var thisDay = currDateSet + (d*86400000);
                var nextDay = thisDay + (86400000);
                
                var isWkEnd = (new Date(thisDay).getDay() >= 5 ? "wkEnd" : "");
                var numDate = new Date(thisDay).getDate() + '';
                if(numDate.length > 1){
                    numDate = numDate.substring(0,1) + "<br/>" + numDate.substring(1);
                }
                
                var dy = $("<div class='dayHolder " + isWkEnd + "'><span class='datenum'>" + numDate + "</span></div>");
                
                
                this.setItems(dy, thisDay, nextDay);
                
                
                $(dy).css("width",dayHolderLen);  
                $("#" + container + "_showDays").append(dy);
            
            }
            
            
            
        };
        
        //specific to a set
        var pnt = {};
        pnt["emaq"]="red";
        pnt["icms"]="blue";
        pnt["LETR"]="green";
        pnt["aces"]="aqua";
        pnt["earning your wings"]="yellow";
        pnt["abend"]="brown";
        pnt["bftc"]="firebrick";
        pnt["purchase requisition"]="orange";
        pnt["plcommit"]="pink";
        
        
        this.paint = function (proj){
            if(pnt[proj]){
                return pnt[proj];
            }else{
                return 'black';
            }
        }
        
        this.setItems = function (dy, thisDay, nextDay) {
            
            
            var me = this;
            $.each(rows, function(idx, row){
                
                if(row.openDT.getTime() >= thisDay && row.openDT.getTime() < nextDay){
                    if(currFilter.PassFilter(row)){			
console.info("setItems", thisDay, nextDay);				
                        var cls = row.sym.substring(3);
                        var d1 = $("<div id='ref_" + row.ref_num + "' class='day " + cls + "'></div>");
                        $(d1).css("background-color", me.paint(cls));
                        $(dy).append(d1);
                    }
                }
    
            });            
            
        };
        
        this.setDates = function(){
//console.info("in time");
            var values = $( "#" + container + "_slider" ).slider( "option", "values" );

            currDateSet = values[0];
            currDateStop = values[1];
            var dateSet = new Date(currDateSet).toLocaleDateString() + ' - ' + new Date(currDateStop).toLocaleDateString() + ' (' + this.getDays(currDateSet,currDateStop) + ' days)';
            $("#" + container + "_showDate").html(dateSet);
           

        };
        

        this.getDays = function(start, stop){
            var result = Math.floor((stop - start)/86400000);
            if(result < UPPER_LIMIT_DAYS){
                return result;
            }else{
                return 0;
            }	            
        };

        
   
        
        this.redraw = function(){
            
        };

		//constructor code

        
        
        

	}

}) ();

//public static method


//public nonprivileged methods
TimespanDisplay.prototype = {
	
    Build: function (setType, setArray) {
		this.build(setType, setArray);
	}

};

