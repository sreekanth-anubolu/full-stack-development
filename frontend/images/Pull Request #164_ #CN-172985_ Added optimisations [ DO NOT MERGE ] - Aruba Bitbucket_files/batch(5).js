;
/* module-key = 'com.onresolve.stash.groovy.groovyrunner:split_vendor', location = 'js/vendor.1dc2f6f0f2576cc09d4a.js' */
/*! For license information please see vendor.1dc2f6f0f2576cc09d4a.js.LICENSE */
;
/* module-key = 'com.onresolve.stash.groovy.groovyrunner:split_autoConfigureDeleteBranchCheckbox', location = 'js/autoConfigureDeleteBranchCheckbox.1dc2f6f0f2576cc09d4a.js' */
(window.webpackJsonpScriptRunner=window.webpackJsonpScriptRunner||[]).push([["autoConfigureDeleteBranchCheckbox"],{1111:function(e,t,n){"use strict";n.r(t);var r=n(46).a.buildNumber,o=n(19),i=n(14),c=n(206),u=n(183),a=function(e,t,n,r){return new(n||(n=Promise))(function(o,i){function c(e){try{a(r.next(e))}catch(e){i(e)}}function u(e){try{a(r.throw(e))}catch(e){i(e)}}function a(e){var t;e.done?o(e.value):(t=e.value,t instanceof n?t:new n(function(e){e(t)})).then(c,u)}a((r=r.apply(e,t||[])).next())})},l=function(e,t){var n,r,o,i,c={label:0,sent:function(){if(1&o[0])throw o[1];return o[1]},trys:[],ops:[]};return i={next:u(0),throw:u(1),return:u(2)},"function"==typeof Symbol&&(i[Symbol.iterator]=function(){return this}),i;function u(i){return function(u){return function(i){if(n)throw new TypeError("Generator is already executing.");for(;c;)try{if(n=1,r&&(o=2&i[0]?r.return:i[0]?r.throw||((o=r.return)&&o.call(r),0):r.next)&&!(o=o.call(r,i[1])).done)return o;switch(r=0,o&&(i=[2&i[0],o.value]),i[0]){case 0:case 1:o=i;break;case 4:return c.label++,{value:i[1],done:!1};case 5:c.label++,r=i[1],i=[0];continue;case 7:i=c.ops.pop(),c.trys.pop();continue;default:if(!(o=(o=c.trys).length>0&&o[o.length-1])&&(6===i[0]||2===i[0])){c=0;continue}if(3===i[0]&&(!o||i[1]>o[0]&&i[1]<o[3])){c.label=i[1];break}if(6===i[0]&&c.label<o[1]){c.label=o[1],o=i;break}if(o&&c.label<o[2]){c.label=o[2],c.ops.push(i);break}o[2]&&c.ops.pop(),c.trys.pop();continue}i=t.call(e,c)}catch(e){i=[6,e],r=0}finally{n=o=0}if(5&i[0])throw i[1];return{value:i[0]?i[1]:void 0,done:!0}}([i,u])}}},s=function(){function e(e){this.selectorConfiguration=e}return e.prototype.shouldCheckDeleteBranchCheckbox=function(e){return a(this,void 0,Promise,function(){var t,n,r,u,a,s;return l(this,function(l){switch(l.label){case 0:return t=Object(c.b)(),n=t.projectState,r=t.repositoryState,u={projectKey:n.key,repoSlug:r.slug,sourceBranchName:e},a=AJS.contextPath()+"/rest/scriptrunner-bitbucket/latest/autoConfigureDeleteBranchCheckbox?"+Object(o.a)(u),[4,Object(i.a)(a)];case 1:return(s=l.sent()).result?[2,s.result.autoDeleteSourceBranch]:[2,!1]}})})},e.prototype.getSourceBranchName=function(){return document.querySelector(this.selectorConfiguration.sourceBranchNameSelector).innerText},e.prototype.getMergeDialog=function(){return Object(u.a)(this.selectorConfiguration.mergeDialogSelector,{subtree:!0})},e.prototype.getDeleteSourceBranchCheckbox=function(){return document.querySelector(this.selectorConfiguration.deleteSourceBranchCheckboxSelector)},e.prototype.getMergeButton=function(){return Object(u.a)(".merge-button")},e.prototype.checkSourceBranchCheckboxIfRequired=function(){return a(this,void 0,void 0,function(){var e;return l(this,function(t){switch(t.label){case 0:return[4,this.getMergeDialog()];case 1:return t.sent(),[4,this.getDeleteSourceBranchCheckbox()];case 2:return e=t.sent(),[4,this.shouldCheckDeleteBranchCheckbox(this.getSourceBranchName())];case 3:return t.sent()&&(e.checked||(e.click(),e.value="on")),e.setAttribute("data-sr-delete-branch-default-state-run","true"),[2]}})})},e.prototype.init=function(){return a(this,void 0,void 0,function(){var e;return l(this,function(t){switch(t.label){case 0:return[4,this.getMergeButton()];case 1:return(e=t.sent()).addEventListener("click",this.checkSourceBranchCheckboxIfRequired.bind(this)),e.setAttribute("data-sr-delete-branch-click-handler-registered","true"),[2]}})})},e}(),f=new s({deleteSourceBranchCheckboxSelector:"#pull-request-merge-dialog .checkbox",mergeDialogSelector:"#pull-request-merge-dialog",sourceBranchNameSelector:".branch-name"}),h=new s({deleteSourceBranchCheckboxSelector:'.merge-dialog input[type="checkbox"]',mergeDialogSelector:".merge-dialog",sourceBranchNameSelector:r>=7013e3?".ref-lozenge-content":".branch-lozenge-content"}),p=function(e,t,n,r){return new(n||(n=Promise))(function(o,i){function c(e){try{a(r.next(e))}catch(e){i(e)}}function u(e){try{a(r.throw(e))}catch(e){i(e)}}function a(e){var t;e.done?o(e.value):(t=e.value,t instanceof n?t:new n(function(e){e(t)})).then(c,u)}a((r=r.apply(e,t||[])).next())})},d=function(e,t){var n,r,o,i,c={label:0,sent:function(){if(1&o[0])throw o[1];return o[1]},trys:[],ops:[]};return i={next:u(0),throw:u(1),return:u(2)},"function"==typeof Symbol&&(i[Symbol.iterator]=function(){return this}),i;function u(i){return function(u){return function(i){if(n)throw new TypeError("Generator is already executing.");for(;c;)try{if(n=1,r&&(o=2&i[0]?r.return:i[0]?r.throw||((o=r.return)&&o.call(r),0):r.next)&&!(o=o.call(r,i[1])).done)return o;switch(r=0,o&&(i=[2&i[0],o.value]),i[0]){case 0:case 1:o=i;break;case 4:return c.label++,{value:i[1],done:!1};case 5:c.label++,r=i[1],i=[0];continue;case 7:i=c.ops.pop(),c.trys.pop();continue;default:if(!(o=(o=c.trys).length>0&&o[o.length-1])&&(6===i[0]||2===i[0])){c=0;continue}if(3===i[0]&&(!o||i[1]>o[0]&&i[1]<o[3])){c.label=i[1];break}if(6===i[0]&&c.label<o[1]){c.label=o[1],o=i;break}if(o&&c.label<o[2]){c.label=o[2],c.ops.push(i);break}o[2]&&c.ops.pop(),c.trys.pop();continue}i=t.call(e,c)}catch(e){i=[6,e],r=0}finally{n=o=0}if(5&i[0])throw i[1];return{value:i[0]?i[1]:void 0,done:!0}}([i,u])}}};AJS.toInit(function(){return p(void 0,void 0,void 0,function(){return d(this,function(e){switch(e.label){case 0:return[4,(r>=7e6?h:f).init()];case 1:return e.sent(),[2]}})})})},14:function(e,t,n){"use strict";n.d(t,"a",function(){return a});var r,o=n(604),i=function(e,t,n,r){return new(n||(n=Promise))(function(o,i){function c(e){try{a(r.next(e))}catch(e){i(e)}}function u(e){try{a(r.throw(e))}catch(e){i(e)}}function a(e){var t;e.done?o(e.value):(t=e.value,t instanceof n?t:new n(function(e){e(t)})).then(c,u)}a((r=r.apply(e,t||[])).next())})},c=function(e,t){var n,r,o,i,c={label:0,sent:function(){if(1&o[0])throw o[1];return o[1]},trys:[],ops:[]};return i={next:u(0),throw:u(1),return:u(2)},"function"==typeof Symbol&&(i[Symbol.iterator]=function(){return this}),i;function u(i){return function(u){return function(i){if(n)throw new TypeError("Generator is already executing.");for(;c;)try{if(n=1,r&&(o=2&i[0]?r.return:i[0]?r.throw||((o=r.return)&&o.call(r),0):r.next)&&!(o=o.call(r,i[1])).done)return o;switch(r=0,o&&(i=[2&i[0],o.value]),i[0]){case 0:case 1:o=i;break;case 4:return c.label++,{value:i[1],done:!1};case 5:c.label++,r=i[1],i=[0];continue;case 7:i=c.ops.pop(),c.trys.pop();continue;default:if(!(o=(o=c.trys).length>0&&o[o.length-1])&&(6===i[0]||2===i[0])){c=0;continue}if(3===i[0]&&(!o||i[1]>o[0]&&i[1]<o[3])){c.label=i[1];break}if(6===i[0]&&c.label<o[1]){c.label=o[1],o=i;break}if(o&&c.label<o[2]){c.label=o[2],c.ops.push(i);break}o[2]&&c.ops.pop(),c.trys.pop();continue}i=t.call(e,c)}catch(e){i=[6,e],r=0}finally{n=o=0}if(5&i[0])throw i[1];return{value:i[0]?i[1]:void 0,done:!0}}([i,u])}}},u={credentials:"same-origin",headers:(r={Pragma:"no-cache"},r["Content-Type"]="application/json",r)},a=function(e,t){return i(void 0,void 0,Promise,function(){var n;return c(this,function(r){return n=o.a(u,t||{}),[2,fetch(e,n).then(function(e){if(!e.ok){var t={error:e.statusText||"request failed",response:e};return Promise.resolve(t)}var r,o=e.headers.get("Content-Type");return o&&-1===o.indexOf("text/html")&&-1===o.indexOf("text/plain")?-1!==o.indexOf("application/json")||o.startsWith("application/")&&-1!==o.indexOf("+json;")?r=e.json():o.startsWith("image/")&&(r=e.blob()):r=e.text(),r.then(function(t){return Promise.resolve({result:t,response:e})}).catch(function(t){return n.method&&["delete","post"].includes(n.method.toLowerCase())?Promise.resolve({result:{},response:e}):(console.warn("Could not parse: "+t),Promise.resolve({error:"Could not parse: "+t}))})}).catch(function(e){return Promise.resolve({error:"Network "+e})})]})})}},183:function(e,t,n){"use strict";n.d(t,"a",function(){return o});var r=function(){return(r=Object.assign||function(e){for(var t,n=1,r=arguments.length;n<r;n++)for(var o in t=arguments[n])Object.prototype.hasOwnProperty.call(t,o)&&(e[o]=t[o]);return e}).apply(this,arguments)},o=function(e,t){return void 0===t&&(t={}),new Promise(function(n){return i(document.body,e,n,r({subtree:!1},t))})},i=function(e,t,n,o){void 0===o&&(o={});var i=e.querySelector(t);i?n(i):new MutationObserver(function(r,o){var i=e.querySelector(t);i&&(o.disconnect(),n(i))}).observe(e,r({childList:!0,subtree:!0,attributes:!1,characterData:!1},o))}},19:function(e,t,n){"use strict";n.d(t,"a",function(){return c});var r=n(202),o=n(602),i=n(603),c=function(e){return r.stringify(o.a(function(e){return!i.a(e)},e))}},191:function(e,t,n){e.exports=void 0},206:function(e,t,n){"use strict";n.d(t,"b",function(){return r}),n.d(t,"a",function(){return o});var r=function(){var e=n(307),t={};try{t.projectState=e.getProject()}catch(e){}try{t.pullRequestState=e.getPullRequest()}catch(e){}try{t.repositoryState=e.getRepository()}catch(e){}return t},o=function(){try{var e=r(),t=e.repositoryState,n=e.projectState;return{repo:t&&t.slug,repositoryId:t&&t.id,project:n&&n.key,projectId:n&&n.id,allLevels:void 0===(null==n?void 0:n.id)&&void 0===(null==t?void 0:t.id)||void 0,allInProject:void 0!==(null==n?void 0:n.id)&&void 0===(null==t?void 0:t.id)||void 0}}catch(e){return{}}}},307:function(e,t){e.exports=require("bitbucket/util/state")},46:function(e,t,n){"use strict";n.d(t,"a",function(){return i}),n.d(t,"b",function(){return c});var r=function(){return(r=Object.assign||function(e){for(var t,n=1,r=arguments.length;n<r;n++)for(var o in t=arguments[n])Object.prototype.hasOwnProperty.call(t,o)&&(e[o]=t[o]);return e}).apply(this,arguments)};n(191);var o=function(){var e=window.WRM||window.parent.WRM;if(window.ScriptRunner=window.ScriptRunner||window.parent.ScriptRunner||{},window.ScriptRunner.WRM=window.ScriptRunner.WRM||{},window.ScriptRunner.WRM.CommonAdminSettings)return window.ScriptRunner.WRM.CommonAdminSettings;var t=e.data.claim("com.onresolve.stash.groovy.groovyrunner:adminSettingsWebResources.admin-settings-data-provider");return window.ScriptRunner.WRM.CommonAdminSettings=t,t},i=o(),c=function(){return r(r({},o()),{isServiceDeskEnabled:!1})}}},[[1111,"runtime","vendor"]]]);;
;
/* module-key = 'com.atlassian.bitbucket.server.bitbucket-frontend:split_extension-jira-pull-request-comment-action-extension-comment-action-extension-js~extension-jira-pull~d6aab13d', location = 'extension-jira-pull-request-comment-action-extension-comment-action-extension-js~extension-jira-pull~d6aab13d.chunk.js' */
/*! For license information please see extension-jira-pull-request-comment-action-extension-comment-action-extension-js~extension-jira-pull~d6aab13d.chunk.js.LICENSE */
(window.atlassianWebpackJsonp9bed4266d44bdeae18aa343dea64edaf=window.atlassianWebpackJsonp9bed4266d44bdeae18aa343dea64edaf||[]).push([["extension-jira-pull-request-comment-action-extension-comment-action-extension-js~extension-jira-pull~d6aab13d"],{"./src/extension/jira/issues-provider.js":function(e,t,s){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.createIssue=t.getIssues=t.getIssuesSummary=void 0;var r=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var s=arguments[t];for(var r in s)Object.prototype.hasOwnProperty.call(s,r)&&(e[r]=s[r])}return e},n=s("com.atlassian.bitbucket.server.bitbucket-webpack-INTERNAL:lodash/require('lodash')"),a=o(s("com.atlassian.bitbucket.server.bitbucket-webpack-INTERNAL:client-storage/require('bitbucket/internal/util/client-storage')")),i=o(s("com.atlassian.bitbucket.server.bitbucket-web-api:navbuilder/require('bitbucket/util/navbuilder')")),u=s("com.atlassian.bitbucket.server.bitbucket-web-api:server/require('bitbucket/util/server')");function o(e){if(e&&e.__esModule)return e;var t={};if(null!=e)for(var s in e)Object.prototype.hasOwnProperty.call(e,s)&&(t[s]=e[s]);return t.default=e,t}var c=a.contexts.REPO;t.getIssuesSummary=function(e){var t=e.projectKey,s=e.repoSlug,r=e.pullRequestId,n=i.rest("jira").addPathComponents("projects",t,"repos",s,"pull-requests",r,"issues").build(),a=(0,u.rest)({url:n,type:u.method.GET,statusCode:{"*":!1}});return new Promise((function(e,t){return a.then((function(t){e(Array.isArray(t)?t:[])})).fail(t)}))},t.getIssues=function(e){var t=i.rest("jira-integration").addPathComponents("issues").withParams({issueKey:e,fields:"issuetype,status,summary",showErrors:!0}).build(),s=(0,u.rest)({url:t,statusCode:{200:!1,500:!1}});return new Promise((function(e,t){s.done((function(t){var s=(0,n.get)(t,"errors.0"),r=s&&s.length?s:t.errors,a=(0,n.get)(t,"issues.0");e({issues:a,errors:r})})).fail((function(e){var s=(0,n.get)(e.responseJSON,"errors",[]).map((function(t){return r({},t,{status:e.status})}));t(s)}))}))},t.createIssue=function(e,t){var s=i.rest("jira").addPathComponents("comments",e.commentId,"issues").withParams({applicationId:e.serverId}).build(),o={fields:r({},t,{project:{key:e.projectKey},issuetype:{id:+e.issueTypeId}})},l=(0,u.rest)({type:"POST",url:s,data:o,statusCode:{400:!1}});return new Promise((function(t,s){l.then((function(s){a.setItemProgressively("create-jira-issue-context",c,e),t(s)})).fail((function(e){return(0,n.get)(e.responseJSON,"errors",[]).reduce((function(e,t){return function(e){return e.context&&""!==e.context}&&(e[t.context]=t.message),e}),{})}))}))}}}]);;
;
/* module-key = 'com.atlassian.bitbucket.server.bitbucket-frontend:split_extension-jira-pull-request-comment-extension-comment-extension-js~extension-jira-pull-request-overv~77f39eac', location = 'extension-jira-pull-request-comment-extension-comment-extension-js~extension-jira-pull-request-overv~77f39eac.chunk.js' */
/*! For license information please see extension-jira-pull-request-comment-extension-comment-extension-js~extension-jira-pull-request-overv~77f39eac.chunk.js.LICENSE */
(window.atlassianWebpackJsonp9bed4266d44bdeae18aa343dea64edaf=window.atlassianWebpackJsonp9bed4266d44bdeae18aa343dea64edaf||[]).push([["extension-jira-pull-request-comment-extension-comment-extension-js~extension-jira-pull-request-overv~77f39eac"],{"./src/extension/jira/jira-logo.svg":function(e,a,t){"use strict";t.r(a),t.d(a,"ReactComponent",(function(){return d}));var r=t("com.atlassian.bitbucket.server.bitbucket-webpack-INTERNAL:react/require('react')"),n=t.n(r);function o(){return(o=Object.assign||function(e){for(var a=1;a<arguments.length;a++){var t=arguments[a];for(var r in t)Object.prototype.hasOwnProperty.call(t,r)&&(e[r]=t[r])}return e}).apply(this,arguments)}var i=n.a.createElement("defs",null,n.a.createElement("linearGradient",{id:"jira-logo_svg__a",x1:57.65,y1:21.92,x2:43.31,y2:36.7,gradientUnits:"userSpaceOnUse"},n.a.createElement("stop",{offset:.18,stopColor:"#344563"}),n.a.createElement("stop",{offset:1,stopColor:"#7a869a"})),n.a.createElement("linearGradient",{id:"jira-logo_svg__b",x1:41.91,y1:38.81,x2:25.34,y2:54.94,xlinkHref:"#jira-logo_svg__a"})),s=n.a.createElement("path",{d:"M72.12 5.07H38.41a15.21 15.21 0 0015.21 15.21h6.21v6A15.21 15.21 0 0075 41.48V8a2.92 2.92 0 00-2.88-2.93z",fill:"#7a869a"}),l=n.a.createElement("path",{d:"M55.44 21.86H21.73a15.21 15.21 0 0015.21 15.21h6.21v6a15.22 15.22 0 0015.21 15.21v-33.5a2.92 2.92 0 00-2.92-2.92z",fill:"url(#jira-logo_svg__a)"}),c=n.a.createElement("path",{d:"M38.75 38.65H5a15.22 15.22 0 0015.26 15.21h6.21v6a15.21 15.21 0 0015.21 15.21V41.58a2.93 2.93 0 00-2.93-2.93z",fill:"url(#jira-logo_svg__b)"}),d=function(e){return n.a.createElement("svg",o({width:24,height:24,viewBox:"0 0 80 80"},e),i,s,l,c)};a.default=t.p+"62b59eac0d9559689ccb28f26e25fc07.svg"}}]);;
;
/* module-key = 'com.atlassian.bitbucket.server.bitbucket-frontend:split_extension-jira-pull-request-overview-extension-overview-extension-js', location = 'extension-jira-pull-request-overview-extension-overview-extension-js.chunk.js' */
/*! For license information please see extension-jira-pull-request-overview-extension-overview-extension-js.chunk.js.LICENSE */
(window.atlassianWebpackJsonp9bed4266d44bdeae18aa343dea64edaf=window.atlassianWebpackJsonp9bed4266d44bdeae18aa343dea64edaf||[]).push([["extension-jira-pull-request-overview-extension-overview-extension-js"],{"./generated-clientside-extension/extension-jira-pull-request-overview-extension-overview-extension-js.js":function(e,n,t){"use strict";var i=a(t("com.atlassian.plugins.atlassian-clientside-extensions-runtime:runtime/require('@atlassian/clientside-extensions-registry')")),s=a(t("./src/extension/jira/pull-request/overview-extension/overview-extension.js"));function a(e){return e&&e.__esModule?e:{default:e}}i.default.registerExtension("com.atlassian.bitbucket.server.bitbucket-frontend:extension/jira/pull-request/overview-extension/overview-extension.js",s.default)},"./src/extension/jira/pull-request/overview-extension/overview-extension.js":function(e,n,t){"use strict";Object.defineProperty(n,"__esModule",{value:!0});var i=t("../../node_modules/@atlassian/clientside-extensions/dist/esm/index.js"),s=t("./src/extension/jira/helpers.js"),a=t("./src/extension/jira/issues-provider.js"),o=t("./src/extension/jira/jira-dialog/index.js"),r=t("./src/extension/jira/jira-logo.svg");n.default=i.ButtonExtension.factory((function(e,n){var t=n.pullRequest,i=n.project,u=n.repository,l=t.id,c=i.key,d=u.slug;return(0,a.getIssuesSummary)({pullRequestId:l,projectKey:c,repoSlug:d}).then((function(n){var t=n.map((function(e){return e.key})).filter(Boolean),i=0===t.length;e.updateAttributes({hidden:i,label:(0,s.getLabel)(t),tooltip:(0,s.getTooltip)(t),iconBefore:r.ReactComponent,onAction:function(){o.initDialogPromise.then((function(e){e.setIssueKeys(t),e.show()}))}})})),{hidden:!1,onAction:function(){},iconBefore:null,iconAfter:null,className:null,label:null,tooltip:null}})),e.exports=n.default}},[["./generated-clientside-extension/extension-jira-pull-request-overview-extension-overview-extension-js.js","runtime","vendors~announcement-banner-settings~auto-decline~create-pull-request~default-branch-admin~extension~b53c067f","vendors~auto-decline~create-pull-request~default-branch-admin~extension-git-rebase-pull-request-acti~1d11af72","vendors~auto-decline~create-pull-request~default-branch-admin~extension-git-rebase-pull-request-acti~2fd8fa4e","vendors~auto-decline~create-pull-request~default-branch-admin~extension-git-rebase-pull-request-acti~c062ae27","vendors~auto-decline~create-pull-request~default-branch-admin~extension-git-rebase-pull-request-acti~a97cef0a","vendors~auto-decline~create-pull-request~extension-git-rebase-pull-request-action-item-extension-act~f68a7118","vendors~auto-decline~create-pull-request~extension-git-rebase-pull-request-action-item-extension-act~6bd15fca","vendors~create-pull-request~extension-git-rebase-pull-request-action-item-extension-action-item-exte~a276dd3d","vendors~create-pull-request~extension-git-rebase-pull-request-action-item-extension-action-item-exte~80497970","vendors~create-pull-request~extension-jira-pull-request-comment-action-extension-comment-action-exte~34708f40","vendors~extension-git-rebase-pull-request-action-item-extension-action-item-extension-js~extension-j~dbec70aa","announcement-banner-settings~auto-decline~create-pull-request~default-branch-admin~extension-git-reb~ba3b7284","announcement-banner-settings~auto-decline~create-pull-request~default-branch-admin~extension-git-reb~f0f3850d","announcement-banner-settings~auto-decline~create-pull-request~default-branch-admin~extension-git-reb~2ce7521e","announcement-banner-settings~auto-decline~create-pull-request~default-branch-admin~extension-jira-pu~77a4de4b","announcement-banner-settings~auto-decline~create-pull-request~default-branch-admin~extension-git-reb~5f3ea1fc","announcement-banner-settings~create-pull-request~extension-git-rebase-pull-request-action-item-exten~e73a8e0d","create-pull-request~extension-git-rebase-pull-request-action-item-extension-action-item-extension-js~7e4acfcd","create-pull-request~extension-git-rebase-pull-request-action-item-extension-action-item-extension-js~e2f477ed","create-pull-request~extension-jira-pull-request-comment-action-extension-comment-action-extension-js~6fa291ae","create-pull-request~extension-jira-pull-request-comment-extension-comment-extension-js~extension-jir~d37111b1","create-pull-request~extension-jira-pull-request-comment-action-extension-comment-action-extension-js~8e802470","extension-jira-pull-request-comment-action-extension-comment-action-extension-js~extension-jira-pull~d6aab13d","extension-jira-pull-request-comment-extension-comment-extension-js~extension-jira-pull-request-overv~77f39eac"]]]);;
;
/* module-key = 'com.atlassian.bitbucket.server.bitbucket-contributing-guidelines:contributing-guidelines-pullrequest-overview-summary-extension', location = '/bitbucket-plugin-contributing-guidelines/internal/feature/pull-request/contributing-guidelines-extension.js' */
define("bitbucket-plugin-contributing-guidelines/internal/feature/pull-request/contributing-guidelines-extension",["module","exports","wrm/i18n","bitbucket-plugin-contributing-guidelines/internal/model/common","bitbucket/internal/util/analytics"],function(h,b,g,d,k){Object.defineProperty(b,"__esModule",{value:!0});b.default=function(a,l,c){var b=l.repository;return{hidden:!c.hasContributingGuidelines,type:"button",label:"Contribution guidelines",tooltip:"View the contribution guidelines for this repository",
className:"contributing-info-link",iconBefore:"info",onAction:function(){e||(e=(0,d.getContributingGuidelinesFilename)(b));e.done(function(a){f||(f=(0,d.getContributingGuidelinesData)(b,a));m.add("stash.client.contributing.pullrequest.clicked");(0,d.showContributingFileDialog)(f)})}}};var m=function(a){if(a&&a.__esModule)return a;var b={};if(null!=a)for(var c in a)Object.prototype.hasOwnProperty.call(a,c)&&(b[c]=a[c]);b.default=a;return b}(k),f=void 0,e=void 0;h.exports=b["default"]});;
;
/* module-key = 'com.atlassian.bitbucket.server.bitbucket-contributing-guidelines:contributing-guidelines-pullrequest-overview-summary-extension', location = '/bitbucket-plugin-contributing-guidelines/internal/feature/pull-request/contributing-guidelines-extension-entrypoint.js' */
require(["@atlassian/clientside-extensions-registry","lib/page-data-loader","bitbucket-plugin-contributing-guidelines/internal/feature/pull-request/contributing-guidelines-extension"],function(a,b,c){b.ready("com.atlassian.bitbucket.server.bitbucket-contributing-guidelines:contributing-guidelines-context-provider","bitbucket.ui.pullrequest.overview.summary").then(function(b){return a.registerExtension("com.atlassian.bitbucket.server.bitbucket-contributing-guidelines:contributing-guidelines-pullrequest-overview-summary",
function(a,d){return c(a,d,b)})})});;
//# sourceMappingURL=/download/contextbatch/js/bitbucket.ui.pullrequest.overview.summary,-_super,-bitbucket.page.pullRequest.detail,-atl.general,-bitbucket.layout.repository,-bitbucket.layout.base,-bitbucket.ui.pullrequest.action/batch.js.map?_statichash=08a321706c2192fe40805889107940a5-CDN%2F1126798137%2F6433dff%2F382%2Fd149cc5f7c898afe14e4fcad6cd9a431&awesome.graphs.adg3=true&awesome.graphs.isLoggedIn=true&feature.smart.mirrors.enabled=true&hasConnectAddons=true&locale=en-US