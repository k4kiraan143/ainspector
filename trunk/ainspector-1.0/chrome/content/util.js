    
with (FBL) {
  var classNameReCache={};
  var ainspectorUtil = {
	
	loadCSSToStylePanel : function(document){

	  this.loadCSS("chrome://ainspector/content/css/ainspector-panel.css", document);
      this.loadCSS("chrome://ainspector/content/css/fonts-min.css", document);
      this.loadCSS("chrome://ainspector/content/css/tabview.css", document);
      this.loadCSS("chrome://ainspector/content/css/allyGrade.css", document);
      this.loadCSS("chrome://ainspector/content/css/grid.css", document); 
    },
		  
	/**
     *  Dynamically add a style sheet to the document.
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

    $AI_STR : function(name) {
      return document.getElementById("ainspector_stringbundle").getString(name);
    },

    $AI_STRF : function(name, args) {
      return document.getElementById("ainspector_stringbundle").getFormattedString(name, args);
    },
    
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

    sort: function(table, colIndex, numerical, order)  {
      var thead = table.firstChild;
      var headerRow = thead.firstChild;
      var tbody = table.lastChild;
      
      FBTrace.sysout("thead...", thead);
  	  FBTrace.sysout("headerRow...." ,  headerRow);
  	
      // Remove class from the currently sorted column
      var headerSorted = getChildByClass(headerRow, "gridHeaderSorted");
      removeClass(headerSorted, "gridHeaderSorted");
      
      if (headerSorted) headerSorted.removeAttribute("aria-sort");

      // Mark new column as sorted.
      var header = headerRow.childNodes[colIndex];
      
      FBTrace.sysout("header...", header);
      
      this.setClass(header, "gridHeaderSorted");
      
      // If the column is already using required sort order, bubble out.
      if ((order == "desc" && header.sorted == 1) || (order == "asc" && header.sorted == -1))  return;
      
      if (header) header.setAttribute("aria-sort", header.sorted === -1 ? "descending" : "ascending");
      
      var colID = header.getAttribute("id");
      FBTrace.sysout("colID.."+ colID);
      // Store current state into the preferences.
      var headerID = headerRow.getAttribute("id");
      FBTrace.sysout("headerID.."+ headerID);

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
      FBTrace.sysout("values: ", values);
      FBTrace.sysout("header after this.setClass is called: ", header);
    },
    
    /**
     * 
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
     * 
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
     * 
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
        re = new RegExp('(^|\\s)' + name + '(\\s|$)', "g")
      }
      return node.className.search(re) != -1;
    },
    
    getChildByClass : function(node) {
    	FBTrace.sysout("inside getChildByClass: ", node);
        if (!node)
        {
            FBTrace.sysout("dom.getChildByClass; ERROR, no parent node!");
            return null;
        }

        for (var i = 1; i < arguments.length; ++i)
        {
            var className = arguments[i];
            var child = node.firstChild;
            node = null;
            for (; child; child = child.nextSibling)
            {
                if (this.hasClass(child, className))
                {
                    node = child;
                    break;
                }
            }
        }

        return node;
    },
    
    isGridRow: function(node) {
		return this.hasClass(node, "gridRow");
	},
    
    getAncestorByClass : function(node, className)
    {
        for (var parent = node; parent; parent = parent.parentNode)
        {
            if (this.hasClass(parent, className))
                return parent;
        }

        return null;
    },
    
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
  
  var flatListTemplateUtil = {

    onKeyPressRow: function(event){
	  
	  event.stopPropagation();
	  FBTrace.sysout("in rowpress: ", event);
	  FBTrace.sysout("in rowpress keycode: "+ event.keyCode);

      switch(event.keyCode) {
		  
	    case 38: //up
		  var row = findPrevious(event.target, ainspectorUtil.isGridRow);
		  if (row) row.focus();
		  break;
		case 39: //right
		  var cell = ainspectorUtil.getChildByClass(event.target, "gridCell");
		  if (cell) cell.focus();
		  break;
		case 40: //down
		  var row = findNext(event.target, ainspectorUtil.isGridRow);
		  if (row) row.focus();
		  break;
	  }
    },
    
    onKeyPressHeadingCell: function(event){
	    
	    event.stopPropagation();
		FBTrace.sysout("in headingpress: ", event);
	    switch(event.keyCode) {
		  
	      case 13: //Enter
	        var table = getAncestorByClass(event.target, "ai-table-list-items");
	        var column = getAncestorByClass(event.target, "gridHeaderCell");
	        ainspectorUtil.sortColumn(table, column);
			break;
	      default:
			this.onKeyPressCell(event);
			break;
		}
      
      },
    
    onKeyPressCell: function(event){
  	
  	event.stopPropagation();
		FBTrace.sysout("in cellpress: ", event);
		FBTrace.sysout("keycode: "+ event.keyCode);

  	switch(event.keyCode) {
		  
  	  case 13:
  		  var row = getAncestorByClass(event.target, "gridRow");
  		  FBTrace.sysout("nnnnnnnn", row.repObject);
  		  var imageElement = row.repObject;
  	        var node = imageElement.dom_element.node;
  	        var panel = Firebug.chrome.selectPanel("html");
  	        panel.select(node);
  	        break;
  	  case 38: //up
			var index = ainspectorUtil.findElementIndex(event.target);
			var row = getAncestorByClass(event.target, "gridRow");
			row = row.previousSibling;
			if (row) {
				var  cell = row.childNodes[index];
				if (cell) cell.focus();
			}
			break;
		  
  	  case 37: //left
			var cell = event.target.previousSibling;
			if (cell) cell.focus();
			else {
				var row = getAncestorByClass(event.target, "gridRow");
				row.focus();
			}
			break;
		
  	  case 39: //right
			var cell = event.target.nextSibling;
			if (cell) cell.focus();
			break;
		
  	  case 40: //down
			var index = ainspectorUtil.findElementIndex(event.target);
			var row = getAncestorByClass(event.target, "gridRow");
			FBTrace.sysout("row: ", row);
			row = row.nextSibling;
			if (row) {
				var  cell = row.childNodes[index];
				if (cell) cell.focus();
			}
			break;
		}
    },
    
    doubleClick: function(event){
      FBTrace.sysout("doubleClick..........", event);

	    var imageElement = event.target.repObject;
      var node = imageElement.dom_element.node;
      var panel = Firebug.chrome.selectPanel("html");
      panel.select(node);
    },
    
    /**
     * hightlightCell
     *  
     * @param event
     * @returns
     */
    hightlightCell: function (event) {
	    
      FBTrace.sysout("HIGHLIGHT...", event);
      FBTrace.sysout("Clicks..."+ event.Clicks);
	  var table = getAncestorByClass(event.target, "ai-table-list-items");
      var row =  getAncestorByClass(event.target, "tableRow");
      var i;
      var j;
      var k;
      var cell_selected;
      var child;
      var row;
      FBTrace.sysout("table: ", table);
      var tbody = table.children[1];
      FBTrace.sysout("tbody: ", tbody);

      for (i = 0; i < tbody.children.length; i++) {
        var flag = false;
        var row = tbody.children[i];
        
        for (j = 0; j < row.children.length; j++) {
      	var cell = row.children[j];
      	var cell_selected = getChildByClass(cell, "gridCellSelected");
      	FBTrace.sysout("cell_selected in highlightcell: "+ cell_selected);
      	for (var k=0; k<cell.classList.length;k++) {
         	  if (cell.classList[k] ==  "gridCellSelected") {
                ainspectorUtil.removeClass(cell, "gridCellSelected");
         		  flag = true;
                 break;
           }
      	}  
      	if (flag == true) break;
        }
        if (flag == true) break;
      }

      var column = getAncestorByClass(event.target, "gridCell");
      ainspectorUtil.setClass(column, "gridCellSelected");

      //ainspectorUtil.setClass(row_cell, "gridCellSelected");
      //var row_cells = cell.childNodes;
      //FBTrace.sysout("rowcells.....", row_cells);
   },
     
    onClickHeader : function(event){
  	  
      var table = getAncestorByClass(event.target, "ai-table-list-items");
      var column = getAncestorByClass(event.target, "gridHeaderCell");
      ainspectorUtil.sortColumn(table, column);
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