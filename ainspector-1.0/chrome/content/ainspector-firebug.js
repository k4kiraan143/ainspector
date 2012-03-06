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

var AINSPECTOR_FB = AINSPECTOR_FB || {};

FBL.ns(function() { with (FBL) { 
  
  var panel_name = AINSPECTOR_FB.ainspectorUtil.$AI_STR("ainspector.mainpanel.name");
  var panel_title = AINSPECTOR_FB.ainspectorUtil.$AI_STR("ainpector.mainpanel.title");
  var cache_object;
  
  Firebug.ainspectorModule = extend(Firebug.Module, { 
	
	/**   
	 * @function showPanel
	 *  
	 * @desc Show/Hide our panel based on new selection from the Firebug main toolbar.
	 * Only called by the Firebug framework.
	 *
	 * @param {Object} browser - the browser window object
	 * @param {Object} panel - the new selected panel object    
	 */
	showPanel: function(browser, panel) { 
	   
  	  var isFirebugExtension = panel && panel.name == panel_name; 
	  var FirebugExtensionButtons = browser.chrome.$("fbFirebugExtensionButtons");
	  cache_object = this.updateCache();
	  collapse(FirebugExtensionButtons, !isFirebugExtension); 
	},
	
	/**
	 * 
	 */
	watchWindow : function(context, win){
//	  FBTrace.sysout("watchWindow: ", win);
	  //if (win == win.top) {
		context.window.addEventListener("load", this.ainspectorOnLoad, false);
		context.window.addEventListener("beforeunload", this.ainspectorOnUnload, false);
		context.window.addEventListener("DOMContentLoaded", this.ainspectorOnDOMContentLoaded, false);
	  //}	
	},
	
	/**
	 * 
	 */
	unWatchWindow : function(context, win){
	  //if (win == win.top) {
		context.window.removeEventListener("load", this.ainspectorOnLoad, false);
		context.window.removeEventListener("beforeunload", this.ainspectorOnUnload, false);
		context.window.removeEventListener("DOMContentLoaded", this.ainspectorOnDOMContentLoaded, false);
	  //}	
	},
	
	/**
	 * @function ainspectorOnLoad
	 * 
	 * @desc
	 * 
	 * @param {Event} event
	 */
	ainspectorOnLoad : function(event){
	  FBTrace.sysout("............ainspectorOnLoad ..........", event);
      var win = event.currentTarget;
	  var firebug_context;
	  
	  if (win != Firebug.currentContext.window) {
		firebug_context = TabWatcher.getContextByWindow(win);
	  } else {
		firebug_context = Firebug.currentContext;  
	  }
	 var toolbarbuttons = firebug_context.browser.chrome.$("radio-toolbar").children;
	 var toolbar_button = "equivalents";
	 for (var i=0; i < toolbarbuttons.length; i=i+2){
		if (toolbarbuttons[i].checked == true) {
		  //if (i != 0) toolbarbuttons[i].checked = false;
		  toolbar_button = toolbarbuttons[i].id;
		  FBTrace.sysout("toolbar_button : " + toolbar_button);	
		  break;
		}
	 }
	 
	 //firebug_context.browser.chrome.$("radio-toolbar").children[0].checked = true;
	 cache_object = AINSPECTOR_FB.cacheUtil.updateCache();
     AINSPECTOR_FB.event.fire('onload', {'window': win });
	 FBTrace.sysout("window : " , window.AINSPECTOR_FB[toolbar_button]);
	 window.AINSPECTOR_FB[toolbar_button].viewPanel(firebug_context, panel_name, cache_object);
	},
	
	/**
	 * @function ainspectorOnUnLoad
	 * 
	 * @desc
	 * 
	 * @param {Event} event
	 */
	ainspectorOnUnLoad : function(event) {
		/*var mainWindow = window.QueryInterface(Components.interfaces.nsIInterfaceRequestor)
	      .getInterface(Components.interfaces.nsIWebNavigation)
	      .QueryInterface(Components.interfaces.nsIDocShellTreeItem)
	      .rootTreeItem
	      .QueryInterface(Components.interfaces.nsIInterfaceRequestor)
	      .getInterface(Components.interfaces.nsIDOMWindow);

	    mainWindow.gBrowser.removeProgressListener(AINSPECTOR_FB.tabProgressListener);*/
		
		var win = event.currentTarget;
        // fire onUnload event.
        var fbcontext;
        
        if (win !== Firebug.currentContext.window) {
            fbcontext = TabWatcher.getContextByWindow(win);
        } else {
            fbcontext = Firebug.currentContext;
        }
        AINSPECTOR_FB.event.fire('onUnload', {'window': win});
        if (fbcontext !== Firebug.currentContext) {
            return;
        }
        
	},
	
	ainspectorOnDOMContentLoaded : function (event){
		var win = event.currentTarget;
        AINSPECTOR_FB.event.fire('onDOMContentLoaded', {'window': win});
	},
    
    /**
     * @function reportView
     * 
     * @desc respond to "Report" button in the AInspector toolbar
     * 
     * @param {Object} context
     */
    reportView: function(context) { 
  
      var panel = context.getPanel(panel_name, true);
      
      /* Clear the panel before writing anything onto the report*/
      if (panel) {
      	clearNode(panel.panelNode);
        clearNode(Firebug.currentContext.getPanel('Rules').panelNode);
      }
    },
    
    /**
     * @function controlsView
     * 
     * @desc respond to "Controls" button in the AInspector toolbar
     * 
     * @param context
     */
    controlsView: function(context) { 
    	  
      //var cachesResult = this.updateCache();

      var panel = context.getPanel(panel_name, true);
      
      /* Clear the panel before writing anything onto the report*/
      if (panel) {
      	clearNode(panel.panelNode);
        clearNode(Firebug.currentContext.getPanel('Rules').panelNode);
      }
      
      var control_toolbar_buttons = [{name: AINSPECTOR_FB.ainspectorUtil.$AI_STR("ainspector.mainpanel.tab.controls.tree"), selected: true, first:true},
                                     {name: AINSPECTOR_FB.ainspectorUtil.$AI_STR("ainspector.mainpanel.tab.controls.labels")}, 
                                     {name: AINSPECTOR_FB.ainspectorUtil.$AI_STR("ainspector.mainpanel.tab.controls")}];
                             
      AINSPECTOR_FB.ainspectorUtil.loadCSSToStylePanel(panel.document); 
      
      var toolbar = panel.document.createElement("div");
      toolbar.id = "toolbarDiv";
      AINSPECTOR_FB.controls.controlsView(control_toolbar_buttons, toolbar, panel, cache_object);
     
    },
    
    /**
     * @function colorContrastView
     * 
     * @desc respond to "Color Contrast" button in the AInspector toolbar
     * 
     * @param context
     */
    colorContrastView: function(context) { 
    	  
      var panel = context.getPanel(panel_name, true);

      /* Clear the panel before writing anything onto the report*/
      if (panel) {
      	clearNode(panel.panelNode);
        clearNode(Firebug.currentContext.getPanel('Rules').panelNode);
      }
      AINSPECTOR_FB.ainspectorUtil.loadCSSToStylePanel(panel.document); 

      AINSPECTOR_FB.colorContrast.colorContrastPanelView(panel, cache_object);
    },
      
    /**
     * @function headingsView
     * 
     * @desc respond to "Headings/Landmarks" button in the AInspector toolbar
     * 
     * @param context
     * @returns
     */
    headingsView: function(context) { 
    	  
      var panel = context.getPanel(panel_name, true);

      /* Clear the panel before writing anything onto the report*/
      if (panel) {
      	clearNode(panel.panelNode);
        clearNode(Firebug.currentContext.getPanel('Rules').panelNode);
      }
      
      var head_land_toolbar_buttons = [{name: AINSPECTOR_FB.ainspectorUtil.$AI_STR("ainspector.mainpanel.tab.headings.tree"), selected: true, first:true},
                                   {name: AINSPECTOR_FB.ainspectorUtil.$AI_STR("ainspector.mainpanel.tab.titleMain")}, 
                                   {name: AINSPECTOR_FB.ainspectorUtil.$AI_STR("ainspector.mainpanel.tab.noLandmark")}];
      
      AINSPECTOR_FB.ainspectorUtil.loadCSSToStylePanel(panel.document);

      var toolbar = panel.document.createElement("div");
      toolbar.id = "toolbarDiv";
      AINSPECTOR_FB.headLandmarkView.headingsPanelView(head_land_toolbar_buttons, toolbar, panel, cache_object);
    },
        
    /**
     * @function linksView
     * 
     * @desc respond to "Links" button in the AInspector toolbar
     * 
     * @param context
     */
    linksView: function(context) { 
        	  
      var panel = context.getPanel(panel_name, true);

      /* Clear the panel before writing anything onto the report*/
      if (panel) {
        clearNode(panel.panelNode);
        clearNode(Firebug.currentContext.getPanel('Rules').panelNode);
      }
		var toolbar_buttons = [{name: AINSPECTOR_FB.ainspectorUtil.$AI_STR("ainspector.mainpanel.tab.links.all"), selected: true, first:true},
		                                   {name: AINSPECTOR_FB.ainspectorUtil.$AI_STR("ainspector.mainpanel.tab.links.duplicateHref")}, 
		                                   {name: AINSPECTOR_FB.ainspectorUtil.$AI_STR("ainspector.mainpanel.tab.links.duplicateName")},
		                                   {name: AINSPECTOR_FB.ainspectorUtil.$AI_STR("ainspector.mainpanel.tab.links.area")}];
      

      AINSPECTOR_FB.ainspectorUtil.loadCSSToStylePanel(panel.document);

      var toolbar = panel.document.createElement("div");
      toolbar.id = "toolbarDiv";
      var links_cache = cache_object.dom_cache.links_cache;
        
      AINSPECTOR_FB.links.linksPanel(panel, toolbar, toolbar_buttons, links_cache);
    },
    
    /**
     * @function listsView
     * 
     * @desc respond to "Lists" button in the AInspector toolbar
     * 
     * @param context
     */
    listsView: function(context) { 
         	  
    	var panel = context.getPanel(panel_name, true);

    	/* Clear the panel before writing anything onto the report*/
        if (panel) {
          clearNode(panel.panelNode);
          clearNode(Firebug.currentContext.getPanel('Rules').panelNode);
        }
        
        var toolbar_buttons = [{name: "Tree View", selected: true, first:true},
                                     {name: "List View"}];
        
        AINSPECTOR_FB.ainspectorUtil.loadCSSToStylePanel(panel.document);
        
        var toolbar = panel.document.createElement("div");
        toolbar.id = "toolbarDiv";
        var lists_cache = cache_object.dom_cache.lists_cache;
        AINSPECTOR_FB.lists.listPanelView(toolbar_buttons, toolbar, panel, lists_cache);
    },
    
    /**
     * @function tablesView
     * 
     * @desc respond to "Tables" button in the AInspector toolbar
     * 
     * @param context
     * @returns
     */
    tablesView: function(context) { 
            	  
      var panel = context.getPanel(panel_name, true);
    
      /* Clear the panel before writing anything onto the report*/
      if (panel) {
       	clearNode(panel.panelNode);
        clearNode(Firebug.currentContext.getPanel('Rules').panelNode);
      }
      
      var tables_toolbar_buttons = [{name: AINSPECTOR_FB.ainspectorUtil.$AI_STR("ainspector.mainpanel.tab.tables.tree"), selected: true, first:true},
                                       {name: AINSPECTOR_FB.ainspectorUtil.$AI_STR("ainspector.mainpanel.tab.tables.list")}];
          
      AINSPECTOR_FB.ainspectorUtil.loadCSSToStylePanel(panel.document);

      var toolbar = panel.document.createElement("div");
      toolbar.id = "toolbarDiv";
      AINSPECTOR_FB.tables.tablesPanelView(tables_toolbar_buttons, toolbar, panel, cache_object);
    },
    
    /**
     * @function abbreviationsView
     * 
     * @desc respond to "Tables" button in the AInspector toolbar
     * 
     * @param context
     * @returns
     */
    abbrView: function(context) { 
            	  
      var panel = context.getPanel(panel_name, true);
    
      /* Clear the panel before writing anything onto the report*/
      if (panel) {
       	clearNode(panel.panelNode);
        clearNode(Firebug.currentContext.getPanel('Rules').panelNode);
      }
      
      var abbr_toolbar_buttons = [
          {name: AINSPECTOR_FB.ainspectorUtil.$AI_STR("ainspector.mainpanel.tab.abbr.abbreviationTab"), selected: true, first:true},
          {name: AINSPECTOR_FB.ainspectorUtil.$AI_STR("ainspector.mainpanel.tab.abbr.languageTab")}];
          
      AINSPECTOR_FB.ainspectorUtil.loadCSSToStylePanel(panel.document);

      var toolbar = panel.document.createElement("div");
      toolbar.id = "toolbarDiv";
      AINSPECTOR_FB.abbr.abbreviationsView(abbr_toolbar_buttons, toolbar, panel, cache_object);
    },
    
    /**
     * @function elementsView
     * 
     * @desc respond to "Headings/Landmarks" button in the AInspector toolbar
     * 
     * @param context
     * @returns
     */
    elementsView: function(context) { 
    	  
      var panel = context.getPanel(panel_name, true);

      /* Clear the panel before writing anything onto the report*/
      if (panel) {
      	clearNode(panel.panelNode);
        clearNode(Firebug.currentContext.getPanel('Rules').panelNode);
      }
      
      var toolbar_buttons = [{name: AINSPECTOR_FB.ainspectorUtil.$AI_STR("ainspector.mainpanel.tab.elements.tree"), selected: true, first:true},
                                   {name: AINSPECTOR_FB.ainspectorUtil.$AI_STR("ainspector.mainpanel.tab.elements.list")}];
      
      AINSPECTOR_FB.ainspectorUtil.loadCSSToStylePanel(panel.document);

      var toolbar = panel.document.createElement("div");
      toolbar.id = "toolbarDiv";
      AINSPECTOR_FB.elementsView.allElementsPanelView(toolbar_buttons, toolbar, panel, cache_object);
    },

    /**
     * @function updateCache
     * 
     * @desc calls evaluate function of the rule set selected. 
     * 
     * @return ruleset_result_cache 
     */
    updateCache: function() {

      var ruleset_result_cache;
      var doc;
      var url;
      try { 
        doc = window.content.document;
        url = window.content.location.href;
      } catch(e) {
        doc  = window.opener.parent.content.document;
        url = window.opener.parent.content.location.href;;
      } // end try

      /*cache_object = new OpenAjax.a11y.RulesetEvaluation();
      FBTrace.sysout("cache_object: ", cache_object);
      cache_object.init('WCAG_2_0', 'en-us', doc.location.href, doc.title, doc, null);
      cache_object.evaluate(true);
      cache_object.dom_cache.links_cache.sortLinkElements('document_order', true);
      FBTrace.sysout("cache...............", cache_object);*/
      
      var ruleset_id = 'WCAG20_ARIA_TRANS';
      var ruleset = OpenAjax.a11y.all_rulesets.getRuleset(ruleset_id);

      if (ruleset) {
    	ruleset_result_cache = ruleset.evaluate(url, doc.title, doc, null, true);
        FBTrace.sysout("Ruleset results object for: " , ruleset_result_cache);
      }
      else {
    	FBTrace.sysout("  ** Ruleset with the id '" + ruleset_id + "' not found!!");
      }
      
      return ruleset_result_cache;
    }
  }); 

  function AInspectorPanel() {} 

  AInspectorPanel.prototype = extend(Firebug.Panel, { 
  
    name: panel_name,
    title: panel_title,
    dependents: ["Rules", "Attributes", "Cache", "Style", "Events"],
  
    /**
     * @function initialize
     * 
     * @desc calls the predecessor method (i.e., Firebug panels initialize()) to set context object reference in panel
     * 
     */
    initialize: function() {
	  
	  var header_column_resizer = AINSPECTOR_FB.gridHeaderColumnResize;
	  
	  this.onMouseClick = bind(header_column_resizer.onMouseClick, header_column_resizer); 
	  this.onMouseDown = bind(header_column_resizer.onMouseDown, header_column_resizer);
	  this.onMouseMove = bind(header_column_resizer.onMouseMove, header_column_resizer);
	  this.onMouseUp = bind(header_column_resizer.onMouseUp, header_column_resizer);
	  this.onMouseOut = bind(header_column_resizer.onMouseOut, header_column_resizer);
	  
	  //this - context , arguments - document
	  Firebug.Panel.initialize.apply(this, arguments);
    },
    
    /**
     * @function initializeNode
     * 
     * @desc Add mouse event listeners to the panel to resize the column headers
     * Only called by the Firebug initialize() function
     * 
     */
    initializeNode : function(){
      
      this.panelNode.id = "ainspector-panel";	
      
      this.panelNode.addEventListener("click", this.onMouseClick, true);
      this.panelNode.addEventListener("mousedown", this.onMouseDown, true);
      this.panelNode.addEventListener("mousemove", this.onMouseMove, true);
      this.panelNode.addEventListener("mouseup", this.onMouseUp, true);
      this.panelNode.addEventListener("mouseout", this.onMouseOut, true);
      
      return;
      
    },
    
    /**
     * @function destroyNode
     * 
     * @desc remove the mouse eventListeners from the panel  
     * Only called by the Firebug Framework
     */
    destroyNode : function() {
    
	  this.panelNode.removeEventListener("click", this.onMouseClick, true);
      this.panelNode.removeEventListener("mousedown", this.onMouseDown, true);
      this.panelNode.removeEventListener("mousemove", this.onMouseMove, true);
      this.panelNode.removeEventListener("mouseup", this.onMouseUp, true);
      this.panelNode.removeEventListener("mouseout", this.onMouseOut, true);
      	
    }
  }); 

  Firebug.registerModule(Firebug.ainspectorModule); 

  /* Firebug.registerPanel(), registers the new panel with global Firebug object and ensures its display*/
  Firebug.registerPanel(AInspectorPanel); 

}});