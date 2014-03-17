var searchtabsuryamanickam = {};
var expr = {};
var back_expr = {};
var i=0;
var first=0;
var backspace=0;
//words signifies the array of words which are in the title of the browser
var words = new Array();
//words_tabs signifies the tabs implying the words
var words_tabs = new Array(new Array());

//clear all elements by a tag name
function clearAll (p, tag) {
    var c, el;
    if (tag) {
        c = p.getElementsByTagName(tag);
        while (el = c[0]) {
            el.parentNode.removeChild(el);
        }
    } else {
        p.innerHTML = "";
    }
}

//function to return the unique elements of an array
unique = function (inputArray) {
	var r = new Array();
	o:for(var i = 0, n = inputArray.length; i < n; i=i+1)
	{
		for(var x = 0, y = r.length; x < y; x=x+1)
		{
			if(r[x]==inputArray[i])
			{
				continue o;
			}
		}
		r[r.length] = inputArray[i];
	}
	return r;
}
//a function to set focus to the textbox
set_focus_text_box = function(backspace){
		var to_display;
		if(expr.length>1 && backspace==0){
  			  to_display = expr.slice(0,expr.length-1); 	
			}

		if(backspace==1){

			  to_display = back_expr;
		}
			  
			  var textbox = document.getElementById("searchtabexpression");
			  textbox.reset();
  			  textbox.value=to_display.toString();
			  //	alert('to display' + to_display.toString());
			  return;  			  
}

