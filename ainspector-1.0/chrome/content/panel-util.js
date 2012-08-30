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

  if (!AINSPECTOR_FB.highlightModule) {
    var Cu = Components.utils; 

    try {
      FBTrace.sysout("OAA_WEB_ACCESSIBILITY (before): ", OAA_WEB_ACCESSIBILITY);
      AINSPECTOR_FB.highlightModule = Cu["import"]("resource://ainspector/highlight.js");
      FBTrace.sysout("OAA_WEB_ACCESSIBILITY (after)", OAA_WEB_ACCESSIBILITY);
      OAA_WEB_ACCESSIBILITY.util.highlightModule.initHighlight(window.content.document);

    } catch (error) {
      FBTrace.sysout("error while creating highlightModule Object ", error);  
    }
  }
  
 /**
  * @namespace AINSPECTOR_FB.toolbarUtil
  */
 AINSPECTOR_FB.toolbarUtil = {
     
  /**
   * @function getToolbarButtonClass
   * 
   * @param {Object} obj
   * 
   * @returns {String} className
   */
  getToolbarButtonClass : function(obj) {
      
    var className = "toolbarButtonView-" + obj.name;
     
    if (obj.selected) className += " selected";
      
    if (obj.first) className += " first";
    return className;
  },
    
  /**
   * @function onToolbarFocus
   * 
   * @desc
   * 
   * @param event
   * @returns
   */
  onToolbarFocus : function(event) {
  
    toolbarUtil.selectTab(event);
  },
    
  /**
   * @function getTabIndex
   * 
   * @param obj
   * @returns
   */
  getTabIndex : function(obj) {
      
    if (obj == 'temp') return 0;
    return obj.selected ? "0" : "-1";
  },
    
  /**
   * @function onToolbarKeyPress
   * 
   * @desc
   * 
   * @param event
   * @returns
   */
  onToolbarKeyPress : function(event) {
  
  var key = event.keyCode;
    var tabs;

    switch(key) {
    
      case KeyEvent.DOM_VK_LEFT:
    
      case KeyEvent.DOM_VK_RIGHT:
      
      case KeyEvent.DOM_VK_UP:
        
      case KeyEvent.DOM_VK_DOWN:

        var forward = key == KeyEvent.DOM_VK_RIGHT || key == KeyEvent.DOM_VK_DOWN;
        var tabList = getAncestorByClass(event.target, "focusTabList");
        
        //get all the tabs from the toolbar
        tabs = tabList.getElementsByClassName("focusTab");

        var currentIndex = Array.indexOf(tabs, event.target);

        if (currentIndex != -1) {
          var newIndex = forward ? ++currentIndex : --currentIndex;

          //get the focus back to the first tab on the tool bar from the last tab of the toolbar
          newIndex = newIndex < 0 ? tabs.length -1 : (newIndex >= tabs.length ? 0 : newIndex);
            
          if (tabs[newIndex]) tabs[newIndex].focus();
        }
        
        event.stopPropagation();
        event.preventDefault();
         
        break;
          
      case KeyEvent.DOM_VK_TAB:
    } //end switch
  },
      
  /**
   * @function getSelectedState
   * 
   * @desc 
   * 
   * @param {Object} obj
   */
  getSelectedState : function (obj) {
  
  if (obj == 'temp') return 'true';  
  
  return obj.selected ? "true" : "false";
  },
      
  /**
   * @function viewHTMLPanel
   * 
   * @desc redirect to the HTML Panel of Firebug
   * 
   * @param {Object} event - event triggered on a row in the Links Table
   */
  viewHTMLPanel: function(event) {

    var main_panel_div =  getAncestorByClass(event.target, "main-panel");
    var sub_div = getChildByClass(main_panel_div, "table-scrollable");
    var table = getChildByClass(sub_div, "ai-table-list-items");;
    var row = null;
    
    if (table) {
      row =  getChildByClass(sub_div, "tableRow");
    } else { 
      table = getChildByClass(sub_div, "domTable");
      row =  getChildByClass(sub_div, "treeRow");
    }
     
    var child;
    var tbody = table.children[1];
    var node = null;

    for (var i = 0; i < tbody.children.length; i++) {
      var flag = false;
      var row = tbody.children[i];
      node = row;
      
      for (var j = 0; j < row.children.length; j++) {
        var cell = row.children[j];
      
        for (var k=0; k<cell.classList.length;k++) {
        
          if (cell.classList[k] ==  "gridCellSelected") {
            flag = true;
            break;
          }//end if
        }//end for
        if (flag == true) break;
      }
      if (flag == true) break;
    }
    
    var item = null;
    if (node.repObject.cache_item) {
      item = node.repObject.cache_item;
    } else {
      if (node.repObject.dom_text_nodes) return;
      if (node.repObject.parent_element) item = node.repObject.parent_element.node;
    }
    AINSPECTOR_FB.previous_selected_row = node;
    
    if (item.dom_element) node = item.dom_element.node;
    else node = item.node;
    
    var panel = Firebug.chrome.selectPanel("html");
    panel.select(node);
  },
  
  /**
   * @function selectRow
   * 
   * @desc sets the first row object in to the panel and highlight() function to highlight the first row 
   * 
   * @param {Object} object - first image object in the images cache
   * @property {Object} selection - set an object to the panel to be used by the side panels when selected first time
   */
  selectRow: function(panel, object, is_a_tree, toolbar_button) {

    if  (AINSPECTOR_FB.previous_selected_row != null &&
        AINSPECTOR_FB.selected_toolbar_button == toolbar_button) {
      var selected_row = AINSPECTOR_FB.previous_selected_row;
      panel.selection = AINSPECTOR_FB.previous_selected_row;
//      var rows = panel.table.children[6].children[1].children;
      var rows = null;
      rows = panel.table.children[1].children[0].children[1].children;
      FBTrace.sysout("rows: ", rows);
      
      var row = null;
      var i = 0;
      
      for (i; i < rows.length; i++) {
        row = rows[i];
//        FBTrace.sysout("row " + i, rows[i]);
        
        if (is_a_tree == true) {
          if (row.repObject.children) {
            var children = row.repObject.children;
            
            for (var j=0; j<children.length; j++) {
              var child = children[j];
              FBTrace.sysout("child: ", child);
              FBTrace.sysout("sevrow: ", selected_row);
              if (child.cache_item.toString() == selected_row.repObject.cache_item.toString() &&
                child.cache_item.document_order == selected_row.repObject.cache_item.document_order) {
                var new_table = AINSPECTOR_FB.treeTemplate.grid.openRow(row);
                FBTrace.sysout("new_table: ", new_table);
                j = j+1;
                var k = i+j;
                AINSPECTOR_FB.flatListTemplateUtil.highlight(new_table.children[1].children[0].children[1].children[i+j]);
                return k;
                break;
              }
            }
          }
        } else { //flat list
          if (row.children[0].textContent == selected_row.children[0].textContent &&
           row.repObject.cache_item.document_order == selected_row.repObject.cache_item.document_order) {
            AINSPECTOR_FB.flatListTemplateUtil.highlight(panel.table.children[1].children[0].children[1].children[i]);
            return i;
            break;
          }
        }
      } 
      
      FBTrace.sysout("AINSPECTOR_FB.images.select() - AINSPECTOR_FB.previous_selected_row: ", AINSPECTOR_FB.previous_selected_row);
      
//      if (is_a_tree == true)  AINSPECTOR_FB.flatListTemplateUtil.highlight(panel.table.children[6].children[1].children[i]);
//      else AINSPECTOR_FB.flatListTemplateUtil.highlight(panel.table.children[1].children[0].children[1].children[i]);
      
      
    } else {
      panel.selection = object;
    
//      if (is_a_tree == true) AINSPECTOR_FB.flatListTemplateUtil.highlight(panel.table.children[6].children[1].children[0]); 
        
//      else AINSPECTOR_FB.flatListTemplateUtil.highlight(panel.table.children[1].children[0].children[1].children[0]);
      AINSPECTOR_FB.flatListTemplateUtil.highlight(panel.table.children[1].children[0].children[1].children[0]);
    }
    
    AINSPECTOR_FB.selected_toolbar_button = toolbar_button;
  },
  
  /**
   * @function getRulesetLEvel
   * 
   * @memberOf AINSPECTOR_FB.toolbarUtil
   * 
   * @desc returns a level in which the ruleset is evaluated
   * 
   * @param {Number} level
   * 
   * @return A, AA && AAA
   */
  getLevel : function (level){
        
    if (level == 1) return "A";
    else if (level == 2) return "A & AA";
    else return "A, AA & AAA";
          
  },
  
  getPixelsFromTop : function(obj) {
    var objFromTop = obj.offsetTop;

    while(obj.offsetParent!=null) {
      var objParent = obj.offsetParent;
      objFromTop += objParent.offsetTop;
      obj = objParent;
    }
    FBTrace.sysout("valueeeeeeeeeeeeee....", objFromTop);
    return objFromTop;
  },
       
  /**
   * @functon getRulesetTitle
   * 
   * @desc gets the ruleset tilte
   * 
   * @param {String} ruleset_id - ID of the ruleset
   * 
   * @return ruleset Title
   */
  getRulesetTitle : function (ruleset_id) {
      
    if (ruleset_id == 'WCAG20_ARIA_TRANS') return 'WCAG 2.0 ARIA Transitional';
        
    else if (ruleset_id == 'WCAG20_ARIA_STRICT') return 'WCAG 2.0 ARIA Strict';
        
    else return 'IITAA 2.0';
  },

  viewContainer : DIV({style : "display:none"}),
    
  /**
   * @function getSelectedToolbarButton
   * 
   * @desc return toolbar button selected on the main panel
   * 
   * @param {Object} context - Firebug context
   * @property {String} toolbar_button - selected toolbar button
   * 
   * @return {String} toolbar_button
   */
  getSelectedToolbarButton : function(context){
    
    //var toolbarbuttons = context.browser.chrome.$("radio-toolbar").children;
    var toolbarbuttons = context.chrome.$("fbFirebugExtensionButtons").children;
    var toolbar_button;
  
    for (var i=1; i < toolbarbuttons.length; i=i+2){
     
      if (toolbarbuttons[i].checked == true) {
         //if (i != 0) toolbarbuttons[i].checked = false;
         toolbar_button = toolbarbuttons[i].id;
       break;
       }
     }
    return toolbar_button;
  }
};

