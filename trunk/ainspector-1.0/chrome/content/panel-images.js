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

/**
 * @file panel-images.js
 * 
 * Create images Object in response to the Images toolbar button on the A11Y Panel
 *   1. Clear the Panel view if it has any old data on it
 *   2. Get the Control Rule Results from the OAA Cache library
 *   3. Calls the Generic template to display the rendered HTML on to the Images Panel
 */
var AINSPECTOR_FB = AINSPECTOR_FB || {};  

with (FBL) {
  
  panel : null;
  
  AINSPECTOR_FB.images = {
      
  /**
   * @function viewPanel 
   * 
   * @desc respond to "Images" button in the AInspector toolbar
   * 
   * @param {Object} context - Firebug current context i.e., DOM
   * @param {String} panel_name - name of the panel to identify in which panel are we
   * @param {Object} cache_object - container for all the element properties
   * @property {Array} toolbar_buttons - buttons to show on a toolbar
   * @property {Object} toolbar - dom element created to hold the content of the panel. will append to the panel 
   * @property {Object} cache_object - container for all the element properties
   * 
   */
  viewPanel: function(context, panel_name, cache_object) {    
    
//  adds or removes the side panels from the extension depending on the panel we are in 
    AINSPECTOR_FB.tabPanelUtil.addAndRemoveSidePanels(true);
    if (!context) context = Firebug.currentContext;
    if (!panel_name) panel_name = "AInspector";

    panel = context.getPanel(panel_name, true);

    if (!cache_object) {
      if (AINSPECTOR_FB.ruleset_object)
        cache_object = AINSPECTOR_FB.ruleset_object;
      else
        cache_object = AINSPECTOR_FB.cacheUtil.updateCache();
    }

    /* Clear the panel before writing anything onto the report*/
    if (panel) {
      clearNode(panel.panelNode);
      clearNode(Firebug.currentContext.getPanel('rulesSidePanel').panelNode);
    }

    /* Get the Image rules results from the ruleset selected in preferences*/
    var images_cache_elements_results = cache_object.getCacheItemsByRuleCategory(OpenAjax.a11y.RULE_CATEGORIES.IMAGES, OpenAjax.a11y.RESULT_FILTER.ALL);
    
    var cache_item_results = images_cache_elements_results.cache_item_results;

    AINSPECTOR_FB.ainspectorUtil.loadCSSToStylePanel(panel.document);
    
    var toolbar = panel.document.createElement("div");
    toolbar.id = "toolbarDiv";
    
    panel.table = AINSPECTOR_FB.template.grid.header.replace({elements: cache_item_results, view:"Images"}, toolbar, AINSPECTOR_FB.template.grid);
    
    var element = panel.document.createElement("div");
    element.style.display = "block";
    
    panel.panelNode.id = "ainspector-panel"; 
    panel.panelNode.appendChild(toolbar);
    panel.panelNode.appendChild(element);
    AINSPECTOR_FB.template.grid.setTableMenuItems(panel.table);

    var selected_row = AINSPECTOR_FB.toolbarUtil.selectRow(panel, cache_item_results[0], false, "images");
    
    if (AINSPECTOR_FB.previous_selected_row != null && selected_row) Firebug.currentContext.getPanel('rulesSidePanel').sView(true, cache_item_results[selected_row]);
    else Firebug.currentContext.getPanel('rulesSidePanel').sView(true, cache_item_results[0]);
  },
    
  /**
   * @function select
   * 
   * @desc sets the first row object in to the panel and highlight() function to highlight the first row 
   * 
   * @param {Object} object - first image object in the images cache
   * @property {Object} selection - set an object to the panel to be used by the side panels when selected first time
   */
  select : function(object) {
     
     if  (AINSPECTOR_FB.previous_selected_row != null) {
       var selected_row = AINSPECTOR_FB.previous_selected_row;
       panel.selection = AINSPECTOR_FB.previous_selected_row;
       var rows = panel.table.children[6].children[1].children;
       FBTrace.sysout("rows: ", rows);
       var row = null;
       var i = 0;
       
       for (i; i <= rows.length; i++) {
         row = rows[i];
         FBTrace.sysout("row: ", row.children[0].textContent);
         if (row.children[0].textContent == selected_row.children[0].textContent) {
           break;
         }
       } 
       
       FBTrace.sysout("AINSPECTOR_FB.images.select() - AINSPECTOR_FB.previous_selected_row: ", AINSPECTOR_FB.previous_selected_row);
       AINSPECTOR_FB.flatListTemplateUtil.highlight(panel.table.children[6].children[1].children[i]);
     } else {
       panel.selection = object;
       AINSPECTOR_FB.flatListTemplateUtil.highlight(panel.table.children[6].children[1].children[0]);
     }
      
  }
  }; //end of images
}