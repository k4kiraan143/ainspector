var AINSPECTOR_FB = AINSPECTOR_FB || {};

AINSPECTOR_FB.tables = {  
	      
    /**
	 * panelsView
	 * 
	 * @desc
	 * 
	 * @param head_land_toolbar_buttons
	 * @param toolbar
	 * @param panelView
	 * @param cache_object
	 * @returns
	 */
	 tablesPanelView : function(toolbar_buttons, toolbar, panelView, cache_object) {
	        
      var tables_cache = cache_object.dom_cache.tables_cache; 
      
      table_elements = tables_cache.table_elements;
      child_elements = tables_cache.child_cache_elements;

      tablesToolbarPlate.toolbar.replace({toolbar_buttons : toolbar_buttons}, toolbar, tablesToolbarPlate);
	  //toolbar.style.display = "block";
       var element = panelView.document.createElement("div");
	  element.style.display = "block";
	  panelView.panelNode.id = "ainspector-panel"; 
	  panelView.panelNode.appendChild(toolbar);
          panelView.panelNode.appendChild(element);
	        
	  panel = panelView;
	  tables_tree_view = panelView;
	  tables_list_view = panelView;

	  panel.table = tablesTreeTemplate.tag.append( {object: child_elements}, panel.panelNode, tablesTreeTemplate);
	  Firebug.currentContext.getPanel('Rules').sView(true, child_elements[0]);
    }
 };

