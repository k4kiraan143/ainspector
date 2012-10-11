/**
 * Copyright 2012 University Of Illinois
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

var EXPORTED_SYMBOLS = ["OAA_WEB_ACCESSIBILITY"]; //Export items from module and inject them into the import scope

var console = Components.classes["@mozilla.org/consoleservice;1"].getService(Components.interfaces.nsIConsoleService);

var Node = Node || {
  ELEMENT_NODE    :  1,
  ATTRIBUTE_NODE  :  2,
  TEXT_NODE       :  3
  }


/** 
 * @namespace OAA_WEB_ACCESSIBILITY
 */

var OAA_WEB_ACCESSIBILITY  = OAA_WEB_ACCESSIBILITY || {};

/** 
 * @namespace OAA_WEB_ACCESSIBILITY.util
 */

OAA_WEB_ACCESSIBILITY.util = OAA_WEB_ACCESSIBILITY.util || {};

/* ---------------------------------------------------------------- */
/*                      Highlight Module                            */ 
/* ---------------------------------------------------------------- */

/** 
 * @namespace OAA_WEB_ACCESSIBILITY.util.highlightModule
 */

OAA_WEB_ACCESSIBILITY.util.highlightModule = {
  
  last_highlighted_nodes: [],
  document: null,

  /**
   * @function initHighlight
   * 
   * @memberOf OAA_WEB_ACCESSIBILITY.util.highlightModule
   *
   * @desc Initialize highlight module
   *
   * @param {Object}  document  - Document object model of the browser view to highlight
   */
   initHighlight : function (document) {
  
     this.document = document;
  
   }, 

  /**
   * @function highlightCacheItems
   *
   * @memberOf OAA_WEB_ACCESSIBILITY.util.highlightModule
   *
   * @desc highlights set of nodes selected on a page
   *
   * @param {Array}   items     - An array of OAA cache items to highlight
   */
   highlightCacheItems : function (items) {
   
	 console.logStringMessage("this.last_highlighted_nodes.length: " + this.last_highlighted_nodes.length);  
     
	 if (this.last_highlighted_nodes && this.last_highlighted_nodes.length) {
       this.removeHighlight(); 
     }

     if (!items || typeof items.length == 'undefined') return;
    
     var node = null;
     var items_len = items.length;
     var style;
     var tag_name;

     for (var i = 0; i < items_len; i++) {
       
       var obj = items[i];
       var item = obj;
       
       if (item.cache_item) item = item.cache_item;
       
       if (item.dom_element) {  // item is a cache element object
    
         if (item.dom_element.image_only) {
           node = item.dom_element.node.getElementsByTagName("img")[0];
         }
         else {
           node = item.dom_element.node;
         }
         style = item.dom_element.computed_style;
         tag_name = item.dom_element.tag_name;
       }
       else { 
         // If item is a dom element object or text node object
         switch (item.type) {
        
           case Node.ELEMENT_NODE:
             node = item.node;
             style = item.computed_style;
             tag_name = item.tag_name;
             break;
          
           case Node.TEXT_NODE:
             
             if (item.parent_element) {
               node = item.parent_element.node;        
               style = item.parent_element.computed_style;
               tag_name = item.parent_element.tag_name;
             }  
             break;
        
           default: 
             break;
         }
     
       }

       if (node) {

//       check if the node is off screen or hidden from assistive technologies
//       console.logStringMessage("style.visibility;" + style.visibility);
//       console.logStringMessage("style.display;" + style.display);

         if (style.visibility == "hidden" || style.display == "none") {
           this.isVisibletoAT(obj);
         } else {
           this.insertDIV(obj, node, tag_name);
         }
       }
     } //end for
   },
  
   /**
    * @function removeHighlight
    * 
    * @memberOf OAA_WEB_ACCESSIBILITY.util.highlightModule
    * 
    * @desc unhighlights the nodes that are highlighted earlier and 
    *       removes the informational message added to a page if the 
    *       element is hidden from Assistive technologies
    */
   removeHighlight : function() {

     if (!this.last_highlighted_nodes || !this.document) return;
     
     var length = this.last_highlighted_nodes.length;
     
     for (var i=0; i <length; i++) {
       	 
       var obj = this.document.getElementById("oaa_web_accessibility_highlight_id");
      
       if (obj && obj.hasChildNodes()) {
         
         if (obj.innerHTML == 'Element is off-screen or hidden from assistive technologies') {
           
           this.document.body.removeChild(obj);
           
           continue;
         }
         
         var parent_node = obj.parentNode;
         while(obj.firstChild) {
           parent_node.insertBefore(obj.firstChild, obj);
         }

         parent_node.removeChild(obj);
       } else {
         if (obj) this.document.removeChild(obj);
       }
     }
   
     for (var i = 0; i < length; i++) {
	   this.last_highlighted_nodes.splice(i, length);
     }

   },
  
  /**
   * @function isVisibletoAT
   * 
   * @memberOf OAA_WEB_ACCESSIBILITY.util.highlightModule
   *
   * @desc Position a div on the left side of the view port 
   * 
   * @param {Object} item
   */
  isVisibletoAT : function (item) {

    if (!this.document) return;

    var new_div_element = this.document.createElement('div');
    var style_div = 'width:400px; padding:10px; border:3px solid grey; margin:0px; color:red; font-size:20px; position:fixed; ';

    new_div_element.id = 'oaa_web_accessibility_highlight_id';
    new_div_element.setAttribute("style", style_div);
    new_div_element.innerHTML = 'Element is off-screen or hidden from assistive technologies';
    new_div_element.setAttribute("title", this.setTitle(item));
      
    this.document.body.insertBefore(new_div_element,this.document.body.childNodes[0]);
    
    this.last_highlighted_nodes.push(new_div_element);
    
  },
  
  /**
   * @function insertDIV
   * 
   * @memberOf OAA_WEB_ACCESSIBILITY.util.highlightModule
   * 
   * @desc position the DIV 
   *   1. as only child of elements that can have content (e.g., p, h1, h2, li...)
   *   2. as th eparent of elements that are 
   *      * defined as empty (e.g., img, input)
   *      * can only contain element (e.g., ul, dl, ol, object...)
   * 
   * @param {Object} cache_item
   * @param {Object} node
   * @param {String} tag_name           
   */
  insertDIV : function (cache_item, node, tag_name) {

    var flag = false;
    var parent_node = null;
    var elements_without_content = ['applet', 'area', 'dl', 'frame', 'img', 'input', 'object', 'ol', 'table', 'ul'];
    var length =  elements_without_content.length;
    var new_div_element = this.document.createElement('div');
    
    new_div_element.id = 'oaa_web_accessibility_highlight_id';
    new_div_element.setAttribute("style", this.changeStyle(cache_item));
    new_div_element.setAttribute("title", this.setTitle(cache_item));
    
    var index = elements_without_content.indexOf(tag_name);
    
    if (index != -1) {
      parent_node = node.parentNode;
      parent_node.insertBefore(new_div_element, node);
      new_div_element.appendChild(node);
    } else {
      
      while (node.firstChild) {
        new_div_element.appendChild(node.firstChild);         
      } 
      node.appendChild(new_div_element); 
    }
    
    this.last_highlighted_nodes.push(new_div_element);

//  If true, element is aligned with top of scroll area.
//  If false, it is aligned with bottom.
    node.scrollIntoView(true);
  },
  
  /**
   * @function changeStyle
   * 
   * @memberOf OAA_WEB_ACCESSIBILITY.util.highlightModule
   * 
   * @desc changes styling of outline on div
   *    1. manual check (red single line)
   *    2. pass (green single line)
   *    3. violation (red double line)
   *    4. warning (yellow single line)
   *    5. hidden (gray double line)
   *    6. shows blue color outline if there are no rules for an element 
   *  
   * @param {Object} item - cache_item to get the severity count
   */
  changeStyle : function(item) {
      
    if (item.violations_count > 0) return "outline: medium solid red; borderCollapse: collapse; ";
    else if (item.manual_checks_count > 0) return "outline: medium double red; borderCollapse: collapse; ";
    else if (item.warnings_count > 0 ) return "outline: medium solid orange; borderCollapse: collapse; ";
    else if (item.hidden_count > 0) return "outline: medium double grey; borderCollapse: collapse; ";
    else if (item.passed_count > 0) return "outline: medium solid green; borderCollapse: collapse;";
    else return "outline: medium solid blue; borderCollapse: collapse;";
  },
  
  /**
   * @function setTitle
   * 
   * @memberOf OAA_WEB_ACCESSIBILITY.util.highlightModule
   * 
   * @desc Creates value for title attribute of the div element to provide a summary of the number of violations, warnings, manual checks and passes 
   * 
   * @param {Object} item - cache_item to retrieve the count of severities
   */
  setTitle : function(item) {
    
    var title = '';
    
    if (item.violations_count > 0) title = title + item.violations_count + ' Violations, ';
    if (item.manual_checks_count > 0) title = title + item.manual_checks_count + ' Manual checks, ';
    if (item.warnings_count > 0) title = title + item.warnings_count + ' Warnings, ';
    if (item.passed_count > 0) title = title + item.passed_count + ' Passes';
    if (item.hidden_count > 0) title = title + item.hidden_count + ' Hidden';
    
    if (!title) title = 'no rule results';
    
    return title;
  }
};
