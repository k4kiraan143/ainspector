define(
  [
    "firebug/lib/lib",
    "firebug/lib/trace",
    "firebug/lib/locale",
    "firebug/lib/dom",
    "firebug/lib/domplate",
    "firebug/lib/css",
    "firebug/lib/array",
    "ainspector/headerResizer",
    "ainspector/ainspectorPreferences",
    "ainspector/highlighting/highlight",
    "ainspector/ainspectorUtil"
  ],
  
  function (FBL, FBTrace, Locale, Dom, Domplate, Css, Arr, HeaderResizer, AinspectorPreferences, OAA_WEB_ACCESSIBILITY, AinspectorUtil) {
  	
  	AinspectorUtil.keyBoardSupport = {
      
	    /**
	     * @function getRowClass
	     * 
	     * @desc
	     * 
	     * @param 
	     * 
	     * @return {String} class name to style 
	     */
	    getRowClass : function(obj) {
        
  	    var className = "tableRowView-" + obj.name;
      
  	    if (obj.selected)
          className += " selected";
      
  	    if (obj.first)
          className += " first";
        
        return className;
      },
      
  	  /**    
  		 * @function getSelectedState    
  		 * @desc     
  		 * @param {Object} obj   
  		 */ 
    	getSelectedState : function (obj) {        
    		
    		if (obj == 'temp') return 'true';          
    		
    		return obj.selected ? "true" : "false";  
    	},
    	
    	/**    
  		 * @function getSelectedState    
  		 * @desc     
  		 * @param {Object} obj   
  		 */ 
    	getTabIndex : function(obj) {
    	  
    	  if (obj == 'temp') return 'true'; 
    		
    	  FBTrace.sysout("AInspector; keyBoardSupport.getTabIndex(): obj- ", obj);
    		
    	  return obj.selected ? "0" : "-1"; 
    	},
      	
  		/** @function onFocus    
  		 *  
  		 *  @desc sets/removes selection of state with the ARIA attrubute "aria-selected"    
  		 *  
  		 *  @param {Event} event    
  		 */   
  		 onFocus : function(event) {      
  		 	
  		 	var event_target = event.target;    
//  		 	var repObject = Firebug.getRepObject(event_target);           
  		 	FBTrace.sysout("AInspector; onFocus-event: ", event);
  		 	if (!event_target) return;            
  		 	
  		 	var category = Css.getClassValue(event_target, "tableRowView");     
  		 	
  		 	if (FBTrace.DBG_AINSPECTOR)
          FBTrace.sysout("AInspector; onFocus-category: ", category);

  		 	if (category) {
  		 	  var table_rows = Dom.getAncestorByClass(event_target, "gridRow");
  		 	  if (table_rows) {
  		 	    var old_row = Dom.getElementByClass(table_rows, "selected"); 
    		 	  if (old_row) {         
              old_row.setAttribute("aria-selected", "false");  
              old_row.setAttribute("aria-label", "null");    
              old_row.setAttribute("tabindex", "-1");     
              Css.removeClass(old_row, "selected");      
            }
  		 	  }
  		 	}
  		 	 event_target.setAttribute("aria-selected", "true");    
         event_target.setAttribute("tabindex", "0");   
         Css.setClass(event_target, "selected"); 
 		  },
  		  
      onKeyPressGridOld : function (event) {
    			
//  			event.stopPropagation();          
  			
  			var main_panel = Dom.getAncestorByClass(event.target, "main-panel");     
  			var table = Dom.getChildByClass(main_panel, "ai-table-list-items");  
  			if (!table) table = Dom.getChildByClass(main_panel, "domTable");
  			switch(event.keyCode) {                
  			
  			  case KeyEvent.DOM_VK_LEFT: //             
  			  case KeyEvent.DOM_VK_UP: //up         
  			  case KeyEvent.DOM_VK_RIGHT: //right      
  			  case KeyEvent.DOM_VK_DOWN: //down  
  			  	FBTrace.sysout("AInspector; ------------KeyboardSupport: ------------- ");

  			  	FBTrace.sysout("AInspector; KeyboardSupport: event - ", event);
  			  	FBTrace.sysout("AInspector; KeyboardSupport: table - ", table);
  			  	if (table.tabIndex == '0') { 
  			  		table.setAttribute('tabindex', '-1');      
  			  		table.rows[0].setAttribute('tabindex', '-1');
//  			  		break;      
  			  	}
  			  	var all_rows = table.getElementsByClassName("gridRow");  
  			  	
  	        var current_index = Array.indexOf(all_rows, event.target);
  	        
  	        FBTrace.sysout("AInspector; KeyboardSupport: current_index - "+ current_index);
  	        
  			  	FBTrace.sysout("AInspector; KeyboardSupport: all_rows - ", all_rows);
  			  	FBTrace.sysout("AInspector; KeyboardSupport: event.target - ", event.target);

  			  	var key = event.keyCode;     
  			  	var forward = key == KeyEvent.DOM_VK_RIGHT || key == KeyEvent.DOM_VK_DOWN;  
  			  	var backward = key == KeyEvent.DOM_VK_LEFT || key == KeyEvent.DOM_VK_UP; 
  			  	FBTrace.sysout("AInspector; KeyboardSupport: forward or right key- "+ forward);
            var ind = 0;
  			  	 
			  	  for (var i=0; i < all_rows.length; i++) {
			  	    if (Css.hasClass(all_rows[i], "gridRowSelected")) {
			  	      Css.removeClass(all_rows[i], "gridRowSelected");
			  	      
			  	      if (forward) ind = (i == all_rows.length-1) ? 1 : i + 1;
			  	      else ind = i > 1 ? i - 1 : 1;
			  	      
			  	      for(var j=0; j < all_rows[i].cells.length; j++) Css.removeClass(all_rows[i].cells[j], "gridCellSelected");

			  	      break;
			  	    } else {
			  	      if (i == all_rows.length-1 && forward) ind = 1;
			  	      if (i == 1 && backward) ind = all_rows.length-1;
			  	    }
			  	  }
  			  	
  			  	if (ind != 0) {
              AinspectorUtil.highlight(all_rows[ind]);
              all_rows[ind].focus();
              FBTrace.sysout("AInspector; KeyboardSupport: all_rows[ind]- ", all_rows[ind]);
  			  	}
  			  	event.stopPropagation();
  			  	event.preventDefault();
            break;
            
  			  case KeyEvent.DOM_VK_TAB:
            var sidePanel = Firebug.chrome.getSelectedSidePanel(); 
            FBTrace.sysout("inside dom tab: ", sidePanel);

            if (sidePanel) {        
              sidePanel.setAttribute("tabindex", "0");         
              Css.setClass(sidePanel, "focusRow");  
              sidePanel.focus();        
            }
            event.stopPropagation();
            event.preventDefault();
            break;   
			   }
  		  },
  		  
  		  isGridRow : function(node){
  		    
  		    return Css.hasClass(node, "gridRow");
  		  },
  		  
  		  /**
  		   * @function onKeyPressTable
  		   * 
  		   * @desc focus on a row with the keyboard events
  		   * 
  		   * @param event event triggered when any keyboard's right, left, up and down arrows are pressed
  		   */
  		  onKeyPressGrid: function(event){
  		    
  		    event.stopPropagation();
  		    
  		    var main_panel = Dom.getAncestorByClass(event.target, "main-panel");
//  		    var table_div = getChildByClass(main_panel, "table-scrollable");
  		    var table = Dom.getChildByClass(main_panel, "ai-table-list-items");
  		    
  		    if (!table) table = Dom.getChildByClass(main_panel, "domTable");
  		    
  		    switch(event.keyCode) {
  		        
  		      case KeyEvent.DOM_VK_LEFT: //  
  		   
  		      case KeyEvent.DOM_VK_UP: //up
  		        var row = Dom.findPrevious(event.target, this.isGridRow);
  		    
  		        if (row) {
  		          row.focus();
  		          AinspectorUtil.highlightRow(event, table, row);
  		        }
  		        break;
  		    
  		      case KeyEvent.DOM_VK_RIGHT: //right
  		      case KeyEvent.DOM_VK_DOWN: //down

  		        if (table.tabIndex == '0') {
  		          table.setAttribute('tabindex', '-1');
  		          table.rows[0].setAttribute('tabindex', '0');
  		          Css.setClass(table.rows[0], "headerRowSelected");
  		          table.rows[0].focus();
  		          var side_panel = Firebug.Chrome.getSelectedSidePanel();
  		          if (side_panel) side_panel.getPanelViewMesg(side_panel.panelNode, "");
  		          break;
  		        }  
  		        var all_rows = table.getElementsByClassName("gridRow");
  		        var current_index = Array.indexOf(all_rows, event.target);
  		        FBTrace.sysout("current_index: "+ current_index);
  		        var index = Array.indexOf(all_rows, event.target);
  		        var key = event.keyCode;
  		        var forward = key == KeyEvent.DOM_VK_RIGHT || key == KeyEvent.DOM_VK_DOWN;
  		          
  		        if (current_index != -1) {
  		           var new_index = forward ? ++current_index : --current_index;
  		          //get the focus back to the first tab on the tool bar from the last tab of the toolbar
  		          new_index = new_index < 0 ? all_rows.length -1 : (new_index >= all_rows.length ? 0 : new_index);
  		             
  		          if (all_rows[new_index]) { 
  		            var next_row = all_rows[new_index];

//  		          unhighlighting from rows in panel
  		            var current_row = all_rows[index];
  		            var header_row = all_rows[index];

  		            if (current_index != 0) {
  		              
  		              Css.removeClass(current_row, "gridRowSelected");
  		                
  		              for (var c=0; c< current_row.cells.length; c++) Css.removeClass(current_row.cells[c], "gridCellSelected");
  		            } 

//  		          highlight rows from panel
  		            all_rows[new_index].focus();
  		            Css.setClass(next_row, "gridRowSelected");
  		                
  		            for (var i=0; i< next_row.cells.length; i++) Css.setClass(next_row.cells[i], "gridCellSelected");
  		            
//  		            if (next_row.repObject.filtered_node_results) OAA_WEB_ACCESSIBILITY.util.highlightModule.highlightNodeResults(next_row.repObject.filtered_node_results);
//  		            else OAA_WEB_ACCESSIBILITY.util.highlightModule.highlightCacheItems(next_row.repObject);
  		            
  		            if (next_row.repObject.filtered_rule_result && next_row.repObject.filtered_rule_result.filtered_node_results) {
  		              OAA_WEB_ACCESSIBILITY.util.highlightModule.highlightNodeResults(next_row.repObject.filtered_rule_result.filtered_node_results);
  		            } else {
  		              OAA_WEB_ACCESSIBILITY.util.highlightModule.highlightCacheItems(next_row.repObject.cache_item_result);
  		            }
  		          }
  		        }
  		        event.stopPropagation();
  		        event.preventDefault();
  		          
  		        break;
  		          
  		      /*case KeyEvent.DOM_VK_TAB:
  		         //var panel = Firebug.chrome.getSelectedPanel();
  		        var sidePanel = Firebug.chrome.getSelectedSidePanel();
  		      if (sidePanel) {
  		        sidePanel.panelNode.setAttribute("tabindex", "0");
  		        sidePanel.panelNode.focus();
  		        setClass(sidePanel.panelNode, "focusRow");
  		      }
  		        break;*/
  		    }
  		  }
  		    
      	}
  		return AinspectorUtil;
  	}
	)