var AINSPECTOR_FB = AINSPECTOR_FB || {};

with (FBL) {

  panel : null;
  heading_elements: null;
  child_elements: null;
  title_main_elements: null;
  landmark_elements: null;

  AINSPECTOR_FB.headLandmarkView = {  

	/**
	 * @function headingsPanelView
	 * 
	 * @desc
	 * 
	 * @param head_land_toolbar_buttons
	 * @param toolbar
	 * @param panelView
	 * @param cache_object
	 */
	headingsPanelView : function(head_land_toolbar_buttons, toolbar, panelView, cache_object) {

	var head_land_cache = cache_object.dom_cache.headings_landmarks_cache;
	FBTrace.sysout("cache_object: ", cache_object);
	child_elements = head_land_cache.child_cache_elements;
	landmark_elements = head_land_cache.landmark_elements;
	heading_elements = head_land_cache.heading_elements;
	title_main_elements = cache_object.dom_cache.title_main_cache.main_elements;

	AINSPECTOR_FB.headLandmarkView.headingsToolbarPlate.toolbar.replace({head_land_toolbar_buttons : head_land_toolbar_buttons}, toolbar, AINSPECTOR_FB.headLandmarkView.headingsToolbarPlate);
	// toolbar.style.display = "block";

	var element = panelView.document.createElement("div");
	element.style.display = "block";

	panelView.panelNode.id = "ainspector-panel"; 
	panelView.panelNode.appendChild(toolbar);
	panelView.panelNode.appendChild(element);

	panel = panelView;

	panel.table = AINSPECTOR_FB.headLandmarkView.headingsTreeTemplate.tag.append( {object: child_elements}, panel.panelNode, AINSPECTOR_FB.headLandmarkView.headingsTreeTemplate);
	this.select(child_elements[0]);
	Firebug.currentContext.getPanel('Rules').sView(true, child_elements[0]);
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

	panel.selection = object;

	AINSPECTOR_FB.flatListTemplateUtil.highlight(panel.table.children[1].children[0]);

}
};

/**
 * @domplate headingsToolbarPlate
 * 
 * @desc template creates the content for navigation button
 */
AINSPECTOR_FB.headLandmarkView.headingsToolbarPlate = domplate({
	toolbar : DIV( {class : "nav-menu"},
			TAG("$toolbarButtons", {toolbar_buttons : "$head_land_toolbar_buttons"}),
			BUTTON({class: "button", onclick: "$toHTMLPanel"}, "HTML Panel" )

	), 

	toolbarButtons : UL ({class : "yui-nav focusTabList toolbarLinks", role : "tablist", onkeypress : "$AINSPECTOR_FB.toolbarUtil.onToolbarKeyPress", "aria-label" :  "toolbarbutton views"},
			FOR("obj", "$toolbar_buttons",
					LI({id: "$obj.name", class : "$obj|AINSPECTOR_FB.toolbarUtil.getToolbarButtonClass focusTab", onclick: "$onClickToolbarButton", tabindex : "$obj|AINSPECTOR_FB.toolbarUtil.getTabIndex", 
						role : "tab", "aria-selected" : "$obj|AINSPECTOR_FB.toolbarUtil.getSelectedState", onfocus : "$onToolbarFocus"},
						"$obj.name"
					)//end LI
			)//end for

	),

	/**
	 * @function toHTMLPanel
	 * 
	 * @desc redirect to the HTML view of Firebug
	 * 
	 * @param event event triggered on a row/cell
	 */
	toHTMLPanel: function(event) {
	var table = getChildByClass(event.target.offsetParent, "ai-table-list-items");
	var row =  null;
	var tbody = null;
	var child;
	var node = null;

	if (table) {
		row = getChildByClass(event.target.offsetParent, "tableRow");
		tbody = table.children[1];

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

	} else {
		table = getChildByClass(event.target.offsetParent, "domTable");
		//row = getChildByClass(event.target.offsetParent, "treeRow");

		row = table.rows;
		tbody = table.children[0];

		for (var i = 0; i < tbody.children.length; i++) {
			var flag = false;
			var row = tbody.children[i];
			node = row;

			for (var k=0; k<row.classList.length;k++) {

				if (row.classList[k] ==  "gridCellSelected") {
					flag = true;
					break;
				}//end if
			}//end for

			if (flag == true) break;
		}
		node = node.repObject.value.dom_element.node;
	}

	var panel = Firebug.chrome.selectPanel("html");
	panel.select(node);
},


/**
 * @function onClickToolbarButton
 * 
 * @desc 
 * 
 * @param event mouse event
 */
onClickToolbarButton : function(event) {
	var toolbar_button = event.currentTarget.id;
	this.showOnSelectButton(toolbar_button);
},

/**
 * @function showOnSelectButton
 * 
 * @desc show the selected toolbar button with a focus on it
 * 
 * @param toolbar_button_id
 */
showOnSelectButton : function(toolbar_button_id) {

	clearNode(panel.table);  // clear the content of the panel 
	clearNode(Firebug.currentContext.getPanel('Rules').panelNode);

	if (toolbar_button_id == "Tree View") {
		FBTrace.sysout("child_elements.....................................: ", child_elements);
		panel.table = AINSPECTOR_FB.headLandmarkView.headingsTreeTemplate.tag.append( {object: child_elements}, panel.panelNode, AINSPECTOR_FB.headLandmarkView.headingsTreeTemplate);
		AINSPECTOR_FB.headLandmarkView.select(child_elements[0]);

		Firebug.currentContext.getPanel('Rules').sView(true, child_elements[0]);

	} else if (toolbar_button_id == "Title/Main/H1"){
		panel.table = AINSPECTOR_FB.headLandmarkView.headingsTreeTemplate.tag.append( {object: title_main_elements}, panel.panelNode, AINSPECTOR_FB.headLandmarkView.headingsTreeTemplate);
		AINSPECTOR_FB.headLandmarkView.select(title_main_elements[0]);
		Firebug.currentContext.getPanel('Rules').sView(true, title_main_elements[0]);
	} else if (toolbar_button_id == "Headings") {
		var properties = ["Order", "Level", "Name"];


		panel.table = AINSPECTOR_FB.headLandmarkView.headingsTemplate.tableTag.append({heading_elements: heading_elements, header_properties: properties}, panel.panelNode, AINSPECTOR_FB.headLandmarkView.headingsTemplate);
		AINSPECTOR_FB.headLandmarkView.select(heading_elements[0]);

		Firebug.currentContext.getPanel('Rules').sView(true, heading_elements[0]);
	} else {
		FBTrace.sysout("landmark_elements : ", landmark_elements);  
		panel.table = AINSPECTOR_FB.headLandmarkView.landmarksTemplate.tableTag.append( {landmark_elements: landmark_elements}, panel.panelNode, AINSPECTOR_FB.headLandmarkView.landmarksTemplate);
		FBTrace.sysout("panel.table: ", panel.table);
		AINSPECTOR_FB.headLandmarkView.select(landmark_elements[0]);

		Firebug.currentContext.getPanel('Rules').sView(true, landmark_elements[0]);
	}

},

/**
 * @function selectTab
 * 
 * @desc set the aria attributes/properties and css properties for a particular tab to be selected 
 * 
 * @param elem event target 
 */
selectTab : function(elem) {

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
		// this.showOnSelectButton(category);
	}
},

/**
 * @function onToolbarFocus
 * 
 * @desc
 * 
 * @param event
 */
onToolbarFocus : function(event) {
	this.selectTab(event.target);
},

viewContainer : DIV({style : "display:none"})

});

