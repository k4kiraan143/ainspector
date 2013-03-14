/**
 * Copyright 2011 University Of Illinois
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

FBL.ns(function() { with (FBL) {

  var main_panel = AINSPECTOR_FB.ainspectorUtil.$AI_STR("ainspector.mainpanel.name");
  var side_panel_name = AINSPECTOR_FB.ainspectorUtil.$AI_STR("ainspector.sidepanel.events.name");
  var side_panel_title = AINSPECTOR_FB.ainspectorUtil.$AI_STR("ainspector.sidepanel.events.title");
  var tool_tip =  AINSPECTOR_FB.ainspectorUtil.$AI_STR("ainspector.sidepanel.events.tooltip");
    
  /**
   * @panel eventsSidePanel displaying Rule results for the current selected 
   * row in the Navigation button,
   */
  function eventsSidePanel() {}
  
  eventsSidePanel.prototype = extend(Firebug.Panel, {
    
    name: side_panel_name,
    parentPanel: main_panel,
    title: side_panel_title,
    tooltip: tool_tip,
    order: 7,
    editable: true,
    
    /**
     *@constructor
     *
     * initialize
     * 
     *@author pbale
     * 
     *@param context
     * 
     *@param doc
     */
     initialize: function(context, doc) {
    
       this.onCLick = bind(this.setSelection, this);
       Firebug.Panel.initialize.apply(this, arguments);
     },

     /**
      * initializeNode
      * 
      * @desc
      * 
      * @param  oldPanelNode
      */
     initializeNode: function(oldPanelNode) {

       appendStylesheet(this.panelNode.ownerDocument, "chrome://selectbug/skin/selectbug.css");
       appendStylesheet(this.panelNode.ownerDocument, "chrome://ainspector/content/css/ainspector-side-panel.css");

       appendStylesheet(this.panelNode.ownerDocument, "chrome://ainspector/content/css/fonts-min.css");
       appendStylesheet(this.panelNode.ownerDocument, "chrome://ainspector/content/css/tabview.css");
       appendStylesheet(this.panelNode.ownerDocument, "chrome://ainspector/content/css/allyGrade.css");
       appendStylesheet(this.panelNode.ownerDocument, "chrome://ainspector/content/css/grid.css");

       this.setSelection = bind(this.setSelection, this);
       this.mainPanel.panelNode.addEventListener("click", this.setSelection, false);
       
       Firebug.Panel.initializeNode.apply(this, arguments);
     },
     
     /**
      * @function updateSelection
      * 
      * @desc
      * 
      * @param element - 
      */
     updateSelection : function(object) {
       
       var selection = this.mainPanel.selection;
       
       if (selection) {
         this.rebuild(this.showOneventsTabSelect(selection.cache_item));  
       } else {
         this.rebuild(this.showOneventsTabSelect(object));
       }
    	 
     },
     
     /**
      * show
      * 
      * @desc
      * 
      * @param state
      */
     show: function(state) {
	   
       Firebug.Panel.show.apply(this, arguments);
       this.updateSelection();
     },
     
     /**
      * @function setSelection
      * 
      * @desc
      * 
      * @param event
      */
     setSelection: function(event) {
   
       var object = Firebug.getRepObject(event.target);
       this.rebuild(this.showOneventsTabSelect(object.cache_item));

     },
     
     /**
      * @function showOneventsTabSelect
      * 
      * @desc
      * 
      * @param {Object} cache_item
      */
     showOneventsTabSelect : function(cache_item) {
       
       var events = cache_item.getEvents();
       var rule_result_array = new Array();

       for(var i=0; i<events.length; i++){
         FBTrace.sysout("event: " + i + ": ", events[i]);
         rule_result_array.push({"event": events[i].label, "element": events[i].event_on_element, "ancestor": events[i].event_on_ancestor});
       }
       return rule_result_array;
       
     },
     
     /**
      * @function rebuild
      * 
      * @desc
      * 
      * @param resultArray
      */
     rebuild: function(resultArray){
       this.panelNode.id = "ainspector-side-panel";
       var flag = true;
       var toolbar_selected = AINSPECTOR_FB.toolbarUtil.getSelectedToolbarButton(Firebug.currentContext);
       
       if (toolbar_selected == "colorContrast") {
         toolbar_selected = toolbar_selected.charAt(0).toUpperCase() + toolbar_selected.slice(1);
         var message = "Events Panel is disabled for the '" + toolbar_selected + "' toolbar button";
       } else {
         for(var i in resultArray){ if(resultArray.hasOwnProperty(i)){flag = false;}}
   	     
         if (flag) {
           var header_elements = ["Events", "On Element", "On Ancestor"];

           AINSPECTOR_FB.emptyTemplate.tag.replace({header_elements: header_elements, messg: "odd"}, this.panelNode);
         } else {
           eventsTemplate.tag.replace({object: resultArray}, this.panelNode);    	    
         }
       }
     }
   });
  
  var eventsTemplate = domplate(BaseRep, {
	    
    tag:
      DIV({class: "side-panel"},
        DIV({class: "element-select", style: "color: black; font-weight: bold;"}, "User Interface Event Handlers"),
        DIV({class: "element-select"}, "Properties are calculated values that are important to accessibility of the selected item."),
        TABLE({class: "ai-sidepanel-table", cellpadding: 0, cellspacing: 0, role: "treegrid"},
          THEAD(
            TR({class: "gridHeaderRow gridRow", id: "rulesTableHeader", "role": "row", tabindex: "0"},
              TH({class: "gridHeaderCell gridCell", id: "ruleResultsCol"}, 
                DIV({class: "gridHeaderCellBox"}, "Events")
              ),
              TH({class: "gridHeaderCell gridCell", id: "ruleMessageCol"}, 
                DIV({class: "gridHeaderCellBox"}, "On Element")
              ),
              TH({class: "gridHeaderCell gridCell", id: "ruleMessageCol"}, 
                DIV({class: "gridHeaderCellBox"}, "On Ancestor")
              )
            )
          ),  
          TBODY(
            FOR("obj", "$object",
              TR({class: "tableRow a11yFocus", role: "row"},
                TD({class: "resultsCol ", role: "gridcell", tabindex: "-1"}, 
                  DIV({class: "gridLabel"},"$obj.event")
                ),
                TD({class: "messagesCol", role: "gridcell", tabindex: "-1"}, 
                  DIV({class: "gridLabel resultAlign"},"$obj.element")
                ),
                TD({class: "messagesCol", role: "gridcell", tabindex: "-1"}, 
                  DIV({class: "gridLabel resultAlign"},"$obj.ancestor")
                )
              ) //end TR
            )  
          ) //end TBODY  
        )
      )
  });
  
  var BaseRep = domplate(Firebug.Rep, {
	    
    /**
     * getNaturalTag
     * 
     * @desc
     * 
     * @param value
     */
	  getNaturalTag: function(value) {
	    
	    var rep = Firebug.getRep(value);
      var tag = rep.shortTag ? rep.shortTag : rep.tag;
	      
      return tag;
    }
  });
 
  Firebug.registerPanel(eventsSidePanel);
}});