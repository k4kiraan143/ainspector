var AINSPECTOR_FB = AINSPECTOR_FB || {};

FBL.ns(function() {with (FBL) {
  
  var classNameReCache={};
  
  AINSPECTOR_FB.gridHeaderColumnResize = {
		  
    resizing: false,
    currColumn: null,
    startX: 0,
    startWidth: 0,
    lastMouseUp: 0,

    /**
     * @function onMouseClick
     * 
     * @desc
     * 
     * @param {} event
     */
    onMouseClick: function(event) {
        
	  if (!isLeftClick(event)) return;

      // Avoid click event for sorting, if the resizing has been just finished.
      var rightNow = (new Date()).getTime();

      if ((rightNow - AINSPECTOR_FB.gridHeaderColumnResize.lastMouseUp) < 1000) cancelEvent(event);
    },
    
    /**
     * @function onMouseDown
     * 
     * @descs
     * 
     * @param {} event
     */
    onMouseDown: function(event) {
        
   	  if (!isLeftClick(event)) return;

      var target = event.target;
      
      if (!hasClass(target, "gridHeaderCellBox")) return;

      var header = getAncestorByClass(target, "gridHeaderRow");

      if (!header) return;

      AINSPECTOR_FB.gridHeaderColumnResize.onStartResizing(event);

      cancelEvent(event);
    },

    /**
     * @function onMouseMove
     * 
     * @descs
     * 
     * @param {} event
     */
    onMouseMove: function(event) {
        
      if (AINSPECTOR_FB.gridHeaderColumnResize.resizing) {
            
    	if (hasClass(target, "gridHeaderCellBox")) target.style.cursor = "e-resize";

        AINSPECTOR_FB.gridHeaderColumnResize.onResizing(event);
        return;
      }
      var target = event.target;

      if (!hasClass(target, "gridHeaderCellBox")) return;

      if (target) target.style.cursor = "";

      if (!AINSPECTOR_FB.gridHeaderColumnResize.isBetweenColumns(event)) return;

      // Update cursor if the mouse is located between two columns.
      target.style.cursor = "e-resize";
    },

    /**
     * @function onMouseUp
     * 
     * @desc
     * 
     * @param {} event
     */
    onMouseUp: function(event) {
        
      if (!AINSPECTOR_FB.gridHeaderColumnResize.resizing) return;

      AINSPECTOR_FB.gridHeaderColumnResize.lastMouseUp = (new Date()).getTime();
      AINSPECTOR_FB.gridHeaderColumnResize.onEndResizing(event);
      cancelEvent(event);
    },

    /**
     * @function onMouseOut
     * 
     * @desc
     * 
     * @param {} event
     */
    onMouseOut: function(event) {
        
      if (!AINSPECTOR_FB.gridHeaderColumnResize.resizing) return;

      if (FBTrace.DBG_COOKIES) {
        FBTrace.sysout("cookies.Mouse out, target: " + event.target.localName +
                ", " + event.target.className + "\n");
        FBTrace.sysout("      explicitOriginalTarget: " + event.explicitOriginalTarget.localName +
                ", " + event.explicitOriginalTarget.className + "\n");
      }
      var target = event.target;

      if (target == event.explicitOriginalTarget) AINSPECTOR_FB.gridHeaderColumnResize.onEndResizing(event);

      cancelEvent(event);
    },

    /**
     * @function isBetweenColumns
     * 
     * @desc
     * 
     * @param {} event
     */
    isBetweenColumns: function(event) {
        
      var target = event.target;
      var x = event.clientX;
      var y = event.clientY;

      var column = getAncestorByClass(target, "gridHeaderCell");
      var offset = getClientOffset(column);
      var size = getOffsetSize(column);

      if (column.previousSibling) {

    	if (x < offset.x + 4)
          return 1;   // Mouse is close to the left side of the column (target).
      }

      if (column.nextSibling) {
            
    	if (x > offset.x + size.width - 6)
          return 2;  // Mouse is close to the right side.
      }
      return 0;
    },

    /**
     * @function onStartResizing
     * 
     * @desc
     * 
     * @param {} event
     */
    onStartResizing: function(event){

      var location = AINSPECTOR_FB.gridHeaderColumnResize.isBetweenColumns(event);
      
      if (!location) return;

      var target = event.target;
      AINSPECTOR_FB.gridHeaderColumnResize.resizing = true;
      AINSPECTOR_FB.gridHeaderColumnResize.startX = event.clientX;

      // Currently resizing column.
      var column = getAncestorByClass(target, "gridHeaderCell");
      AINSPECTOR_FB.gridHeaderColumnResize.currColumn = (location == 1) ? column.previousSibling : column;

      // Last column width.
      var size = getOffsetSize(AINSPECTOR_FB.gridHeaderColumnResize.currColumn);
      AINSPECTOR_FB.gridHeaderColumnResize.startWidth = size.width;

      if (FBTrace.DBG_COOKIES) {
            
    	var colId = AINSPECTOR_FB.gridHeaderColumnResize.currColumn.getAttribute("id");
        FBTrace.sysout("cookies.Start resizing column (id): " + colId +
                ", start width: " + AINSPECTOR_FB.gridHeaderColumnResize.startWidth + "\n");
      }
    },

    /**
     * @function onResizing
     * 
     * @desc
     * 
     * @param {} event
     */
    onResizing: function(event) {
        
      if (!AINSPECTOR_FB.gridHeaderColumnResize.resizing) return;

      var newWidth = AINSPECTOR_FB.gridHeaderColumnResize.startWidth + (event.clientX - AINSPECTOR_FB.gridHeaderColumnResize.startX);
      AINSPECTOR_FB.gridHeaderColumnResize.currColumn.style.width = newWidth + "px";
        
      if (FBTrace.DBG_COOKIES) {
        var colId = AINSPECTOR_FB.gridHeaderColumnResize.currColumn.getAttribute("id");
        FBTrace.sysout("cookies.Resizing column (id): " + colId +
                ", new width: " + newWidth + "\n", AINSPECTOR_FB.gridHeaderColumnResize.currColumn);
      }
    },

    /**
     * @function endResizing
     * 
     * @desc
     * 
     * @param {} event
     */
    onEndResizing: function(event) {

      if (!AINSPECTOR_FB.gridHeaderColumnResize.resizing) return;

      AINSPECTOR_FB.gridHeaderColumnResize.resizing = false;

      var newWidth = AINSPECTOR_FB.gridHeaderColumnResize.startWidth + (event.clientX - AINSPECTOR_FB.gridHeaderColumnResize.startX);
      AINSPECTOR_FB.gridHeaderColumnResize.currColumn.style.width = newWidth + "px";

      // Store width into the preferences.
      var colId = AINSPECTOR_FB.gridHeaderColumnResize.currColumn.getAttribute("id");

      if (colId) {
        var prefName = "ainspector." + colId + ".width";
        AINSPECTOR.util.Preference.setPref(prefName, newWidth);
      }

      if (FBTrace.DBG_COOKIES) {
        var colId = AINSPECTOR_FB.gridHeaderColumnResize.currColumn.getAttribute("id");
        FBTrace.sysout("cookies.End resizing column (id): " + colId +
                ", new width: " + newWidth + "\n");
      }
    }	  
  };
  
  AINSPECTOR_FB.ainspectorUtil = {
	
	loadCSSToStylePanel : function(document){

	  this.loadCSS("chrome://ainspector/content/css/ainspector-panel.css", document);
      this.loadCSS("chrome://ainspector/content/css/fonts-min.css", document);
      this.loadCSS("chrome://ainspector/content/css/tabview.css", document);
      this.loadCSS("chrome://ainspector/content/css/allyGrade.css", document);
      this.loadCSS("chrome://ainspector/content/css/grid.css", document); 
    },
		  
	/**
     * @function loadCSS
     * 
     * @desc dynamically add a style sheet to the document.
     * 
     * @param url
     * @param doc
     * 
     * @return
     */
    loadCSS : function(url, doc) {
      
      if ( ! doc ) {
        return '';
      }
      var newCss = doc.createElement("link");
      newCss.rel = "stylesheet";
      newCss.type = "text\/css";
      newCss.href = url;
      doc.body.appendChild(newCss);

      return newCss;
    },  

    /**
     * @function AI_STR
     * 
     * @desc
     * 
     * @param name
     * 
     * @return
     */
    $AI_STR : function(name) {
      
      return document.getElementById("ainspector_stringbundle").getString(name);
    },

    /**
     * @function AI_STRF
     * 
     * @desc
     * 
     * @param name
     * @param args
     * 
     * @return
     */
    $AI_STRF : function(name, args) {
      
      return document.getElementById("ainspector_stringbundle").getFormattedString(name, args);
    },
    
    /**
     * @function sortColumn
     * 
     * @desc
     * 
     * @param table
     * @param column
     * @param order
     */
    sortColumn : function(table, column, order) {
      
      var colIndex = 0;
      if(!column) return;
      FBTrace.sysout("Inside sortColumn....");
      var numerical = !this.hasClass(column, "alphaValue");

      for (column = column.previousElementSibling; column; ) {
    	++colIndex;
    	column = column.previousElementSibling;
      }

      this.sort(table, colIndex, numerical, order);
    },

    /**
     * @funstion sort
     * 
     * @desc 
     * 
     * @param table
     * @param colIndex
     * @param numerical
     * @param order
     */
    sort: function(table, colIndex, numerical, order)  {
      var thead = table.firstChild;
      var headerRow = thead.firstChild;
      var tbody = table.lastChild;
      
      // Remove class from the currently sorted column
      var headerSorted = getChildByClass(headerRow, "gridHeaderSorted");
      removeClass(headerSorted, "gridHeaderSorted");
      
      if (headerSorted) headerSorted.removeAttribute("aria-sort");

      // Mark new column as sorted.
      var header = headerRow.childNodes[colIndex];
      
      this.setClass(header, "gridHeaderSorted");
      
      // If the column is already using required sort order, bubble out.
      if ((order == "desc" && header.sorted == 1) || (order == "asc" && header.sorted == -1))  return;
      
      if (header) header.setAttribute("aria-sort", header.sorted === -1 ? "descending" : "ascending");
      
      var colID = header.getAttribute("id");
      // Store current state into the preferences.
      var headerID = headerRow.getAttribute("id");

      Preference.setPref(headerID + "sortCol", colID); 
      Preference.setPref(headerID + "sortDir", header.getAttribute("aria-sort")); 
      var values = [];
      for (var row = tbody.childNodes[0]; row; row = row.nextSibling) {
          var cell = row.childNodes[colIndex];
          var value = numerical ? parseFloat(cell.textContent) : cell.textContent;
          values.push({row: row, value: value});
      }

      values.sort(function(a, b) { return a.value < b.value ? -1 : 1; });

      if ((header.sorted && header.sorted == 1) || (!header.sorted && order == "asc")) {
    	removeClass(header, "sortedDescending");
        this.setClass(header, "sortedAscending");
        header.sorted = -1;

        for (var i = 0; i < values.length; ++i) {
          tbody.appendChild(values[i].row);
        
          if (values[i].info) tbody.appendChild(values[i].info);
        }
      } else {
    	removeClass(header, "sortedAscending");
        this.setClass(header, "sortedDescending");

        header.sorted = 1;

        for (var i = values.length-1; i >= 0; --i) {
          tbody.appendChild(values[i].row);
          
          if (values[i].info) tbody.appendChild(values[i].info);
        }
      }
    },
    
    /**
     * @function setClass
     * 
     * @desc
     * 
     * @param node
     * @param name
     * 
     * @return node|null
     */
    setClass : function(node, name) {
      
      if (!node || node.nodeType != 1 || name == '') return;

      if (name.indexOf(" ") != -1) {
        var classes = name.split(" "), len = classes.length;
        
        for (var i = 0; i < len; i++) {
          var cls = classes[i].trim();
          if (cls != "") this.setClass(node, cls);
        }
        return;
      }
      
      if (!this.hasClass(node, name)) node.className = node.className.trim() + " " + name;
    },
    
    /**
     * @function removeClass
     * 
     * @desc
     * 
     * @param node
     * @param name
     * 
     * @return node|null
     */
    removeClass : function(node, name) {
        
      if (!node || node.nodeType != 1 || node.className == '' || name == '') return;

      if (name.indexOf(" ") != -1) {
        var classes = name.split(" "), len = classes.length;
        
        for (var i = 0; i < len; i++) {
          var cls = classes[i].trim();
          
          if (cls != ""){
                    
            if (this.hasClass(node, cls) == false) this.removeClass(node, cls);
          }
        }
        return;
      }

      var re;
      
      if (name.indexOf("-") == -1) {
        re = classNameReCache[name] = classNameReCache[name] || new RegExp('(^|\\s)' + name + '(\\s|$)', "g");
      } else { 
        re = new RegExp('(^|\\s)' + name + '(\\s|$)', "g")
      }
      node.className = node.className.replace(re, " ");

    },
    
    /**
     * @function hasClass
     * 
     * @desc
     * 
     * @param node
     * @param name
     * 
     * @return 
     */
    hasClass : function(node, name) {
      if (!node || node.nodeType != 1 || !node.className || name == '') return false;

      if (name.indexOf(" ") != -1) {
        var classes = name.split(" "), len = classes.length, found=false;

        for (var i = 0; i < len; i++) {
          var cls = classes[i].trim();
                
          if (cls != "") {
        	if (this.hasClass(node, cls) == false) return false;
            found = true;
          }
        }
        return found;
      }
      var re;
      if (name.indexOf("-") == -1) {
  
        re = classNameReCache[name] = classNameReCache[name] || new RegExp('(^|\\s)' + name + '(\\s|$)', "g");

      } else { 
        re = new RegExp('(^|\\s)' + name + '(\\s|$)', "g");
      }
      return node.className.search(re) != -1;
    },
    
    /**
     * @function getChildByClass
     * 
     * @desc
     * 
     * @param node
     * 
     * @return node
     */
    getChildByClass : function(node) {
    	
      if (!node) {
        return null;
      }

      for (var i = 1; i < arguments.length; ++i) {
        var className = arguments[i];
        var child = node.firstChild;
        node = null;
        
        for (; child; child = child.nextSibling) {
                
          if (this.hasClass(child, className)) {
            node = child;
            break;
          }
        }
      }

      return node;
    },
    
    /**
     * @function isGridRow
     * 
     * @desc
     * 
     * @param node
     * 
     * @return 
     */
    isGridRow: function(node) {
	  
      return AINSPECTOR_FB.ainspectorUtil.hasClass(node, "gridRow");
	},
    
	/**
	 * @function getAncestorByClass
	 * 
	 * @desc
	 * 
	 * @param node
	 * @param className
	 */
    getAncestorByClass : function(node, className) {
      
	  for (var parent = node; parent; parent = parent.parentNode) {
            
		if (this.hasClass(parent, className)) return parent;
      }

      return null;
    },
    
    /**
     * @function findElementIndex
     * 
     * @desc
     * 
     * @param elem
     * 
     * @return
     */
    findElementIndex : function(elem) {
      
      var k=-1, e=elem;
      
      while (e) {
    	
    	if ( "previousSibling" in e ) {
    	
    	  e = e.previousSibling;
    	  k = k + 1;
    	
    	} else {
    	  k= -1;
    	  break;
    	}
      }
      return k;
    }
  };
  
  /**
   * toolbarUtil
   * 
   * @desc common helper functions for the tool bar buttons
   */
  AINSPECTOR_FB.toolbarUtil = {
    
    /**
     * @function getToolbarButtonClass
     * 
     * @param obj
     * @returns
     */
    getToolbarButtonClass : function(obj) {
      
      var className = "toolbarButtonView-" + obj.name;
      
      if (obj.selected) className += " selected";
      
      if (obj.first) className += " first";
    
      return className;
    },
    
    /**
     * @function selectTab
     * 
     * @param event
     * 
     * @returns
     */
    selectTab : function(event) {
      var elem = event.target;
      if (!elem) return;
      
      var category = getClassValue(elem, "toolbarButtonView");
      if (category) {
        var tabList = getAncestorByClass(elem, "focusTabList");
        
        if (tabList) {
          var oldTab = getElementByClass(tabList, "selected");
          
          if (oldTab) {
            oldTab.setAttribute("aria-selected", "false");
            oldTab.setAttribute("aria-expanded", "false");
            oldTab.setAttribute("tabindex", "-1");
            removeClass(oldTab, "selected");
          }
        }
        elem.setAttribute("aria-selected", "true");
        elem.setAttribute("aria-expanded", "true");
        elem.setAttribute("tabindex", "0");
        setClass(elem, "selected");
        var currentView = panel;
        showOnSelectButton();
        
      }
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
        } //end switch
        //return tabs[newIndex];
      },
      
      /**
       * getSelectedState
       * 
       * @param obj
       * @returns
       */
      getSelectedState : function (obj) {
        return obj.selected ? "true" : "false";
      },
      
      /**
       * toHTMLPanel
       * 
       * @desc redirect to the HTML Panel of Firebug
       * 
       * @param event event triggered on a row in the Links Table
       */
      toHTMLPanel: function(event) {

        var table = getChildByClass(event.target.offsetParent, "ai-table-list-items");

  	    var row =  getChildByClass(event.target.offsetParent, "tableRow");
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
            if (cell.classList[k] ==  "gridRowSelected") {
              flag = true;
              break;
            }//end if
          }//end for
          if (flag == true) break;
        }
          if (flag == true) break;
        }
        node = node.repObject.dom_element.node;
        var panel = Firebug.chrome.selectPanel("html");
        panel.select(node);
      },

    
    viewContainer : DIV({style : "display:none"})
  };
  
  AINSPECTOR_FB.flatListTemplateUtil = {

	/**
	 * @FUNCTION onKeyPressTable
	 * 
	 * @desc
	 * 
	 * @param event event triggered when any keyboard's right, left, up and down arrows are pressed
	 */
	onKeyPressTable : function(event){
	  
	  event.stopPropagation();
	  
	  switch(event.keyCode) {
	  
	    case 38: //up
		  //var row = findPrevious(event.target, AINSPECTOR_FB.ainspectorUtil.isGridRow);
	    	var row = findPrevious(event.target, AINSPECTOR_FB.ainspectorUtil.isGridRow);
		  if (row) row.focus();
		  break;
		case 39: //right
		  var cell = AINSPECTOR_FB.ainspectorUtil.getChildByClass(event.target, "gridCell");
		  AINSPECTOR_FB.flatListTemplateUtil.hightlightCell(event);
		  if (cell) cell.focus();
		  break;
		case 40: //down
		  var index = AINSPECTOR_FB.ainspectorUtil.findElementIndex(event.target);
		  var row = getAncestorByClass(event.target, "gridRow");
		  if (event.target.id == "imgTableHeader") {
			row = row.parentNode.nextSibling.firstChild;
		  } else {
			row = row.nextSibling;
		  }
	   	  if (row) row.focus();
		  break;
		case 13:
		  var table = getAncestorByClass(event.target, "ai-table-list-items");
	      var column = getChildByClass(event.target, "gridCell");
	      AINSPECTOR_FB.ainspectorUtil.sortColumn(table, column);
		  break;
		  //cell.focus();
	  }
    },
    
    /**
     * hightlight
     *  
     * @desc
     * 
     * @param event event triggered when mouse click happens
     * 
     * @returns
     */
    hightlight: function (event) {
	    
	  var table = getAncestorByClass(event.target, "ai-table-list-items");
      var row =  getAncestorByClass(event.target, "gridRow");
      var tbody = null;
      var id = row.id;
      if (row.id == "imgTableHeader") 
    	tbody = table.children[0];
      else 
    	tbody = table.children[1];

     
      var i;
      var j;
      var k;
      var cell_selected = false;
      var child;
      var row;
      var cell;
      
      for (i = 0; i < tbody.children.length; i++) {
          var flag = false;
          var row = tbody.children[i];
          
          for (j = 0; j < row.children.length; j++) {
        	  cell = row.children[j];
        	  //cell_selected = getChildByClass(cell, "gridCellSelected");
        	 
        	  for (var k=0; k<cell.classList.length;k++) {
       	  
        		if (cell.classList[k] ==  "gridCellSelected") {
        		  cell_selected = true;
                AINSPECTOR_FB.ainspectorUtil.removeClass(cell, "gridCellSelected");
       		  flag = true;
                break;
             }
        	 }  
        	 if (flag == true) break;
         }
         if (flag == true) break;
       }

       var column = getAncestorByClass(event.target, "gridCell");
       AINSPECTOR_FB.ainspectorUtil.setClass(column, "gridCellSelected");

        //AINSPECTOR_FB.ainspectorUtil.setClass(row_cell, "gridCellSelected");
        //var row_cells = cell.childNodes;
      
    },
    
	/**
	 * @function onKeyPressRow
	 * 
	 * @desc focus on a row with the keyboard events
	 * 
	 * @param event event triggered when any keyboard's right, left, up and down arrows are pressed
	 */
	onKeyPressRow: function(event){
	  
	  event.stopPropagation();

      switch(event.keyCode) {
		  
	    case 38: //up
		  var row = findPrevious(event.target, AINSPECTOR_FB.ainspectorUtil.isGridRow);
		  if (row) row.focus();
		  break;
		case 39: //right
		  var cell = AINSPECTOR_FB.ainspectorUtil.getChildByClass(event.target, "gridCell");
		  if (cell) cell.focus();
		  break;
		case 40: //down
		  var row = findNext(event.target, AINSPECTOR_FB.ainspectorUtil.isGridRow);
		  if (row) row.focus();
		  break;
	  }
    },
    
    /**
	 * @function onKeyPressRow
	 * 
	 * @desc focus on a row with the keyboard events
	 * 
	 * @param event event triggered when any keyboard's right, left, up and down arrows are pressed
	 */
	onKeyPressHeaderRow: function(event){
	  
	  event.stopPropagation();

      switch(event.keyCode) {
		  
	    case 38: //up
		  var row = findPrevious(event.target, AINSPECTOR_FB.ainspectorUtil.isGridRow);
		  if (row) row.focus();
		  break;
		case 39: //right
		  var cell = AINSPECTOR_FB.ainspectorUtil.getChildByClass(event.target, "gridHeaderCell");
		  AINSPECTOR_FB.flatListTemplateUtil.hightlightCell(event);
		  if (cell) cell.focus();
		  break;
		case 40: //down
		  var row = findNext(event.target, AINSPECTOR_FB.ainspectorUtil.isGridRow);

		  if (row) row.focus();
		  break;
		case 13:
		  var table = getAncestorByClass(event.target, "ai-table-list-items");
	      var column = getChildByClass(event.target, "gridHeaderCell");
	      AINSPECTOR_FB.ainspectorUtil.sortColumn(table, column);
		  break;
		  //cell.focus();
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
     * @function onKeyPressCell
     * 
     * @desc focus on a table cell with the keyboard events
     * 
     * @param event event triggered when any keyboard's right, left, up and down arrows are pressed
     */
    onKeyPressCell: function(event){
  	  event.stopPropagation();
  	  switch(event.keyCode) {
		  
  	    case 13:
  		  var row = getAncestorByClass(event.target, "gridRow");
  		  var imageElement = row.repObject;
          var node = imageElement.dom_element.node;
  	      var panel = Firebug.chrome.selectPanel("html");
  	      panel.select(node);
  	      break;
  	  
  	    case 38: //up
			var index = AINSPECTOR_FB.ainspectorUtil.findElementIndex(event.target);
			var row = getAncestorByClass(event.target, "gridRow");
			row = row.previousSibling;
			if (row) {
			  var  cell = row.childNodes[index];
			  
			  if (cell) cell.focus();
			}
			break;
		  
  	    case 37: //left
		  var cell = event.target.previousSibling;
		
		  if (cell) {
		    cell.focus();
		  } else {
			var row = getAncestorByClass(event.target, "gridRow");
			row.focus();
		  }
		  break;
		
  	    case 39: //right
		  var cell = event.target.nextSibling;
			
		  if (cell) cell.focus();
		  break;
		
  	    case 40: //down
		  var index = AINSPECTOR_FB.ainspectorUtil.findElementIndex(event.target);
		  var row = getAncestorByClass(event.target, "gridRow");
   		  row = row.nextSibling;
			
   		  if (row) {
			var  cell = row.childNodes[index];
			
			if (cell) cell.focus();
		  }
		  break;
	   }  
     },
    
    /**
     * @function doubleClick
     * 
     * @desc double click on a row/cell takes to the HTML panel of Firebug from the ainspector panel
     * 
     * @param event
     */ 
    doubleClick: function(event){

      var element = event.target.repObject;
      var node = element.dom_element.node;
      var panel = Firebug.chrome.selectPanel("html");
      panel.select(node);
    },
    
    /**
     * @function highlight
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
    },
    
    /**
     * @function highlightRow
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
    highlightRow: function (event) {
	
      var table = getAncestorByClass(event.target, "ai-table-list-items");
      var current_row =  getAncestorByClass(event.target, "tableRow");
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
    	  break;
    	}
        
      }
      AINSPECTOR_FB.ainspectorUtil.setClass(current_row, "gridRowSelected");

      for (var c=0; c< current_row.children.length; c++) {
    	AINSPECTOR_FB.ainspectorUtil.setClass(current_row.children[c], "gridCellSelected");
      }
      
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
    	  break;
    	}
        
      }
      AINSPECTOR_FB.ainspectorUtil.setClass(current_row, "gridRowSelected");

      for (var c=0; c< current_row.children.length; c++) {
    	AINSPECTOR_FB.ainspectorUtil.setClass(current_row.children[c], "gridCellSelected");
      }
      
    },
    
    /**
     * hightlightCell
     *  
     * @desc
     * 
     * @param event event triggered when mouse click happens
     * 
     * @returns
     */
    hightlightCell: function (event) {
	    
	  var table = getAncestorByClass(event.target, "ai-table-list-items");
      var row =  getAncestorByClass(event.target, "tableRow");
      var tbody = table.children[1];

      if (!row) { //to highlight header cells
    	row =  getAncestorByClass(event.target, "gridHeaderRow");
    	tbody = table.children[0];
      }
      var i;
      var j;
      var k;
      var cell_selected = false;
      var child;
      var row;
      var cell;
      
      for (i = 0; i < tbody.children.length; i++) {
        var flag = false;
        var row = tbody.children[i];
        
        for (j = 0; j < row.children.length; j++) {
      	  cell = row.children[j];
      	  //cell_selected = getChildByClass(cell, "gridCellSelected");
      	 
      	  for (var k=0; k<cell.classList.length;k++) {
     	  
      		if (cell.classList[k] ==  "gridCellSelected") {
      		  cell_selected = true;
              AINSPECTOR_FB.ainspectorUtil.removeClass(cell, "gridCellSelected");
     		  flag = true;
              break;
           }
      	 }  
      	 if (flag == true) break;
       }
       if (flag == true) break;
     }

     var column = getAncestorByClass(event.target, "gridCell");
     if (!column) {
       if (cell_selected == true) {
    	   column = getChildByClass(event.target, "gridHeaderCell").nextSibling;
           //column = event.target.nextSibling;
     } else {
       column = getChildByClass(event.target, "gridHeaderCell");}
     }
     AINSPECTOR_FB.ainspectorUtil.setClass(column, "gridCellSelected");

      //AINSPECTOR_FB.ainspectorUtil.setClass(row_cell, "gridCellSelected");
      //var row_cells = cell.childNodes;
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
    }

  };
  
  var Preference = {
		  /**
		     * @private
		     */
		    _native : null,

		    /**
		     * Register native preference mechanism.
		     */
		    registerNative: function(o) {
		        this._native = o;
		    },

		    /**
		     * Get Preference with default value.  If the preference does not exist,
		     * return the passed default_value.
		     * @param {String} name name of preference
		     * @return preference value or default value.
		     */
		    getPref: function(name, default_value) {
		        if (this._native) {
		            return this._native.getPref(name, default_value);
		        }
		        return default_value;
		    },

		    /**
		     * Get child preference list in branch.
		     * @param {String} branch_name
		     * @return array of preference values.
		     * @type Array
		     */
		    getPrefList: function(branch_name, default_value) {
		      if (this._native) {
		        return this._native.getPrefList(branch_name, default_value);
		      }
		      return default_value;
		    },

		    /**
		     * Set Preference with passed value.
		     * @param {String} name name of preference
		     * @param {value type} value value to be used to set the preference
		     */
		    setPref: function(name, value) {
		      if (this._native) {
		        this._native.setPref(name, value);
		      }
		    },

		    /**
		     * Delete Preference with passed name.
		     * @param {String} name name of preference to be deleted
		     */
		    deletePref: function(name) {
		        if (this._native) {
		            this._native.deletePref(name);
		        }
		    }
          };
};
});