/**
 * @domplate headingsTreeTemplate
 * 
 * @desc template object, create HTML mark up showed upon clicking the headings toolbar button
 */
AINSPECTOR_FB.headLandmarkView.headingsTreeTemplate = domplate({
	
  tag:
	TABLE({class: "domTable", cellpadding: 0, cellspacing: 0, onclick: "$onClick", tabindex: 0, onkeypress: "$onKeyPressedTable"},
	  THEAD(
		TR({"class": "gridHeaderRow a11yFocus", id: "tableTableHeader", "role": "row", tabindex: "0", onclick: "$AINSPECTOR_FB.flatListTemplateUtil.onClickHeader", onkeypress: "$AINSPECTOR_FB.flatListTemplateUtil.onKeyPressRow"},
		  TH({"class": "gridHeaderCell gridCell", id: "headEleCol", onkeypress: "$AINSPECTOR_FB.flatListTemplateUtil.onKeyPressHeadingCell"}, DIV({"class": "gridHeaderCellBox"}, "Element")),
		  TH({"class": "gridHeaderCell gridCell", id: "headRoleCol", onkeypress: "$AINSPECTOR_FB.flatListTemplateUtil.onKeyPressHeadingCell"}, DIV({"class": "gridHeaderCellBox"}, "Role/Level")),
		  TH({"class": "gridHeaderCell gridCell", id: "headNameCol", onkeypress: "$AINSPECTOR_FB.flatListTemplateUtil.onKeyPressHeadingCell"}, DIV({"class": "gridHeaderCellBox"}, "Name"))
		) //end TR
	  ), //end THEAD
	  TBODY(
	  	FOR("member", "$object|memberIterator", TAG("$row", {member: "$member"}))
	  )
	),

	row:
	  TR({class: "treeRow", $hasChildren: "$member.hasChildren", _repObject: "$member", 
	    level: "$member.level", tabindex: "-1", onkeypress: "$onKeyPressedRow", onclick: "$onClickTreeRow"},
		TD({class: "memberLabelCell", style: "padding-left: $member.indent\\px", _repObject: "$member"},
		  TAG("$member.tag", {'member' :"$member", 'object': "$member.value"})
		),
		TD({class: "memberLabelCell", style: "padding-left: $member.indent\\px", _repObject: "$member"},
		 "$member.role_level"),
		TD({class: "memberLabelCell", _repObject: "$member"}, "$member.text")
	),

	strTag : DIV({class: "treeLabel"},"$member.name"),

	loop:
	  FOR("member", "$members", TAG("$row", {member: "$member"})),
		
	/**
     * @function onClickTreeRow
     * 
     * @desc helper function to call highlight
     * 
     * @param {Event} event - even triggered when a row is selected in a panel
     * @property {Object} selection - present selected row info to be passed to the side panel 
     */
    onClickTreeRow : function(event){
		    	  
	  panel.selection = Firebug.getRepObject(event.target);
	  FBTrace.sysout("panel: zupzupzupz", panel);
	  AINSPECTOR_FB.flatListTemplateUtil.highlightTreeRow(event);
	  
	  
	},

    /**
	 * @function memberIterator
	 * 
	 * @desc
	 * 
	 * @param object to iterate through
	 */
	memberIterator: function(object) {
	  return this.getMembers(object);
    },

    /**
	 * @function onClick
	 * 
	 * @desc
	 * 
	 * @param event
	 */
	onClick: function(event) {

	  if (!isLeftClick(event)) return;

   	  var row = getAncestorByClass(event.target, "treeRow");
	  var label = getAncestorByClass(event.target, "treeLabel");

	  if (label && hasClass(row, "hasChildren")) this.toggleRow(row);
	},
	
	/**
	 * @function onKeyPressedTable
	 * 
	 * @desc
	 * 
	 * @param event
	 */
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

    /**
     * @function isTreeRow
     * 
     * @param {Object} node
     */
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
		break;
	}
  },

	/**
	 * @function closeRow
	 * 
	 * @desc close a row when clicked on a twisty open image on the panel
	 * 
	 * @param row table row
	 */
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

	/**
	 * @function openRow
	 * 
	 * @desc open a row when clicked on a twisty close image on the panel
	 * 
	 * @param row table row
	 */
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

