/*
 * Copyright 2011-2012 OpenAjax Alliance
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


/* ---------------------------------------------------------------- */
/*              ARIA Defintions and Validation Methods              */
/* ---------------------------------------------------------------- */


if (typeof OpenAjax.a11y.aria == "undefined") {
	OpenAjax.a11y.aria = {
			
		/*
		 * array of WAI-ARIA global states and properties
		 * @see http://www.w3.org/TR/wai-aria/#global_states
		 */
		globalProperties : [
            "aria-atomic", 
            "aria-busy", 
            "aria-controls", 
            "aria-describedby",
            "aria-disabled", 
            "aria-dropeffect", 
            "aria-flowto", 
            "aria-grabbed",
            "aria-haspopup", 
            "aria-hidden", 
            "aria-invalid", 
            "aria-label",
            "aria-labelledby", 
            "aria-live", 
            "aria-owns", 
            "aria-relevant"
        ],
	
        /*
         * XSD data types for all WAI-ARIA properties
         * along with valid values when the data type is NMTOKEN
         */
        propertyDataTypes : {
         	"aria-activedescendant" : {
         		type : "idref"
         	},
         	"aria-atomic" : {
         		type : "boolean"
         	},
         	"aria-autocomplete" : {
         		type : "nmtoken",
         		values : ["inline", "list", "both", "none"]
         	},
         	"aria-busy" : {
         		type : "boolean"
         	},
         	"aria-checked" : {
         		type : "nmtoken",
         		values : ["true", "false", "mixed", "undefined"]
         	},
         	"aria-controls" : {
         		type : "idrefs"
         	},
         	"aria-describedby" : {
         		type : "idrefs"
         	},
         	"aria-disabled" : {
         		type : "boolean"
         	},
         	"aria-dropeffect" : {
         		type : "nmtokens",
         		values : ["copy", "move", "link", "execute", "popup", "none"]
         	},
         	"aria-expanded" : {
         		type : "nmtoken",
         		values : ["true", "false", "undefined"]
         	},
         	"aria-flowto" : {
         		type : "idrefs"
         	},
         	"aria-grabbed" : {
         		type : "nmtoken",
         		values : ["true", "false", "undefined"]
         	},
         	"aria-haspopup" : {
         		type : "boolean"
         	},
         	"aria-hidden" : {
         		type : "boolean"
         	},
         	"aria-invalid" : {
         		type : "nmtoken",
         		values : ["true", "false", "spelling", "grammar"]
         	},
         	"aria-label" : {
         		type : "string"
         	},
         	"aria-labelledby" : {
         		type : "idrefs"
         	},
         	"aria-level" : {
         		type : "integer"
         	},
         	"aria-live" : {
         		type : "nmtoken",
         		values : ["off", "polite", "assertive"]
         	},
         	"aria-multiline" : {
         		type : "boolean"
         	},
         	"aria-multiselectable" : {
         		type : "boolean"
         	},
         	"aria-orientation" : {
         		type : "nmtoken",
         		values : ["vertical", "horizontal"]
         	},
         	"aria-owns" : {
         		type : "idrefs"
         	},
         	"aria-posinset" : {
         		type : "integer"
         	},
         	"aria-pressed" : {
         		type : "nmtoken",
         		values : ["true", "false", "mixed", "undefined"]
         	},
         	"aria-readonly" : {
         		type : "boolean"
         	},
         	"aria-relevant" : {
         		type : "nmtokens",
         		values : ["additions", "removals", "text", "all"]
         	},
         	"aria-required" : {
         		type : "boolean"
         	},
         	"aria-selected" : {
         		type : "nmtoken",
         		values : ["true", "false", "undefined"]
         	},
         	"aria-setsize" : {
         		type : "integer"
         	},
         	"aria-sort" : {
         		type : "nmtoken",
         		values : ["ascending", "descending", "other", "none"]
         	},
         	"aria-valuemax" : {
         		type : "decimal"
         	},
         	"aria-valuemin" : {
         		type : "decimal"
         	},
         	"aria-valuenow" : {
         		type : "decimal"
         	},
         	"aria-valuetext" : {
         		type : "string"
         	}
        },
        
        /*
         * list of abstract roles - used to support the WAI-ARIA role taxonomy and 
         * not to be used by content authors
         * @see http://www.w3.org/TR/wai-aria/roles#isAbstract
         */
        abstractRoles : [
            "command", 
            "composite", 
            "input", 
            "landmark", 
            "range",
            "roletype", 
            "section", 
            "sectionhead", 
            "select",
            "structure", 
            "widget", 
            "window"
        ],
                         
          /*
           * design patterns for concrete WAI-ARIA roles
           * legitimate keys for each role include:
           * 
           * - container: appropriate container(s) for that role
           * - props: states and properties that may be associated with this role (in addition to the global states and properties listed above)
           * - reqProps: required states or properties for this role
           * - reqChildren: required children for this role
           * - htmlEquiv: HTML equivalent for this role
           * - roleType: one of widget, landmark, or null 
           */
        designPatterns : {
         		
         	"alert" : {
         		reqName : false,
         		container : null,
         		props : ["aria-expanded"],
         		reqProps : null,
         		reqChildren : null,
         		htmlEquiv : null,
         		nameFromContent: false,
         		nameFromContent: false,
         		roleType : "live"     		
         	},
         	                
         	"alertdialog" : {
         		reqName : true,
         		container : null,
         		props : ["aria-expanded"],
         		reqProps : null,
         		reqChildren : null,
         		htmlEquiv : null,
         		nameFromContent: false,
         		supportOnClick: true,
         		roleType : "widget"
         	},
         	
         	"application" : {
         		reqName : true,
         		container : null,
         		props : ["aria-expanded"],
         		reqProps : null,
         		reqChildren : null,
         		htmlEquiv : null,
         		nameFromContent: false,
         		roleType : "landmark"
         	},
         	
         	"article" : {
         		reqName : false,
         		container : null,
         		props : ["aria-expanded"],
         		reqProps : null,
         		reqChildren : null,
         		htmlEquiv : null,
          		nameFromContent: false,
         		roleType : "section"
        	},
         	
         	"banner" : {
         		reqName : false,
         		container : null,
         		props : ["aria-expanded"],
         		reqProps : null,
         		reqChildren : null,
         		htmlEquiv : null,
         		nameFromContent: false,
         		roleType : "landmark"
         	},
         	
         	"button" : {
         		reqName : true,
         		container : null,
         		props : ["aria-expanded", "aria-pressed"],
         		reqProps : null,
         		reqChildren : null,
         		htmlEquiv : "input[@type='button']",
         		nameFromContent: true,
         		supportOnClick: true,
         		roleType : "widget"
         	},
         	
         	"checkbox" : {
         		reqName : true,
         		container : null,
         		props : null,
         		reqProps : ["aria-checked"],
         		reqChildren : null,
         		htmlEquiv : "input[@type='checkbox']",
         		nameFromContent: true,
         		supportOnClick: true,
         		roleType : "widget"
         	},
         	
             "columnheader" : {
         		reqName : true,
         		container : ["row"],
         		props : ["aria-expanded", "aria-sort", "aria-readonly", "aria-selected", "aria-required"],
         		reqProps : null,
         		reqChildren : null,
         		htmlEquiv : "th",
         		nameFromContent: true,
         		roleType : "section"
         	},
         	
         	"combobox" : {
         		reqName : true,
         		container : null,
         		props : ["aria-autocomplete", "aria-required", "aria-activedescendant"],
         		reqProps : ["aria-expanded"],
         		reqChildren : ["listbox", "textbox"],
         		htmlEquiv : "select",
         		nameFromContent: false,
         		roleType : "widget"
         	},
         	
         	"complementary" : {
         		reqName : false,
         		container : null,
         		props : ["aria-expanded"],
         		reqProps : ["aria-labelledby"],
         		reqChildren : null,
         		htmlEquiv : null,
         		nameFromContent: false,
         		roleType : "landmark"
         	},
         	
         	"contentinfo" : {
         		reqName : false,
         		container : null,
         		props : ["aria-expanded"],
         		reqProps : ["aria-labelledby"],
         		reqChildren : null,
         		htmlEquiv : null,
         		nameFromContent: false,
         		roleType : "landmark"
         	},
         	
         	"definition" : {
         		reqName : false,
         		container : null,
         		props : ["aria-expanded"],
         		reqProps : null,
         		reqChildren : null,
         		htmlEquiv : null,
         		nameFromContent: false,
         		roleType : "section"
         	},
         	
         	"dialog" : {
         		reqName : true,
         		container : null,
         		props : ["aria-expanded"],
         		reqProps : null,
         		reqChildren : null,
         		htmlEquiv : null,
         		nameFromContent: false,
         		roleType : "widget"
         	},
         	
         	"directory" : {
         		reqName : false,
         		container : null,
         		props : ["aria-expanded"],
         		reqProps : null,
         		reqChildren : null,
         		htmlEquiv : null,
         		nameFromContent: true,
         		roleType : "section"
         	},
         	
         	"document" : {
         		reqName : true,
         		container : null,
         		props : ["aria-expanded"],
         		reqProps : null,
         		reqChildren : null,
         		htmlEquiv : null,
          		nameFromContent: false,
         		roleType : "section"
        	},
         	
         	"form" : {
         		reqName : false,
         		container : null,
         		props : ["aria-expanded"],
         		reqProps : null,
         		reqChildren : null,
         		htmlEquiv : "form",
         		nameFromContent: false,
         		roleType : "landmark"
         	},	
         	
         	"grid" : {
         		reqName : true,
         		container : null,
         		props : ["aria-level", "aria-multiselectable", "aria-readonly", "aria-activedescendant", "aria-expanded"],
         		reqProps : null,
         		reqChildren : ["row", "rowgroup"],
         		htmlEquiv : null,
         		nameFromContent: false,
         		roleType : "widget"
         	},
         	
         	"gridcell" : {
         		reqName : true,
         		container : ["row"],
         		props : ["aria-readonly", "aria-selected", "aria-expanded", "aria-required"],
         		reqProps : null,
         		reqChildren : null,
         		htmlEquiv : null,
         		nameFromContent: true,
         		roleType : "widget"         		
         	},
         	
         	"group" : {
         		reqName : false,
         		container : null,
         		props : ["aria-activedescendant", "aria-expanded"],
         		reqProps : null,
         		reqChildren : null,
         		htmlEquiv : "fieldset",
         		nameFromContent: false,
         		roleType : "section"         		
         	},
         	
         	"heading" : {
         		reqName : true,
         		container : null,
         		props : ["aria-level", "aria-expanded"],
         		reqProps : null,
         		reqChildren : null,
         		htmlEquiv : "h1 | h2 | h3 | h4 | h5 |h6",
         		nameFromContent: true,
         		roleType : "section"         		
         	},
         	
         	"img" : {
         		reqName : true,
         		container : null,
         		props : ["aria-expanded"],
         		reqProps : null,
         		reqChildren : null,
         		htmlEquiv : "img",
         		nameFromContent: false,
         		roleType : "section"         		
         	},
         	
         	"link" : {
         		reqName : true,
         		container : null,
         		props : null,
         		reqProps : null,
         		reqChildren : null,
         		htmlEquiv : "a",
         		nameFromContent: true,
         		supportOnClick: true,
         		roleType : "widget"
         	},
         	
         	"list" : {
         		reqName : false,
         		container : null,
         		props : ["aria-expanded"],
         		reqProps : null,
         		reqChildren : ["group", "listitem"],
         		htmlEquiv : "ul | ol",
         		nameFromContent: false,
         		roleType : "section"
         	},
         	
         	"listbox" : {
         		reqName : true,
         		container : null,
         		props : ["aria-expanded", "aria-activedescendant", "aria-multiselectable", "aria-required"],
         		reqProps : null,
         		reqChildren : ["option"],
         		htmlEquiv : "select",
         		nameFromContent: false,
         		supportOnClick: true,
         		roleType : "widget"
         	},
         	
         	"listitem" : {
         		reqName : true,
         		container : ["list"],
         		props : ["aria-expanded", "aria-level", "aria-posinset", "aria-setsize"],
         		reqProps : null,
         		reqChildren : null,
         		nameFromContent: true,
         		htmlEquiv : "section",
         		supportOnClick: true,
         		roleType : "widget"
         	},
         	
         	"log" : {
         		reqName : false,
         		container : null,
         		props : ["aria-expanded"],
         		reqProps : null,
         		reqChildren : null,
         		htmlEquiv : null,
         		nameFromContent: false,
         		roleType : "live"
         	},
         	
         	"main" : {
         		reqName : false,
         		container : null,
         		props : ["aria-expanded"],
         		reqProps : null,
         		reqChildren : null,
         		htmlEquiv : null,
         		nameFromContent: false,
         		roleType : "landmark"
         	},
         	
         	"marquee" : {
         		reqName : true,
         		container : null,
         		props : ["aria-expanded"],
         		reqProps : null,
         		reqChildren : null,
         		htmlEquiv : null,
         		nameFromContent: false,
         		roleType : "section"
         	},
         	
         	"math" : {
         		reqName : false,
         		container : null,
         		props : ["aria-expanded"],
         		reqProps : null,
         		reqChildren : null,
         		htmlEquiv : null,
         		nameFromContent: false,
         		roleType : "widget"
         	},
         	
         	"menu" : {
         		reqName : true,
         		container : null,
         		props : ["aria-expanded", "aria-activedescendant"],
         		reqProps : null,
         		reqChildren : ["menuitem", "menuitemcheckbox", "menuitemradio"],
         		htmlEquiv : null,
         		nameFromContent: false,
         		supportOnClick: true,
         		roleType : "widget"
         	},
         	
         	"menubar" : {
         		reqName : false,
         		container : null,
         		props : ["aria-activedescendant", "aria-expanded"],
         		reqProps : null,
         		reqChildren : null,
         		htmlEquiv : null,
         		nameFromContent: false,
         		supportOnClick: true,
         		roleType : "widget"
         	},
         	
         	"menuitem" : {
         		reqName : true,
         		container : ["menu", "menubar"],
         		props : null,
         		reqProps : null,
         		reqChildren : null,
         		htmlEquiv : null,
         		nameFromContent: true,
         		supportOnClick: true,
         		roleType : "widget"
         	},
         	
         	"menuitemcheckbox" : {
         		reqName : true,
         		container : ["menu", "menubar"],
         		props : null,
         		reqProps : ["aria-checked"],
         		reqChildren : null,
         		htmlEquiv : null,
         		nameFromContent: true,
         		supportOnClick: true,
         		roleType : "widget"
         	},
         	
         	"menuitemradio" : {
         		reqName : true,
         		container : ["menu", "menubar"],
         		props : ["aria-selected", "aria-posinset", "aria-setsize"],
         		reqProps : ["aria-checked"],
         		reqChildren : null,
         		htmlEquiv : null,
         		nameFromContent: true,
         		supportOnClick: true,
         		roleType : "widget"
         	},
         	
         	"navigation" : {
         		reqName : false,
         		container : null,
         		props : ["aria-expanded"],
         		reqProps : ["aria-labelledby"],
         		reqChildren : null,
         		htmlEquiv : null,
         		nameFromContent: false,
         		roleType : "landmark"
         	},
         	
         	"note" : {
         		reqName : false,
         		container : null,
         		props : ["aria-expanded"],
         		reqProps : null,
         		reqChildren : null,
         		htmlEquiv : null,
         		nameFromContent: false,
         		roleType : "section"
         	},
         	
         	"option" : {
         		reqName : true,
         		container : ["listbox"],
         		props : ["aria-expanded", "aria-checked", "aria-selected", "aria-posinset", "aria-setsize"],
         		reqProps : null,
         		reqChildren : null,
         		htmlEquiv : null,
         		nameFromContent: true,
         		supportOnClick: true,
         		roleType : "widget"
         	},
         	
         	"presentation" : {
         		reqName : false,
         		container : null,
         		props : null,
         		reqProps : null,
         		reqChildren : null,
         		htmlEquiv : null,
         		nameFromContent: false,
         		roleType : "section"
         	},
         	
         	"progressbar" : {
         		reqName : true,
         		container : null,
         		props : ["aria-valuetext", "aria-valuenow", "aria-valuemax", "aria-valuemin"],
         		reqProps : null,
         		reqChildren : null,
         		htmlEquiv : null,
         		nameFromContent: false,
         		roleType : "widget",
         		hasRange: true
         	},
         	
         	"radio" : {
         		reqName : true,
         		container : null,
         		props : ["aria-selected", "aria-posinset", "aria-setsize"],
         		reqProps : ["aria-checked"],
         		reqChildren : null,
         		htmlEquiv : "input[@type='radio']",
         		nameFromContent: true,
         		supportOnClick: true,
         		roleType : "widget"
         	},
         	
         	"radiogroup" : {
         		reqName : true,
         		container : null,
         		props : ["aria-activedescendant", "aria-expanded", "aria-required"],
         		reqProps : ["aria-labelledby"],
         		reqChildren : ["radio"],
         		htmlEquiv : null,
         		nameFromContent: false,
         		supportOnClick: true,
         		roleType : "widget"
         	},
         	
         	"region" : {
         		reqName : false,
         		container : null,
         		props : ["aria-expanded"],
         		reqProps : null,
         		reqChildren : null,
         		htmlEquiv : "frame",
         		nameFromContent: false,
         		roleType : "landmark"
         	},
         	
         	"row" : {
         		reqName : false,
         		container : ["grid", "treegrid", "rowgroup"],
         		props : ["aria-level", "aria-selected", "aria-activedescendant", "aria-expanded"],
         		reqProps : null,
         		reqChildren : ["gridcell", "rowheader", "columnheader"],
         		htmlEquiv : null,
         		nameFromContent: true,
         		roleType : "section"
         	},
         	
         	"rowgroup" : {
         		reqName : false,
         		container : ["grid"],
         		props : ["aria-expanded", "aria-activedescendant"],
         		reqProps : null,
         		reqChildren : ["row"],
         		htmlEquiv : null,
         		nameFromContent: true,
         		roleType : "section"
         	},
         	
         	"rowheader" : {
         		reqName : true,
         		container : ["row"],
         		props : ["aria-expanded", "aria-sort", "aria-required", "aria-readonly", "aria-selected"],
         		reqProps : null,
         		reqChildren : null,
         		htmlEquiv : "th",
         		nameFromContent: true,
         		roleType : "section"
         	},
         	
         	"scrollbar" : {
         		reqName : true,
         		container : null,
         		props : ["aria-valuetext"],
         		reqProps : ["aria-controls", "aria-orientation", "aria-valuenow", "aria-valuemax", "aria-valuemin"],
         		reqChildren : null,
         		htmlEquiv : null,
         		nameFromContent: false,
         		roleType : "widget",
         		hasRange: true
         	},
         	
         	"search" : {
         		reqName : false,
         		container : null,
         		props : ["aria-expanded"],
         		reqProps : ["aria-labelledby"],
         		reqChildren : null,
         		htmlEquiv : null,
         		nameFromContent: false,
         		roleType : "landmark"
         	},
         	
         	"separator" : {
         		reqName : false,
         		container : null,
         		props : ["aria-expanded", "aria-orientation"],
         		reqProps : null,
         		reqChildren : null,
         		htmlEquiv : null,
         		nameFromContent: false,
         		roleType : "section"
         	},
         	
         	"slider" : {
         		reqName : true,
         		container : null,
         		props : ["aria-orientation", "aria-valuetext"],
         		reqProps : ["aria-valuemax", "aria-valuenow", "aria-valuemin"],
         		reqChildren : null,
         		htmlEquiv : null,
         		nameFromContent: false,
         		roleType : "widget",
         		hasRange: true
         	},
         	
         	"spinbutton" : {
         		reqName : true,
         		container : null,
         		props : ["aria-required", "aria-valuetext"],
         		reqProps : ["aria-valuemax", "aria-valuenow", "aria-valuemin"],
         		reqChildren : null,
         		htmlEquiv : null,
         		nameFromContent: false,
         		roleType : "widget",
         		hasRange: true
         	},
         	
         	"status" : {
         		reqName : false,
         		container : null,
         		props : ["aria-expanded"],
         		reqProps : null,
         		reqChildren : null,
         		htmlEquiv : null,
         		nameFromContent: false,
         		roleType : "live"
         	},
         	
         	"tab" : {
         		reqName : true, // bug in authoring spec??
         		container : ["tablist"],
         		props : ["aria-selected", "aria-expanded"],
         		reqProps : null,
         		reqChildren : null,
         		htmlEquiv : null,
         		nameFromContent: true,
         		roleType : "widget"
         	},
         	
         	"tablist" : {
         		reqName : false,
         		container : null,
         		props : ["aria-activedescendant", "aria-expanded", "aria-level"],
         		reqProps : null,
         		reqChildren : ["tab"],
         		htmlEquiv : null,
         		nameFromContent: false,
         		roleType : "widget"
         	},
         	
         	"tabpanel" : {
         		reqName : true,
         		container : null,
         		props : ["aria-expanded"],
         		reqProps : null,
         		reqChildren : null,
         		htmlEquiv : null,
         		nameFromContent: false,
         		roleType : "widget"
         	},
         	
         	"textbox" : {
         		reqName : true,
         		container : null,
         		props : ["aria-activedescendant", "aria-autocomplete", "aria-multiline", "aria-readonly", "aria-required"],
         		reqProps : null,
         		reqChildren : null,
         		htmlEquiv : "input[@type='text'] | textarea",
         		nameFromContent: false,
         		roleType : "widget"
         	},
         	
         	"timer" : {
         		reqName : true,
         		container : null,
         		props : ["aria-expanded"],
         		reqProps : null,
         		reqChildren : null,
         		htmlEquiv : null,
         		nameFromContent: false,
         		roleType : "live"
         	},
         	
         	"toolbar" : {
         		reqName : false,
         		container : null,
         		props : ["aria-activedescendant", "aria-expanded"],
         		reqProps : null,
         		reqChildren : null,
         		htmlEquiv : null,
         		nameFromContent: false,
         		supportOnClick: true,
         		roleType : "widget"
         	},
         	
         	"tooltip" : {
         		reqName : true,
         		container : null,
         		props : ["aria-expanded"],
         		reqProps : null,
         		reqChildren : null,
         		htmlEquiv : null,
         		nameFromContent: false,
         		roleType : "widget"
         	},
         	
         	"tree" : {
         		reqName : true,
         		container : null,
         		props : ["aria-multiselectable", "aria-activedescendant", "aria-expanded", "aria-required"],
         		reqProps : null,
         		reqChildren : ["group", "treeitem"],
         		htmlEquiv : null,
         		nameFromContent: false,
         		roleType : "widget"
         	},
         	
         	"treegrid" : {
         		reqName : true,
         		container : null,
         		props : ["aria-activedescendant", "aria-expanded", "aria-level", "aria-multiselectable", "aria-readonly", "aria-required"],
         		reqProps : null,
         		reqChildren : ["row"],
         		htmlEquiv : null,
         		nameFromContent: false,
         		roleType : "section"
         	},
         	
         	"treeitem" : {
         		reqName : true,
         		container : ["group", "tree"],
         		props : ["aria-checked", "aria-selected", "aria-expanded", "aria-level", "aria-posinset", "aria-setsize"],
         		reqProps : null,
         		reqChildren : null,
         		htmlEquiv : null,
         		nameFromContent: true,
         		supportOnClick: true,
         		roleType : "widget"
            }
         	
        }, // end designPatterns
        
        getRoleObject : function(role) {

          var dp = this.designPatterns;

          for (var r in dp) {
          
            if (role == r)  return dp[r];
          
          }

          var ar = this.abstractRoles;
          var ar_len = ar.length;
          
          for (var i = 0; i < ar_len; i++) {
          
            if (role == r[i])  return 'abstract';
          
          }

          return null;
        }
        
    };	    
    
}
