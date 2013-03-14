/**
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

/* --------------------------------------------------------------------------- */
/* OpenAjax Alliance (OAA) Ruleset for WCAG 2.0 (Beta)           */
/* --------------------------------------------------------------------------- */
   

OpenAjax.a11y.all_rulesets.addRuleset('WCAG20', {

  title : {
    'default' : "WCAG 2.0 ARIA Strict: Organization Websites",
    'en-us'   : "WCAG 2.0 ARIA Strict: Organization Websites"
  },   
  
  description : {
    'default' : "WCAG 2.0 ARIA strict ruleset for informational websites for universities, colleges, organization and business",
    'en-us'   : "WCAG 2.0 ARIA strict ruleset for informational websites for universities, colleges, organization and business"  
  },
  
  author : {
    name : "OpenAjax Accessibility Working Group",
    url  : "http://www.openajax.org/member/wiki/Accessibility"
  }, 
  
  ruleset_id    : "HIGHER_ED_ADMIN",  
  version       : "0.6 Beta",
  last_updated  : "2012-10-31",

  // Assignement of rules to WCAG 2.0 requirements

  rule_mappings : {
   AUDIO_1 : {
       type     : OpenAjax.a11y.RULE.REQUIRED,
       triage   : false,
       enabled  : true
     },
   AUDIO_2 : {
       type     : OpenAjax.a11y.RULE.REQUIRED,
       triage   : false,
       enabled  : true
     },
   COLOR_1 : {
       type     : OpenAjax.a11y.RULE.REQUIRED,
       triage   : false,
       enabled  : true
     },
   COLOR_2 : {
       type     : OpenAjax.a11y.RULE.REQUIRED,
       triage   : false,
       enabled  : true
     },
   CONTROL_1 : {
       type     : OpenAjax.a11y.RULE.REQUIRED,
       triage   : false,
       enabled  : true
     },
   CONTROL_2 : {
       type     : OpenAjax.a11y.RULE.REQUIRED,
       triage   : false,
       enabled  : true
     },
   CONTROL_3 : {
       type     : OpenAjax.a11y.RULE.REQUIRED,
       triage   : false,
       enabled  : true
     },
   CONTROL_4 : {
       type     : OpenAjax.a11y.RULE.REQUIRED,
       triage   : false,
       enabled  : true
     },
   CONTROL_5 : {
       type     : OpenAjax.a11y.RULE.REQUIRED,
       triage   : false,
       enabled  : true
     },
   CONTROL_6 : {
       type     : OpenAjax.a11y.RULE.REQUIRED,
       triage   : false,
       enabled  : true
     },
   CONTROL_7 : {
       type     : OpenAjax.a11y.RULE.REQUIRED,
       triage   : false,
       enabled  : true
     },
   CONTROL_8 : {
       type     : OpenAjax.a11y.RULE.REQUIRED,
       triage   : false,
       enabled  : true
     },
   CONTROL_10 : {
       type     : OpenAjax.a11y.RULE.REQUIRED,
       triage   : false,
       enabled  : true
     },
   CONTROL_11 : {
       type     : OpenAjax.a11y.RULE.REQUIRED,
       triage   : false,
       enabled  : true
     },
   CONTROL_12 : {
       type     : OpenAjax.a11y.RULE.REQUIRED,
       triage   : false,
       enabled  : true
     },
   HEADING_1 : {
       type     : OpenAjax.a11y.RULE.RECOMMENDED,
       triage   : false,
       enabled  : true
     },
   HEADING_2 : {
       type     : OpenAjax.a11y.RULE.RECOMMENDED,
       triage   : false,
       enabled  : true
     },
   HEADING_3 : {
       type     : OpenAjax.a11y.RULE.REQUIRED,
       triage   : false,
       enabled  : true
     },
   HEADING_4 : {
       type     : OpenAjax.a11y.RULE.REQUIRED,
       triage   : false,
       enabled  : true
     },
   HEADING_5 : {
       type     : OpenAjax.a11y.RULE.REQUIRED,
       triage   : false,
       enabled  : true
     },
   IMAGE_1 : {  
       type     : OpenAjax.a11y.RULE.REQUIRED,
       triage   : false,
       enabled  : true
     },
   IMAGE_2 : {
       type     : OpenAjax.a11y.RULE.REQUIRED,
       triage   : false,
       enabled  : true
     },
   IMAGE_3 : {
       type     : OpenAjax.a11y.RULE.REQUIRED,
       triage   : false,
       enabled  : true
     },
   IMAGE_4_EN : {
       type     : OpenAjax.a11y.RULE.RECOMMENDED,
       triage   : false,
       enabled  : true
     },
   IMAGE_5 : {
       type     : OpenAjax.a11y.RULE.RECOMMENDED,
       triage   : false,
       enabled  : true
     },
   IMAGE_6 : {
       type     : OpenAjax.a11y.RULE.REQUIRED,
       triage   : false,
       enabled  : true
     },
   KEYBOARD_1 : {
       type     : OpenAjax.a11y.RULE.REQUIRED,
       triage   : false,
       enabled  : true
     },
   KEYBOARD_2 : {
       type     : OpenAjax.a11y.RULE.REQUIRED,
       triage   : false,
       enabled  : true
     },
   LANDMARK_1 : {
       type     : OpenAjax.a11y.RULE.REQUIRED,
       triage   : false,
       enabled  : true
     },
   LANDMARK_2 : {
       type     : OpenAjax.a11y.RULE.REQUIRED,
       triage   : false,
       enabled  : true
     },
   LANDMARK_2N : {
       type     : OpenAjax.a11y.RULE.REQUIRED,
       triage   : false,
       enabled  : true
     },
   LANDMARK_2B : {
       type     : OpenAjax.a11y.RULE.REQUIRED,
       triage   : false,
       enabled  : true
     },
   LANDMARK_2CI : {
       type     : OpenAjax.a11y.RULE.REQUIRED,
       triage   : false,
       enabled  : true
     },
   LAYOUT_1 : {
       type     : OpenAjax.a11y.RULE.REQUIRED,
       triage   : false,
       enabled  : true
     },
   LAYOUT_2 : {
       type     : OpenAjax.a11y.RULE.RECOMMENDED,
       triage   : false,
       enabled  : true
     },
   LAYOUT_3 : {
       type     : OpenAjax.a11y.RULE.REQUIRED,
       triage   : false,
       enabled  : true
     },
   LINK_1 : {
       type     : OpenAjax.a11y.RULE.REQUIRED,
       triage   : false,
       enabled  : true
     },
   LINK_2 : {
       type     : OpenAjax.a11y.RULE.REQUIRED,
       triage   : false,
       enabled  : true
     },
   LINK_3 : {
       type     : OpenAjax.a11y.RULE.RECOMMENDED,
       triage   : false,
       enabled  : true
     },
   LINK_4 : {
       type     : OpenAjax.a11y.RULE.REQUIRED,
       triage   : false,
       enabled  : true
     },
   TABLE_1 : {
       type     : OpenAjax.a11y.RULE.REQUIRED,
       triage   : false,
       enabled  : true
     },
   TABLE_2S : {
       type     : OpenAjax.a11y.RULE.RECOMMENDED,
       triage   : false,
       enabled  : true
     },
   TABLE_2M : {
       type     : OpenAjax.a11y.RULE.REQUIRED,
       triage   : false,
       enabled  : true
     },
   TABLE_3 : {
       type     : OpenAjax.a11y.RULE.REQUIRED,
       triage   : false,
       enabled  : true
     },
   TABLE_4 : {
       type     : OpenAjax.a11y.RULE.RECOMMENDED,
       triage   : false,
       enabled  : true
     },
   TITLE_1 : {
       type     : OpenAjax.a11y.RULE.REQUIRED,
       triage   : false,
       enabled  : true
     },
   TITLE_2 : {
       type     : OpenAjax.a11y.RULE.REQUIRED,
       triage   : false,
       enabled  : true
     },
   VIDEO_1 : {
       type     : OpenAjax.a11y.RULE.REQUIRED,
       triage   : false,
       enabled  : true
     },
   VIDEO_2 : {
       type     : OpenAjax.a11y.RULE.REQUIRED,
       triage   : false,
       enabled  : true
     },
   VIDEO_3 : {
       type     : OpenAjax.a11y.RULE.REQUIRED,
       triage   : false,
       enabled  : true
     },
   VIDEO_4 : {
       type     : OpenAjax.a11y.RULE.REQUIRED,
       triage   : false,
       enabled  : true
     },
   VIDEO_5 : {
       type     : OpenAjax.a11y.RULE.REQUIRED,
       triage   : false,
       enabled  : true
     },
   VIDEO_6 : {
       type     : OpenAjax.a11y.RULE.REQUIRED,
       triage   : false,
       enabled  : true
     },
   VIDEO_7 : {
       type     : OpenAjax.a11y.RULE.REQUIRED,
       triage   : false,
       enabled  : true
     },
   VIDEO_8 : {
       type     : OpenAjax.a11y.RULE.REQUIRED,
       triage   : false,
       enabled  : true
     },
   WIDGET_1 : {
       type     : OpenAjax.a11y.RULE.REQUIRED,
       triage   : false,
       enabled  : true
     },
   WIDGET_2 : {
       type     : OpenAjax.a11y.RULE.REQUIRED,
       triage   : false,
       enabled  : true
     },
   WIDGET_3 : {
       type     : OpenAjax.a11y.RULE.REQUIRED,
       triage   : false,
       enabled  : true
     },
   WIDGET_4 : {
       type     : OpenAjax.a11y.RULE.REQUIRED,
       triage   : false,
       enabled  : true
     },
   WIDGET_5 : {
       type     : OpenAjax.a11y.RULE.REQUIRED,
       triage   : false,
       enabled  : true
     },
   WIDGET_6 : {
       type     : OpenAjax.a11y.RULE.REQUIRED,
       triage   : false,
       enabled  : true
     },
   WIDGET_7 : {
       type     : OpenAjax.a11y.RULE.REQUIRED,
       triage   : false,
       enabled  : true
     },
   WIDGET_8 : {
       type     : OpenAjax.a11y.RULE.REQUIRED,
       triage   : false,
       enabled  : true
     },
   WIDGET_9 : {
       type     : OpenAjax.a11y.RULE.REQUIRED,
       triage   : false,
       enabled  : true
     },
   WIDGET_10 : {
       type     : OpenAjax.a11y.RULE.REQUIRED,
       triage   : false,
       enabled  : true
     },
   WIDGET_11 : {
       type     : OpenAjax.a11y.RULE.REQUIRED,
       triage   : false,
       enabled  : true
     },
   WIDGET_12 : {
       type     : OpenAjax.a11y.RULE.REQUIRED,
       triage   : false,
       enabled  : true
     }
  } 
});