/**
 * @function highlightRow
 * 
 * @desc
 * 
 * @param event
 */
highlightRow: function (event) {

	var table = getAncestorByClass(event.target, "domTable");
	row = table.rows;
	tbody = table.children[0];
	var i;
	var j;
	var k;
	var cell_selected;
	var child;
	var row;

	for (i = 0; i < tbody.children.length; i++) {
		var flag = false;
		var row = tbody.children[i];

		for (var k=0; k<row.classList.length;k++) {

			if (row.classList[k] ==  "gridCellSelected") {
				AINSPECTOR_FB.ainspectorUtil.removeClass(row, "gridCellSelected");
				flag = true;
				break;
			}
		}  
		if (flag == true) break;
	}
	var row_selected = getAncestorByClass(event.target, "treeRow");
	AINSPECTOR_FB.ainspectorUtil.setClass(row_selected, "gridCellSelected");
},

/**
 * @function toggleRow
 * 
 * @desc
 * 
 * @param row
 */
toggleRow: function(row) {
	FBTrace.sysout("toggleRow: ", row);

	if (hasClass(row, "opened")) {
		this.closeRow(row);
	} else {
		this.openRow(row);
	}
},

/**
 * @function getMembers
 * 
 * @desc
 * 
 * @param object
 * @param level
 * 
 * @return
 */
getMembers: function(object, level) {

	if (!level) level = 0;

	var members = [];

	for (var p in object) members.push(this.createMember(p, object[p], level));
	FBTrace.sysout("member: ", members);
	return members;
},

/**
 * @function createMember
 * 
 * @desc create an object of display properties to loop through the row and childrow constructors
 * 
 *  @param name
 *  @param value
 *  @param level
 */
