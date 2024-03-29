/* See license.txt for terms of usage */

/**
 * @file ainspectorPanel.js
 * 
 * Applies user interface to the application, programmatically inserts themselves 
 * into the application.
 * 
 * define the AInspectorPanel by 
 *   1. extending internal Firebug.ActivablePanel object methods
 *   2. initializing mouse event listeners for column resizing to the A11y Panel
 *   3. appends menu's like views, rule sets, WCAG levels and filters to the A11y panel
 *   4. sets the above menu items into preferences (can be viewed at about:config with the prefix 'extensions.ainspector-firebug-preferences.xxx')
 */
define([
  "firebug/lib/object",
  "firebug/lib/lib",
  "firebug/lib/trace",
  "firebug/lib/locale",
  "firebug/lib/dom",
  "ainspector/openajax_a11y/oaa_a11y_amd",
  "ainspector/headerResizer",
  "ainspector/ainspectorMenuUtil",
  "ainspector/highlighting/highlight",
  "ainspector/ainspectorUtil",
  "ainspector/ainspectorWatcher",
  "ainspector/ainspectorPreferences",
  "ainspector/ainspectorModule",
  "ainspector/ainspectorListTemplate",
  "ainspector/ainspectorTreeTemplate",
  "ainspector/ainspectorRulesTemplate",
  "ainspector/wcagSummaryTemplate"
  ],
  function(Obj, FBL, FBTrace, Locale, Dom, OpenAjax, HeaderResizer, AinspectorListener,
      OAA_WEB_ACCESSIBILITY, AinspectorUtil, AinspectorWatcher, AinspectorPreferences) {
  
    var panelName = "ainspector";
    var console = Components.classes["@mozilla.org/consoleservice;1"].
    getService(Components.interfaces.nsIConsoleService);
    Firebug.AinspectorPanel = function AinspectorPanel() {};
  
    /**
     * An instance of the Panel Object is created by the Firebug Framework for each browser tab where Firebug is activated
     */ 
    Firebug.AinspectorPanel.prototype = Obj.extend(Firebug.ActivablePanel, {
  
      name: panelName,
      title: "A11y",
      ruleset_object: null,
      
      onActivationChanged: function(enable) {
      
        if (enable) {
          Firebug.AinspectorModule.addObserver(this);
        } else {
          Firebug.AinspectorModule.removeObserver(this);
        }
      },
  
      /**
       * @method initialize
       * 
       * @desc bind mouse events to the panel to inspect the events that are bound to DOM elements i.e., if
       * any thing goes wrong 
       * automatically called by Firebug Framework when A11y Panel is activated
       * calls the predecessor method (i.e., Firebug Panels initialize()) to
       *   1. set context object reference in panel
       *   2. do some initializations  
       */
      initialize: function() {
          
        if (FBTrace.DBG_AINSPECTOR) 
          FBTrace.sysout("AInspector; AinspectorPanel.initialize");
        
        var header_column_resizer = HeaderResizer.gridHeaderColumnResizer;
        
        this.onMouseClick = Obj.bind(header_column_resizer.onMouseClick, header_column_resizer); 
        this.onMouseDown  = Obj.bind(header_column_resizer.onMouseDown, header_column_resizer);
        this.onMouseMove  = Obj.bind(header_column_resizer.onMouseMove, header_column_resizer);
        this.onMouseUp    = Obj.bind(header_column_resizer.onMouseUp, header_column_resizer);
        this.onMouseOut   = Obj.bind(header_column_resizer.onMouseOut, header_column_resizer);
        
        this.refresh();
        
        Firebug.ActivablePanel.initialize.apply(this, arguments);

      },
      
      /**
       * @method initializeNode
       * 
       * @desc Add mouse event listeners to the panel to resize the column headers of a grid on the panel 
       * Only called by the Firebug at the end of initialize() method
       * 
       */
      initializeNode : function(){
        
        this.panelNode.id = "ainspector-panel";  
        
        this.panelNode.addEventListener("click", this.onMouseClick, true);
        this.panelNode.addEventListener("mousedown", this.onMouseDown, true);
        this.panelNode.addEventListener("mousemove", this.onMouseMove, true);
        this.panelNode.addEventListener("mouseup", this.onMouseUp, true);
        this.panelNode.addEventListener("mouseout", this.onMouseOut, true);
//        this.resizeEventTarget = Firebug.chrome.$('fbContentBox');
//        this.panelNode.addEventListener("resize", this.onResizer, true);
        Firebug.ActivablePanel.initializeNode.apply(this, arguments);
        
      },
      
      /**
       * @method destroy
       * 
       * @desc remove mouse eventListeners from the panel
       *       only called by Firebug Framework 
       */
      destroyNode: function(state) {
  
        if (FBTrace.DBG_AINSPECTOR) FBTrace.sysout("AInspector; AinspectorPanel.destroy");
  
        this.panelNode.removeEventListener("click", this.onMouseClick, true);
        this.panelNode.removeEventListener("mousedown", this.onMouseDown, true);
        this.panelNode.removeEventListener("mousemove", this.onMouseMove, true);
        this.panelNode.removeEventListener("mouseup", this.onMouseUp, true);
        this.panelNode.removeEventListener("mouseout", this.onMouseOut, true);
        
        Firebug.ActivablePanel.destroyNode.apply(this, arguments);
      },
      
      show: function(state) {
       
        Firebug.ActivablePanel.show.apply(this, arguments);

        this.showToolbarButtons("fbPanelToolbar", true);

        if (FBTrace.DBG_AINSPECTOR) FBTrace.sysout("AInspector; AinspectorPanel.show;");
      },

      hide: function() {
        
        Firebug.ActivablePanel.hide.apply(this, arguments);

        this.showToolbarButtons("fbPanelToolbar", false);

        if (FBTrace.DBG_AINSPECTOR)
            FBTrace.sysout("AInspector; AinspectorPanel.hide;");
      },
      
      /**
       * @function getContextMenuItems
       */
      getContextMenuItems: function(object, target) {
        return AinspectorUtil.contextMenu.getContextMenuItems(this, arguments);
      },
      
      /**
       * @function getPanelToolbarButtons
       * 
       * @desc Adds toolbar buttons to the A11y Panel
       *       Called by Firebug framework if it exists in the A11y panel
       */
      getPanelToolbarButtons : function() {
        
        var buttons = [];
        buttons.push(
          {
            type       : "menu",
            id         : "views",
            label      : "ainspector.menu.ruleCategories.views",
            items      : this.getRuleCategoriesMenu()
          },
          {
            type       : "menu",
            id         : "rulesets",
            label      : "ainspector.menu.rulesets",
            items      : this.getAllRulesetsMenu()
          },
          {
            type       : "menu",
            id         : "level",
            label      : "ainspector.menu.scLevel",
            tooltiptext: "ainspector.menu.scLevel.tooltip",
            items      : this.getSCLevelMenu()
          },
          {
            type       : "menu",
            id         : "filters",
            label      : "ainspector.menu.filters",
            tooltiptext: "ainspector.menu.filters.tooltip",
            items      : this.getFiltersMenu()
          },
          {
            type       : "menu",
            id         : "reports",
            label      : "ainspector.menu.reports",
            items      : this.getReportsMenu()
          }
        );
        
        return buttons;
      },
      
      /**
       * @function getRuleCategoriesMenu
       * 
       * @desc creates drop down menu; called by  getPanelToolbarButtons()
       */
      getRuleCategoriesMenu : function(){
        
        if (FBTrace.DBG_AINSPECTOR) 
          FBTrace.sysout("AInspector; AinspectorPanel.getRuleCategoriesMenu-fbPanelToolbar: ", Firebug.chrome.$("fbPanelToolbar").children);
        
        var items = [];
        items.push(
          {
            id     : "rulesView",
            label  : "ainspector.menuitem.allRules",
            type   : "radio",
            checked: this.isSelected("rulesView"),
            command: Obj.bindFixed(this.rulesView, this)
          },
          {
            id     : "categoriesView",
            label  : "ainspector.menuitem.categories",
            type   : "radio",
            checked: this.isSelected("categoriesView"),
            command: Obj.bindFixed(this.categoriesView, this)
          },
          {
            id     : "wcagView",
            label  : "ainspector.menuitem.wcag",
            type   : "radio",
            checked: this.isSelected("wcagView"),
            command: Obj.bindFixed(this.wcagView, this)
          },
          {
            label  :   "-",
          },
          {
            id     : "contentView",
            label  : "ainspector.menuitem.content",
            type   : "radio",
            checked: this.isSelected("contentView"),
            command: Obj.bindFixed(this.contentView, this)
          },
          
          {
            id     : "headersView",
            label  : "ainspector.menuitem.headers",
            type   : "radio",
            checked: this.isSelected("headersView"),
            command: Obj.bindFixed(this.headersView, this)
          },
          {
            id     : "imagesView",
            label  : "ainspector.menuitem.images",
            type   : "radio",
            checked: this.isSelected("imagesView"),
            command: Obj.bindFixed(this.imagesView, this)
          },
          {
            id     : "controlsView",
            label  : "ainspector.menuitem.controls",
            type   : "radio",
            checked: this.isSelected("controlsView"),
            command: Obj.bindFixed(this.controlsView, this)
          },
          {
            id     : "linksView",
            label  : "ainspector.menuitem.links",
            type   : "radio",
            checked: this.isSelected("links"),
            command: Obj.bindFixed(this.linksView, this)
          },
          {
            id     : "audioView",
            label  : "ainspector.menuitem.audio",
            type   : "radio",
            checked: this.isSelected("audioView"),
            command: Obj.bindFixed(this.audioView, this)
          },
          {
            id     : "tablesView",
            label  : "ainspector.menuitem.tables",
            type   : "radio",
            checked: this.isSelected("tablesView"),
            command: Obj.bindFixed(this.tablesView, this)
          },
          {
            id     : "widgetsView",
            label  : "ainspector.menuitem.widgets",
            type   : "radio",
            checked: this.isSelected("widgetsView"),
            command: Obj.bindFixed(this.widgetsView, this)
          }
        );
  
        return items;
      },
      
      /**
       * @function getAllRulesetsMenuItem
       * 
       * @desc Adds menu items for the Ruleset Menu in the A11y toolbar
       */
      getAllRulesetsMenu : function() {
        
        if (FBTrace.DBG_AINSPECTOR) 
          FBTrace.sysout("AInspector; AinspectorPanel.getAllRulesetsMenu-fbPanelToolbar: ", Firebug.chrome.$("fbPanelToolbar").children);
        
        
        var all_rulesets = OpenAjax.a11y.all_rulesets.getAllRulesets();
        
        var items = [];
        var ruleset = null;

        for (var i=0; i<all_rulesets.length; i++) {
          ruleset = all_rulesets[i];
          items.push({
              id     : ruleset.ruleset_id,
              nol10n : true,
              label  : ruleset.ruleset_title + " " + ruleset.ruleset_version,
              type   : "radio",
              tooltiptext: ruleset.ruleset_id,
              checked: this.checkRuleset(ruleset.ruleset_id),
              command: Obj.bindFixed(this.setPreferences, this)
            }
          );
        }
        
        items.push(
          {
            label      :   "-",
          },
          {
            id         : "rrules",
            label      : "ainspector.menuitem.recRules.enable",
            type       : "checkbox",
            checked    : AinspectorPreferences.getPreferences().wcag20_recommended_rules_enabled,
            command    : Obj.bindFixed(this.setPreferences, this)
          }
        );
        
        return items;
      },
      
      getSCLevelMenu : function () {
        
        var items = [];
        items.push(
          {
            id         : OpenAjax.a11y.EVALUATION_LEVELS.A_AA_AAA,
            label      : "ainspector.menuitem.scLevel.AAA",
            tooltiptext: "ainspector.menuitem.scLevel.tooltip.AAA",
            type       : "radio",
            checked    : this.checkLevel(OpenAjax.a11y.EVALUATION_LEVELS.A_AA_AAA),
            command    :  Obj.bindFixed(this.setPreferences, this)
          },
          {
            id         : OpenAjax.a11y.EVALUATION_LEVELS.A_AA,
            label      : "ainspector.menuitem.scLevel.AA",
            tooltiptext: "ainspector.menuitem.scLevel.tooltip.AA",
            type       : "radio",
            checked    : this.checkLevel(OpenAjax.a11y.EVALUATION_LEVELS.A_AA),
            command    :  Obj.bindFixed(this.setPreferences, this)
          },
          {
            id         : OpenAjax.a11y.EVALUATION_LEVELS.A,
            label      : "ainspector.menuitem.scLevel.A",
            tooltiptext: "ainspector.menuitem.scLevel.tooltip.A",
            type       : "radio",
            checked    : this.checkLevel(OpenAjax.a11y.EVALUATION_LEVELS.A), 
            command    : Obj.bindFixed(this.setPreferences, this)
          }
        );
        return items;
      },
            
      /**
       * @function getFiltersMenu
       * 
       * @desc Add menu items for Filters menu
       */
      getFiltersMenu : function() {
        
        var items = [];
        items.push({
            id     : "emc",
            label  : "ainspector.menuitem.filters.elemc",
            type   : "checkbox",
            checked: AinspectorPreferences.getPreferences().show_results_element_manual_checks,
            command: function() {
                var checked = false;
                
                if (this.hasAttribute("checked")) checked = this.getAttribute("checked");
                
                if (FBTrace.DBG_AINSPECTOR) FBTrace.sysout("AInspector; is_emc_filter_checked:         "+ checked);
                
                this.setAttribute("checked", checked);
                AinspectorUtil.is_emc = checked;

                Firebug.AinspectorPanel.prototype.setPreferences();
            }
          }
        );
        
        return items;
      },
      
     /**
      * @function getReportsMenu
      * 
      * @desc Add menu items for Reports menu
      */
     getReportsMenu : function() {
       
       var items = [];
       items.push({
           id     : "wcag",
           label  : "ainspector.menu.reports.wcag",
           type   : "radio",
           command: function() {
               var id = this.getAttribute("id");
               Firebug.AinspectorPanel.prototype.showReport(id);
           }
         },
         {
           id     : "category",
           label  : "ainspector.menu.reports.category",
           type   : "radio",
           command:function() {
              var id = this.getAttribute("id");
              Firebug.AinspectorPanel.prototype.showReport(id);
           }  
         }
       );
       
       return items;
     },
      
     refresh : function() {
       ruleset_object = AinspectorWatcher.getRuleResultsObject();
     },
      
     /**
      * @function getPreferences
      * 
      * @desc makes a call to the preferences module
      */
     getPreferences: function(){
        
       window.openDialog("chrome://ainspector/content/preferences/preferences-dialog.xul", "", "chrome,centerscreen,resizable=yes", "");
     },
     
     /**
      * @function rulesView
      * 
      * @desc response to Headers menu item
      */
     rulesView : function(){
     
       AinspectorListener.onGetPanelToolbarButtons(ruleset_object);
       OAA_WEB_ACCESSIBILITY.util.highlightModule.removeHighlight(window.content.document);
       Firebug.AinspectorModule.AinspectorRulesTemplate.viewTag(ruleset_object, 
          OpenAjax.a11y.RULE_CATEGORIES.ALL, Locale.$STR("ainspector.views.rules"), "rulesView");
        
     },
      
     categoriesView : function () {
        
       AinspectorListener.onGetPanelToolbarButtons(ruleset_object);
       OAA_WEB_ACCESSIBILITY.util.highlightModule.removeHighlight(window.content.document);
       Firebug.AinspectorModule.WcagSummaryTemplate.viewTag(ruleset_object, 
         OpenAjax.a11y.RULE_SUMMARY.CATEGORIES, Locale.$STR("ainspector.views.categories"), "categoriesView");
     },
      
     wcagView : function() {
        
       AinspectorListener.onGetPanelToolbarButtons(ruleset_object);
       OAA_WEB_ACCESSIBILITY.util.highlightModule.removeHighlight(window.content.document);
       Firebug.AinspectorModule.WcagSummaryTemplate.viewTag(ruleset_object, 
          OpenAjax.a11y.RULE_SUMMARY.WCAG20, Locale.$STR("ainspector.views.wcag"), "wcagView");
     },
     
     /**
      * @function contentView
      * @desc response to Text menu item
      */
     contentView : function() {
       
       AinspectorListener.onGetPanelToolbarButtons(ruleset_object, 'Text Elements');
       OAA_WEB_ACCESSIBILITY.util.highlightModule.removeHighlight(window.content.document);
       Firebug.AinspectorModule.AinspectorListTemplate.viewTag(ruleset_object, 
           OpenAjax.a11y.ELEMENT_TYPE.TEXT, Locale.$STR("ainspector.views.text"), "contentView");
 
     },
     
     /**
      * @function headersView
      * 
      * @desc response to Headers menu item
      */
     headersView : function() {
       
       AinspectorListener.onGetPanelToolbarButtons(ruleset_object, 'Heading and Landmark Elements');
       OAA_WEB_ACCESSIBILITY.util.highlightModule.removeHighlight(window.content.document);
       Firebug.AinspectorModule.AinspectorListTemplate.viewTag(ruleset_object, 
           OpenAjax.a11y.ELEMENT_TYPE.HEADINGS_LANDMARKS, Locale.$STR("ainspector.views.headers"), "headersView");
       
     },
     
     /**
      * @function controlsView
      * 
      * @desc response to form controls menu item
      */
     controlsView : function() {
       
       AinspectorListener.onGetPanelToolbarButtons(ruleset_object, 'Form Control Elements');
       OAA_WEB_ACCESSIBILITY.util.highlightModule.removeHighlight(window.content.document);
       Firebug.AinspectorModule.AinspectorTreeTemplate.viewTag(ruleset_object, 
           OpenAjax.a11y.ELEMENT_TYPE.FORM_CONTROLS, Locale.$STR("ainspector.views.controls"), "controlsView");
       
     },
     
     /**
      * @function imagesView
      * 
      * @desc response to Images menu item
      */
     imagesView : function() {
       
       AinspectorListener.onGetPanelToolbarButtons(ruleset_object, 'Image Elements');
       OAA_WEB_ACCESSIBILITY.util.highlightModule.removeHighlight(window.content.document);
       Firebug.AinspectorModule.AinspectorListTemplate.viewTag(ruleset_object, 
           OpenAjax.a11y.ELEMENT_TYPE.IMAGES, Locale.$STR("ainspector.views.images"), "imagesView");
     },
     
     /**
      * @function linksView
      * 
      * @desc response to Links menu item
      */
     linksView : function() {
       
       AinspectorListener.onGetPanelToolbarButtons(ruleset_object, 'Link Elements');
       OAA_WEB_ACCESSIBILITY.util.highlightModule.removeHighlight(window.content.document);
       Firebug.AinspectorModule.AinspectorListTemplate.viewTag(ruleset_object, 
           OpenAjax.a11y.ELEMENT_TYPE.LINKS, Locale.$STR("ainspector.views.links"), "linksView");
 
     },
     
     /**
      * @function audioView
      * 
      * @desc response to audio/video menu item
      */
     audioView : function() {
       
       AinspectorListener.onGetPanelToolbarButtons(ruleset_object, 'Audio/Video/Object Elements');
       OAA_WEB_ACCESSIBILITY.util.highlightModule.removeHighlight(window.content.document);
       Firebug.AinspectorModule.AinspectorListTemplate.viewTag(ruleset_object, 
           OpenAjax.a11y.ELEMENT_TYPE.AUDIO_VIDEO, Locale.$STR("ainspector.views.audio"), "audioView");
 
     },
     
     /**
      * @function tablesView
      * 
      * @desc response to form controls menu item
      */
     tablesView : function() {
       
       AinspectorListener.onGetPanelToolbarButtons(ruleset_object, 'Table Elements');
       OAA_WEB_ACCESSIBILITY.util.highlightModule.removeHighlight(window.content.document);

       Firebug.AinspectorModule.AinspectorTreeTemplate.viewTag(ruleset_object, 
           OpenAjax.a11y.ELEMENT_TYPE.TABLES, Locale.$STR("ainspector.views.tables"), "tablesView");
       
     },
     
     /**
      * @function widgetsView
      * 
      * @desc response to form controls menu item
      */
     widgetsView : function() {
       
       AinspectorListener.onGetPanelToolbarButtons(ruleset_object, 'Widget Elements');
       OAA_WEB_ACCESSIBILITY.util.highlightModule.removeHighlight(window.content.document);

       Firebug.AinspectorModule.AinspectorTreeTemplate.viewTag(ruleset_object, 
           OpenAjax.a11y.ELEMENT_TYPE.WIDGETS, Locale.$STR("ainspector.views.widgets"), "widgetsView");
       
     },
     
     /**
       * @function setPreferences
       */
      setPreferences: function() {
        
        var toolbar = Firebug.chrome.$("fbPanelToolbar");
        
        var p = AinspectorPreferences.preferences;
        
        var rulesets = toolbar.children[1].children[0].children;
        
        /* set the selected ruleset in preferences*/
        for (var i=0; i< rulesets.length; i++) {
          if (i <=3 && rulesets[i].hasAttribute('checked')) {
            p.ruleset_id = rulesets[i].id;
          
          } else {
            if (i==4 && rulesets[i].hasAttribute('checked')) {
              p.wcag20_recommended_rules_enabled = true;
            } else {
            	p.wcag20_recommended_rules_enabled = false;
            }
          }
        }
        
        /* set success criteria level in preferences*/
        var level = toolbar.children[2].children[0].children;
        
        for (var m = 0; m < level.length; m++) {
          if (level[m].hasAttribute('checked')) {
            p.wcag20_level = parseInt(level[m].id);
          } 
        }
        var filters = Firebug.chrome.$("fbPanelToolbar").children[3].children[0].children;

        /* update evaluation result filters in to the preferences */
        for (var j=0; j<filters.length; j++) {
          
          var filter = filters[j];
          var pref_filter;
          
          if (filter.id == "emc") {
            pref_filter =  AinspectorUtil.is_emc;

            if (pref_filter) p.show_results_element_manual_checks = true;
            else p.show_results_element_manual_checks = false;
          }
          if (filter.id == "pmc") {
            pref_filter =  AinspectorUtil.is_pmc;

            if (pref_filter) p.show_results_page_manual_checks = true;
            else  p.show_results_page_manual_checks = false;
          }
          if (filter.id == "pass") {
            pref_filter =  AinspectorUtil.is_pass;

            if (pref_filter) p.show_results_pass = true;
            else p.show_results_pass = false;
          } 
          if (filter.id == "hidden") {
            pref_filter =  AinspectorUtil.is_hidden;

            if (pref_filter) p.show_results_hidden = true;
            else p.show_results_hidden = false;
          }
        }
        
        p.show_results_violations = true;
        p.show_results_not_applicable = true;
        p.show_results_warnings = true;
        p.broken_links = false;
        p.layout_tables = false;
        AinspectorPreferences.setPreferences(p);
        
        FBTrace.sysout("preferences:", p);
        
        this.refresh();
        
        var views = toolbar.children[0].children[0].children;
        
        for (var k=0; k < views.length; k++) {
          
        	if (views[k].hasAttribute('checked')) {
            var v = views[k].id;
            
            this[v]();
            
            break;
          } 
        }
      },
      
      setSelectedFilter : function(filter) {
        var all_filters = Firebug.chrome.$("fbPanelToolbar").children[3].children[0].children;

        this.setSelectedFilters(all_filters, filter);
      },
      
      setSelectedFilters : function(filters, filter){

        for (var i=0; i<filters.length; i++) {
          if (filters[i].id == filter) {
            if (filters[i].selected)
              filters[i].removeAttribute("selected", false);
            else
              filters[i].setAttribute("selected", true);
          }
        }

      },
      
      checkRuleset : function(id) {
        
        var pref = AinspectorPreferences.getPreferences();
//      console.logStringMessage("id: "+ id + ".... prefs" + pref.ruleset_id);
        
        if (id == pref.ruleset_id) return true; 
        else return false;
        
      },
      
      checkLevel : function(id) {
        
        var pref = AinspectorPreferences.getPreferences();
        
        if (id == pref.wcag20_level) return true; 
        
      },
      
      checkFilterEmc : function() {
        
        var pref = AinspectorPreferences.getPreferences();

        if (pref.show_results_element_manual_checks == true) return true; 
        else return false;
      },
      
      isSelected : function(view) {
      	
        var already_selected_view = AinspectorUtil.selectedView; 
        
        if (view == already_selected_view) return true;
        else return false;
      },
      
      /**
       * @function showReport
       * 
       * @desc writes HTML and CSV report to a file and saves it locally on the disk
       * 
       *  @param {String}id - type of report
       */
      showReport : function(id) {
        
        Components.utils.import("resource://gre/modules/FileUtils.jsm");
        var rule_category;
        var name;
        var preferences = AinspectorPreferences.getPreferences();
        
        if (id == "wcag") {
          rule_category = OpenAjax.a11y.RULE_SUMMARY.WCAG20;
          name = "WCAG 2.0"; 
        } else {
          rule_category = OpenAjax.a11y.RULE_SUMMARY.CATEGORIES;
          name = "All Rules"; 
        }
        
        var rule_summary = ruleset_object.getFilteredRuleResultsByRuleSummary(rule_category, name, 
                          preferences.wcag20_level, preferences.show_results_filter_value);
        
        OpenAjax.a11y.report_css   = OpenAjax.a11y.util.initStringUsingURL("chrome://ainspector/content/openajax_a11y/reports/oaa_report.css");
        OpenAjax.a11y.report_rule_summary_view_js   = OpenAjax.a11y.util.initStringUsingURL("chrome://ainspector/content/openajax_a11y/reports/oaa_report_rule_summary_view.js");
        OpenAjax.a11y.report_rule_summary_view_body = OpenAjax.a11y.util.initStringUsingURL("chrome://ainspector/content/openajax_a11y/reports/oaa_report_rule_summary_view.inc");
        
        if (!rule_summary) return;

        var dir = FileUtils.getDir('TmpD', [], true, true);

        var file = FileUtils.getFile('TmpD', ['ai_report_rule_summary.html']);
        
        var fileStream = FileUtils.openSafeFileOutputStream(file, 0x02 | 0x08 | 0x20, 0644, 0);  
        
        var html = rule_summary.toHTML(name);
        
        fileStream.write(html, html.length);
        
        FileUtils.closeSafeFileOutputStream(fileStream);
            
        window.open("file:\\"+file.path,'mywindow','');

        file = FileUtils.getFile('TmpD', ['ai_report_rule_summary.csv']);
        
        fileStream = FileUtils.openSafeFileOutputStream(file, 0x02 | 0x08 | 0x20, 0644, 0);  
        
        var csv = rule_summary.toCSV(name);
        
        fileStream.write(csv, csv.length);
        
        FileUtils.closeSafeFileOutputStream(fileStream);
      }
    });
  
  Firebug.registerStringBundle("chrome://ainspector/locale/ainspector.properties");
  Firebug.registerStylesheet("chrome://ainspector/skin/ainspector.css");
  
  return Firebug.AinspectorPanel;
  
});