//hashmap constructs the mapping of the words to the words_tabs
hashmap_words_tabs = function(){
	k=words.length;
              	for (i = 0; i < k; i = i + 1) {
						words.pop();						
				}
				k=words_tabs.length;
				for (i = 0; i < k; i = i + 1) {
					words_tabs.pop();
				}
	 var numTabs = gBrowser.browsers.length;	                
                for(var index=1; index<numTabs; index++) {

                        var currentIndex = (gBrowser.tabContainer.getIndexOfItem(gBrowser.selectedTab) + index)%numTabs;          				
                        var currentBrowser = gBrowser.getBrowserAtIndex(currentIndex);
						var browser = currentBrowser.contentDocument.title.toLowerCase();
						var regex = /[(<>"'?&-;:]/g;
						var strings_browser=browser.replace(regex, "");												
						strings_browser = strings_browser.split(/\W+/);												
						if(index==1){													
								words.push(strings_browser[0]);									
								words_tabs.push(new Array(currentIndex.toString()));	
								
									for(x=1;x<strings_browser.length; x=x+1){							
							for(i=0; i<words.length; i=i+1){								
								if(strings_browser[x]==words[i]){
									words_tabs[i].push(currentIndex.toString());
									break;						
								}
								if(i==words.length-1){																	
									words.push(strings_browser[x]);	
									words_tabs.push(new Array(currentIndex.toString()));
									break;
								}
							}
						}
						}
						else{
						for(x=0;x<strings_browser.length; x=x+1){							
							for(i=0; i<words.length; i=i+1){								
								if(strings_browser[x]==words[i]){
									words_tabs[i].push(currentIndex.toString());
									break;						
								}
								if(i==words.length-1){																	
									words.push(strings_browser[x]);	
									words_tabs.push(new Array(currentIndex.toString()));
									break;
								}
							}							
						}										
						}					

                }
}

searchtabsuryamanickam.searchtabcheckifenterispressed = function(e){ //  when something is typed
     	if(e.which==38 || e.which==40){ //if the key is either up or down arrow, focus gets moved to the listbox
     		    var menulist = document.getElementById("searchtabmenu");
     		    menulist.focus();
				return;
     		
     	}
             
        if((e.which>=65 && e.which<=90)||e.which==8){ //  hit any alphabets or backspace character
        		if(e.which==8 && expr.length!=0){  //if its a backspace, delete the last letter from the expression
						back_expr = expr;						
     					expr = expr.slice(0,expr.length-1);    
						backspace=1; //backspace(key) is pressed
        		}
        		if(e.which==8 && expr.length==0){
        			return;
        		}
				var character = String.fromCharCode(e.which);
				character = character.toLowerCase();
				if(first==1 && e.which!=8){
				expr = expr + character;
				}
				if(first==0 && e.which!=8){
					expr = character;
					first=1;
				}				
               

                // Check each tab of this browser instance
               hashmap_words_tabs();
               var tabs_to_show = new Array();         
              
				for(x=0;x<words.length;x=x+1){
					var match=0;					
					for(k=0;k<expr.length;k=k+1){						
						if(expr[k]==words[x][k]){
							match=match+1;
							if(match==expr.length){								
								for(var j=0;j<words_tabs[x].length;j=j+1){																		
									tabs_to_show.push(words_tabs[x][j]);																		
								}
							}
						}
					}
				}
              //tabs to show contains alll the tabs which are to be shown based on the expr
             tabs_to_show = unique(tabs_to_show);    	    

			 //opening the popup
             var popup=document.getElementById("thepanel");
             popup.height=tabs_to_show.length*22;
			 popup.openPopup(document.getElementById("searchtabexpression"), "before_start", 0, 0, false, false);			 
			 var menulist = document.getElementById("searchtabmenu");	
			 //should clear all the previous instances of the listitems since its dynamic
			 clearAll(menulist,'listitem');
		     menulist.setAttribute('hidden','false');
			 
			 //if tabs_to_show is zero then display no tabs to the user
			 if(tabs_to_show.length==0){
 			 menulist.height=22;	
			 var list_item = document.createElement('listitem');
			 list_item.setAttribute('label','No such tab.');
			 list_item.setAttribute('name','list_item');			 
			 document.getElementById("searchtabexpression").focus();    	
			 menulist.appendChild(list_item);			 
			 set_focus_text_box(backspace);			 			 
			 backspace=0;
			 return;			 
			 }
			 //else display all the tabs in listbox
			 
			 menulist.height=tabs_to_show.length*22;			 
              for(i=0;i<tabs_to_show.length;i=i+1){
              	var content = gBrowser.getBrowserAtIndex(tabs_to_show[i]);
              	content = content.contentDocument.title;
				var list_item = document.createElement('listitem');
				list_item.setAttribute('label',content);
				list_item.setAttribute('name','list_item');
			    list_item.setAttribute('value',tabs_to_show[i]);
				menulist.appendChild(list_item);
              }  		
			document.getElementById("searchtabexpression").focus();    
			
			set_focus_text_box(backspace);
			
			  k=tabs_to_show.length;              
              for(i=0;i<k;i=i+1){
              	tabs_to_show.pop();       	
              }  
			  backspace=0;
              return;

       }
      
        if(e.which == 27){ //  hit Esc
	 document.getElementById("searchtabexpression").value = "Search Tab (shift + f)";
	 expr={};
	 document.getElementById("searchtabexpression").select();
     first=0;
     gBrowser.focus();
        }
}

searchtabsuryamanickam.searchtabbringtofocus = function() {

document.getElementById("searchtabexpression").select();
return;
}

searchtabsuryamanickam.searchtabwaitforlistselection = function(e){
    var menulist = document.getElementById("searchtabmenu");
    if(e.which==13){
    	    	gBrowser.selectedTab = gBrowser.tabContainer.getItemAtIndex(menulist.value);    	
    
   	document.getElementById("searchtabexpression").select();
   	menulist.setAttribute('hidden','true');
   	document.getElementById("searchtabexpression").value = "Search Tab (shift + f)";
   	expr={};
   	first=0;
   	document.getElementById("searchtabexpression").select();
   	gBrowser.focus();

    }




}
searchtabsuryamanickam.clickitem = function(){
	    var menulist = document.getElementById("searchtabmenu");
	   	gBrowser.selectedTab = gBrowser.tabContainer.getItemAtIndex(menulist.value); 
	   	document.getElementById("searchtabexpression").select();
	   	menulist.setAttribute('hidden','true');
	   	document.getElementById("searchtabexpression").value = "Search Tab (shift + f)";
	   	first=0;
	   	expr={};
	   	document.getElementById("searchtabexpression").select();
	   	gBrowser.focus();



}