createMember: function(name, value, level)  {
	//  FBTrace.sysout(' createMember : ', value);
	return {
	  name: value.dom_element.tag_name, //name,
	  role_level: (value.dom_element.role) ? value.dom_element.role : value.level,
	  text: (value.dom_element.role) ? (value.label) : value.name,
	  hasChildren: this.hasChildElements(value), 
	  children: this.getChildrenEle(value),
	  value: (value != null) ? value : "",
	  label: (value.dom_element.children != null) ? "" : value,
	  level: level,
	  indent: level * 16,
	  tag: this.strTag
	};
},

/**
 * @function getChildrenEle
 * 
 * @desc
 * 
 * @param element
 * 
 * @return child_cache_elements|null
 */
getChildrenEle: function(element){
	var tag_name = element.dom_element; 
	if (tag_name == 'h1' || tag_name == 'h2' || tag_name == 'h3' ||
			tag_name == 'h4' || tag_name == 'h5' || tag_name == 'h6') {
		return [];	
	} else {
		return element.child_cache_elements; 
	}
},

/**
 * @function hasChildElements
 * 
 * @desc
 * 
 * @param element
 */
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

/**
 * @function onClick_htmlView
 * 
 * @desc
 * 
 * @param event
 */
onClick_htmlView: function(event) {

	var head_landmark = event.target.headLandElement.value;
	var node = head_landmark.dom_element.node;
	var panel = Firebug.chrome.selectPanel("html");

	panel.select(node);  
}

});


/**
 * @Domplate landmarksTemplate
 * 
 * @Desc template object, create HTML mark up showed upon clicking the images toolbar button
 * 
 * @return flat list of images to be displayed on the panel
 */
AINSPECTOR_FB.headLandmarkView.landmarksTemplate = domplate({
  
	  tableTag:
    
	  TABLE({class: "ai-table-list-items", cellpadding: 0, cellspacing: 0, hiddenCols: "", role: "treegrid", onkeypress: "$AINSPECTOR_FB.flatListTemplateUtil.onKeyPressTable"},
      THEAD(
        TR({class: "gridHeaderRow gridRow", id: "imgTableHeader", role: "row", tabindex: "0", onclick: "$AINSPECTOR_FB.flatListTemplateUtil.onClickHeader"},
            TH({class: "gridHeaderCell gridCell", id: "lmOrderHeaderCol", role: "columnheader", onkeypress: "$AINSPECTOR_FB.flatListTemplateUtil.onKeyPressHeadingCell"}, DIV({class: "gridHeaderCellBox"}, "Order")),
            TH({class: "gridHeaderCell gridCell", id: "lmElementHeaderCol", role: "columnheader", onkeypress: "$AINSPECTOR_FB.flatListTemplateUtil.onKeyPressHeadingCell"}, DIV({class: "gridHeaderCellBox"}, "Element")),
            TH({class: "gridHeaderCell gridCell", id: "lmRoleHeaderCol", role: "columnheader", onkeypress: "$AINSPECTOR_FB.flatListTemplateUtil.onKeyPressHeadingCell"}, DIV({class: "gridHeaderCellBox"}, "Role")),
            TH({class: "gridHeaderCell gridCell", id: "lmNameHeaderCol", role: "columnheader", onkeypress: "$AINSPECTOR_FB.flatListTemplateUtil.onKeyPressHeadingCell"}, DIV({class: "gridHeaderCellBox"}, "Name"))
        ) //end TR
      ), //end THEAD
      TBODY(
        FOR("object", "$landmark_elements",
          TR({class: "tableRow  gridRow", role: "row", id: "$object.cache_id", _repObject:"$object", onclick: "$onClickRow", ondblclick: "$AINSPECTOR_FB.flatListTemplateUtil.doubleClick"},//gridRow              
            TD({class: "imgOrderCol gridCell gridCol", id:"imgOrderCol" , role: "gridcell", tabindex: "-1", onkeypress: "$AINSPECTOR_FB.flatListTemplateUtil.onKeyPressCell", ondblclick: "$AINSPECTOR_FB.flatListTemplateUtil.doubleClick"},
              DIV({class: "gridContent", _repObject:"$object"}, "$object.document_order")
            ),
            TD({class: "imgEleCol gridCell gridCol ",  id:"imgSrcCol", role: "gridcell", tabindex: "-1", onkeypress: "$AINSPECTOR_FB.flatListTemplateUtil.onKeyPressCell", ondblclick: "$AINSPECTOR_FB.flatListTemplateUtil.doubleClick"},
              DIV({class: "gridContent", _repObject:"$object"}, "$object.dom_element.tag_name")
            ),
            TD({class: "imgTextCol gridCell gridCol ",  id:"imgSrcCol", role: "gridcell", tabindex: "-1", onkeypress: "$AINSPECTOR_FB.flatListTemplateUtil.onKeyPressCell", ondblclick: "$AINSPECTOR_FB.flatListTemplateUtil.doubleClick"},
              DIV({class: "gridContent", _repObject:"$object"}, "$object.dom_element.role")
            ),
            TD({class: "imgSourceCol gridCell gridCol ", id: "imgTextCol", role: "gridcell", tabindex: "-1", onkeypress: "$AINSPECTOR_FB.flatListTemplateUtil.onKeyPressCell", ondblclick: "$AINSPECTOR_FB.flatListTemplateUtil.doubleClick"},
              DIV({class: "gridContent", _repObject:"$object", title: "$object.source"}, "$object.name")
            )
          )//end TR   
        ) //end FOR
      )// end TBODY
    ), // end inner TABLE
    
    /**
     * @function onClick
     * 
     * @desc helper function to call highlight
     * 
     * @param {Event} event - even triggered when a row is selected in a panel
     * @property {Object} selection - present selected row info to be passed to the side panel 
     */
    onClickRow : function(event){
  	  
	    panel.selection = Firebug.getRepObject(event.target);
	    FBTrace.sysout("panel: zupzupzupz", panel);
	    AINSPECTOR_FB.flatListTemplateUtil.highlightRow(event);
    }
  });