with (FBL) {
  
  panel : null;
  tables_tree_view : null;
  tables_list_view: null;
  child_elements: null;
  table_elements: null;
  
  /**
   * imageToolbarPlate
   * 
   * @Domplate
   * 
   * @desc template creates the content for navigation button
   */
  this.tablesToolbarPlate = domplate({
    toolbar : DIV( {class : "nav-menu"},
                TAG("$toolbarButtons", {toolbar_buttons : "$toolbar_buttons"}),
                BUTTON({class: "button", onclick: "$toolbarUtil.toHTMLPanel"}, "HTML Panel" )
                
              ), 
  
    toolbarButtons : UL ({class : "yui-nav focusTabList toolbarLinks", role : "tablist", onkeypress : "$toolbarUtil.onToolbarKeyPress", "aria-label" :  "element views"},
                       FOR("obj", "$toolbar_buttons",
                         LI({id: "$obj.name", class : "$obj|toolbarUtil.getToolbarButtonClass focusTab", onclick: "$onClick", tabindex : "$obj|toolbarUtil.getTabIndex", role : "tab", "aria-selected" : "$obj|toolbarUtil.getSelectedState", onfocus : "$onToolbarFocus"},
                             "$obj.name"
                         )//end LI
                       )//end for
                
    ),
    
    /**
     * toHtmlView
     * 
     * @desc redirect to the HTML view of Firebug
     * 
     * @param event event triggered on a row in the Links Table
     */
    toHtmlPanel: function(event) {

      var table = getChildByClass(event.target.offsetParent, "ai-table-list-items");
      FBTrace.sysout("inside pane-images table", table);

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
              if (cell.classList[k] ==  "gridCellSelected") {
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

    
    /**
     * onClick
     * 
     * @desc
     * 
     * @param event
     */
    onClick : function(event) {
      var toolbar_button = event.currentTarget.id;
      this.showOnSelectButton(toolbar_button);
    },
    showOnSelectButton : function(toolbar_button_id) {

    	clearNode(panel.table);
        clearNode(Firebug.currentContext.getPanel('Rules').panelNode);
        FBTrace.sysout("toolbar_button_id: " + toolbar_button_id);
        if (toolbar_button_id == "Tree View") {
    		  panel.table = tablesTreeTemplate.tag.append( {object: child_elements}, tables_tree_view.panelNode, tablesTreeTemplate);
    		  Firebug.currentContext.getPanel('Rules').sView(true, child_elements[0]);
        
        } else {
          FBTrace.sysout("table_elements: ", table_elements);	
      	  panel.table = tablesFlatListTemplate.tableTag.append( {table_elements: table_elements}, tables_list_view.panelNode, null);
      	  FBTrace.sysout("panel.table: ", panel.table);
      	  Firebug.currentContext.getPanel('Rules').sView(true, table_elements[0]);
        }
     },
    /**
     * selectTab
     * 
     * @param elem
     * @returns
     */
    selectTab : function(elem) {
    
      if (!elem) return;
      
      var category = getClassValue(elem, "ruleCategory");
      FBTrace.sysout("catewgory: "+ category);
      FBTrace.sysout("elem: ", elem);

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
        FBTrace.sysout("panel in selectTab: ", panel);
        this.showOnSelectButton(category);
      }
    },
  
    /**
     * onToolbarFocus
     * 
     * @desc
     * 
     * @param event
     * @returns
     */
    onToolbarFocus : function(event) {
      this.selectTab(event.target);
    },
    
    viewContainer : DIV({style : "display:none"})
});

/**
   * tablesFlatListTemplate
   * 
   * @Domplate
   * 
   * @desc template to create a table for Links tab and pop up the values in it
   */
  this.tablesFlatListTemplate = domplate({
    
	  tableTag:
      TABLE({"class": "ai-table-list-items", cellpadding: 0, cellspacing: 0, hiddenCols: "", "role": "treegrid"},
        THEAD(
          TR({"class": "gridHeaderRow a11yFocus", id: "tableTableHeader", "role": "row", tabindex: "0", onclick: "$flatListTemplateUtil.onClickHeader", onkeypress: "$flatListTemplateUtil.onKeyPressRow"},
            TH({"class": "gridHeaderCell gridCell", id: "tableTagCol", onkeypress: "$flatListTemplateUtil.onKeyPressHeadingCell"}, DIV({"class": "gridHeaderCellBox"}, "Tag")),
            TH({"class": "gridHeaderCell gridCell", id: "tableInfoCol", onkeypress: "$flatListTemplateUtil.onKeyPressHeadingCell"}, DIV({"class": "gridHeaderCellBox"}, "Information"))
          ) //end TR
        ), //end THEAD
        TBODY(
          FOR("object", "$table_elements",
            TR({"class": "tableRow a11yFocus gridRow", "role": "row", id: "$object.cache_id", _repObject:"$object", onkeypress: "$flatListTemplateUtil.onKeyPressRow", onclick: "$flatListTemplateUtil.hightlightCell", ondblclick: "$flatListTemplateUtil.doubleClick"}, //gridRow              
            	TD({"class": "tableTagCol gridCell gridCol a11yFocus", "role": "gridcell", "tabindex": "-1", onclick: "$hightlightCell"},
                  DIV({"class": "gridContent gridOrderCol", _repObject:"$object"}, "$object.dom_element.tag_name")
                ),
                
                TD({"class": "tableInfoCol gridCell gridCol a11yFocus", "role": "gridcell", "tabindex": "-1", onkeypress: "$flatListTemplateUtil.onKeyPressCell", onclick: "$hightlightCell"},
                  DIV({"class": "gridContent gridOrderCol", _repObject:"$object"}, "$object|getString")
                )
              )//end TR
            
          ) //end FOR
        )// end TBODY
      ),// end inner TABLE
      
      getString : function (object){
	    return object.toString();
      }
      
      
   });
  
  var tablesTreeTemplate = domplate({
    tag:
	  TABLE({class: "domTable", cellpadding: 0, cellspacing: 0, onclick: "$onClick", tabindex: 0, onkeypress: "$onKeyPressedTable"},
	    THEAD(
	      TR({"class": "gridHeaderRow a11yFocus", id: "tableTableHeader", "role": "row", tabindex: "0", onclick: "$flatListTemplateUtil.onClickHeader", onkeypress: "$flatListTemplateUtil.onKeyPressRow"},
	        TH({"class": "gridHeaderCell gridCell", id: "tableTagCol", onkeypress: "$flatListTemplateUtil.onKeyPressHeadingCell"}, DIV({"class": "gridHeaderCellBox"}, "Tag")),
	        TH({"class": "gridHeaderCell gridCell", id: "tableInfoCol", onkeypress: "$flatListTemplateUtil.onKeyPressHeadingCell"}, DIV({"class": "gridHeaderCellBox"}, "Information"))
	      ) //end TR
	    ), //end THEAD
	    TBODY(
		  FOR("member", "$object|memberIterator", TAG("$row", {member: "$member"}))
		)
	  ),
    
	  row:
	    TR({class: "treeRow", $hasChildren: "$member.hasChildren", _repObject: "$member", 
	    	level: "$member.level", tabindex: "-1", onkeypress: "$onKeyPressedRow", onfocus: "$onFocus", onclick: "$highlightRow"},
		  TD({class: "memberLabelCell", style: "padding-left: $member.indent\\px", _repObject: "$member"},
		    TAG("$member.tag", {'member' :"$member", 'object': "$member.value"})
		  ),
		  TD({class: "memberLabelCell", _repObject: "$member"}, "$member.information")
	    ),

      strTag : DIV({class: "treeLabel"},"$member.name"),

	  loop:
	    FOR("member", "$members", TAG("$row", {member: "$member"})),

	  memberIterator: function(object) {
	    return this.getMembers(object);
	  },

	  onClick: function(event) {
			    
		if (!isLeftClick(event)) return;

	    var row = getAncestorByClass(event.target, "treeRow");
		var label = getAncestorByClass(event.target, "treeLabel");
		
		if (label && hasClass(row, "hasChildren")) this.toggleRow(row);
	  },

	  onKeyPressedTable: function(event) {
		
		switch(event.keyCode) {
        
		  case 39: //right
            event.stopPropagation();
            event.preventDefault();
            var label = findNextDown(event.target, this.isTreeRow);
            label.focus();
            break;
	    }
	  },

	  isTreeRow: function(node) {
		return hasClass(node, "treeRow");
	  },

	  onKeyPressedRow: function(event) {
		event.stopPropagation();
		
		switch(event.keyCode) {
          case 37: //left
            event.preventDefault();
            var row = getAncestorByClass(event.target, "treeRow");
            
            if (hasClass(row, "opened")) { // if open
              this.closeRow(row); // close
            } else {
              var table = getAncestorByClass(event.target, "domTable");
              table.focus(); // focus parent;
            }
            break;
          
          case 38: //up
            event.preventDefault();
            var row = findPrevious(event.target, this.isTreeRow, false);
            row.focus();
            break;
            
          case 39: //right
            event.preventDefault();
            var row = getAncestorByClass(event.target, "treeRow");

            if (hasClass(row, "hasChildren")) this.openRow(row);
            break;
            
          case 40: //down
            event.preventDefault();
            var row = findNext(event.target, this.isTreeRow, false);
            row.focus();
            break;
            
          case 13: //Enter
            event.preventDefault();
            var links = event.target.getElementsByClassName('objectLink');
          
            if (links[0]) AINSPECTOR.util.event.dispatchMouseEvent(links[0], 'click');
      		break;
		}
	  },

      onFocus: function(event) {
		 FBTrace.sysout("inside onfocus"); 
        var links = event.target.getElementsByClassName('objectLink');
        
        if (links[0]) AINSPECTOR.util.event.dispatchMouseEvent(links[0], 'mouseover');
      },

	  closeRow: function(row) {
		
    	if (hasClass(row, "opened")) {
		  var level = parseInt(row.getAttribute("level"));
		  removeClass(row, "opened");
		  var tbody = row.parentNode;
		
		  for (var firstRow = row.nextSibling; firstRow; firstRow = row.nextSibling) {
			
			if (parseInt(firstRow.getAttribute("level")) <= level) break;
			tbody.removeChild(firstRow);
		  }
	    }
      },

      openRow: function(row) {
		
    	if (!hasClass(row, "opened")) {
		  var level = parseInt(row.getAttribute("level"));
		  setClass(row, "opened");
		  var repObject = row.repObject;
			
		  if (repObject) {
            var members = this.getMembers(repObject.children, level+1);
			
            if (members) this.loop.insertRows({members: members}, row);
		  }
		}
	  },
	  
	  highlightRow: function (event) {
		    
	      FBTrace.sysout("HIGHLIGHT...", event);
		 // var table = getAncestorByClass(event.target, "domTable");
	      //var row =  getAncestorByClass(event.target, "treeRow");
	      
	      var table = getAncestorByClass(event.target, "domTable");
	    	 // table = getAncestorByClass(event.target.offsetParent, "domTable");
	      row = table.rows;
	      tbody = table.children[0];
	      FBTrace.sysout("inside pane-headings table", table);
	      FBTrace.sysout("inside pane-headings row", row);
	      var i;
	      var j;
	      var k;
	      var cell_selected;
	      var child;
	      var row;
	      FBTrace.sysout("table: ", table);
	      FBTrace.sysout("tbody: ", tbody);

	      for (i = 0; i < tbody.children.length; i++) {
	        var flag = false;
	        var row = tbody.children[i];
	      	for (var k=0; k<row.classList.length;k++) {
	          if (row.classList[k] ==  "gridCellSelected") {
	            ainspectorUtil.removeClass(row, "gridCellSelected");
	         	flag = true;
	            break;
	           }
	      	}  
	      	if (flag == true) break;
	      }

	      var row_selected = getAncestorByClass(event.target, "treeRow");
	      ainspectorUtil.setClass(row_selected, "gridCellSelected");

	      //ainspectorUtil.setClass(row, "selected");
	      //var row_cells = cell.childNodes;
	      FBTrace.sysout("rowcells.....", row_cells);
	   },


      toggleRow: function(row) {

		if (hasClass(row, "opened")) {
		  this.closeRow(row);
		} else {
		  this.openRow(row);
		}
	  },

	  getMembers: function(object, level) {
			    
		if (!level) level = 0;

	    var members = [];
		
	    for (var p in object) members.push(this.createMember(p, object[p], level));

		return members;
	  },

	  createMember: function(name, value, level)  {
	  //  FBTrace.sysout(' createMember : ', value);
		return {
		  name: value.dom_element.tag_name, //name,
		  role_level: (value.dom_element.role) ? value.dom_element.role : value.level,
		  text: (value.dom_element.role) ? (value.label) : value.name,
		  information: value.toString(),
	      hasChildren: this.hasChildElements(value), 
	      children: this.getChildrenEle(value),
	      value: (value != null) ? value : "",
	      label: (value.dom_element.children != null) ? "" : value,
	      level: level,
	      indent: level * 16,
	      tag: this.strTag
	    };
	  },
	  
	  getChildrenEle: function(element){
		var tag_name = element.dom_element; 
	    if (tag_name == 'h1' || tag_name == 'h2' || tag_name == 'h3' ||
	     tag_name == 'h4' || tag_name == 'h5' || tag_name == 'h6') {
	      return [];	
	    } else {
		 return element.child_cache_elements; 
	    }
	  },
	  
	  hasChildElements: function(element){
		if (typeof element.has_element_children === 'undefined') { 
		  
		  /* check if the child elements are the only text. If so set hasChildren to false. */
		  if (element.child_cache_elements && element.child_cache_elements.length > 0)
		  return element.dom_element.has_element_children;
		  else return false;
	    } else {
		  return element.has_element_children;
		}
	  },
	  
	  onClick_htmlView: function(event) {
		FBTrace.sysout("event::::: ", event.target);
		var head_landmark = event.target.headLandElement.value;
	    var node = head_landmark.dom_element.node;
	    var panel = Firebug.chrome.selectPanel("html");
	    panel.select(node);  
	  }
	  
	});
   
  }

