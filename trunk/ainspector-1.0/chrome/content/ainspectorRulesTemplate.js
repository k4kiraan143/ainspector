/**
 * Copyright 2013 University Of Illinois
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
define([
  "firebug/lib/trace",
  "firebug/lib/locale",
  "firebug/firebug",
  "firebug/lib/domplate",
  "firebug/lib/events",
  "firebug/lib/dom",
  "firebug/lib/css",
  "ainspector/sidePanelUtil",
  "ainspector/openajax_a11y/oaa_a11y_amd",
  "ainspector/ainspectorPreferences",
  "ainspector/ainspectorUtil",
  "ainspector/ainspectorModule",
  ],
  function (FBTrace, Locale, Firebug, Domplate, Events, Dom, Css, SidePanelUtil, OpenAjax, AinspectorPreferences, AinspectorUtil) {
    
    with (Domplate){
    
      Firebug.registerStringBundle("chrome://ainspector/locale/ainspector.properties");
      
      Firebug.AinspectorModule.AinspectorRulesTemplate = domplate({
      
        tag:
         DIV({class:"main-panel"},
          SPAN({class: "summaryTitle", style: "margin-left: 0.5em;"}, "$view"),
          SPAN({style: "margin-left: 3.0em; color: gray;"}, "%P"),
          SPAN({style: "margin-left: 0.5em; color: black; background-color: #78AB46"}, "  " + "$category_rule_results.percent_passed" + "  "),
          SPAN({style: "margin-left: 1.5em; color: gray;"}, " V"),
          SPAN({style: "margin-left: 0.5em; color: black; background-color: #b22222;"}, "  " + "$category_rule_results.violations_count" + "  "),
          SPAN({style: "margin-left: 1.5em; color: gray;"}, " W"),
          SPAN({style: "margin-left: 0.5em; color: black; background-color: #DAA520;"}, "  " + "$category_rule_results.warnings_count" + "  "),
          SPAN({style: "margin-left: 1.5em; color: gray;"}, " MC"),
          SPAN({style: "margin-left: 0.5em; color: black; background-color: #7D26CD;"}, "  " + "$category_rule_results.manual_checks_count" + "   "),
          
          TABLE({class: "ai-table-list-items", id: "ai-table-list-items", cellpadding: 0, cellspacing: 0, hiddenCols: ""},
             THEAD({},
               TR({class: "gridHeaderRow firstRow gridRow", onclick:"$sortColumn"},
                   TH({class: "gridHeaderCell", id: "gridRulesCol", role: "columnheader"}, 
                     DIV({class: "gridHeaderCellBox"}, Locale.$STR("ainspector.header.summary.Rules"))
                   ),
                   TH({class: "gridHeaderCell", id: "gridLevelCol", role: "columnheader"}, 
                       DIV({class: "gridHeaderCellBox", title: Locale.$STR("ainspector.header.summary.title.level")}, 
                         Locale.$STR("ainspector.header.summary.level"))
                   ),
                   TH({class: "gridHeaderCell", id: "gridRequiredCol", role: "columnheader"}, 
                       DIV({class: "gridHeaderCellBox", title: Locale.$STR("ainspector.header.summary.title.required")}, 
                         Locale.$STR("ainspector.header.summary.required"))
                   ),
                   TH({class: "gridHeaderCell", id: "gridPassCol", role: "columnheader"}, 
                     DIV({class: "gridHeaderCellBox", title: Locale.$STR("ainspector.header.title.pass")}, 
                       Locale.$STR("ainspector.header.pass"))
                   ),
                   TH({class: "gridHeaderCell", id: "gridWarningCol", role: "columnheader"}, 
                     DIV({class: "gridHeaderCellBox", title: Locale.$STR("ainspector.header.title.warning")}, 
                         Locale.$STR("ainspector.header.warning"))
                   ),
                   TH({class: "gridHeaderCell", id: "gridViolationCol", role: "columnheader"}, 
                     DIV({class: "gridHeaderCellBox", title: Locale.$STR("ainspector.header.title.violation")}, 
                       Locale.$STR("ainspector.header.violation"))
                   ),
                   TH({class: "gridHeaderCell", id: "gridManualCheckCol", role: "columnheader"}, 
                     DIV({class: "gridHeaderCellBox", title: Locale.$STR("ainspector.header.summary.title.mc")}, 
                       Locale.$STR("ainspector.header.summary.mc"))
                   )
                 )
             ), //end THEAD
             TBODY({class: ""},
               FOR("object", "$results",
                 
                 TR({class: "tableRow gridRow", _repObject:"$object", onclick: "$highlightRule"},//gridRow              
                   TD({class: "gridCol gridOrderCol", id: "gridOrderCol", role: "gridcell"},
                     DIV({class: "gridContent ", title : "$object.summary"}, "$object.summary")
                   ),
                   TD({class: "gridCol ", id: "gridLevelCol", role: "gridcell"},
                       DIV({class: "gridContent gridAlign"},  "$object.wcag20_level_label")
                   ),
                   TD({class: "gridCol gridElementCol", id: "gridElementCol", role: "gridcell"},
                     DIV({class: "gridContent gridAlign"}, "$object.required")
                   ),
                   TD({class: "gridCol", id: "gridPassCol", role: "gridcell"},
                     DIV({class: "gridContent gridAlign"}, TAG("$strTagPass", {rule_result: "$object"}))
                   ),
                   TD({class: "gridCol", id: "gridWarningCol", role: "gridcell"},
                     DIV({class: "gridContent gridAlign"}, TAG("$strTagWarn", {rule_result: "$object"}))
                   ),
                   TD({class: "gridCol", id: "gridViolationCol", role: "gridcell"},
                     DIV({class: "gridContent gridAlign"}, TAG("$strTagViolation", {rule_result: "$object"}))
                   ),
                   TD({class: "gridCol", id: "gridManualCheckCol", role: "gridcell"},
                     DIV({class: "gridContent gridAlign"}, TAG("$strTagManual", {rule_result: "$object"}))
                   )
                 ) //end TR   
               ) //end FOR
             ) //end TBODY
            ) //end TABLE
           ), //end DIV
           
           strTagManual : DIV({class: "$rule_result.manual_checks_count|getManualCheckStyle"}, "$rule_result.manual_checks_count"), //$object.manual_checks_count
           strTagViolation : DIV({class: "$rule_result.violations_count|getViolationStyle"}, "$rule_result.violations_count"), //$object.violations_count
           strTagPass : DIV({class: "$rule_result.passed_count|getPassStyle"}, "$rule_result.passed_count"), //$object.passed_count
           strTagWarn : DIV({class: "$rule_result.warnings_count|getWarningsStyle"}, "$rule_result.warnings_count"), //$object.warnings_count
           
           getManualCheckStyle : function(mck) {
        	 if (mck > 0 ) return "manualMsgTxt";
        	 else return "grayStyle";
           },
           getViolationStyle : function(violation) {
    	     if (violation > 0 ) return "violationMsgTxt";
    	     else return "grayStyle";
           },
           getPassStyle : function(pass) {
        	 if (pass > 0 ) return "passMsgTxt";
        	 else return "grayStyle";
           },
           getWarningsStyle : function(warn) {
          	 if (warn > 0 ) return "warnMsgTxt";
          	 else return "grayStyle";
           },
           
           /**
            * @function viewTag
            * 
            * @desc gets cache item results for a rule category
            * 
            * @param {Object}rule_results - rule results object
            * @param {Object}panelNode   - A11Y panel
            * @param {String}rule_category- specific rule category selected in the menu  
            */
           viewTag : function(rule_results, rule_category, view, id) {
             
             SidePanelUtil.addAndRemoveSidePanels(false);
             var preferences = AinspectorPreferences.getPreferences();
             var panel = Firebug.currentContext.getPanel("ainspector", true);
             
             if (panel) {
               Dom.clearNode(panel.panelNode);
             }
             
             panel.panelNode.id = "ainspector-panel"; 

             FBTrace.sysout("rule_Results: ", rule_results);
             var category_rule_results = rule_results.getFilteredRuleResultsByRuleCategory(rule_category, 
                 "All Rules", preferences.show_results_filter_value);
             
             category_rule_results.sortRuleResultsByImplementationLevel();
             if (FBTrace.DBG_AINSPECTOR) FBTrace.sysout("AInspector; category_rule_results", category_rule_results);
             var rule_results_list = category_rule_results.createListOfRuleResults();
//             rule_results_list.sortListOfRuleResults('wcag20_level', 1); 

             FBTrace.sysout("filtered_rule_results: ", rule_results_list);

             var filtered_rule_results = category_rule_results.filtered_rule_results;
             
             panel.table = this.tag.replace({results: rule_results_list, view:view, category_rule_results: category_rule_results }, panel.panelNode);
             AinspectorUtil.contextMenu.setTableMenuItems(panel.table);
             
             var side_panel = Firebug.chrome.getSelectedSidePanel();
             
             AinspectorUtil.selectRow(panel.table, false, id);
             
             if (side_panel){
              
               if (AinspectorUtil.selected_row != null) side_panel.updateSelection(AinspectorUtil.selected_row.repObject, side_panel.panelNode);
               else side_panel.getPanelViewMesg(side_panel.panelNode, "");
             } else {
               side_panel = Firebug.currentContext.getPanel('elements');
               side_panel.getPanelViewMesg(side_panel.panelNode, "");
             }
             
           },
           
           
           highlightRule : function(event){
             
             var table       = Dom.getAncestorByClass(event.target, "ai-table-list-items");
             var current_row = Dom.getAncestorByClass(event.target, "tableRow");
             AinspectorUtil.highlightRow(event, table, current_row);
           },
           
           sortColumn : function(event) {
             
             var table  = Dom.getAncestorByClass(event.target, "ai-table-list-items");
             var column = Dom.getAncestorByClass(event.target, "gridHeaderCell");
             
             if (FBTrace.DBG_AINSPECTOR)
               FBTrace.sysout("AInspector; Firebug.AinspectorModule.AinspectorRulesTemplate.sortColumn", AinspectorUtil);  
             AinspectorUtil.sortColumn(table, column);
           }
           
      });
    }  
    Firebug.registerStylesheet("chrome://ainspector/skin/ainspector-list-template.css");
    Firebug.registerStylesheet("chrome://ainspector/skin/ainspector.css");
  
    Firebug.registerRep(Firebug.AinspectorModule.AinspectorRulesTemplate);
  
    return Firebug.AinspectorModule.AinspectorRulesTemplate;
  }
);
         