/**
 * @Domplate imagesTemplate
 * 
 * @Desc template object, create HTML mark up showed upon clicking the images toolbar button
 * 
 * @return flat list of images to be displayed on the panel
 */
AINSPECTOR_FB.headLandmarkView.headingsTemplate = domplate({
  
	  tableTag:
    
	  TABLE({class: "ai-table-list-items", cellpadding: 0, cellspacing: 0, hiddenCols: "", role: "treegrid", onkeypress: "$AINSPECTOR_FB.flatListTemplateUtil.onKeyPressTable"},
      THEAD(
        TR({class: "gridHeaderRow gridRow", id: "imgTableHeader", role: "row", tabindex: "0", onclick: "$AINSPECTOR_FB.flatListTemplateUtil.onClickHeader"},
            TH({class: "gridHeaderCell gridCell", id: "headOrderHeaderCol", role: "columnheader", onkeypress: "$AINSPECTOR_FB.flatListTemplateUtil.onKeyPressHeadingCell"}, DIV({class: "gridHeaderCellBox"}, "Order")),
            TH({class: "gridHeaderCell gridCell", id: "headLevelHeaderCol", role: "columnheader", onkeypress: "$AINSPECTOR_FB.flatListTemplateUtil.onKeyPressHeadingCell"}, DIV({class: "gridHeaderCellBox"}, "Level")),
            TH({class: "gridHeaderCell gridCell", id: "headNameHeaderCol", role: "columnheader", onkeypress: "$AINSPECTOR_FB.flatListTemplateUtil.onKeyPressHeadingCell"}, DIV({class: "gridHeaderCellBox"}, "Name"))
        ) //end TR
      ), //end THEAD
      TBODY(
        FOR("object", "$heading_elements",
          TR({class: "tableRow  gridRow", role: "row", id: "$object.cache_id", _repObject:"$object", onclick: "$AINSPECTOR_FB.headLandmarkView.landmarksTemplate.onClickRow", ondblclick: "$AINSPECTOR_FB.flatListTemplateUtil.doubleClick"},//gridRow              
            TD({class: "imgOrderCol gridCell gridCol", id:"imgOrderCol" , role: "gridcell", tabindex: "-1", onkeypress: "$AINSPECTOR_FB.flatListTemplateUtil.onKeyPressCell", ondblclick: "$AINSPECTOR_FB.flatListTemplateUtil.doubleClick"},
              DIV({class: "gridContent", _repObject:"$object"}, "$object.document_order")
            ),
            TD({class: "imgEleCol gridCell gridCol ",  id:"imgSrcCol", role: "gridcell", tabindex: "-1", onkeypress: "$AINSPECTOR_FB.flatListTemplateUtil.onKeyPressCell", ondblclick: "$AINSPECTOR_FB.flatListTemplateUtil.doubleClick"},
              DIV({class: "gridContent", _repObject:"$object"}, "$object.level")
            ),
            TD({class: "imgSourceCol gridCell gridCol ", id: "imgTextCol", role: "gridcell", tabindex: "-1", onkeypress: "$AINSPECTOR_FB.flatListTemplateUtil.onKeyPressCell", ondblclick: "$AINSPECTOR_FB.flatListTemplateUtil.doubleClick"},
              DIV({class: "gridContent", _repObject:"$object", title: "$object.source"}, "$object.name")
            )
          )//end TR   
        ) //end FOR
      )// end TBODY
    ) // end inner TABLE
  });
}