/**
 * @namespace AINSPECTOR_FB.flatListTemplateUtil
 */
AINSPECTOR_FB.flatListTemplateUtil = {

  /**
   * @function onKeyPressTable
   * 
   * @desc focus on a row with the keyboard events
   * 
   * @param event event triggered when any keyboard's right, left, up and down arrows are pressed
   */
  onKeyPressTable: function(event){
    
    event.stopPropagation();
    
    var main_panel = getAncestorByClass(event.target, "main-panel");
    var table_div = getChildByClass(main_panel, "table-scrollable");
    var table = getChildByClass(table_div, "ai-table-list-items");
    FBTrace.sysout("table: ", table);
    
    switch(event.keyCode) {
        
      case KeyEvent.DOM_VK_LEFT: //  
   
      case KeyEvent.DOM_VK_UP: //up
    var row = findPrevious(event.target, AINSPECTOR_FB.ainspectorUtil.isGridRow);
    
    if (row) {
      row.focus();
      AINSPECTOR_FB.flatListTemplateUtil.highlightRow(event, row);
    }
    break;
    
      case KeyEvent.DOM_VK_RIGHT: //right
      //var cell = AINSPECTOR_FB.ainspectorUtil.getChildByClass(event.target, "gridCell");
      //if (cell) cell.focus();
      //break;
    case KeyEvent.DOM_VK_DOWN: //down

      if (table.tabIndex == '0') {
        table.setAttribute('tabindex', '-1');
        table.rows[0].setAttribute('tabindex', '0');
        setClass(table.rows[0], "headerRowSelected");
        table.rows[0].focus();
        var side_panel = Firebug.currentContext.getPanel('rulesSidePanel');
        AINSPECTOR_FB.emptySidePanelTemplate.tag.replace({messg: "please select an element row in the left panel", desc: "Evaluation Results By Rule"}, side_panel.panelNode);
        break;
      }  
      FBTrace.sysout("AINSPECTOR_FB.flatListTemplateUtil.onKeyPressTable - down arrow");
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
//          unhighlighting from rows in panel
            var current_row = all_rows[index];
            var header_row = all_rows[index];
            if (current_index != 0) {
              
//              if (current_index == 1) {
//                FBTrace.sysout("all_rows:", all_rows);
//                FBTrace.sysout("header_row: ", header_row);
//                if(hasClass(header_row, "headerRowSelected")) AINSPECTOR_FB.ainspectorUtil.removeClass(header_row, "headerRowSelected");
//              }
              
              AINSPECTOR_FB.ainspectorUtil.removeClass(current_row, "gridRowSelected");
                
              for (var c=0; c< current_row.cells.length; c++) AINSPECTOR_FB.ainspectorUtil.removeClass(current_row.cells[c], "gridCellSelected");
            } 

//          highlight rows from panel
            all_rows[new_index].focus();
            AINSPECTOR_FB.ainspectorUtil.setClass(next_row, "gridRowSelected");
                
            for (var i=0; i< next_row.cells.length; i++) AINSPECTOR_FB.ainspectorUtil.setClass(next_row.cells[i], "gridCellSelected");
              OAA_WEB_ACCESSIBILITY.util.highlightModule.highlightCacheItems([next_row.repObject]);
          }
        }
        event.stopPropagation();
        event.preventDefault();
          
        break;
          
      case KeyEvent.DOM_VK_TAB:
         //var panel = Firebug.chrome.getSelectedPanel();
        var sidePanel = Firebug.chrome.getSelectedSidePanel();
//      if (sidePanel) {
//        sidePanel.panelNode.setAttribute("tabindex", "0");
//        sidePanel.panelNode.focus();
//        setClass(sidePanel.panelNode, "focusRow");
//      }
        break;
    }
  },
    
  /**
   * @function onKeyPressTree
   * 
   * @desc
   * 
   * @param {Object} event
   */
  onKeyPressTree : function (event) {
    
    event.stopPropagation();
    var table = getAncestorByClass(event.target, "domTree");
      
    switch(event.keyCode) {
          
      case KeyEvent.DOM_VK_LEFT: //  
        
      case KeyEvent.DOM_VK_UP: //up
        var row = findPrevious(event.target, AINSPECTOR_FB.ainspectorUtil.isGridRow);
        
      if (row) {
        row.focus();
        AINSPECTOR_FB.flatListTemplateUtil.highlightRow(event, row);
      }
      break;
      
      case KeyEvent.DOM_VK_RIGHT: //right
          
      case KeyEvent.DOM_VK_DOWN: //down

      if (table.tabIndex == '0') {
        table.setAttribute('tabindex', '-1');
        table.rows[0].setAttribute('tabindex', '0');
        table.rows[0].focus();
        
        break;
      }  
      var all_rows = table.getElementsByClassName("gridRow");
        var current_index = Array.indexOf(all_rows, event.target);
        var index = Array.indexOf(all_rows, event.target);
        var key = event.keyCode;
        var forward = key == KeyEvent.DOM_VK_RIGHT || key == KeyEvent.DOM_VK_DOWN;
           
        if (current_index != -1) {
          var new_index = forward ? ++current_index : --current_index;
           
          //get the focus back to the first tab on the tool bar from the last tab of the toolbar
          new_index = new_index < 0 ? all_rows.length -1 : (new_index >= all_rows.length ? 0 : new_index);
                
          if (all_rows[new_index]) { 
            var next_row = all_rows[new_index];

            //unhighlighting from rows in panel
            var current_row = all_rows[index];

            if (current_index != 0) {
              AINSPECTOR_FB.ainspectorUtil.removeClass(current_row, "gridRowSelected");
              
              for (var c=0; c< current_row.cells.length; c++) AINSPECTOR_FB.ainspectorUtil.removeClass(current_row.cells[c], "gridCellSelected");
            }

//          highlight rows from panel
          all_rows[new_index].focus();
            AINSPECTOR_FB.ainspectorUtil.setClass(next_row, "gridRowSelected");
            
            for (var i=0; i< next_row.cells.length; i++) AINSPECTOR_FB.ainspectorUtil.setClass(next_row.cells[i], "gridCellSelected");
          OAA_WEB_ACCESSIBILITY.util.highlightModule.highlightCacheItems([next_row.repObject]);

          }
        }
        event.stopPropagation();
        event.preventDefault();
           
        break;
    }
  },
    
  /**
   * @function onFocus
   * 
   * @desc sets/removes selection of state with the ARIA attrubute "aria-selected" 
   * 
   * @param {Event} event
   */
  onFocus : function(event) {

    var event_target = event.target;

    if (!event_target) return;
      
    var category = getClassValue(event_target, "tableRowView");
    var table_rows = getAncestorByClass(event_target, "gridRow");
      
    if (table_rows) {
      var old_row = getElementByClass(table_rows, "selected");

      if (old_row) {
        old_row.setAttribute("aria-selected", "false");
        old_row.setAttribute("tabindex", "-1");
        removeClass(old_row, "selected");
     }
    }

    event_target.setAttribute("aria-selected", "true");
    event_target.setAttribute("tabindex", "0");
    setClass(event_target, "selected");
  },
    
  /**
   * @function htmlButtonPress
   * 
   * @desc
   * 
   * @param {Event} event
   */
  htmlButtonPress : function(event) {
    
    switch(event.keyCode) {
      
    case 13: //Enter
      AINSPECTOR_FB.images.equivToolbarPlate.toHTMLPanel(event);
    break;
  }
  },
  

    
    /**
     * @function onKeyPressHeadingCell
     * 
     * @desc focus on a table header cell with the keyboard events
     * 
     * @param event event triggered when any keyboard's enter, right, left, up and down arrows are pressed
     */
    onKeyPressHeadingCell: function(event){
      
    event.stopPropagation();
    switch(event.keyCode) {
      
      case 13: //Enter
        var table = getAncestorByClass(event.target, "ai-table-list-items");
        var column = getAncestorByClass(event.target, "gridHeaderCell");
        AINSPECTOR_FB.ainspectorUtil.sortColumn(table, column);
      break;
      
      case 9: //tab    
        break;
      default:
      this.onKeyPressCell(event);
      break;
    }
    },
    
    /**
     * @function doubleClick
     * 
     * @desc double click on a row/cell takes to the HTML panel of Firebug from the ainspector panel
     * 
     * @param event - event triggered on a table cell of a particular row
     */ 
    doubleClick: function(event){
      
      var row = getAncestorByClass(event.target, "tableRow");
      
      if (!row) row = getAncestorByClass(event.target, "treeRow");
      
      FBTrace.sysout("AINSPECTOR_FB.flatListTemplateUtil.doubleClick()- row: ", row);
      
      var object = row.repObject;
      var node = null;
      
      if (object.cache_item.dom_element) node = object.cache_item.dom_element.node;

      else node = object.cache_item.node;
      
      AINSPECTOR_FB.previous_selected_row = row;
      
      var panel = Firebug.chrome.selectPanel("html");

      panel.select(node);
    },
    
    /**
     * @function unhighlight
     * 
     * @desc unhighlights earlier selected row
     * 
     * @param {Object} table - table in the panel/sidepanel 
     */
    unHighlight : function (table) {
      
      var tbody = table.children[1];
      var rows = tbody.children;
      
      for (var i=0; i< rows.length; i++){
        var row = rows[i];
        var cells = row.children;
        var count = 0;
        var no_of_cells = row.children.length;

        for (var j=0; j< cells.length; j++) {
          var cell = cells[j];
           var class_list = cell.classList;
           
           
           for (var k=0; k<class_list.length; k++) {
             
             if (class_list[k] ==  "gridCellSelected") {
               AINSPECTOR_FB.ainspectorUtil.removeClass(cell, "gridCellSelected");
               count = count + 1;
               break;
             }
           }
           if (count >= no_of_cells) break;
        }
        
        if (count >= no_of_cells) {
          AINSPECTOR_FB.ainspectorUtil.removeClass(row, "gridRowSelected");
          break;
        }
      }
    },
    
    /**
     * @function highlight
     * 
     * @memberof AINSPECTOR_FB.flatListTemplateUtil
     * 
     * @desc highlight the first row when a toolbar button is clicked
     * 
     * @param {Object} row - row to highlight
     */
    highlight : function (row) {
      
      AINSPECTOR_FB.ainspectorUtil.setClass(row, "gridRowSelected");
      
      for (var i=0; i< row.children.length; i++) {
        AINSPECTOR_FB.ainspectorUtil.setClass(row.children[i], "gridCellSelected");
      }
      FBTrace.sysout("AINSPECTOR_FB.flatListTemplate.highlight() - row: ", row);
      if (row.repObject.cache_item) OAA_WEB_ACCESSIBILITY.util.highlightModule.highlightCacheItems([row.repObject.cache_item]);
      else OAA_WEB_ACCESSIBILITY.util.highlightModule.highlightCacheItems([row.repObject]);

    },
    
    /**
     * @function highlightRow
     *  
     * @memberof AINSPECTOR_FB.flatListTemplateUtil
     * @desc highlight a row when a row is selected in a panel
     * Set the "gridRowSelected" and "gridCellSelected" classes to the selected Row and 
     * cells in that row remove these classes from earlier selected row.
     * 
     * 
     * @param {event} event triggered when mouse click happens
     * 
     * @returns 
     */
    highlightRow: function (event) {
  
      var table = getAncestorByClass(event.target, "ai-table-list-items");
      var current_row =  getAncestorByClass(event.target, "tableRow");
      var tbody = table.children[1]; //nomber of rows in a table
//      FBTrace.sysout("AINSPECTOR_FB.flatListTemplateUtil.table: ", tbody);
      var row;
      var cell;

      if (!current_row) { //to highlight header cells
        current_row =  getAncestorByClass(event.target, "gridHeaderRow");
        tbody = table.children[0];
        
        if (event.keyCode == 38 || event.keyCode == 37) {
            
        //current_row = table.children[1].children[]; 

        } else if (event.keyCode == 40 || event.keyCode == 39){
        table.children[0].children[0].blur();
        current_row = table.children[1].children[0]; 
        table.children[1].children[0].focus();
        AINSPECTOR_FB.ainspectorUtil.setClass(current_row, "gridRowSelected");
          
        OAA_WEB_ACCESSIBILITY.util.highlightModule.highlightCacheItems([current_row.repObject]);
          for (var c=0; c< current_row.children.length; c++) {
          AINSPECTOR_FB.ainspectorUtil.setClass(current_row.children[c], "gridCellSelected");
          }
          return;
        }
      }
    
      for (var i = 0; i < tbody.children.length; i++) {
        row = tbody.children[i];
        var count = 0;
        var no_of_cells = row.children.length;
        
        for (var j = 0; j < no_of_cells; j++) {
        cell = row.children[j];
       
        for (var k=0; k<cell.classList.length;k++) {
       
          if (cell.classList[k] ==  "gridCellSelected") {
              AINSPECTOR_FB.ainspectorUtil.removeClass(cell, "gridCellSelected");
              count = count + 1;
              break;
          }

        }  
        if (count >= no_of_cells) break;
        }
        if (count >= no_of_cells) {
        AINSPECTOR_FB.ainspectorUtil.removeClass(row, "gridRowSelected");
        if (event.keyCode == 38 || event.keyCode == 37) {
            current_row = tbody.children[i-1]; 

          } else if (event.keyCode == 40 || event.keyCode == 39){
            
            current_row = tbody.children[i+1]; 
          }
        break;
      }
        
      }
      AINSPECTOR_FB.flatListTemplateUtil.highlight(current_row);
    },
    
    /**
     * @function highlightTreeRow
     *  
     * @desc highlight a row when a row is selected in a panel
     * Set the "gridRowSelected" and "gridCellSelected" classes to the selected Row and 
     * cells in that row remove these classes from earlier selected row.
     * 
     * 
     * @param {event} event triggered when mouse click happens
     * 
     * @returns 
     */
    highlightTreeRow: function (event) {
  
      var table = getAncestorByClass(event.target, "domTable");
      var current_row =  getAncestorByClass(event.target, "treeRow");
      var tbody = table.children[1]; //nomber of rows in a table
      var row;
      var cell;
      
      if (!current_row) { //to highlight header cells
      current_row =  getAncestorByClass(event.target, "gridHeaderRow");
        tbody = table.children[0];
      }
    
      for (var i = 0; i < tbody.children.length; i++) {
        row = tbody.children[i];
        var count = 0;
        var no_of_cells = row.children.length;
        
        for (var j = 0; j < no_of_cells; j++) {
        cell = row.children[j];
       
        for (var k=0; k<cell.classList.length;k++) {
       
          if (cell.classList[k] ==  "gridCellSelected") {
              AINSPECTOR_FB.ainspectorUtil.removeClass(cell, "gridCellSelected");
              count = count + 1;
              break;
          }

        }  
        if (count >= no_of_cells) break;
        }
        if (count >= no_of_cells) {
        AINSPECTOR_FB.ainspectorUtil.removeClass(row, "gridRowSelected");
        if (event.keyCode == 38 || event.keyCode == 37) {
            current_row = tbody.children[i-1]; 

          } else if (event.keyCode == 40 || event.keyCode == 39){
            current_row = tbody.children[i+1]; 

          }
        break;
      }
        
      }
      FBTrace.sysout("current_row: ", current_row);
      this.highlight(current_row);
    },
    
    /**
     * @function onClickHeader
     * 
     * @desc sorts the table depending on the header selected
     * 
     * @param event event triggered when mouse click happens
     */
    onClickHeader : function(event){
      
      var table = getAncestorByClass(event.target, "ai-table-list-items");
      var column = getAncestorByClass(event.target, "gridHeaderCell");
      AINSPECTOR_FB.ainspectorUtil.sortColumn(table, column);
    },
    
    /**
     * @function getProps
     * 
     * @desc returns the properties of a cache_item
     * 
     * @param {Object} cache_items - cache Object returned by the OAA Evaluation library
     * 
     * @return props
     */
    getProps : function(cache_items) {
      
      var cache_item_properties = [];
      
      var length = cache_items.length;
      
      for (var i = 0; i < length; i++) {
        
        var cache_item = cache_items[i];
        var props = [];
        var dom_element = null;
        
        if (cache_item.dom_element) dom_element = cache_item.dom_element;
        
        else dom_element = cache_item;
        
        /*props.push(dom_element.rules_hidden.length);
        props.push(dom_element.rules_passed.length);
        props.push(dom_element.rules_warnings.length);
        props.push(dom_element.rules_manual_checks.length);
        props.push(dom_element.rules_violations.length);
        
        cache_item.properties = props;*/
        cache_item_properties[i] = cache_item;
      }
      FBTrace.sysout("cache_item_properties: ", cache_item_properties);

      return cache_item_properties;
    }
    
  };

/**
 * @namespace AINSPECTOR_FB.tabPanelUtil
 */
AINSPECTOR_FB.tabPanelUtil = {
  /**
   * @function updateToolbar
   * 
   * @memberof AINSPECTOR_FB.tabPanelUtil
   * 
   * @param {Object} panelType - registered panel 
   * @param {String} toolbar_button - name of the toolbar button selected
   */
  updateToolbar: function(panelType, toolbar_button) {
     var removeBtn = Firebug.chrome.$(toolbar_button);
     var registered = Firebug.getPanelType(panelType);
    },
    
    /**
     * @function onRemoveSidePanel
     * @memberOf AINSPECTOR_FB.tabPanelUtil
     * 
     * @desc removes/unregisters sidePanal from any main panel depending on panelType
     * 
     *  @param {Object} panelType - type of the Panel  
     */
  onRemoveSidePanel: function(panelType) {
   
    Firebug.unregisterPanel(panelType);
  },

  /**
     * @function onAppendSidePanel
     * @memberOf AINSPECTOR_FB.tabPanelUtil
     * 
     * @desc add/registers sidePanal from any main panel depending on panelType
     * 
     *  @param {Object} panelType - registered Panel  
     */
    onAppendSidePanel: function(panelType) {

      FBTrace.sysout("onAppendSidePanel: ", panelType);
      Firebug.registerPanel(panelType);
      FBTrace.sysout("onAppendSidePanel afer register: ", Firebug);

    },
    
    /**
     * @function addAndRemoveSidePanels
     * 
     * @desc registers side panels according to the toolbar buttons selected
     *   like for 'Images' toolabr button on A11y Panel - 'Rule Results' side panel is registered
     *   like for 'Color Contrast' toolabr button on A11y Panel - 'Font Properties' side panel is registered
     *   
     * @param {Boolean} flag - a boolean value to check which toolbar button has to have the respective side panels
     */
    addAndRemoveSidePanels : function(flag) {
      
      var panelType_rules = Firebug.getPanelType("rulesSidePanel");
      var panelType_colorContrast = Firebug.getPanelType("colorContrastSidePanel");
      var panelType_elements = Firebug.getPanelType("elementsSidePanel");
  
      /* flag == true if it is other than color contrast toolbar button*/
      if (flag == true) {
        if (panelType_elements) {
          AINSPECTOR_FB.elements_registered = panelType_elements;
          AINSPECTOR_FB.tabPanelUtil.onRemoveSidePanel(panelType_elements);
        }
        if (panelType_colorContrast) {
          
          AINSPECTOR_FB.font_properties_registered = panelType_colorContrast;
          AINSPECTOR_FB.tabPanelUtil.onRemoveSidePanel(panelType_colorContrast);
        }
        if (panelType_rules) {
          //nothing
        } else {
          FBTrace.sysout("AINSPECTOR_FB.rules_registered: ", AINSPECTOR_FB.rules_registered);
          panelType_rules = AINSPECTOR_FB.rules_registered;
          AINSPECTOR_FB.tabPanelUtil.onAppendSidePanel(panelType_rules);
  
        }
      } else if (flag == false){ //if it is only color contrast panel
        if (panelType_elements) {
          AINSPECTOR_FB.elements_registered = panelType_elements;
          AINSPECTOR_FB.tabPanelUtil.onRemoveSidePanel(panelType_elements);
        }
        
        if (panelType_rules) {
          AINSPECTOR_FB.rules_registered = panelType_rules;
          AINSPECTOR_FB.tabPanelUtil.onRemoveSidePanel(panelType_rules);     
        }
        
        if (panelType_colorContrast) {
          //nothing
        } else {
          panelType_colorContrast = AINSPECTOR_FB.font_properties_registered;
          AINSPECTOR_FB.tabPanelUtil.onAppendSidePanel(panelType_colorContrast);
        }
      
      } else { //for summary view
        if (panelType_rules) {
          AINSPECTOR_FB.rules_registered = panelType_rules;
          AINSPECTOR_FB.tabPanelUtil.onRemoveSidePanel(panelType_rules);     
        }
        if (panelType_colorContrast) {
          
          AINSPECTOR_FB.font_properties_registered = panelType_colorContrast;
          AINSPECTOR_FB.tabPanelUtil.onRemoveSidePanel(panelType_colorContrast);
        }
        
        if (panelType_elements) {
          
        } else {
          panelType_elements = AINSPECTOR_FB.elements_registered;
          AINSPECTOR_FB.tabPanelUtil.onAppendSidePanel(panelType_elements);
        }
        
      }
    }
 };



}});