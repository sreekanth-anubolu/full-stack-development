;
/* module-key = 'com.atlassian.applinks.applinks-plugin:applinks-common-exported', location = 'applinks/internal/common/docs.js' */
define('applinks/common/docs', [
    'applinks/lib/jquery',
    'applinks/lib/aui',
    'applinks/common/help-paths'
], function(
    $,
    AJS,
    ApplinksHelpPaths
) {
    // NOTE: should be moved to applinks/feature/help-link, see APLDEV-593

    return {
        /**
         * NOTE: this is a dynamically generated version of the link build in _help_link.vm, any update here should be
         * applied there.
         * @method createDocLink
         * @param pageKey a key that maps to a page in ual-help-paths.properties
         * @param sectionKey (Optional) a key that maps to an anchor section id in ual-help-paths.properties
         * @param classNames (Optional) Whitespace separated list of additional class names
         * @return an html &lt;a&gt; element targeting the specified page & section
         */
        createDocLink: function(pageKey, sectionKey, classNames) {
            return this._createDocLink(pageKey, sectionKey, classNames, "Help");
        },
        createDocLinkIcon: function(pageKey, sectionKey, classNames) {
            return this._createDocLink(pageKey, sectionKey, classNames, '')
                .append($('<span/>', {
                    "class": 'aui-icon aui-icon-small aui-iconfont-help',
                    "text": "Help"
                }));
        },

        _createDocLink: function(pageKey, sectionKey, classNames, text) {
            if (!classNames) {
                classNames = '';
            } else {
                classNames = ' ' + classNames;
            }
            return $('<a/>', {
                'class': 'ual-help-link help-link' + classNames,
                href: this.getDocHref(pageKey, sectionKey),
                target: '_blank',
                'data-help-link-key': pageKey,
                text: text,
                title: "Help"
            });
        },

        /**
         * @method getDocHref
         * @param pageKey a key that maps to a page in ual-help-paths.properties
         * @param sectionKey (Optional) a key that maps to an anchor section id in ual-help-paths.properties
         * @return the url of the given page and section (if specified)
         */
        getDocHref: function(pageKey, sectionKey) {
            var link = ApplinksHelpPaths.getFullPath(pageKey);
            if (sectionKey) {
                link += '#' + ApplinksHelpPaths.getPath(sectionKey);
            }
            return link;
        }
    };

});
;
;
/* module-key = 'com.atlassian.applinks.applinks-plugin:applinks-common-exported', location = 'applinks/internal/common/help-paths.js' */
define('applinks/common/help-paths', [
    'applinks/lib/console',
    'applinks/lib/wrm',
    'applinks/lib/lodash',
    'applinks/common/modules',
    'applinks/common/preconditions'
], function(
    console,
    WRM,
    _,
    ApplinksModules,
    Preconditions
) {
    // NOTE: should be moved to applinks/feature/help-link, see APLDEV-593

    // lazy-load help paths, facilitates unit-testing
    var allHelpPaths = _.memoize(function() {
        var helpPaths = WRM.data.claim(ApplinksModules.dataFqn(ApplinksModules.COMMON_EXPORTED, 'applinks-help-paths'));
        if (!helpPaths.entries) {
            console.warn('Help paths not found, all help links are likely to be broken.');
        }
        return helpPaths.entries || {};
    });

    var getPath = function(key, sectionKey) {
        Preconditions.nonEmptyString(key, 'key');
        var path = allHelpPaths()[key] || key;
        if (sectionKey) {
            Preconditions.nonEmptyString(sectionKey, 'sectionKey');
            var prefix = path.replace(/\+/g, ''); // "g" flag to remove _all_ '+' signs
            path += '#' +prefix + '-' + sectionKey;
        }
        return path;
    };

    function endsWith(string, suffix) {
        return string.indexOf(suffix, string.length - suffix.length) !== -1;
    }

    function addSuffixIfRequired(string, suffix) {
        return endsWith(string, suffix) ? string : string + suffix;
    }

    return {
        /**
         * @param key {string} key to get the path for
         * @returns {string} relative help path that can be appended to any relevant docs base URL
         */
        getPath: getPath,

        /**
         * @param key {string} key to get the path for
         * @param sectionKey {string} optional key of the anchor on the target page
         * @returns {string} full help path including the base URL
         */
        getFullPath: function(key, sectionKey) {
            var baseUrl = this.baseUrl();
            return addSuffixIfRequired(baseUrl, '/') + this.getPath(key, sectionKey);
        },

        /**
         * @returns {string} configured base URL for the help paths
         */
        baseUrl: _.partial(getPath, 'applinks.docs.root')
    }
});;
;
/* module-key = 'com.atlassian.applinks.applinks-plugin:applinks-common-exported', location = 'applinks/internal/common/events.js' */
define('applinks/common/events', [
    'applinks/lib/jquery',
    'applinks/lib/lodash',
    'applinks/lib/window',
    'applinks/common/preconditions'
], function(
    $,
    _,
    window,
    Preconditions
) {
    var PREFIX = 'applinks.event.';

    function applinksEvent(eventId) {
        return PREFIX + Preconditions.nonEmptyString(eventId, 'eventId');
    }

    /**
     * Provides common Applinks event IDs and a simple event system facade API. This is a preferred way to subscribe to
     * and raise Applinks-specific events as it does not depend on a specific event bus or event target (such as
     * `document`), as well as facilitates unit testing.
     */
    return {
        PREREADY: applinksEvent('preready'),
        READY: applinksEvent('ready'),

        /**
         * Raised when applinks list is first loaded
         */
        APPLINKS_LOADED: applinksEvent('loaded'),
        /**
         * Raised when applinks list is updated
         */
        APPLINKS_UPDATED: applinksEvent('updated'),

        /**
         * This event is only raised when linking to Atlassian applications
         * Can be consumed by other plugins
         */
        NEW_APPLINK_CREATED: applinksEvent('created'),

        /**
         * Raised when orphaned upgrade operation succeeds in creating a new Applink from the orphaned relationship
         */
        ORPHANED_UPGRADE: applinksEvent('orphaned.upgrade'),

        /**
         * Raised when v3 onboarding has finished or, or has never run on the current page (and won't).
         */
        V3_ONBOARDING_FINISHED: applinksEvent('v3-onboarding-finished'),

        // legacy events
        Legacy: {
            MESSAGE_BOX_DISPLAYED: applinksEvent('message-box-displayed')
        },

        applinksEvent: applinksEvent,

        on: function(events, handler, context) {
            var handlerWithContext = context ? _.bind(handler, context) : handler;
            $(window.document).on(events, handlerWithContext);
        },

        off: function(events, handler) {
            $(window.document).off(events, handler);
        },

        trigger: function(event, data) {
            $(window.document).trigger(event, data);
        }
    }
});;
;
/* module-key = 'com.atlassian.applinks.applinks-plugin:applinks-common-exported', location = 'applinks/internal/common/i18n.js' */
define('applinks/common/i18n', [
    'applinks/lib/lodash',
    'applinks/lib/jquery',
    'applinks/lib/wrm',
    'applinks/common/modules',
    'applinks/common/preconditions',
    'applinks/common/products'
], function(
    _,
    $,
    WRM,
    ApplinksModules,
    Preconditions,
    ApplinksProducts
) {
    var getAllEntityTypes = _.memoize(function() {
        var val = WRM.data.claim(ApplinksModules.dataFqn(ApplinksModules.COMMON_EXPORTED, 'entity-types'));
        return Preconditions.hasValue(val, 'entity-types', 'Entity Types data not found');
    });

    var getAllAuthTypes = _.memoize(function() {
        var val = WRM.data.claim(ApplinksModules.dataFqn(ApplinksModules.COMMON_EXPORTED, 'authentication-types'));
        return Preconditions.hasValue(val, 'authentication-types', 'Authentication Types data not found');
    });

    return {
        
        /**
         * @param typeId ID of the application type to resolve
         * @returns {string} resolved i18n-ed type name, or the original `typeId` if there is no mapping
         */
        getApplicationTypeName: function(typeId) {
            return ApplinksProducts.getTypeName(typeId);
        },

        /**
         * @param typeId ID of the entity type to resolve
         * @returns {string} resolved i18n-ed singular entity type name, or the original `typeId` if there is no mapping
         */
        getEntityTypeName: function(typeId) {
            return getAllEntityTypes().singular[typeId] || typeId;
        },

        /**
         * @param typeId ID of the entity type to resolve
         * @returns {string} resolved i18n-ed plural entity type name, or the original `typeId` if there is no mapping
         */
        getPluralizedEntityTypeName: function(typeId) {
            return getAllEntityTypes().plural[typeId] || typeId;
        },

        /**
         * @param type ID of the authentication type to resolve (usually in a form of full class name)
         * @returns {string} resolved i18n-ed authentication type name, or the original `type` if there is no mapping
         */
        getAuthenticationTypeName: function(type) {
            return getAllAuthTypes()[type] || type;
        }
    };
});
;
;
/* module-key = 'com.atlassian.applinks.applinks-plugin:applinks-common-exported', location = 'applinks/internal/common/modules.js' */
/**
 * Applinks plugin modules core constants and definitions.
 */
define('applinks/common/modules', function() {
    return {
        /**
         * Applinks plugin key
         */
        PLUGIN_KEY: 'com.atlassian.applinks.applinks-plugin',

        // key web resource keys
        COMMON_EXPORTED: 'applinks-common-exported',
        COMMON: 'applinks-common',

        /**
         * Fully qualifies a module name using the plugin key.
         *
         * @param {string} moduleName module name to qualify
         * @returns {string} fully qualified name
         */
        fqn: function(moduleName) {
            return this.PLUGIN_KEY + ':' + moduleName;
        },

        /**
         * Fully qualifies web-resource data using module name and data key.
         *
         * @param {string} moduleName module name
         * @param {string} dataKey key of the data element
         * @returns {string} fully qualified name
         */
        dataFqn: function(moduleName, dataKey) {
            return this.fqn(moduleName) + '.' + dataKey;
        }
    };
});;
;
/* module-key = 'com.atlassian.applinks.applinks-plugin:applinks-common-exported', location = 'applinks/internal/common/preconditions.js' */
define('applinks/common/preconditions', [
    'applinks/lib/lodash'
], function(
    _
) {
    function nonEmptyString(value, varName, customMessage) {
        return _checkArgument(
            _.isString(value) && !_.isEmpty(value),
            customMessage,
            _withVarName(varName, ': expected a non-empty string, was: <' + value + '>'),
            value
        );
    }

    function isFunction(value, varName, customMessage) {
        return _checkArgument(
            _.isFunction(value),
            customMessage,
            _withVarName(varName, ': expected a function, was: ' + value),
            value
        );
    }

    function isArray(value, varName, customMessage) {
        return _checkArgument(
            _.isArray(value),
            customMessage,
            _withVarName(varName, ': expected an array, was: ' + value),
            value
        );
    }

    function hasValue(value, varName, customMessage) {
        return _checkArgument(
            value,
            customMessage,
            _withVarName(varName, ': expected a value'),
            value
        );
    }

    function _checkArgument(test, message, defaultMessage, actualValue) {
        var actualMessage = message ? message : defaultMessage;
        if (!test) {
            throw new Error(actualMessage)
        }
        return actualValue || test;
    }

    function _withVarName(varName, msg) {
        return (varName || '[unspecified]') + msg;
    }

    return {
        // applinks support 1.5.2+ underscore and its lodash counterparts
        // _.partial works differently in lodash@2.x vs its newer and underscore versions
        //  thus replacing _.partial with vanilla JS for full compatibility
        checkArgument: function(test, message, actualValue) {
            return _checkArgument(test, message, '', actualValue);
        },
        nonEmptyString: nonEmptyString,
        isArray: isArray,
        isFunction: isFunction,
        hasValue: hasValue
    };
});;
;
/* module-key = 'com.atlassian.applinks.applinks-plugin:applinks-common-exported', location = 'applinks/internal/common/products.js' */
define('applinks/common/products', [
    'applinks/lib/lodash',
    'applinks/lib/wrm',
    'applinks/common/modules',
    'applinks/common/preconditions'
], function(
    _,
    WRM,
    ApplinksModules,
    Preconditions
) {
    var getAllTypes = _.memoize(function() {
        var val = WRM.data.claim(ApplinksModules.dataFqn(ApplinksModules.COMMON_EXPORTED, 'applinks-types'));
        return Preconditions.hasValue(val, 'types', 'Application Types data not found');
    });

    /**
     * @param typeId ID of the application type to resolve
     * @returns {string} resolved i18n-ed type name, or the original `typeId` if there is no mapping
     */
    function getTypeName(typeId) {
        return getAllTypes()[typeId] || typeId;
    }

    /**
     * Map of Atlassian product keys to application type IDs
     */
    return {
        BAMBOO: 'bamboo',
        BITBUCKET: 'stash', // special case, see java class com.atlassian.applinks.application.bitbucket.BitbucketApplicationTypeImpl.TYPE_ID
        CONFLUENCE: 'confluence',
        FECRU: 'fecru',
        JIRA: 'jira',
        REFAPP: 'refapp',
        STASH: 'stash',
        getTypeName: getTypeName
    };
});;
;
/* module-key = 'com.atlassian.auiplugin:split_aui.splitchunk.89403fec76', location = 'aui.chunk.e3ac2f65f1f52a285a46--824c9cae70b600cfcd7d.js' */
(window.__auiJsonp=window.__auiJsonp||[]).push([["aui.splitchunk.89403fec76"],{VjKg:function(n,t,i){"use strict";jQuery.fn.throbber=function(n){return function(){var t=[],i={isLatentThreshold:100,minThrobberDisplay:200,loadingClass:"loading"};return n(document).ajaxComplete(function(i,e){n(t).each(function(n){e===this.get(0)&&(this.hideThrobber(),t.splice(n,1))})}),function(e){var o,s,r=function n(t,i){n.t=setTimeout(function(){clearTimeout(n.t),n.t=void 0,t()},i)};return(e=n.extend(i,e||{})).target?(s=jQuery(e.target),t.push(n.extend(this,{showThrobber:function(){r(function(){o||(s.addClass(e.loadingClass),r(function(){o&&o()},e.minThrobberDisplay))},e.isLatentThreshold)},hideThrobber:function(){o=function(){s.removeClass(e.loadingClass),e.end&&e.end()},r.t||o()}})),this.showThrobber(),this):this}}()}(jQuery)}}]);;
;
/* module-key = 'com.atlassian.auiplugin:split_aui.deprecated.component.dropdown1', location = 'aui.chunk.11ec3a8ac1281fee094e--c5ce74bad3d72324f3ed.js' */
(window.__auiJsonp=window.__auiJsonp||[]).push([["aui.deprecated.component.dropdown1"],{"8dXc":function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var a=l(n("+x/D"));n("WCtk"),n("VjKg");var r=o(n("bPPT")),i=o(n("JFi+")),u=l(n("KloK"));function o(e){if(e&&e.__esModule)return e;var t={};if(null!=e)for(var n in e)Object.prototype.hasOwnProperty.call(e,n)&&(t[n]=e[n]);return t.default=e,t}function l(e){return e&&e.__esModule?e:{default:e}}var s=2700;function d(e,t){var n=null,r=[],u=!1,o=(0,a.default)(document),l={item:"li:has(a)",activeClass:"active",alignment:"right",displayHandler:function(e){return e.name},escapeHandler:function(){return this.hide("escape"),!1},hideHandler:function(){},moveHandler:function(){},useDisabled:!1};if(a.default.extend(l,t),l.alignment={left:"left",right:"right"}[l.alignment.toLowerCase()]||"left",e&&e.jquery)n=e;else if("string"==typeof e)n=(0,a.default)(e);else{if(!e||e.constructor!==Array)throw new Error("dropDown function was called with illegal parameter. Should be $ object, $ selector or array.");n=(0,a.default)("<div></div>").addClass("aui-dropdown").toggleClass("hidden",!!l.isHiddenByDefault);for(var c=0,f=e.length;c<f;c++){for(var h=(0,a.default)("<ol></ol>"),p=0,g=e[c].length;p<g;p++){var v=(0,a.default)("<li></li>"),m=e[c][p];m.href?(v.append((0,a.default)("<a></a>").html("<span>"+l.displayHandler(m)+"</span>").attr({href:m.href}).addClass(m.className)),a.default.data((0,a.default)("a > span",v)[0],"properties",m)):v.html(m.html).addClass(m.className),m.icon&&v.prepend((0,a.default)("<img />").attr("src",m.icon)),m.insideSpanIcon&&v.children("a").prepend((0,a.default)("<span></span>").attr("class","icon")),m.iconFontClass&&v.children("a").prepend((0,a.default)("<span></span>").addClass("aui-icon aui-icon-small aui-iconfont-"+m.iconFontClass)),a.default.data(v[0],"properties",m),h.append(v)}c===f-1&&h.addClass("last"),n.append(h)}(0,a.default)("body").append(n)}var y=function(){b(1)},w=function(){b(-1)},b=function(e){var t=!u,n=d.current.$[0],r=d.current.links,o=n.focused;if(u=!0,0!==r.length){if(n.focused="number"==typeof o?o:-1,!d.current)return i.log("move - not current, aborting"),!0;n.focused+=e,n.focused<0?n.focused=r.length-1:n.focused>=r.length&&(n.focused=0),l.moveHandler((0,a.default)(r[n.focused]),e<0?"up":"down"),t&&r.length?((0,a.default)(r[n.focused]).addClass(l.activeClass),u=!1):r.length||(u=!1)}},C=function(e){if(!d.current)return!0;var t=e.which,n=d.current.$[0],r=d.current.links;switch(d.current.cleanActive(),t){case 40:y();break;case 38:w();break;case 27:return l.escapeHandler.call(d.current,e);case 13:return!(n.focused>=0)||(l.selectionHandler?l.selectionHandler.call(d.current,e,(0,a.default)(r[n.focused])):"a"!=(0,a.default)(r[n.focused]).attr("nodeName")?(0,a.default)("a",r[n.focused]).trigger("focus"):(0,a.default)(r[n.focused]).trigger("focus"));default:return r.length&&(0,a.default)(r[n.focused]).addClass(l.activeClass),!0}return e.stopPropagation(),e.preventDefault(),!1},k=function(e){e&&e.which&&3==e.which||e&&e.button&&2==e.button||d.current&&d.current.hide("click")},x=function(e){return function(){d.current&&(d.current.cleanFocus(),this.originalClass=this.className,(0,a.default)(this).addClass(l.activeClass),d.current.$[0].focused=e)}},j=function(e){if(e.button||e.metaKey||e.ctrlKey||e.shiftKey)return!0;d.current&&l.selectionHandler&&l.selectionHandler.call(d.current,e,(0,a.default)(this))};return n.each(function(){var e=this,t=(0,a.default)(this),n={},i={reset:function(){(n=a.default.extend(n,{$:t,links:(0,a.default)(l.item||"li:has(a)",e),cleanActive:function(){e.focused+1&&n.links.length&&(0,a.default)(n.links[e.focused]).removeClass(l.activeClass)},cleanFocus:function(){n.cleanActive(),e.focused=-1},moveDown:y,moveUp:w,moveFocus:C,getFocusIndex:function(){return"number"==typeof e.focused?e.focused:-1}})).links.each(function(e){var t=(0,a.default)(this);(function(e){var t=!1;return e.data("events")&&a.default.each(e.data("events"),function(e,n){a.default.each(n,function(e,n){if(j===n)return t=!0,!1})}),t})(t)||(t.hover(x(e),n.cleanFocus),t.click(j))})},appear:function(e){e?(t.removeClass("hidden"),t.addClass("aui-dropdown-"+l.alignment)):t.addClass("hidden")},fade:function(e){e?t.fadeIn("fast"):t.fadeOut("fast")},scroll:function(e){e?t.slideDown("fast"):t.slideUp("fast")}};n.reset=i.reset,n.reset(),n.addControlProcess=function(e,t){a.default.aop.around({target:this,method:e},t)},n.addCallback=function(e,t){return a.default.aop.after({target:this,method:e},t)},n.show=function(t){l.useDisabled&&this.$.closest(".aui-dd-parent").hasClass("disabled")||(this.alignment=l.alignment,k(),d.current=this,this.method=t||this.method||"appear",this.timer=setTimeout(function(){o.click(k)},0),o.keydown(C),l.firstSelected&&this.links[0]&&x(0).call(this.links[0]),(0,a.default)(e.offsetParent).css({zIndex:s}),i[this.method](!0),(0,a.default)(document).trigger("showLayer",["dropdown",d.current]))},n.hide=function(e){return this.method=this.method||"appear",(0,a.default)(t.get(0).offsetParent).css({zIndex:""}),this.cleanFocus(),i[this.method](!1),o.unbind("click",k).unbind("keydown",C),(0,a.default)(document).trigger("hideLayer",["dropdown",d.current]),d.current=null,e},n.addCallback("reset",function(){l.firstSelected&&this.links[0]&&x(0).call(this.links[0])}),d.iframes||(d.iframes=[]),d.createShims=function e(){return(0,a.default)("iframe").each(function(e){this.shim||(this.shim=(0,a.default)("<div />").addClass("shim hidden").appendTo("body"),d.iframes.push(this))}),e}(),n.addCallback("show",function(){(0,a.default)(d.iframes).each(function(){var e=(0,a.default)(this);if(e.is(":visible")){var t=e.offset();t.height=e.height(),t.width=e.width(),this.shim.css({left:t.left+"px",top:t.top+"px",height:t.height+"px",width:t.width+"px"}).removeClass("hidden")}})}),n.addCallback("hide",function(){(0,a.default)(d.iframes).each(function(){this.shim.addClass("hidden")}),l.hideHandler()}),r.push(n)}),r}d.getAdditionalPropertyValue=function(e,t){var n=e[0];n&&"string"==typeof n.tagName&&"li"===n.tagName.toLowerCase()||i.log("dropDown.getAdditionalPropertyValue : item passed in should be an LI element wrapped by jQuery");var r=a.default.data(n,"properties");return r?r[t]:null},d.removeAllAdditionalProperties=function(e){},d.Standard=function(e){var t=[],n={selector:".aui-dd-parent",dropDown:".aui-dropdown",trigger:".aui-dd-trigger"};a.default.extend(n,e);var r=function(e,t,r,i){a.default.extend(i,{trigger:e}),t.addClass("dd-allocated"),r.addClass("hidden"),0==n.isHiddenByDefault&&i.show(),i.addCallback("show",function(){t.addClass("active")}),i.addCallback("hide",function(){t.removeClass("active")})},i=function(e,t,n,a){a!=d.current&&(n.css({top:t.outerHeight()}),a.show(),e.stopImmediatePropagation()),e.preventDefault()};if(n.useLiveEvents){var u=[],o=[];(0,a.default)(n.trigger).live("click",function(e){var t,l,s,c,f=(0,a.default)(this);if((c=a.default.inArray(this,u))>=0){var h=o[c];t=h.parent,l=h.dropdown,s=h.ddcontrol}else{if(0===(l=(t=f.closest(n.selector)).find(n.dropDown)).length)return;if(!(s=d(l,n)[0]))return;u.push(this),h={parent:t,dropdown:l,ddcontrol:s},r(f,t,l,s),o.push(h)}i(e,f,l,s)})}else(this instanceof a.default?this:(0,a.default)(n.selector)).not(".dd-allocated").filter(":has("+n.dropDown+")").filter(":has("+n.trigger+")").each(function(){var e=(0,a.default)(this),u=(0,a.default)(n.dropDown,this),o=(0,a.default)(n.trigger,this),l=d(u,n)[0];a.default.extend(l,{trigger:o}),r(o,e,u,l),o.on("click",function(e){i(e,o,u,l)}),t.push(l)});return t},d.Ajax=function(e){var t,n={cache:!0};return a.default.extend(n,e||{}),t=d.Standard.call(this,n),(0,a.default)(t).each(function(){var e=this;a.default.extend(e,{getAjaxOptions:function(t){var r=function(t){n.formatResults&&(t=n.formatResults(t)),n.cache&&e.cache.set(e.getAjaxOptions(),t),e.refreshSuccess(t)};return n.ajaxOptions?a.default.isFunction(n.ajaxOptions)?a.default.extend(n.ajaxOptions.call(e),{success:r}):a.default.extend(n.ajaxOptions,{success:r}):a.default.extend(t,{success:r})},refreshSuccess:function(e){this.$.html(e)},cache:function(){var e={};return{get:function(t){var n=t.data||"";return e[(t.url+n).replace(/[\?\&]/gi,"")]},set:function(t,n){var a=t.data||"";e[(t.url+a).replace(/[\?\&]/gi,"")]=n},reset:function(){e={}}}}(),show:function(t){return function(){n.cache&&e.cache.get(e.getAjaxOptions())?(e.refreshSuccess(e.cache.get(e.getAjaxOptions())),t.call(e)):((0,a.default)(a.default.ajax(e.getAjaxOptions())).throbber({target:e.$,end:function(){e.reset()}}),t.call(e),e.iframeShim&&e.iframeShim.hide())}}(e.show),resetCache:function(){e.cache.reset()}}),e.addCallback("refreshSuccess",function(){e.reset()})}),t},a.default.fn.dropDown=function(e,t){return d[e=(e||"Standard").replace(/^([a-z])/,function(e){return e.toUpperCase()})].call(this,t)},a.default.fn.dropDown=r.construct(a.default.fn.dropDown,"Dropdown constructor",{alternativeName:"Dropdown2"}),(0,u.default)("dropDown",d),t.default=d,e.exports=t.default},F4aK:function(e,t,n){},WCtk:function(e,t){!function(){var e=!0,t=function(){for(var e=Object.prototype.toString,t={},n={1:"element",3:"textnode",9:"document",11:"fragment"},a="Arguments Array Boolean Date Document Element Error Fragment Function NodeList Null Number Object RegExp String TextNode Undefined Window".split(" "),r=a.length;r--;){var i=a[r],u=window[i];if(u)try{t[e.call(new u)]=i.toLowerCase()}catch(e){}}return function(a){return null==a&&(void 0===a?"undefined":"null")||a.nodeType&&n[a.nodeType]||"number"==typeof a.length&&((a.callee?"arguments":a.alert&&"window")||a.item&&"nodelist")||t[e.call(a)]}}(),n=function(e){return"function"==t(e)},a=function(e,t,n){var a,r=e[t];return 1==n.type||2==n.type||3==n.type?a=function(){var e,a=null;try{e=r.apply(this,arguments)}catch(e){a=e}if(1==n.type){if(null!=a)throw a;e=n.value.apply(this,[e,t])}else 2==n.type&&null!=a?e=n.value.apply(this,[a,t]):3==n.type&&(e=n.value.apply(this,[e,a,t]));return e}:4==n.type?a=function(){return n.value.apply(this,[arguments,t]),r.apply(this,arguments)}:6==n.type?a=function(){return n.value.apply(this,arguments)}:5==n.type&&(a=function(){var e={object:this,args:Array.prototype.slice.call(arguments)};return n.value.apply(e.object,[{arguments:e.args,method:t,proceed:function(){return r.apply(e.object,e.args)}}])}),a.unweave=function(){e[t]=r,pointcut=e=a=r=null},e[t]=a,a},r=function(e,t,a){var r=[];for(var i in e){var u=null;try{u=e[i]}catch(e){}null!=u&&i.match(t.method)&&n(u)&&(r[r.length]={source:e,method:i,advice:a})}return r},i=function(t,n){var i=void 0!==t.target.prototype?t.target.prototype:t.target,u=[];if(6!=n.type&&void 0===i[t.method]){var o=r(t.target,t,n);for(var l in 0==o.length&&(o=r(i,t,n)),o)u[u.length]=a(o[l].source,o[l].method,o[l].advice)}else u[0]=a(i,t.method,n);return e?u:u[0]};jQuery.aop={after:function(e,t){return i(e,{type:1,value:t})},afterThrow:function(e,t){return i(e,{type:2,value:t})},afterFinally:function(e,t){return i(e,{type:3,value:t})},before:function(e,t){return i(e,{type:4,value:t})},around:function(e,t){return i(e,{type:5,value:t})},introduction:function(e,t){return i(e,{type:6,value:t})},setup:function(t){e=t.regexMatch}}}()},bjPS:function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var a=n("8dXc");Object.keys(a).forEach(function(e){"default"!==e&&"__esModule"!==e&&Object.defineProperty(t,e,{enumerable:!0,get:function(){return a[e]}})}),n("F4aK")}},[["bjPS","runtime","aui.splitchunk.0d131bcbf1","aui.splitchunk.444efc83be","aui.splitchunk.78b1c5d416","aui.splitchunk.54d3f16c20","aui.splitchunk.744c37ce5a","aui.splitchunk.89403fec76"]]]);;
;
/* module-key = 'com.atlassian.applinks.applinks-plugin:applinks-util-js', location = 'applinks/internal/non-amd/rest-service.js' */
// NOTE: this is used outside of Applinks. See atlassian-plugin.xml for more details about the associated restrictions

(function(AppLinksI18n, ApplinksDocs, ApplinksEvents) {
    var $ = AJS.$;

    /**
     * The triggering of AppLinks initialisation can be customised by setting a function on
     * AJS.AppLinksInitialisationBinder. The binder function should take a single argument which is a zero-arg function to
     * run and should execute this function when appropriate.
     */
    AppLinks = $.extend(window.AppLinks || {}, {
        Event: {
            NAMESPACE: 'applinks'
        },
        I18n: AppLinksI18n,
        Docs: ApplinksDocs
    });
    AppLinks.Event = $.extend(window.AppLinks.Event, ApplinksEvents);

    // Is there an overridden initialisation binder?
    if (AJS.AppLinksInitialisationBinder) {
        AppLinks.initialisationBinder = AJS.AppLinksInitialisationBinder;
    } else {
        // The default bind if no specific binder is specified
        AppLinks.initialisationBinder = function(f) {
            AJS.toInit(f);
        }
    }

    function parseJsonResponse(xhr) {
        var respJSON = xhr.responseText;
        var respObj;
        try {
            respObj = JSON.parse(respJSON);
        } catch (e) {
            console && console.error && console.error('invalid JSON response', respJSON, xhr);
        }
        return respObj || {};
    }

    var restUrlVersionMatch = new RegExp('rest/applinks(?:.*?)/(\\d\\.\\d|\\d)/');
    /**
     * Determine the REST endpoint version of a given URL.
     * @param url
     */
    function versionOf(url) {
        var results = restUrlVersionMatch.exec(url);
        return results && results.length === 2 ? results[1] : false;
    }

    AppLinks.initialisationBinder(function() {
        AppLinks = $.extend(window.AppLinks || {}, {
            failure: function(data) {
                if (data.status == 401) {
                    window.location.reload();
                } else {
                    var message = AppLinks.parseError(data);
                    var errorDivs = $('.page-error');

                    if (errorDivs.length > 0) {
                        errorDivs.html(message).fadeIn('slow');
                    } else {
                        alert('REST request failed: ' + message);
                    }
                }
            },
            jsonRequest: function(url, type, data, success, error, beforeSend) {
                if (data) {
                    data = JSON.stringify(data);
                }
                $(".page-error").fadeOut('fast');
                if (!error) error = AppLinks.failure;
                return jQuery.ajax({
                    url: url,
                    type: type,
                    data: data,
                    dataType: 'json',
                    contentType: "application/json; charset=utf-8",
                    beforeSend: beforeSend,
                    cache: false,
                    success: success,
                    error: error,
                    jsonp: false
                });
            },
            xmlRequest: function(url, type, data, success, error, beforeSend) {
                if (data) {
                    data = JSON.stringify(data);
                }
                $(".page-error").fadeOut('fast');
                if (!error) error = AppLinks.failure;
                return jQuery.ajax({
                    url: url,
                    type: type,
                    data: data,
                    dataType: 'xml',
                    contentType: "application/xml; charset=utf-8",
                    beforeSend: beforeSend,
                    cache: false,
                    success: success,
                    error: error
                });
            },
            parseError: function(errorData) {
                var error = parseJsonResponse(errorData);
                var message = error && error.message;
                if (message) {
                    return $.isArray(message) ? message.join(' ') : message;
                }
                if (errorData) {
                    return errorData.statusText ? errorData.statusText : errorData;
                }
                return 'An unknown error occurred. Check the console logs for details.';
            },
            put: function(url, data, success, error, beforeSend) {
                return AppLinks.jsonRequest(url, 'PUT', data, success, error, beforeSend);
            },
            post: function(url, data, success, error, beforeSend) {
                return AppLinks.jsonRequest(url, 'POST', data, success, error, beforeSend);
            },
            update: function(data, success, error, beforeSend) {
                var selfLink = AppLinks.self_link(data);
                /**
                 * Adapt to the version of the endpoint and the HTTP verb it uses.
                 * yes, this is not "REST-ful". The verb is wrong. It has been wrong since 2014.
                 * It is simpler to adapt than it is to release a new endpoint.
                 */
                var restMethod = versionOf(selfLink) === '1.0' ? AppLinks.put : AppLinks.post;
                restMethod(selfLink, data, success, error, beforeSend);
            },
            get: function(url, success, error, beforeSend) {
                return AppLinks.jsonRequest(url, 'GET', null, success, error, beforeSend);
            },
            getXml: function(url, success, error, beforeSend) {
                return AppLinks.xmlRequest(url, 'GET', null, success, error, beforeSend);
            },
            self_link: function(item) {
                for (var i = 0, _i = item.link.length; i < _i; i++) {
                    var link = item.link[i];
                    if (link.rel == "self") return link.href;
                }

                throw "No self-link found";
            },
            del: function(urlOrObject, success, error, beforeSend) {
                var url;
                if (typeof(urlOrObject) == 'string') url = urlOrObject;
                else url = AppLinks.self_link(urlOrObject);
                return AppLinks.jsonRequest(url, 'DELETE', null, success, error, beforeSend);
            },
            SPI: $.extend({}, {
                API_VERSION: "1.0",
                REST_RESOURCE_URL: AJS.contextPath() + "/rest/applinks/",
                BASE_URL: AJS.contextPath() + "/rest/applinks/1.0",
                OAUTH_REST_RESOURCE_URL: AJS.contextPath() + "/rest/applinks-oauth/",
                OAUTH_BASE_URL: AJS.contextPath() + "/rest/applinks-oauth/1.0",

                /**
                 * Update the API version and associated urls.
                 * @param version
                 */
                setApiVersion: function(version){
                    AppLinks.SPI.API_VERSION = version;
                    AppLinks.SPI.setBaseUrl(AppLinks.SPI.REST_RESOURCE_URL + AppLinks.SPI.API_VERSION);
                },
                setBaseUrl: function(url){
                    AppLinks.SPI.BASE_URL = url;
                },
                setOAuthBaseUrl: function(url){
                    AppLinks.SPI.OAUTH_BASE_URL = url;
                },
                /**
                 * Build a base URL for rest calls using the specified baseUrl.
                 * @param baseUrl
                 * @returns {string}
                 */
                getRemoteRestBaseUrl: function(baseUrl) {
                    return baseUrl + "/rest/applinks/" + AppLinks.SPI.API_VERSION;
                },
                /**
                 * Build a base URL for plugin servlet calls using the specified baseUrl.
                 * @param baseUrl
                 * @returns {string}
                 */
                getRemotePluginServletBaseUrl: function(baseUrl) {
                    return baseUrl + "/plugins/servlet";
                },
                getAllLinks: function(success, failure) {
                    var url = AppLinks.SPI.BASE_URL + "/applicationlink";
                    return AppLinks.get(url, success, failure);
                },
                getAllLinksWithAuthInfo: function(success, failure) {
                    var url = AppLinks.SPI.BASE_URL + "/listApplicationlinks";
                    return AppLinks.get(url, success, failure);
                },
                getApplicationLinkState: function(id, success, failure) {
                    var url = AppLinks.SPI.BASE_URL + "/listApplicationlinkstates/id/" + id;
                    return AppLinks.get(url, success, failure);
                },
                getLinksOfType: function(typeId, success, failure) {
                    var url = AppLinks.SPI.BASE_URL + "/applicationlink/type/" + typeId;
                    return AppLinks.get(url, success, failure);
                },
                tryToFetchManifest: function(url, success, failure) {
                    var restUrl = AppLinks.SPI.BASE_URL + '/applicationlinkForm/manifest.json?url=' + encodeURIComponent(url);
                    return AppLinks.get(restUrl, success, failure, function(jqxhr) {
                        jqxhr.setRequestHeader("X-Atlassian-Token", "no-check");
                    });
                },
                getManifestFor: function(id, success, failure) {
                    var url = AppLinks.SPI.BASE_URL + '/manifest/' + id + ".json";
                    return AppLinks.get(url, success, failure);
                },
                getLocalManifest: function(success, failure){
                    var url = AppLinks.SPI.BASE_URL + '/manifest.json';
                    return AppLinks.get(url, success, failure);
                },
                /**
                 * Attempt to get the Manifest of the remote application, via a direct REST call.
                 * Requires CORS enabled on the REST resource.
                 * @param url
                 * @param success
                 * @param failure
                 * @returns {*}
                 */
                getRemoteManifest: function(remoteBaseUrl, success, failure){
                    var remoteManifestUrl = AppLinks.SPI.getRemoteRestBaseUrl(remoteBaseUrl) + '/manifest.json';
                    return AppLinks.get(remoteManifestUrl, success, failure);
                },
                /**
                 * Attempt to get the OAuth Consumer Info of the remote application, via a direct call.
                 * Requires CORS enabled on the REST resource.
                 * @param url
                 * @param success
                 * @param failure
                 * @returns {*}
                 */
                getRemoteOAuthConsumerInfo: function(remoteBaseUrl, success, failure){
                    var remoteManifestUrl = AppLinks.SPI.getRemotePluginServletBaseUrl(remoteBaseUrl) + '/oauth/consumer-info';
                    return AppLinks.getXml(remoteManifestUrl, success, failure);
                },
                getApplinkStatus: function (applinkId, success, failure) {
                    var url = AppLinks.SPI.BASE_URL + '/status/' + applinkId;
                    return AppLinks.get(url, success, failure);
                },
                createStaticUrlAppLink: function(applicationType, success, failure) {
                    var restUrl = AppLinks.SPI.BASE_URL + '/applicationlinkForm/createStaticUrlAppLink?typeId=' + applicationType;
                    return AppLinks.post(restUrl, null, success, failure);
                },
                createLink: function(applicationLink, username, password, createTwoWayLink, customRpcUrl, rpcUrl, configFormValues, success, failure) {
                    var url = AppLinks.SPI.BASE_URL + '/applicationlinkForm/createAppLink';
                    var data = {
                        applicationLink: applicationLink,
                        username: username,
                        password: password,
                        createTwoWayLink: createTwoWayLink,
                        customRpcURL: customRpcUrl,
                        rpcUrl: rpcUrl,
                        configFormValues: configFormValues
                    };
                    return AppLinks.post(url, data, success, failure);
                },
                createLinkWithOrphanedTrust : function(applicationLink, username, password, createTwoWayLink, customRpcUrl, rpcUrl, configFormValues, orphanedTrust, success, failure) {
                    var url = AppLinks.SPI.BASE_URL + '/applicationlinkForm/createAppLink';
                    var data = {
                        applicationLink: applicationLink,
                        username: username,
                        password: password,
                        createTwoWayLink: createTwoWayLink,
                        customRpcURL: customRpcUrl,
                        rpcUrl: rpcUrl,
                        configFormValues: configFormValues,
                        orphanedTrust: orphanedTrust
                    };
                    return AppLinks.post(url, data, success, failure);
                },
                verifyTwoWayLinkDetails : function (remoteUrl, rpcUrl, username, password, success, failure) {
                    var url = AppLinks.SPI.BASE_URL + '/applicationlinkForm/details';
                    var data = {
                        username: username,
                        password: password,
                        remoteUrl: remoteUrl,
                        rpcUrl: rpcUrl
                    };
                    return AppLinks.post(url, data, success, failure);
                },
                getApplicationLinkInfo: function (appId, success, error) {
                    var url = AppLinks.SPI.BASE_URL + "/applicationlinkInfo/id/" + appId;
                    return AppLinks.get(url, success, error);
                },
                deleteLink: function(applicationLink, reciprocate, success, error) {
                    var url = AppLinks.SPI.BASE_URL + "/applicationlink/" + applicationLink.id;
                    if (reciprocate) url += "?reciprocate=true";
                    return AppLinks.del(url, success, error);
                },
                makePrimary: function(applicationLink, success) {
                    var url = AppLinks.SPI.BASE_URL + "/applicationlink/primary/" + applicationLink.id;
                    return AppLinks.post(url, null, success);
                },
                relocate: function(applicationLink, newUrl, suppressWarnings, success, error) {
                    var url = AppLinks.SPI.BASE_URL + "/relocateApplicationlink/" + applicationLink.id + "?newUrl=" + encodeURIComponent(newUrl) +
                        "&nowarning=" + (suppressWarnings ? "true" : "false");
                    return AppLinks.post(url, null, success, error);
                },
                legacyUpgrade: function(applicationLink, success, error) {
                    var url = AppLinks.SPI.BASE_URL + "/upgrade/legacy/" + applicationLink.id;
                    return AppLinks.post(url, null, success, error);
                },
                ualUpgrade: function(applicationLink, body, success, error) {
                    var url = AppLinks.SPI.BASE_URL + "/upgrade/ual/" + applicationLink.id;
                    return AppLinks.post(url, body, success, error);
                },
                getEntityTypesForApplicationType: function(applicationType, success, error) {
                    var url = AppLinks.SPI.BASE_URL + "/type/entity/" + applicationType;
                    return AppLinks.get(url, success, error);
                },
                getLocalEntitiesWithLinksToApplication: function(applicationLinkId, success, error) {
                    var url = AppLinks.SPI.BASE_URL + "/entitylink/localEntitiesWithLinksTo/" + applicationLinkId + ".json";
                    return AppLinks.get(url, success, error);
                },
                getEntityLinksForApplication: function(applicationLinkId, success, error) {
                    var url = AppLinks.SPI.BASE_URL + "/entities/" + applicationLinkId + ".json";
                    AppLinks.get(url, success, error);
                },
                getEntityLinksForApplicationUsingAnonymousAccess: function(applicationLinkId, success, error) {
                    var url = AppLinks.SPI.BASE_URL + "/entities/anonymous/" + applicationLinkId + ".json";
                    return AppLinks.get(url, success, error);
                },
                createNonUalEntityLink: function(localType, localKey, applicationId, remoteTypeId, remoteKey, name, success, error) {
                    var url = AppLinks.SPI.BASE_URL + "/entitylink/" + localType + "/" + localKey + "?reciprocate=false";
                    var data = {
                        applicationId: applicationId,
                        typeId: remoteTypeId,
                        key: remoteKey,
                        name: name,
                        isPrimary: false
                    };
                    return AppLinks.put(url, data, success, error);
                },
                createEntityLink: function(localType, localKey, entity, reciprocate, success, failure) {
                    var url = AppLinks.SPI.BASE_URL + "/entitylink/" + localType + "/" + localKey + "?reciprocate=";
                    url += (reciprocate ? "true" : "false");
                    return AppLinks.put(url, entity, success, failure);
                },
                getConfiguredEntityLinks: function(localType, localKey, success, error) {
                    var url = AppLinks.SPI.BASE_URL + "/entitylink/primaryLinks/" + localType + "/" + localKey + ".json";
                    return AppLinks.get(url, success, error);
                },
                deleteEntityLink: function(localTypeId, localKey, entity, reciprocate, success, error) {
                    var url = AppLinks.SPI.BASE_URL + "/entitylink/" + localTypeId + "/" + localKey + "?typeId=" + entity.typeId + "&key=" + entity.key + "&applicationId=" + entity.applicationId + "&reciprocate=" + reciprocate;
                    return AppLinks.del(url, success, error);
                },
                makePrimaryEntityLink: function(localTypeID, localKey, entity, success, error) {
                    var url = AppLinks.SPI.BASE_URL + "/entitylink/primary/" + localTypeID + "/" + localKey + "?typeId=" + entity.typeId + "&key=" + entity.key + "&applicationId=" + entity.applicationId;
                    return AppLinks.post(url, null, success, error);
                },
                canDeleteAppLink: function(applicationId, success, error) {
                    var url = AppLinks.SPI.BASE_URL + "/permission/reciprocate-application-delete/" + applicationId;
                    return AppLinks.get(url, success, error);
                },
                canDeleteEntityLink: function(localTypeId, localKey, entity, success, error) {
                    var url = AppLinks.SPI.BASE_URL + "/permission/reciprocate-entity-delete/" + entity.applicationId + "/" + localTypeId + "/" + localKey + "/" + entity.typeId + "/" + entity.key;
                    return AppLinks.get(url, success, error);
                },
                canCreateReciprocateEntityLink: function(applicationId, success, error) {
                    var url = AppLinks.SPI.BASE_URL + "/permission/reciprocate-entity-create/" + applicationId;
                    return AppLinks.get(url, success, error);
                },
                processPermissionCode: function(settings) {
                    var config = {
                        noPermission: function() {},
                        missing: function() {},
                        credentialsRequired: function(authUrl) {},
                        authenticationFailed: function(authUrl) {},
                        noAuthentication: function(authUrl) {},
                        noAuthenticationConfigured: function() {},
                        noConnection: function() {},
                        allowed: function() {},
                        unrecognisedCode: function(code) {},
                        updateView: function(message, icon, button) {}
                    };

                    if (!settings) settings = {};

                    settings = $.extend(config, settings);

                    return function(data) {
                        var code = data.code;
                        if (code == "NO_PERMISSION") {
                            settings.noPermission();
                        } else if (code == "MISSING") {
                            settings.missing();
                        } else if (code == "CREDENTIALS_REQUIRED") {
                            settings.credentialsRequired(data.url);
                        } else if (code == "AUTHENTICATION_FAILED") {
                            settings.authenticationFailed(data.url);
                        } else if (code == "NO_AUTHENTICATION") {
                            settings.noAuthentication(data.url);
                        } else if (code == "NO_AUTHENTICATION_CONFIGURED") {
                            settings.noAuthenticationConfigured();
                        } else if (code == "NO_CONNECTION") {
                            settings.noConnection();
                        } else if (code == "ALLOWED") {
                            settings.allowed();
                        } else {
                            settings.unrecognisedCode(data.code);
                        }
                    };
                },
                addAuthenticationTrigger: function(target, authUrl, callbacks) {
                    if (!callbacks) {
                        callbacks = {};
                    }

                    if (typeof callbacks.onSuccess == "undefined") {
                        callbacks.onSuccess = function() {
                            location.reload();
                        }
                    }

                    if (typeof callbacks.onFailure == "undefined") {
                        callbacks.onFailure = function() {
                            return true;
                        }
                    }
                    //Unbind previous click listener, otherwise we might end up opening multiple windows.
                    $(target).off('click.applinks');
                    $(target).on('click.applinks', function() {
                        if (callbacks.before) {
                            callbacks.before();
                        }
                        AppLinks.authenticateRemoteCredentials(authUrl, callbacks.onSuccess, callbacks.onFailure);
                    });
                },
                deleteOrphanedTrust: function(id, type, success, error) {
                    var url = AppLinks.SPI.BASE_URL + "/orphaned-trust/" + type + "/" + id;
                    return AppLinks.del(url, success, error);
                },
                getOrphanedTrust: function(success, error) {
                    var url = AppLinks.SPI.BASE_URL + "/orphaned-trust/";
                    return AppLinks.get(url, success, error);
                },
                showCreateEntityLinkSuggestion: function() {
                    return true;
                },
                getApplicationLink: function(id, success, failure) {
                    var url = AppLinks.SPI.BASE_URL + '/applicationlink/' + id;
                    return AppLinks.get(url, success, failure);
                },
                createApplicationLink: function(id, name, rpcUrl, displayUrl, typeId, success, failure) {
                    var url = AppLinks.SPI.BASE_URL + '/applicationlink';
                    var data = {
                        id: id,
                        name: name,
                        rpcUrl: rpcUrl,
                        displayUrl: displayUrl,
                        typeId: typeId
                    };
                    return AppLinks.put(url, data, success, failure);
                },
// TODO APLDEV-3 extract OAuth creation code into OAuth specific js files in the Oauth plugin.
                createConsumer: function(id, key, name, description, sharedSecret, publicKey, twoLOAllowed, executingTwoLOUser, twoLOImpersonationAllowed, outgoing, success, failure) {
                    var url = AppLinks.SPI.OAUTH_BASE_URL + '/applicationlink/' + id + '/authentication/consumer';
                    var data = {
                        key: key,
                        name: name,
                        description: description,
                        sharedSecret: sharedSecret,
                        publicKey: publicKey,
                        outgoing: outgoing,
                        twoLOAllowed: twoLOAllowed,
                        executingTwoLOUser: executingTwoLOUser,
                        twoLOImpersonationAllowed: twoLOImpersonationAllowed
                    };
                    return AppLinks.put(url, data, success, failure);
                },
                createConsumerAutoConfigure: function(id, twoLOAllowed, executingTwoLOUser, twoLOImpersonationAllowed, success, failure) {
                    var url = AppLinks.SPI.OAUTH_BASE_URL + '/applicationlink/' + id + '/authentication/consumer?autoConfigure=true';
                    var data = {
                        twoLOAllowed: twoLOAllowed,
                        executingTwoLOUser: executingTwoLOUser,
                        twoLOImpersonationAllowed: twoLOImpersonationAllowed
                    };
                    return AppLinks.put(url, data, success, failure);
                },
                registerProvider: function(id, provider, config, success, failure) {
                    var url = AppLinks.SPI.BASE_URL + '/applicationlink/' + id + '/authentication/provider';
                    var data = {
                        config : config,
                        provider : provider
                    };
                    return AppLinks.put(url, data, success, failure);
                },
                enableFeature: function(featureName, success, failure) {
                    var url = AppLinks.SPI.BASE_URL + '/features/' + featureName;
                    return AppLinks.put(url, {}, success, failure);
                },
                disableFeature: function(featureName, success, failure) {
                    var url = AppLinks.SPI.BASE_URL + '/features/' + featureName;
                    return AppLinks.del(url, success, failure);
                }
            }, (window.AppLinks && window.AppLinks.SPI) || {})
        });

        AppLinks.UI = {
            showInfoBox: function(message) {
                $('.aui-message.aui-message-success').remove();
                AppLinks.UI.createMessage('success', message, 'page-info');
            },
            hideInfoBox: function() {
                $('.aui-message.aui-message-success').remove();
            },
            showErrorBox: function(message) {
                AppLinks.UI.createMessage('error', message, 'page-error');
            },
            hideErrorBox: function() {
                $('.aui-message.aui-message-error').remove();
            },
            showWarningBox: function(messages) {
                if ($.isArray(messages) && messages.length > 0) {
                    var ulEl = $("<ul></ul>");
                    $(messages).each(function(index) {
                        ulEl.append($("<li/>", {
                            text: messages[index]
                        }));
                    });
                    var messageEl = $('<div class="page-warning"></div>').append(ulEl);
                    AppLinks.UI.createMessage('warning', messageEl.html(), 'page-warning');
                } else {
                    AppLinks.UI.createMessage('warning', messages, 'page-warning');
                }
            },
            hideWarningBox: function() {
                $('.aui-message.aui-message-warning').remove();
            },
            shortenString: function(message, maxLength) {
                if (message.length  > maxLength) {
                    message = message.substring(0, maxLength) + "...";
                }
                return message;
            },
            createMessage: function(type, message, cssClass) {
                var messageEl = $('<div class="' + cssClass + '">');
                messageEl.html(message);
                AJS.messages[type](".applinks-message-bar", {
                    title: "",
                    body: messageEl.wrap('<div></div>').parent().html(),
                    closeable: true
                });
                $(document).trigger(AppLinks.Event.Legacy.MESSAGE_BOX_DISPLAYED);
            },
            displayValidationErrorMessages: function (errorClass, rootEl, messages) {
                if ($.isArray(messages)) {
                    $(messages).each(function(i,v) {
                        var d = $('<div class="error applinks-error">');
                        d.text(v);
                        $(rootEl).find("." + errorClass).append(d);
                    });
                } else if(typeof messages != 'undefined'){
                    var d = $('<div class="error applinks-error">');
                    d.text(messages.toString());
                    $(rootEl).find("." + errorClass).append(d);
                }
            },
            displayValidationError: function(errorClass, rootEl, errorFn) {
                return function(xhr) {
                    if (xhr.status == 401) {
                        window.location.reload();
                        return;
                    }
                    $('.applinks-error').remove();
                    $('aui-spinner').remove();

                    var respObj = parseJsonResponse(xhr);
                    var messages = respObj.message;

                    if (typeof respObj.fields == "undefined") {
                        AppLinks.UI.displayValidationErrorMessages(errorClass, rootEl, messages);
                    } else {
                        var fields = respObj.fields;
                        $(fields).each(function(index) {
                            var d = $('<div class="error applinks-error" id="' + fields[index] + '-error">');
                            d.text(messages[index]);
                            if ($(rootEl).find('.' + fields[index]).length > 0) {
                                d.insertAfter($(rootEl).find('.' + fields[index]));
                            } else {
                                d.insertAfter($(rootEl).find('.' + errorClass).append(d));
                            }
                        });
                    }
                    $(rootEl).find('.' + errorClass).addClass("fully-populated-errors");
                    if (errorFn) {
                        errorFn();
                    }
                }
            },
            addProtocolToURL : function(url) {
                var newUrl = $.trim(url);
                var tempURL = newUrl.toLowerCase();
                var hasProtocol = false;
                if (tempURL.length >= 7) {
                    if (tempURL.substring(0,7).indexOf('http') != -1) {
                        hasProtocol = true;
                    }
                }
                //default protocol is http
                if (!hasProtocol) {
                    newUrl = 'http://' + newUrl;
                }
                return newUrl;
            },
            /**
             * Similar to the standard Javascript join() method, but nicer in that
             * it uses a different delimiter for the last node (by default "and"),
             * so that:
             * {code}
             * "1, 2 and 3" == prettyJoin(['1', '2', '3'], function(value) {return value;});
             * {code}
             *
             * @param inputArray
             * @param resolveFn
             * @param finalDelimiter
             */
            prettyJoin : function(inputArray, resolveFn, finalDelimiter) {
                if (!finalDelimiter) {
                    finalDelimiter = "and";
                }
                var maxLength = inputArray.length;
                var message = "";
                $.each(inputArray, function(index, value) {
                    if (index == (maxLength - 1) && maxLength > 1) {
                        message += " " + finalDelimiter + "  " + resolveFn(value);
                    } else {
                        message += resolveFn(value);
                        if (index + 2 < maxLength) {
                            message += ", ";
                        }
                    }
                });
                return message;
            },
            showLoadingIcon: function(element) {
                $('<aui-spinner size="small" class="applinks-loading"></aui-spinner>').insertBefore(element);
            },
            hideLoadingIcon: function(element) {
                $(element).prev('aui-spinner').remove();
            },
            findUrl: function(text) {
                var url = undefined;
                var lcText = text.toLowerCase();
                var startOfUrl = lcText.indexOf('http:');
                if (startOfUrl == -1) {
                    startOfUrl = lcText.indexOf('https:');
                }
                if (startOfUrl > -1) {
                    var endOfUrl = lcText.indexOf(' ', startOfUrl);
                    if (endOfUrl == -1) {
                        endOfUrl = lcText.length;
                    }
                    url = text.substring(startOfUrl, endOfUrl); // use _case-sensitive_ version to retrieve the actual URL
                }
                return url;
            },
            findApplicationType : function(id) {
                id = id.toLowerCase();
                if (id.indexOf("jira") != -1) {
                    return "jira";
                } else if (id.indexOf("fisheye") != -1) {
                    return "fecru";
                } else if (id.indexOf("confluence") != -1) {
                    return "confluence";
                } else if (id.indexOf("refapp") != -1) {
                    return "refapp";
                } else {
                    return undefined;
                }
            },
            escapeSelector: function(selector) {
                // based on http://samuelsjoberg.com/archive/2009/09/escape-jquery-selectors
                return selector.replace(/([#;&,\.\+\*\~':"\!\^$\[\]\(\)=>\|])/g, "\\$1");
            },
            sanitiseHTML: function(input) {
                var replacements = {
                    "<": "&lt;",
                    '"': "&quot;",
                    "&": "&amp;"
                };
                return input.replace(/[<"&]/g, function(match) {
                    return replacements[match];
                });
            },
            refreshOrphanedTrust: function() {
                // post dialog -- check whether we need to remove any orphaned-trust entries
                var updateOrphanedTrust = function(data) {
                    $("tr.orphaned-trust-row").each(function() {
                        var $this = $(this);
                        var id = $this.attr("data-id");
                        var type = $this.attr("data-type");
                        var stillExists = false;
                        for (var i = 0; i < data.orphanedTrust.length; i++) {
                            var ot = data.orphanedTrust[i];
                            if (id == ot.id && type == ot.type) {
                                stillExists = true;
                                break;
                            }
                        }
                        if (!stillExists) {
                            $this.remove();
                            if (data.orphanedTrust.length == 0) {
                                // we just removed the last orphaned trust cert, hide warning!
                                $(".orphaned-trust-warning").hide();
                            }
                        }
                    });
                };

                AppLinks.SPI.getOrphanedTrust(updateOrphanedTrust);
            },
            removeCssClass: function(element, prefix) {
                $(element).removeClass( function(index, className) {
                    var classes = className.split(' ');
                    var classToRemove = "";
                    $.each(classes, function(index, value) {
                        if (value.indexOf(prefix) != -1) {
                            classToRemove = value;
                        }
                    });
                    return classToRemove;
                } );
            }
        };

        /**
         * Add jQuery event system to AppLinks.UI namespace.
         */
        (function(){
            var eventBus = $({});
            $.each(['bind', 'unbind', 'trigger'], function(i, current){
                AppLinks.UI[current] = function(){
                    return eventBus[current].apply(eventBus, arguments);
                }
            });
        })();

        $(document).trigger(AppLinks.Event.PREREADY);
        $(document).trigger(AppLinks.Event.READY);
    });
})(require('applinks/common/i18n'), require('applinks/common/docs'), require('applinks/common/events'));
;
;
/* module-key = 'com.atlassian.applinks.applinks-plugin:applinks-util-js', location = 'applinks/internal/non-amd/autocomplete.js' */
// NOTE: this is used outside of Applinks. See atlassian-plugin.xml for more details about the associated restrictions

AJS.$(document).bind(AppLinks.Event.READY, function() {
/**
 * TODO: THIS CODE IS COPIED FROM CONFLUENCE and should be part of AUI/AJS.
 * IF AUI comes with the InputDrivenDropDown when can remove this file.
 * https://studio.atlassian.com/browse/AJS-471
 *
 * A simple cache manager that supports a
 * FIFO cache invalidation strategy.
 *
 * @class cacheManager
 * @namespace AJS.Confluence
 * @constructor
 * @param cacheSize the size of the cache before keys are invalidated
 */
AppLinks.autoComplete = {
        cacheManager : function (cacheSize) {
    var cache = {},
        cacheStack = [],
        cacheSize = cacheSize || 30;

    return {
        /**
         * Return the value stored in the cache for the given key
         * @method get
         * @param key {String}
         */
        get: function(key) {
            return cache[key];
        },
        /**
         * Put the given key, value in the cache
         * @method put
         * @param key {String}
         * @param value {Object}
         */
        put: function(key, value) {
            cache[key] = value;
            cacheStack.push(key);
            if (cacheStack.length > cacheSize) {
                delete cache[cacheStack.shift()];
            }
        },
        /**
         * Clear the cache.
         */
        clear : function() {
            cache = {};
            cacheStack = [];
        }
    };
}};


(function($){
    /**
     * Check that all items in the drop down can be displayed - show ellipses at the end of any that
     * are too long. Also remove any unused properties that the dropDown may have stored for each
     * item in the list.
     *
     * @method truncateText
     * @private
     */
    var truncateText = function (dd) {
        AJS.log("InputDrivenDropDown: truncating text");
        var width = dd.$.closest(".aui-dropdown").width(),
            rightPadding = 20; // add some padding so the ellipsis doesn't run over the edge of the box

        $("a span:not(.icon)", dd.$).each(function () {
            var $a = $(this),
                elpss = $("<var></var>").html("&#8230;"),
                elwidth = elpss.width(),
                isLong = false;

            $a.wrapInner($("<em>"));
            $("em", $a).each(function () {
                var $label = $(this);

                $label.show();
                if (this.offsetLeft + this.offsetWidth > width) {
                    var childNodes = this.childNodes,
                        success = false;

                    for (var j = childNodes.length - 1; j >= 0; j--) {
                        var childNode = childNodes[j],
                            truncatedChars = 1,
                            valueAttr = (childNode.nodeType == 3) ? "nodeValue" : "innerHTML",
                            nodeText = childNode[valueAttr];

                        do {
                            if (truncatedChars <= nodeText.length) {
                                childNode[valueAttr] = nodeText.substr(0, nodeText.length - truncatedChars++);
                            } else { // if we cannot fit even one character of the next word, then try truncating the node just previous to this
                                break;
                            }
                        } while (this.offsetLeft + this.offsetWidth + elwidth > width - rightPadding);

                        if (truncatedChars <= nodeText.length) {
                            // we've managed truncate part of the word and fit it in
                            success = true;
                            break;
                        }
                    }

                    if (success) {
                        isLong = true;
                    } else {
                        $label.hide();
                    }
                }
            });
            if (isLong) {
                $a.append(elpss);
                this.elpss = elpss;
            }
        });
    };

    var highlightTokens = function(dd, tokens) {
        if (!tokens.length || !tokens[0]) return;

        AJS.log("InputDrivenDropDown: highlighting tokens");

        // escape regex chars .*+?|()[]{}\ first
        for (var i = 0, ii = tokens.length; i < ii; i++) {
            var token = tokens[i];
            tokens[i] = token ? token.replace(/[\.\*\+\?\|\(\)\[\]{}\\]/g, "\\$") : "";
        }

        var regex = new RegExp("(" + tokens.join("|") + ")", "gi");

        $("li a:not(.dropdown-prevent-highlight) span", dd.$).each(function() {
            var span = $(this),
                html = span.html().replace(regex, "<strong>$1</strong>");
            span.html(html);
        });
    };

    /**
     * Builds and shows the dropdown.
     *
     * @param idd the InputDrivenDropdown
     * @param dropdownData in the form { matrix, query, queryTokens }
     * @private
     */
    var makeDropdown = function (idd, dropdownData) {
        var options = idd.options,
            old_dd = idd.dd;

        if (old_dd) {
            old_dd.hide();
            old_dd.$.remove();
        }

        options.ajsDropDownOptions = options.ajsDropDownOptions || {};
        if (options.ajsDropDownOptions && !options.ajsDropDownOptions.alignment) { // default to left alignment
            options.ajsDropDownOptions.alignment = "left";
        }
        //this needs to be moved into aui
        options.ajsDropDownOptions.selectionHandler = options.ajsDropDownOptions.selectionHandler || function(e, element) {
            if(e.type != "click") {
                e.preventDefault();
                $("a",element).click();
                document.location = $("a",element).attr("href");
            }
        };

        /* Fixing an AUI bug in here:  AJS.dropdown puts the raw 'matrix[i].name' as html, without escaping it !
           The solution is to override their displayHandler
         */
        /**
         * Escape obj.name and return it
         */
        options.ajsDropDownOptions.displayHandler = function (obj) {
            return AJS.escapeHtml(obj.name);
        }

        var dd = idd.dd = new AJS.dropDown(dropdownData.matrix, options.ajsDropDownOptions)[0];

        // could move into dropdown.js in AUI
        if (options.ajsDropDownOptions && options.ajsDropDownOptions.className) {
            dd.$.addClass(options.ajsDropDownOptions.className);
        }

        // place the created drop down using the configured dropdownPlacement function
        // if there is none then use a default behaviour
        if (options.dropdownPlacement) {
            options.dropdownPlacement(dd.$);
        } else {
            AJS.log("No dropdownPlacement function specified. Appending dropdown to the body.");
            $("body").append(dd.$);
        }

        highlightTokens(dd, dropdownData.queryTokens || [dropdownData.query]);
        truncateText(dd);

        if (options.dropdownPostprocess) {
            options.dropdownPostprocess(dd.$);
        }
        dd.show(idd._effect);

        if (typeof options.onShow == "function") {
            options.onShow.call(dd, dd.$);
        }

        return dd;
    };

    /**
     * Provides a controller-agnostic object that listens for controller changes and populates a dropdown
     * via a callback. Most aspects can be customized via the options object parameter.
     * <br>
     * Options are:
     * <li>
     *   getDataAndRunCallback - (required) callback method used to provide data for the dropdown. It must take
     *                          two parameters, user input value and the callback function to execute.
     * </li>
     * <li>
     *   onShow - function to call when the drop-down is displayed
     * </li>
     * <li>
     *   dropdownPlacement - a function that will be called with the drop down and which should place it in the
     *                          correct place on the page. The supplied arguments are 1) the input that issued the
     *                          search, 2) the dropDown to be placed.
     * </li>
     * <li>
     *   ajsDropDownOptions - any options the underlying dropDown component can handle expects
     * </li>
     * <li>
     *   onDeath - callback to run when dropdown dies
     * </li>
     * @class InputDrivenDropDown
     * @namespace AJS
     */
    function InputDrivenDropDown(id, options) {
        this._effect = "appear";
        this._timer = null;

        this.id = id;
        this.options = options;
        this.inactive = false;
        this.busy = false;
        this.cacheManager = AppLinks.autoComplete.cacheManager();
    }

    /**
     * Clears the cache.
     */
    InputDrivenDropDown.prototype.clearCache = function () {
        this.cacheManager.clear();
    };

    /**
     * This method should be called when the user input for this dropdown has changed.
     * It will check the cache before fetching data (via options.getDataAndRunCallback)
     * and displaying the dropdown.
     *
     * @param value {String} the new value of the user input
     * @param force {Boolean} force a change to occur regardless of user input
     */
    InputDrivenDropDown.prototype.change = function (value, force) {
        var t = this;
        if (value != t._value || force) {
            t._value = value;
            t.busy = false;

            clearTimeout(t._timer);

            if (force || (/\S{0,}/).test(value)) {
                var cachedVal = t.cacheManager.get(value);
                if (cachedVal) {
                    makeDropdown(t, cachedVal);
                } else {
                    t.busy = true;
                    t._timer = setTimeout(function () { // delay sending a request to give the user a chance to finish typing their search term(s)
                        t.options.getDataAndRunCallback.call(t, value, t.show);
                    }, 200);
                }
            } else {
                t.dd && t.dd.hide();
            }
        }
    };

    /**
     * Gets the number of visible options in the dropdown.
     */
    InputDrivenDropDown.prototype.dropDownLength = function () {
        return this.dd.links ? this.dd.links.length : 0;
    };
    
    /**
     * Gets the specified menu item from the dropdown list.
     * 
     * @param index {Integer} the 0-based index of the dropdown option list
     */
    InputDrivenDropDown.prototype.dropDownItem = function (index) {
        return this.dropDownLength() > index ? this.dd.links[index] : null;
    };
    
    /**
     * Hides the drop down
     */
    InputDrivenDropDown.prototype.hide = function () {
        this.dd && this.dd.hide();
    };

    /**
     * Hides and removes the drop down from the DOM.
     */
    InputDrivenDropDown.prototype.remove = function () {
        var dd = this.dd;
        if (dd) {
            this.hide();
            dd.$.remove();
        }
        this.inactive = true;
        this.options.onDeath && this.options.onDeath();
    };

    /**
     * Shows the drop down with the given matrix data and query.
     * <br>
     * Matrix property should be an array of arrays, where the sub-arrays represent the different
     * search categories.
     *
     * Expected properties of category sub-array objects are:
     *  - href
     *  - name
     *  - className
     *  - html (optional, replaces href and name)
     *  - icon (optional)
     *
     *
     * @param matrix {Array} matrix to populate the drop down from
     * @param query {String} the user input string that triggered this show
     * @param queryTokens {Array} an array of strings of the query tokens. Use for highlighting search terms.
     */
    InputDrivenDropDown.prototype.show = function (matrix, query, queryTokens) {
        if (this.inactive) {
            AJS.log("Quick search abandoned before server response received, ignoring. " + this);
            return;
        }

        var dropdownData = {
            matrix: matrix,
            query: query,
            queryTokens: queryTokens
        };
        this.cacheManager.put(query, dropdownData);

        makeDropdown(this, dropdownData);
        this.busy = false;
    };

    /**
     * Returns an InputDrivenDropDown. See InputDrivenDropDown for more documentation.
     * @param options {Object} options for the InputDrivenDropDown
     * @constructor
     */
    AppLinks.inputDrivenDropdown = function (options) {
        return new InputDrivenDropDown("inputdriven-dropdown", options);
    };

})(jQuery);
});
;
;
/* module-key = 'com.atlassian.applinks.applinks-plugin:applinks-util-js', location = 'js/fecru-compatibility.js' */
if (jQuery != undefined && AJS != undefined) jQuery = AJS.$; // make sure we're extending the correct jQuery;
;
/* module-key = 'com.atlassian.applinks.applinks-plugin:feature-oauth-dance', location = 'applinks/internal/feature/oauth/oauth-callback.js' */
define('applinks/feature/oauth-callback', [
    'applinks/lib/window',
    'applinks/lib/lodash',
    'applinks/common/preconditions'
], function(
    window,
    _,
    Preconditions
) {
    function OAuthCallback(url) {
        Preconditions.nonEmptyString(url, 'url');
        this._url = url;
    }

    OAuthCallback.prototype.source = function(source) {
        Preconditions.hasValue(source, 'source');
        this._source = source;
        return this;
    };

    OAuthCallback.prototype.onSuccess = function(callback) {
        Preconditions.isFunction(callback, 'onSuccess');
        this._onSuccess = callback;
        return this;
    };

    OAuthCallback.prototype.onFailure = function(callback) {
        Preconditions.isFunction(callback, 'onFailure');
        this._onFailure = callback;
        return this;
    };

    // API for OAuth to invoke callbacks
    OAuthCallback.prototype.success = function() {
        this.oauthWindow.close();
        if (this._onSuccess) {
            this._onSuccess(this._source);
        }
        // free up the oauthCallback object
        delete window.oauthCallback;
    };

    OAuthCallback.prototype.failure = function() {
        this.oauthWindow.close();
        if (this._onFailure) {
            this._onFailure(this._source);
        }
        // free up the oauthCallback object
        delete window.oauthCallback;
    };

    // start the dance
    OAuthCallback.prototype.open = function() {
        // required for OAuth callbacks to fire
        window.oauthCallback = this;
        this.oauthWindow = window.open(this._url, 'com_atlassian_applinks_authentication');
    };

    return OAuthCallback;
});;
;
/* module-key = 'com.atlassian.applinks.applinks-plugin:feature-oauth-dance', location = 'applinks/internal/feature/oauth/oauth-dance.js' */
define('applinks/feature/oauth-dance', [
    'applinks/lib/console',
    'applinks/lib/jquery',
    'applinks/lib/lodash',
    'applinks/lib/window',
    'applinks/common/events',
    'applinks/common/preconditions',
    'applinks/feature/oauth-callback'
], function(
    console,
    $,
    _,
    window,
    ApplinksEvents,
    Preconditions,
    OAuthCallback
) {
    /**
     * Creates a new OAuth Dance. This initializes elements found by `selector` within `scope` to initiate the OAuth
     * dance on click. The elements need to have a `data-authorisation-uri` attribute that points to the authorisation
     * page to open.
     *
     * @param scope {string} optional selector for scope, if not defined then global `document` will be used
     * @param selector {string} selector for the DOM elements to initialize OAuth dance for. If not defined then scope will be used
     * @constructor
     */
    function OAuthDance(scope, selector) {
        this._scope = scope || window.document;
        this._selector = selector;
    }

    OAuthDance.prototype.onSuccess = function(callback) {
        Preconditions.isFunction(callback, 'onSuccess');
        this._onSuccess = callback;
        return this;
    };

    OAuthDance.prototype.onFailure = function(callback) {
        Preconditions.isFunction(callback, 'onFailure');
        this._onFailure = callback;
        return this;
    };

    OAuthDance.prototype.defaultSuccess = function() {
        return this.onSuccess(function() {
            window.location.reload()
        });
    };

    OAuthDance.prototype.defaultFailure = function() {
        return this.onFailure(function() { return true });
    };

    /**
     * Wire up click events for the selected elements to initiate OAuth dance.
     */
    OAuthDance.prototype.initialize = function() {
        var that = this;
        if (this._selector) {
            $(this._scope).on('click', this._selector, function(e) {
                e.preventDefault();
                that._open($(this));
            });
        } else {
            $(this._scope).on('click', function(e) {
                e.preventDefault();
                that._open($(this));
            });
        }
    };

    /**
     * Start the OAuth dance for the given selector/scope.
     */
    OAuthDance.prototype.start = function() {
        var $scope = $(this._scope);
        var $element = this._selector ? $scope.find(this._selector) : $scope;
        this._open($element);
    };

    OAuthDance.prototype._open = function(element) {
        if (element.length !== 1) {
            console.warn('Could not trigger OAuth dance, the source is not a single HTML element: ' + element);
            return;
        }
        
        var authorisationUri = element.attr('data-authorisation-uri');

        if (authorisationUri) {
            this._onSuccess || this.defaultSuccess();
            this._onFailure || this.defaultFailure();
            new OAuthCallback(authorisationUri)
                .source(element)
                .onSuccess(this._onSuccess)
                .onFailure(this._onFailure)
                .open();
        } else {
            console.warn('Could not trigger OAuth dance, data-authorisation-uri missing for: ' + element);
        }
    };

    return OAuthDance;
});;
;
/* module-key = 'com.atlassian.applinks.applinks-plugin:applinks-oauth-ui', location = 'js/oauth-dialog.js' */
// NOTE: this is used outside of Applinks. See atlassian-plugin.xml for more details about the associated restrictions

/**
 * @deprecated use applinks/feature/oauth-callback and applinks/feature/oauth-dance AMD module
 */
(function($, ApplinksEvents, OAuthCallback) {
    // rest-service.js will load the AppLinks name space
    AppLinks.authenticateRemoteCredentials = function (url, onSuccess, onFailure) {
        $('.applinks-error').remove();
        new OAuthCallback(url).onSuccess(onSuccess).onFailure(onFailure).open();
    };
})(require('applinks/lib/jquery'), require('applinks/common/events'), require('applinks/feature/oauth-callback'));
;
;
/* module-key = 'com.atlassian.integration.jira.jira-integration-plugin:jira-create-issue-form', location = '/jira-create-issue-form/jira-create-issue-form.js' */
define("jira-integration-plugin/jira-create-issue-form",["jquery","jira-integration-plugin/custom-lodash","jira-integration-plugin/jira-create-issue-form-data","jira-integration-plugin/jira-create-issue-form-field-helper","jira-integration-plugin/fields",],function(a,g,c,e,h){var f=window.jiraIntegration.templates;d.defaults={allowUnsupportedFields:false,ignoreFieldsWithDefaultValue:true,excludedField:["project","issuetype","reporter"],formClass:"jira-interation-create-issue-form",requiredFieldsOnly:true,renderSummaryAndDescription:false,get$unsupportedFieldMessage:function(j,k){return a(f.jiraCreateIssueForm.unsupportedFieldsMessage({unsupportedFields:j,createIssueUrl:k,}))},get$unexpectedError:function(j){return a(aui.message.error({content:AJS.escapeHtml(j)}))},get$communicationError:function(j){return a(f.jiraCreateIssueForm.communicationErrorMessage({message:j,}))},get$unauthorizeMessage:function(j){return a(f.jiraCreateIssueForm.authorize({extraClasses:"jira-oauth-dialog",applicationName:j,}))},get$unsupportedServerMessage:function(j){return a(f.jiraCreateIssueForm.unsupportedServerMessage({serverUrl:j,}))},get$unrenderableRequiredFieldsMessage:function(k,j){var l=k.map(function(m){return AJS.escapeHtml(m.name)}).join(", ");return a(f.jiraCreateIssueForm.unrenderableRequiredFieldsMessage({names:l,count:k.length,serverUrl:j,}))},ajax:function(j){alert("JiraCreateIssueForm requires the option 'ajax(options)' to be specified and respond like jQuery.ajax.\nThis method should handle response status codes other than 200 and 500 (those are handled by us).")},};function d(j){this.configuration=g.extend({},d.defaults,j);if(this.configuration.renderSummaryAndDescription){this.configuration.excludedField.push("summary","description")}this._init()}d.prototype._trigger=function(j,k){var l=this.configuration[j];if(l){l.apply(this,Array.prototype.slice.call(arguments,1))}};d.prototype._selectServer=function(j,l){var k=this;if(this.currentServerId===j&&!l){return}this.currentServerId=j;this.formIsLoading(this.defaultFields.server);c.isIssueCreationSupported(j,this.configuration.ajax).done(function(m){if(m){k._loadProjectData(j);k.formLoadingCompleted(k.defaultFields.server)}else{var n=c.getServerById(j).displayUrl;k._handleUnsupportedServer(n)}}).fail(function(m){if(m[0]&&m[0].authenticationUri){k._handleAuthorizeError(m[0])}else{k._handleAjaxError(m)}})};d.prototype._bindEventListener=function(){var j=this;this.defaultFields.server.on("change",function(l){j.fieldValues=g.extend({},j.fieldValues,j._getFieldValues());j.resetForm(true);var k=this.value;if(k){j._selectServer(k)}else{e.resetSelectField(j.defaultFields.project);j.defaultFields.project.trigger("change")}j._trigger("onServerChanged",this.value)});this.defaultFields.project.on("change",function(){var l=this.value||a(this).select2("data").value;var k=a(j.defaultFields.issueType).select2("data");j.fieldValues=g.extend({},j.fieldValues,j._getFieldValues());if(l){a('option[value=""]',j.defaultFields.project).remove();j._loadIssueType(j.currentServerId,l,k)}else{e.resetSelectField(j.defaultFields.issueType)}j.defaultFields.issueType.trigger("change");j._trigger("onProjectChanged",this.value)});this.defaultFields.issueType.on("change",function(){j.fieldValues=g.extend({},j.fieldValues,j._getFieldValues());j.resetForm(true);if(this.value){j._loadFields(j.fieldValues)}else{j.$containerRequireField&&j.$containerRequireField.html("");i(this.$form)}j._trigger("onTypeChanged",this.value)})};d.prototype._getFieldValues=function(){return this._getJSON({getFieldJSON:h.getInternalJSON,$form:this.$form,})};d.prototype._init=function(){this.container=a(this.configuration.container);this.fieldValues={};if(this.container.length){this._renderForm();this._bindEventListener();this._loadServerData()}else{throw new Error("container property should be defined.")}};d.prototype._renderForm=function(){var j=this;this.$form=a(f.jiraCreateIssueForm.form({formClass:this.configuration.formClass,})).on("aui-valid-submit",function(k){if(j.configuration.onSubmit){k.preventDefault();j.configuration.onSubmit()}}).on("focus",".fake-tabbable",function(){const k=a("div#select2-drop.select2-drop-active").children()[0];if(k&&k.children.length){k.getElementsByTagName("input")[0].focus()}});if(this.configuration.renderSummaryAndDescription){this._renderSummaryAndDescription()}this.container.append(this.$form);this.defaultFields=this._getDefaultFields();g.each(this.defaultFields,g.bind(function(k){this.createSelect2WithIcon(a(k))},this));this.$containerRequireField=a(".create-issue-required-fields",this.container);this._trigger("onFormRendered")};d.prototype._renderSummaryAndDescription=function(){var j=a(".create-issue-default-fields",this.$form);j.append(aui.form.textField({labelContent:"Summary",isRequired:true,name:"summary",value:this._getSummaryFromConfiguration(),}));j.append(aui.form.textareaField({labelContent:"Description",name:"description",}))};d.prototype._getDefaultFields=function(){return{server:a(".server-select",this.$form),project:a(".project-select",this.$form),issueType:a(".issuetype-select",this.$form),}};d.prototype._loadServerData=function(){var j=this;this.formIsLoading(this.defaultFields.server);c.loadServers(j.configuration.ajax).then(function(k){j.formLoadingCompleted(j.defaultFields.server);j._loadServerDataComplete(k)})};d.prototype._loadFields=function(k){var l=this;var j=g.extend({},this.getContextJSON(),k);this.formIsLoading(this.defaultFields.issueType);var m=c.getFieldMetadata(j,l.configuration.ajax);m.done(function(r){var n=l._filterFields(r.fields);if(l.configuration.renderSummaryAndDescription){var o=r.fields.description;var q=!!(o&&o.required);l._setDescriptionAsRequiredField(q)}var p=l._unrenderableRequiredFields(n);if(p.length===0){l._renderFields(n,j);l._trigger("onFieldsRendered")}else{l._handleUnrenderableRequiredFields(p)}l._fieldTypeAnalytics(n);l.formLoadingCompleted(l.defaultFields.issueType)}).fail(g.bind(l._handleAjaxError,this))};d.prototype._loadServerDataComplete=function(j){if(j.length){if(j.length===1){e.hideField(this.defaultFields.server)}this._hasMultiServer=j.length>1;e.fillSelectData(this.defaultFields.server,j,this.configuration.serverId||j[0].id);this._selectServer(this.configuration.serverId||j[0].id)}else{this._handlerUnexpectedError("Don\u0027t have any Jira server, please check the application link configuration.")}};d.prototype._loadProjectData=function(j){var k=this;this.formIsLoading(this.defaultFields.project);var l=c.loadProjects(j,k.configuration.ajax);l.then(function(m){if(m.errors&&m.errors.length){var n=m.errors[0];if(n.authenticationUri){k._handleAuthorizeError(n)}else{k._handlerUnexpectedError(n.message)}}else{if(m.length){e.fillSelectData(k.defaultFields.project,m,k.configuration.projectId)}else{k._handlerUnexpectedError("You do not have permission to create issues on this Jira server.")}}k.formLoadingCompleted(k.defaultFields.project)},g.bind(k._handleAjaxError,this))};d.prototype._loadIssueType=function(k,j,l){var m=c.getIssueTypes(k,j,this.configuration.ajax);e.fillSelectData(this.defaultFields.issueType,m,l&&l.id)};d.prototype._fieldTypeAnalytics=function(j){var l=j.map(function(n){var m=h.getFieldType(n);return{required:n.required,restType:m,knownRestType:h.isKnownRestType(m),}});var k=l.reduce(function(m,n){if(n.knownRestType){m[n.required?"requiredFields":"otherFields"].push(n.restType)}else{m[n.required?"unknownRequiredFieldsCount":"unknownOtherFieldsCount"]++}return m},{requiredFields:[],otherFields:[],unknownRequiredFieldsCount:0,unknownOtherFieldsCount:0,});k=Object.keys(k).reduce(function(n,p){var q=k[p];if(!Array.isArray(q)){n[p]=q;return n}var m=q.length;n[p+".size"]=m;for(var o=0;o<m;o++){n[p+"["+o+"]"]=q[o]}return n},{});AJS.trigger("analytics",{name:"jira.integration.issue.create.form.displayed",data:k,})};d.prototype._renderFields=function(j,k){this.$containerRequireField.html("");var l=g.reject(j,h.canRender);if(!this.configuration.allowUnsupportedFields&&l.length){this._handleUnsupportedFields(l)}else{this.$containerRequireField.html(g.map(j,function(m){return h.renderField(null,m,k,null)}).join(""));h.attachFieldBehaviors(this.$containerRequireField,k,null);this._trigger("onRequiredFieldsRendered",j,l)}};d.prototype._setError=function(j){i(this.$form);this.$form.prepend(j);this.formLoadingCompleted();this.formHasError()};d.prototype._handleCommunicationError=function(k){var j=this.configuration.get$communicationError(k);this._setError(j)};d.prototype._handlerUnexpectedError=function(k){var j=this.configuration.get$unexpectedError(k);this._setError(j)};d.prototype._handleUnsupportedFields=function(j){j=g.map(j,function(l){return AJS.escapeHtml(l.name)});var k=this.configuration.get$unsupportedFieldMessage(j,this._getCreateJiraIssueUrl());i(this.$form);this.$form.prepend(k);this._trigger("onError");this.formLoadingCompleted()};d.prototype._handleUnsupportedServer=function(j){var k=this.configuration.get$unsupportedServerMessage(j);this._setError(k)};d.prototype._handleAjaxError=function(m){var l=this;if(m.status>=500&&m.status<600){var j=(m.responseJSON.errors&&m.responseJSON.errors[0]);var k=j&&j.exceptionName;if(k&&k==="com.atlassian.integration.jira.JiraCommunicationException"){this._handleCommunicationError(j.message)}else{l._handlerUnexpectedError(AJS.format("Could not communicate with Jira (HTTP error {0})",m.status))}}else{l._handlerUnexpectedError("An unexpected response was received from Jira.")}l.formHasError()};d.prototype._handleAuthorizeError=function(l){var k=this;this.formHasError();var j=this.configuration.get$unauthorizeMessage(l.applicationName);this.$form.append(j);a(".applink-authenticate",j).on("click",function(m){AppLinks.authenticateRemoteCredentials(l.authenticationUri,function(){k.resetForm();k._selectServer(k.currentServerId,true)},function(){k._handlerUnexpectedError(AJS.format("You have refused to permit access to {0}.",l.applicationName))});m.preventDefault()})};d.prototype._handleUnrenderableRequiredFields=function(j){var k=this.configuration.get$unrenderableRequiredFieldsMessage(j,this._getCreateJiraIssueUrl());i(this.$form);this.$form.append(k);this.formLoadingCompleted()};d.prototype._getCreateJiraIssueUrl=function(){var l=this.defaultFields.project.find("option:selected").val();var m=this.defaultFields.issueType.find("option:selected").val();var n=c.getServerById(this.currentServerId).displayUrl;n=n+"/secure/CreateIssueDetails!Init.jspa?pid="+l+"&issuetype="+m;var k=this._getFieldValue("summary");if(k.length){n=n+"&summary="+encodeURIComponent(k)}var j=this._getFieldValue("description");if(j.length){n=n+"&description="+encodeURIComponent(j)}return n};d.prototype._filterFields=function(j){var k=this;return g.filter(j,function(n){var m=n.schema?(n.schema.system||n.schema.custom||n.schema.customId):n;var l=k.configuration.excludedField&&k.configuration.excludedField.includes(m)||(k.configuration.ignoreFieldsWithDefaultValue&&n.hasDefaultValue)||(k.configuration.requiredFieldsOnly&&!n.required);return !l})};d.prototype._unrenderableRequiredFields=function(j){return j.filter(function(k){return k.required&&!h.canRender(k)})};d.prototype._getFieldValue=function(k){var j=a("[name='"+k+"']",this.$form);return(j)?a.trim(j.val()):""};d.prototype._setDescriptionAsRequiredField=function(j){var k=a('.field-group [name="description"]',this.$form).prev("label");k.find(".aui-icon.aui-icon-required").remove();if(j){k.append(aui.icons.icon({icon:"required"}))}};d.prototype._getSummaryFromConfiguration=function(){var j=this.configuration.initialSummary;delete this.configuration.initialSummary;return j};d.prototype._getJSON=function(j){if(!j.verbose){return b(j.$form,function(o,m,n){return j.getFieldJSON(o)})}var l=c.getCachedFieldMetadataEntry(this.getContextJSON()).value;var k=Object.keys(l.fields).reduce(function(p,n){var m=l.fields[n];p[n]=h.getContext(null,m,null,null);return p},{});return b(this.$form,function(p,m,o){var n=k[m];return{name:m,jiraType:n.jiraType,required:n.isRequired,label:n.labelText,value:j.getFieldJSON(p),index:o,}})};d.prototype.resetForm=function(j){i(this.$form);a(".field-group",this.$form).show();if(this.configuration.renderSummaryAndDescription){this._setDescriptionAsRequiredField(false)}if(!this._hasMultiServer){e.hideField(this.defaultFields.server)}this.$containerRequireField.html("");this.fieldValues=j?this.fieldValues:{}};d.prototype.formHasError=function(){a(".field-group",this.$form).hide();this.$containerRequireField.html("");if(this._hasMultiServer){e.showField(this.defaultFields.server)}e.setFieldDisabled(a(".insert-issue-button"),true);this._trigger("onError");this.formLoadingCompleted()};d.prototype.getCurrentServer=function(){return c.getServerById(this.currentServerId)};d.prototype.formIsLoading=function(j){if(j){e.setIsLoading(j,true)}var k=a(":input",a(this.$form));e.setFieldDisabled(k,true)};d.prototype.formLoadingCompleted=function(j){if(j){e.setIsLoading(j,false)}else{a(".aui-icon.aui-icon-wait",this.$form).remove()}var k=a(":input",a(this.$form));e.setFieldDisabled(k,false)};d.prototype.createSelect2WithIcon=function(j){if(j.is(".server-select")){j.auiSelect2({minimumResultsForSearch:-1})}else{var k=j.is(".project-select")?{formatSelection:this.projectSelectFormat,formatResult:this.projectSelectFormat,extraAttributes:this.defaultFields,}:{formatSelection:this.issueTypeSelectFormat,formatResult:this.issueTypeSelectFormat,minimumResultsForSearch:-1,extraAttributes:this.defaultFields,};j.auiSelect2(k)}j.auiSelect2("val","")};d.prototype.projectSelectFormat=function(l){var k=this.extraAttributes.server.select2("data").id;var j=c.getProjectIconUrl(k,l.id);return f.fields.select2WithIconOption({optionValue:l.text,iconUrl:j,isProject:true,})};d.prototype.issueTypeSelectFormat=function(m){var l=this.extraAttributes.server.select2("data").id;var j=this.extraAttributes.project.select2("data").id;var k=c.getIssueTypeIconUrl(l,j,m.id);return f.fields.select2WithIconOption({optionValue:m.text,iconUrl:k,isProject:false,})};d.prototype.getContextJSON=function(){var j=this.defaultFields.project.val()||a(this.defaultFields.project).select2("data").value;return{serverId:this.currentServerId,projectId:j,projectKey:c.getProjectById(this.currentServerId,j).key,issueTypeId:this.defaultFields.issueType.val(),summary:this._getSummaryFromConfiguration(),}};d.prototype.getJSON=function(j){return d.prototype._getJSON({getFieldJSON:h.getJSON,verbose:j,$form:this.$form,})};d.prototype.renderErrors=function(j){b(this.$form,function(k,n){var o=k.closest(".jira-field");var m=function(p){return p.indexOf(n)===0};var l;if(j.hasOwnProperty(n)||Object.keys(j).some(m)){if(!j.hasOwnProperty(n)){n=Object.keys(j).filter(m)[0]}l=Array.isArray(j[n])?j[n]:[j[n]]}h.setFieldError(o,l)})};d.prototype.submit=function(){this.$form.submit()};function b(j,l){var k={};j.find(".create-issue-required-fields").find("input, select, textarea, fieldset").not(".select2-input, .select2-focusser").each(function(n){var o=a(this);var m=o.attr("data-name");if(m){k[m]=l(o,m,n)}});return k}function i(j){a(".aui-message",j).remove()}return d});;
;
/* module-key = 'com.atlassian.integration.jira.jira-integration-plugin:jira-create-issue-form', location = '/jira-create-issue-form/jira-create-issue-form-data.js' */
define("jira-integration-plugin/jira-create-issue-form-data",["jquery"],function(d){var j={};var l={};var q=AJS.contextPath()+"/plugins/servlet/jira-integration/icons?serverId={0}&iconType={1}&{2}";var m=[];var p=function(s,t){return s({dataType:"json",timeout:0,url:AJS.contextPath()+"/rest/jira-integration/1.0/servers"+(t||""),})};function o(s){return p(s,"").done(function(t){t.forEach(function(u){j[u.id]=u})})}function i(s,u){var t=j[s]&&j[s].projects;if(t){return d.Deferred().resolve(t)}return p(u,"/"+s+"/projects").done(function(v){if(v.length){v.forEach(function(z){var y=z.issuetypes.filter(function(A){return !A.subtask});z.issueTypes=y;var w={};y.forEach(function(A){w[A.id]=A.iconUrl});var x=z.avatarUrls["16x16"].split("/secure/projectavatar?")[1];if(x.indexOf("pid=")===-1){x=x+"&pid="+z.id}m[e(s,z.id)]={iconUrl:AJS.format(q,s,"project",x),issueTypes:w,}});j[s].projects=v}})}function r(t,s){var u=h(t).filter(function(v){return v.id===s})[0];return u?u.issueTypes:[]}function f(s,t){var u=b(s);if(u.value){return d.Deferred().resolve(u.value)}return p(t,"/"+s.serverId+"/projects/"+s.projectKey+"/issue-types/"+s.issueTypeId+"/fields-meta").done(function(v){l[u.key]=v})}function b(t){var s=e(t.serverId,t.projectKey,t.issueTypeId);return{key:s,value:l[s],}}function n(s){return j[s]}function g(s,t){if(!j[s]){throw new Error("Can only be called after server is loaded.")}if("issueCreationSupported" in j[s]){return d.Deferred().resolve(j[s].issueCreationSupported)}return p(t,"/"+s+"/features").then(function(u){if(u.errors){return d.Deferred().reject(u.errors)}else{if(!Array.isArray(u)){return d.Deferred().reject("Unexpected response from Jira")}}j[s].issueCreationSupported=u.indexOf("CREATE_ISSUE")!==-1;return j[s].issueCreationSupported})}function h(s){if(!j[s]){throw new Error("Can only be called after server is loaded.")}return j[s].projects}function k(u,t){var w=h(u);if(!w){return null}for(var v=0,s=w.length;v<s;v++){var x=w[v];if(x.id===t){return x}}return null}function a(t,s){var u=e(t,s);return m[u]?m[u].iconUrl:""}function c(u,t,v){var w=e(u,t);var s=m[w];return(s&&s.issueTypes[v])?s.issueTypes[v]:""}function e(t,s,u){return t+(s?"-"+s:"")+(u?"-"+u:"")}return{loadServers:o,loadProjects:i,getIssueTypes:r,getFieldMetadata:f,getCachedFieldMetadataEntry:b,getServerById:n,getProjectIconUrl:a,getIssueTypeIconUrl:c,getProjects:h,getProjectById:k,isIssueCreationSupported:g,}});;
;
/* module-key = 'com.atlassian.integration.jira.jira-integration-plugin:jira-create-issue-form', location = '/jira-create-issue-form/jira-create-issue-form-field-helper.js' */
define("jira-integration-plugin/jira-create-issue-form-field-helper",["jquery","jira-integration-plugin/custom-lodash"],function(b,h){function d(j,m,k){var n=[];var l;m.forEach(function(p){var o={value:AJS.escapeHtml(p.id),text:p.name,iconUrl:p.iconUrl?p.iconUrl:(p.avatarUrls?p.avatarUrls["16x16"]:""),};if(k===p.id){o.selected=true;l=p}n.push(aui.form.optionOrOptgroup(o))});if(l){l.text=l.name;j.html(n.join(""));j.auiSelect2("data",l).trigger("change")}else{n.unshift(e(j));j.html(n.join(""));j.auiSelect2("val","").trigger("change")}}function a(j){j.html(e(j));j.auiSelect2("val","").trigger("change")}function e(j){var k=j.attr("data-placeholder");return aui.form.optionOrOptgroup({value:"",text:k,iconUrl:"",})}function i(j){j.parent().hide()}function c(j){j.parent().show()}function f(k,j){j?b.fn.disable?k.disable():k.prop("disabled",true):b.fn.enable?k.enable():k.prop("disabled",false)}function g(k,j){return j?k.after(aui.icons.icon({icon:"wait"})):k.next(".aui-icon.aui-icon-wait").remove()}return{fillSelectData:d,resetSelectField:a,hideField:i,showField:c,setFieldDisabled:f,setIsLoading:g,}});;
;
/* module-key = 'com.atlassian.integration.jira.jira-integration-plugin:jira-create-issue-form', location = '/jira-create-issue-form/jira-create-issue-form.soy' */
// This file was automatically generated from jira-create-issue-form.soy.
// Please don't edit this file by hand.

/**
 * @fileoverview Templates in namespace jiraIntegration.templates.jiraCreateIssueForm.
 */

if (typeof jiraIntegration == 'undefined') { var jiraIntegration = {}; }
if (typeof jiraIntegration.templates == 'undefined') { jiraIntegration.templates = {}; }
if (typeof jiraIntegration.templates.jiraCreateIssueForm == 'undefined') { jiraIntegration.templates.jiraCreateIssueForm = {}; }


jiraIntegration.templates.jiraCreateIssueForm.form = function(opt_data, opt_ignored) {
  return '' + aui.form.form({extraClasses: (opt_data.formClass ? opt_data.formClass + ' ' : '') + 'jira-create-form', method: 'post', action: '#', content: '<fieldset class="create-issue-default-fields"><div class="fake-tabbable" tabindex="0" /><div class="field-group" data-jira-type="server"><label>' + soy.$$escapeHtml('Server') + '<span class="aui-icon icon-required"> required</span></label><select class="jira-select2-drop-box server-select medium-long-field" name="server" data-placeholder="' + soy.$$escapeHtml('Select a server') + '"><option disabled selected value="">' + soy.$$escapeHtml('Select a server') + '</option></select></div><div class="field-group" data-jira-type="project"><label>' + soy.$$escapeHtml('Project') + '<span class="aui-icon icon-required"> required</span></label><select class="jira-select2-drop-box project-select medium-long-field" name="project" data-placeholder="' + soy.$$escapeHtml('Select a project') + '"><option disabled selected value="">' + soy.$$escapeHtml('Select a project') + '</option></select></div><div class="field-group" data-jira-type="issuetype"><label>' + soy.$$escapeHtml('Issue Type') + '<span class="aui-icon icon-required"> required</span></label><select class="jira-select2-drop-box issuetype-select" name="issue-type" data-placeholder="' + soy.$$escapeHtml('Select an issue type') + '"><option disabled selected value="">' + soy.$$escapeHtml('Select an issue type') + '</option></select></div></fieldset><fieldset class="create-issue-required-fields"></fieldset>'});
};
if (goog.DEBUG) {
  jiraIntegration.templates.jiraCreateIssueForm.form.soyTemplateName = 'jiraIntegration.templates.jiraCreateIssueForm.form';
}


jiraIntegration.templates.jiraCreateIssueForm.unsupportedFieldsMessage = function(opt_data, opt_ignored) {
  var param28 = '';
  if (opt_data.unsupportedFields.length == 1) {
    var field__soy31 = '<strong>' + soy.$$escapeHtml(opt_data.unsupportedFields) + '</strong>';
    param28 += soy.$$filterNoAutoescape(AJS.format('The required field {0} is not available in this form. You will need to',field__soy31));
  } else {
    var fieldList__soy38 = '' + jiraIntegration.templates.jiraCreateIssueForm.buildFieldList({fields: opt_data.unsupportedFields});
    param28 += soy.$$filterNoAutoescape(AJS.format('The required fields {0} are not available in this form. You will need to',fieldList__soy38));
  }
  param28 += ' <a href="' + soy.$$escapeHtml(opt_data.createIssueUrl) + '" target="_blank">' + soy.$$escapeHtml('create your issue directly in Jira') + '</a>.';
  var output = '' + aui.message.warning({content: param28});
  return output;
};
if (goog.DEBUG) {
  jiraIntegration.templates.jiraCreateIssueForm.unsupportedFieldsMessage.soyTemplateName = 'jiraIntegration.templates.jiraCreateIssueForm.unsupportedFieldsMessage';
}


jiraIntegration.templates.jiraCreateIssueForm.buildFieldList = function(opt_data, opt_ignored) {
  var output = '';
  var joinText__soy50 = '' + ((opt_data.fields.length == 2) ? ' ' + soy.$$escapeHtml('and') + ' ' : ', ');
  var fieldList58 = opt_data.fields;
  var fieldListLen58 = fieldList58.length;
  for (var fieldIndex58 = 0; fieldIndex58 < fieldListLen58; fieldIndex58++) {
    var fieldData58 = fieldList58[fieldIndex58];
    output += ((! (fieldIndex58 == 0)) ? soy.$$escapeHtml(joinText__soy50) : '') + '<strong>' + soy.$$escapeHtml(fieldData58) + '</strong>';
  }
  return output;
};
if (goog.DEBUG) {
  jiraIntegration.templates.jiraCreateIssueForm.buildFieldList.soyTemplateName = 'jiraIntegration.templates.jiraCreateIssueForm.buildFieldList';
}


jiraIntegration.templates.jiraCreateIssueForm.authorize = function(opt_data, opt_ignored) {
  opt_data = opt_data || {};
  var output = '';
  var applicationNameEscaped__soy67 = '' + soy.$$escapeHtml(opt_data.applicationName);
  output += aui.message.info({content: '' + soy.$$filterNoAutoescape(AJS.format('{0}Log in and approve{1} to retrieve data from {2}','<a class="oauth-init applink-authenticate" href="#">','</a>',applicationNameEscaped__soy67))});
  return output;
};
if (goog.DEBUG) {
  jiraIntegration.templates.jiraCreateIssueForm.authorize.soyTemplateName = 'jiraIntegration.templates.jiraCreateIssueForm.authorize';
}


jiraIntegration.templates.jiraCreateIssueForm.unsupportedServerMessage = function(opt_data, opt_ignored) {
  return '' + aui.message.warning({content: '' + soy.$$filterNoAutoescape(AJS.format('The version of selected Jira server is not supported. You may want to upgrade to at least version 5.x or {0}create issue in Jira{1}.','<a href="' + opt_data.serverUrl + '" target="_blank">','</a>'))});
};
if (goog.DEBUG) {
  jiraIntegration.templates.jiraCreateIssueForm.unsupportedServerMessage.soyTemplateName = 'jiraIntegration.templates.jiraCreateIssueForm.unsupportedServerMessage';
}


jiraIntegration.templates.jiraCreateIssueForm.unrenderableRequiredFieldsMessage = function(opt_data, opt_ignored) {
  return '' + aui.message.warning({content: '' + soy.$$filterNoAutoescape(AJS.format('The required {1,choice,1#field|1\x3cfields} \x3cstrong\x3e{0}\x3c/strong\x3e {1,choice,1#is|1\x3care} not available in this dialog. You will need to {2}create your issue directly in Jira{3}.',opt_data.names,opt_data.count,'<a href="' + opt_data.serverUrl + '" target="_blank">','</a>'))});
};
if (goog.DEBUG) {
  jiraIntegration.templates.jiraCreateIssueForm.unrenderableRequiredFieldsMessage.soyTemplateName = 'jiraIntegration.templates.jiraCreateIssueForm.unrenderableRequiredFieldsMessage';
}


jiraIntegration.templates.jiraCreateIssueForm.communicationErrorMessage = function(opt_data, opt_ignored) {
  return '' + aui.message.error({titleContent: '' + soy.$$escapeHtml('Unfortunately, we\x27ve encountered problems connecting to Jira'), content: '<p>' + soy.$$escapeHtml(opt_data.message) + '</p>'});
};
if (goog.DEBUG) {
  jiraIntegration.templates.jiraCreateIssueForm.communicationErrorMessage.soyTemplateName = 'jiraIntegration.templates.jiraCreateIssueForm.communicationErrorMessage';
}
;
;
/* module-key = 'com.atlassian.bitbucket.server.bitbucket-frontend:split_extension-jira-pull-request-comment-action-extension-comment-action-extension-js', location = 'extension-jira-pull-request-comment-action-extension-comment-action-extension-js.chunk.js' */
/*! For license information please see extension-jira-pull-request-comment-action-extension-comment-action-extension-js.chunk.js.LICENSE */
(window.atlassianWebpackJsonp9bed4266d44bdeae18aa343dea64edaf=window.atlassianWebpackJsonp9bed4266d44bdeae18aa343dea64edaf||[]).push([["extension-jira-pull-request-comment-action-extension-comment-action-extension-js"],{"./generated-clientside-extension/extension-jira-pull-request-comment-action-extension-comment-action-extension-js.js":function(e,t,n){"use strict";var i=s(n("com.atlassian.plugins.atlassian-clientside-extensions-runtime:runtime/require('@atlassian/clientside-extensions-registry')")),r=s(n("./src/extension/jira/pull-request/comment-action-extension/comment-action-extension.js"));function s(e){return e&&e.__esModule?e:{default:e}}i.default.registerExtension("com.atlassian.bitbucket.server.bitbucket-frontend:extension/jira/pull-request/comment-action-extension/comment-action-extension.js",r.default)},"./src/extension/jira/applinks-provider.js":function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.getEnhancedEntityLink=void 0;var i=a(n("com.atlassian.bitbucket.server.bitbucket-webpack-INTERNAL:client-storage/require('bitbucket/internal/util/client-storage')")),r=a(n("com.atlassian.bitbucket.server.bitbucket-web-api:navbuilder/require('bitbucket/util/navbuilder')")),s=n("com.atlassian.bitbucket.server.bitbucket-web-api:server/require('bitbucket/util/server')");function a(e){if(e&&e.__esModule)return e;var t={};if(null!=e)for(var n in e)Object.prototype.hasOwnProperty.call(e,n)&&(t[n]=e[n]);return t.default=e,t}var o=i.contexts.REPO;t.getEnhancedEntityLink=function(e){var t=e.projectKey,n=r.rest("jira").addPathComponents("projects",t,"primary-enhanced-entitylink").build(),a=(0,s.rest)({url:n,type:"GET",statusCode:{400:!1,403:!1,404:!1,409:!1,500:!1}});return new Promise((function(e){a.always((function(t,n){var r=i.getItemProgressively("create-jira-issue-context",o)||{},s=r.serverId,a=r.projectId;"success"===n&&(s=t.applicationLinkId,a=""+t.projectId),e({serverId:s,projectId:a})}))}))}},"./src/extension/jira/create-new-issue-modal/create-new-issue-modal.jsx":function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var i=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var i in n)Object.prototype.hasOwnProperty.call(n,i)&&(e[i]=n[i])}return e},r=function(e,t){if(Array.isArray(e))return e;if(Symbol.iterator in Object(e))return function(e,t){var n=[],i=!0,r=!1,s=void 0;try{for(var a,o=e[Symbol.iterator]();!(i=(a=o.next()).done)&&(n.push(a.value),!t||n.length!==t);i=!0);}catch(e){r=!0,s=e}finally{try{!i&&o.return&&o.return()}finally{if(r)throw s}}return n}(e,t);throw new TypeError("Invalid attempt to destructure non-iterable instance")},s=n("com.atlassian.auiplugin:ajs/require('@atlassian/aui')"),a=n("com.atlassian.bitbucket.server.bitbucket-webpack-INTERNAL:react/require('prop-types')"),o=n("com.atlassian.bitbucket.server.bitbucket-webpack-INTERNAL:react/require('react')"),u=g(o),c=n("com.atlassian.plugins.atlassian-plugins-webresource-plugin:i18n/require('wrm/i18n')"),l=n("./src/feature/pull-request/utils/get-user-role-from-pr.js"),d=g(n("./src/widget/centered-spinner/index.js")),m=function(e){if(e&&e.__esModule)return e;var t={};if(null!=e)for(var n in e)Object.prototype.hasOwnProperty.call(e,n)&&(t[n]=e[n]);return t.default=e,t}(n("com.atlassian.bitbucket.server.bitbucket-webpack-INTERNAL:analytics/require('bitbucket/internal/util/analytics')")),p=n("./src/extension/jira/applinks-provider.js"),f=g(n("./src/extension/jira/events/emitter.js")),b=n("./src/extension/jira/events/topics.js"),x=n("./src/extension/jira/issues-provider.js"),j=n("./src/extension/jira/jira-create-issue-form/index.js");function g(e){return e&&e.__esModule?e:{default:e}}var v=function(e){var t=e.closeModal,n=e.setActions,a=e.context,g=a.currentUser,v=a.repository,q=a.project,y=a.pullRequest,k=a.isTask,h=a.comment,w=h.id,_=q.key,I=(0,o.useRef)(),E=(0,o.useRef)(),O=(0,o.useState)(!1),R=r(O,2),M=R[0],P=R[1],T=(0,o.useState)(!1),A=r(T,2),L=A[0],N=A[1],S=(0,o.useState)(!1),C=r(S,2),F=C[0],z=C[1];(0,o.useEffect)((function(){n([{text:"Create issue",isDisabled:!M||!F,isLoading:L,onClick:function(){I.current.submit()}},{text:"Cancel",onClick:t}])}),[F,M,L]);var J=(0,o.useMemo)((function(){var e=((0,l.getUserRoleFromPR)({pullRequest:y,user:g})||"other").toLowerCase();return{"comment.id":h.id,"pullRequest.id":y.id,"repository.id":v.id,"comment.tasks.size":h.tasks.length,userRole:e,isTask:k}}),[h,v,y,g,k]),K=(0,o.useCallback)((function(){var e=I.current;e.formIsLoading(),N(!0);var n=i({},I.current.getContextJSON(),{commentId:w}),r=e.getJSON(!1);(0,x.createIssue)(n,r).then((function(e){var n=e.issueKey;(0,s.flag)({body:c.format("Jira issue {0} created",n),type:"success",close:"auto"}),f.default.emit(b.ISSUE_CREATED,{commentId:w,issueKey:n}),m.add("jira.issue.comment.create.success",J),t()})).catch((function(t){e.renderErrors(t),m.add("jira.issue.comment.create.failed",J),e.formLoadingCompleted(),N(!1)}))}),[]);return(0,o.useEffect)((function(){(0,p.getEnhancedEntityLink)({projectKey:_}).then((function(e){var t=e.serverId,n=e.projectId;I.current=(0,j.initializeForm)({projectId:n,serverId:t,container:E.current,onRequiredFieldsRendered:function(){P(!0)},onSubmit:K}),z(!0)}))}),[]),u.default.createElement(o.Fragment,null,u.default.createElement("div",{ref:E}),!F&&u.default.createElement(d.default,null))};v.displayName="CreateNewIssueModal",v.propTypes={closeModal:a.func.isRequired,context:a.object.isRequired,setActions:a.func.isRequired},t.default=v,e.exports=t.default},"./src/extension/jira/create-new-issue-modal/index.js":function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var i=n("./src/extension/jira/create-new-issue-modal/create-new-issue-modal.jsx");Object.defineProperty(t,"default",{enumerable:!0,get:function(){return(e=i,e&&e.__esModule?e:{default:e}).default;var e}}),e.exports=t.default},"./src/extension/jira/jira-create-issue-form/index.js":function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var i=n("./src/extension/jira/jira-create-issue-form/jira-create-issue-form.js");Object.keys(i).forEach((function(e){"default"!==e&&"__esModule"!==e&&Object.defineProperty(t,e,{enumerable:!0,get:function(){return i[e]}})}))},"./src/extension/jira/jira-create-issue-form/jira-create-issue-form.js":function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.initializeForm=void 0;var i,r=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var i in n)Object.prototype.hasOwnProperty.call(n,i)&&(e[i]=n[i])}return e},s=n("./src/plugin/jira-integration/create-issue-form.js"),a=(i=s)&&i.__esModule?i:{default:i},o=n("com.atlassian.bitbucket.server.bitbucket-web-api:server/require('bitbucket/util/server')");t.initializeForm=function(e){var t=e.projectId,n=e.serverId,i=e.container,s=e.onRequiredFieldsRendered,u=e.onSubmit;return new a.default({allowUnsupportedFields:!0,ignoreFieldsWithDefaultValue:!1,requiredFieldsOnly:!1,ajax:function(e){var t=r({},e,{statusCode:{500:!1}});return(0,o.ajax)(t)},projectId:t,serverId:n,onRequiredFieldsRendered:s,onSubmit:u,container:i})}},"./src/extension/jira/pull-request/comment-action-extension/comment-action-extension.js":function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var i,r=n("../../node_modules/@atlassian/clientside-extensions/dist/esm/index.js"),s=n("com.atlassian.plugins.atlassian-plugins-webresource-plugin:i18n/require('wrm/i18n')"),a=n("./src/extension/jira/create-new-issue-modal/index.js"),o=(i=a)&&i.__esModule?i:{default:i};t.default=r.ModalExtension.factory((function(e,t){return{hidden:!1,disabled:!1,label:"Create Jira issue",onAction:function(e){e.setTitle("Create Jira issue"),(0,r.renderElementAsReact)(e,o.default,{context:t,closeModal:e.closeModal,setActions:e.setActions})}}})),e.exports=t.default},"./src/plugin/jira-integration/create-issue-form.js":function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var i,r=n("com.atlassian.integration.jira.jira-integration-plugin:jira-create-issue-form/require('jira-integration-plugin/jira-create-issue-form')"),s=(i=r)&&i.__esModule?i:{default:i};t.default=s.default,e.exports=t.default},"com.atlassian.integration.jira.jira-integration-plugin:jira-create-issue-form/require('jira-integration-plugin/jira-create-issue-form')":function(e,t){e.exports=require("jira-integration-plugin/jira-create-issue-form")}},[["./generated-clientside-extension/extension-jira-pull-request-comment-action-extension-comment-action-extension-js.js","runtime","vendors~announcement-banner-settings~auto-decline~create-pull-request~default-branch-admin~extension~b53c067f","vendors~auto-decline~create-pull-request~default-branch-admin~extension-git-rebase-pull-request-acti~1d11af72","vendors~auto-decline~create-pull-request~default-branch-admin~extension-git-rebase-pull-request-acti~2fd8fa4e","vendors~auto-decline~create-pull-request~default-branch-admin~extension-git-rebase-pull-request-acti~1cfb3340","vendors~auto-decline~create-pull-request~default-branch-admin~extension-git-rebase-pull-request-acti~c062ae27","vendors~auto-decline~create-pull-request~default-branch-admin~extension-jira-pull-request-comment-ac~8aae8faf","vendors~auto-decline~create-pull-request~default-branch-admin~extension-git-rebase-pull-request-acti~a97cef0a","vendors~auto-decline~create-pull-request~extension-git-rebase-pull-request-action-item-extension-act~f68a7118","vendors~auto-decline~create-pull-request~extension-git-rebase-pull-request-action-item-extension-act~6bd15fca","vendors~create-pull-request~extension-git-rebase-pull-request-action-item-extension-action-item-exte~a276dd3d","vendors~create-pull-request~extension-jira-pull-request-comment-action-extension-comment-action-exte~6886c665","vendors~create-pull-request~extension-git-rebase-pull-request-action-item-extension-action-item-exte~80497970","vendors~create-pull-request~extension-jira-pull-request-comment-action-extension-comment-action-exte~34708f40","vendors~extension-git-rebase-pull-request-action-item-extension-action-item-extension-js~extension-j~dbec70aa","announcement-banner-settings~auto-decline~create-pull-request~default-branch-admin~extension-git-reb~ba3b7284","announcement-banner-settings~auto-decline~create-pull-request~default-branch-admin~extension-git-reb~f0f3850d","announcement-banner-settings~auto-decline~create-pull-request~default-branch-admin~extension-git-reb~2ce7521e","announcement-banner-settings~auto-decline~create-pull-request~default-branch-admin~extension-git-reb~5f3ea1fc","announcement-banner-settings~create-pull-request~extension-git-rebase-pull-request-action-item-exten~e73a8e0d","auto-decline~create-pull-request~extension-git-rebase-pull-request-action-item-extension-action-item~2a2246cc","create-pull-request~extension-git-rebase-pull-request-action-item-extension-action-item-extension-js~7e4acfcd","create-pull-request~extension-git-rebase-pull-request-action-item-extension-action-item-extension-js~3711041f","create-pull-request~extension-git-rebase-pull-request-action-item-extension-action-item-extension-js~e2f477ed","create-pull-request~extension-jira-pull-request-comment-action-extension-comment-action-extension-js~58e9fe33","create-pull-request~extension-jira-pull-request-comment-action-extension-comment-action-extension-js~6fa291ae","announcement-banner-settings~create-pull-request~extension-jira-pull-request-comment-action-extensio~48f98c9e","create-pull-request~extension-jira-pull-request-comment-action-extension-comment-action-extension-js~8e802470","extension-git-rebase-pull-request-action-item-extension-action-item-extension-js~extension-jira-pull~bfcbe4b9","extension-jira-pull-request-comment-action-extension-comment-action-extension-js~extension-jira-pull~d6aab13d","extension-jira-pull-request-comment-action-extension-comment-action-extension-js~pull-request-ui"]]]);;
;
/* module-key = 'com.atlassian.bitbucket.server.bitbucket-frontend:split_extension-jira-pull-request-comment-extension-comment-extension-js', location = 'extension-jira-pull-request-comment-extension-comment-extension-js.chunk.js' */
/*! For license information please see extension-jira-pull-request-comment-extension-comment-extension-js.chunk.js.LICENSE */
(window.atlassianWebpackJsonp9bed4266d44bdeae18aa343dea64edaf=window.atlassianWebpackJsonp9bed4266d44bdeae18aa343dea64edaf||[]).push([["extension-jira-pull-request-comment-extension-comment-extension-js"],{"./generated-clientside-extension/extension-jira-pull-request-comment-extension-comment-extension-js.js":function(e,t,n){"use strict";var s=a(n("com.atlassian.plugins.atlassian-clientside-extensions-runtime:runtime/require('@atlassian/clientside-extensions-registry')")),i=a(n("./src/extension/jira/pull-request/comment-extension/comment-extension.js"));function a(e){return e&&e.__esModule?e:{default:e}}s.default.registerExtension("com.atlassian.bitbucket.server.bitbucket-frontend:extension/jira/pull-request/comment-extension/comment-extension.js",i.default)},"./src/extension/jira/jira-issues-list/index.js":function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var s=n("./src/extension/jira/jira-issues-list/jira-issues-list.jsx");Object.defineProperty(t,"default",{enumerable:!0,get:function(){return(e=s,e&&e.__esModule?e:{default:e}).default;var e}}),e.exports=t.default},"./src/extension/jira/jira-issues-list/jira-issues-list.jsx":function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var s=function(e,t){if(Array.isArray(e))return e;if(Symbol.iterator in Object(e))return function(e,t){var n=[],s=!0,i=!1,a=void 0;try{for(var r,u=e[Symbol.iterator]();!(s=(r=u.next()).done)&&(n.push(r.value),!t||n.length!==t);s=!0);}catch(e){i=!0,a=e}finally{try{!s&&u.return&&u.return()}finally{if(i)throw a}}return n}(e,t);throw new TypeError("Invalid attempt to destructure non-iterable instance")},i=h(n("../../node_modules/@atlaskit/button/dist/esm/entry-points/standard-button.js")),a=h(n("../../node_modules/@atlaskit/icon/cjs/index.js")),r=h(n("../../node_modules/@atlaskit/spinner/dist/esm/index.js")),u=h(n("../../node_modules/@atlaskit/tooltip/dist/esm/index.js")),l=h(n("com.atlassian.bitbucket.server.bitbucket-webpack-INTERNAL:classnames/require('classnames')")),o=n("com.atlassian.bitbucket.server.bitbucket-webpack-INTERNAL:lodash/require('lodash')"),c=n("com.atlassian.bitbucket.server.bitbucket-webpack-INTERNAL:react/require('prop-types')"),d=n("com.atlassian.bitbucket.server.bitbucket-webpack-INTERNAL:react/require('react')"),m=h(d),f=n("com.atlassian.plugins.atlassian-plugins-webresource-plugin:i18n/require('wrm/i18n')"),p=n("./src/extension/jira/issues-provider.js"),x=n("./src/extension/jira/jira-dialog/index.js"),b=h(n("./src/extension/jira/jira-issue-link/index.js")),j=h(n("./src/extension/jira/jira-lozenge/index.js")),q=h(n("./src/extension/jira/events/emitter.js")),v=n("./src/extension/jira/events/topics.js"),g=n("./src/extension/jira/jira-logo.svg"),y=n("./src/extension/jira/jira-issues-list/jira-issues-list.less");function h(e){return e&&e.__esModule?e:{default:e}}var k=function(e){return"done"===(0,o.get)(e,"fields.status.statusCategory.key")},E=function(e){var t=e.commentId,n=e.issueKeys,c=(0,d.useState)(!1),h=s(c,2),E=h[0],I=h[1],_=(0,d.useState)(null),A=s(_,2),N=A[0],S=A[1],T=(0,d.useState)(null),w=s(T,2),C=w[0],R=w[1],O=(0,d.useState)(n),M=s(O,2),z=M[0],L=M[1],P=(0,d.useCallback)((function(e){var n=e.commentId,s=e.issueKey;t===n&&L((function(e){return[].concat(function(e){if(Array.isArray(e)){for(var t=0,n=Array(e.length);t<e.length;t++)n[t]=e[t];return n}return Array.from(e)}(e),[s])}))}),[]),U=(0,d.useCallback)((function(){z.length&&(I(!0),(0,p.getIssues)(z).then((function(e){var t=e.issues,n=e.errors;S(t),R(n),I(!1)})))}),[z]);(0,d.useEffect)((function(){U()}),[z]),(0,d.useEffect)((function(){return q.default.on(v.AUTHORIZATION_SUCCEEDED,U),q.default.on(v.ISSUE_CREATED,P),function(){q.default.off(v.AUTHORIZATION_SUCCEEDED,U),q.default.off(v.ISSUE_CREATED,P)}}),[t]);var D,J=Array.isArray(C)?C.some((function(e){return e.authenticationUri})):null,K=Array.isArray(N)?N.filter((function(e){return e.fields})):[],H=(0,o.difference)(z,K.map((function(e){return e.key}))),W=(0,d.useCallback)((function(){x.initDialogPromise.then((function(e){e.setIssueKeys(H),e.show()}))}),[H]);return E?m.default.createElement("div",{className:"jira-issues-list"},m.default.createElement(r.default,{size:"xsmall"})):(0,o.isEmpty)(N)&&(0,o.isEmpty)(C)?null:m.default.createElement("div",{className:"jira-issues-list"},K.length?m.default.createElement("ul",null,K.map((function(e){return m.default.createElement("li",{key:e.key,className:"issue-item"},m.default.createElement("img",{className:"issue-type-icon",alt:e.fields.issuetype.name,src:e.fields.issuetype.iconUrl}),m.default.createElement(b.default,{issueKey:e.key,issueUrl:e.url,className:(0,l.default)("issue-link",{"issue-status-done":k(e)})},e.key),m.default.createElement("span",{className:"issue-summary"},e.fields.summary),m.default.createElement(j.default,{issue:e}))}))):null,J?m.default.createElement("div",{className:"jira-auth-wrapper"},m.default.createElement(u.default,{content:(D={unresolvedIssues:H},D.unresolvedIssues.join(", "))},m.default.createElement(i.default,{onClick:W,iconBefore:m.default.createElement(a.default,{glyph:g.ReactComponent,size:"small",primaryColor:y.jiraIconColor}),spacing:"compact",appearance:"link",className:"jira-auth-button"},function(e){var t=e.resolvedIssues,n=e.unresolvedIssues;return t.length&&n.length?"You dont have access to view all issues or they may not exist":"Authenticate with Jira to view issue details"}({resolvedIssues:K,unresolvedIssues:H})))):null)};E.displayName="JiraIssuesList",E.propTypes={commentId:c.number.isRequired,issueKeys:(0,c.arrayOf)(c.string)},E.defaultProps={issueKeys:[]},t.default=E,e.exports=t.default},"./src/extension/jira/jira-issues-list/jira-issues-list.less":function(e,t,n){e.exports={jiraIconColor:"#42526E"}},"./src/extension/jira/jira-lozenge/index.js":function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var s=n("./src/extension/jira/jira-lozenge/jira-lozenge.jsx");Object.defineProperty(t,"default",{enumerable:!0,get:function(){return(e=s,e&&e.__esModule?e:{default:e}).default;var e}}),e.exports=t.default},"./src/extension/jira/jira-lozenge/jira-lozenge.jsx":function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.JiraLozenge=void 0,n(11);var s,i=n("com.atlassian.bitbucket.server.bitbucket-webpack-INTERNAL:react/require('prop-types')"),a=n("com.atlassian.bitbucket.server.bitbucket-webpack-INTERNAL:react/require('react')"),r=(s=a)&&s.__esModule?s:{default:s};var u=t.JiraLozenge=function(e){var t=e.issue,n=e.isSubtle,s=t.fields.status;return r.default.createElement("span",{dangerouslySetInnerHTML:{__html:JIRA.Template.Util.Issue.Status.issueStatusResolver({issueStatus:s,isSubtle:n,isCompact:!s.statusCategory})}})};u.displayName="JiraLozenge",u.propTypes={issue:i.object.isRequired,isSubtle:i.bool},t.default=u},"./src/extension/jira/pull-request/comment-extension/comment-extension.js":function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var s,i=n("../../node_modules/@atlassian/clientside-extensions/dist/esm/index.js"),a=n("./src/extension/jira/jira-issues-list/index.js"),r=(s=a)&&s.__esModule?s:{default:s};t.default=i.PanelExtension.factory((function(e,t){var n=t.comment,s=n.id,a=Array.isArray(n.issues)?n.issues:[];return{hidden:!1,onAction:function(e){(0,i.renderElementAsReact)(e,r.default,{commentId:s,issueKeys:a})}}})),e.exports=t.default},11:function(e,t,n){e.exports=void 0}},[["./generated-clientside-extension/extension-jira-pull-request-comment-extension-comment-extension-js.js","runtime","vendors~announcement-banner-settings~auto-decline~create-pull-request~default-branch-admin~extension~b53c067f","vendors~auto-decline~create-pull-request~default-branch-admin~extension-git-rebase-pull-request-acti~1d11af72","vendors~auto-decline~create-pull-request~default-branch-admin~extension-git-rebase-pull-request-acti~2fd8fa4e","vendors~auto-decline~create-pull-request~default-branch-admin~extension-git-rebase-pull-request-acti~1cfb3340","vendors~auto-decline~create-pull-request~default-branch-admin~extension-git-rebase-pull-request-acti~c062ae27","vendors~auto-decline~create-pull-request~default-branch-admin~extension-git-rebase-pull-request-acti~33a7ea31","vendors~auto-decline~create-pull-request~default-branch-admin~extension-git-rebase-pull-request-acti~ab9da1b0","vendors~auto-decline~create-pull-request~default-branch-admin~extension-jira-pull-request-comment-ac~8aae8faf","vendors~auto-decline~create-pull-request~default-branch-admin~extension-git-rebase-pull-request-acti~a97cef0a","vendors~auto-decline~create-pull-request~extension-git-rebase-pull-request-action-item-extension-act~f68a7118","vendors~auto-decline~create-pull-request~default-branch-admin~extension-jira-pull-request-comment-ex~24307f96","vendors~auto-decline~create-pull-request~extension-git-rebase-pull-request-action-item-extension-act~6bd15fca","vendors~auto-decline~create-pull-request~extension-git-rebase-pull-request-action-item-extension-act~72721d40","vendors~auto-decline~create-pull-request~default-branch-admin~extension-jira-pull-request-comment-ex~852d1b7c","vendors~create-pull-request~extension-git-rebase-pull-request-action-item-extension-action-item-exte~a276dd3d","vendors~create-pull-request~extension-jira-pull-request-comment-action-extension-comment-action-exte~6886c665","vendors~create-pull-request~extension-git-rebase-pull-request-action-item-extension-action-item-exte~6781d47e","vendors~create-pull-request~extension-git-rebase-pull-request-action-item-extension-action-item-exte~80497970","vendors~create-pull-request~extension-jira-pull-request-comment-action-extension-comment-action-exte~34708f40","vendors~extension-git-rebase-pull-request-action-item-extension-action-item-extension-js~extension-j~dbec70aa","vendors~create-pull-request~extension-jira-pull-request-comment-extension-comment-extension-js~pull-~6f6cd606","announcement-banner-settings~auto-decline~create-pull-request~default-branch-admin~extension-git-reb~ba3b7284","announcement-banner-settings~auto-decline~create-pull-request~default-branch-admin~extension-git-reb~f0f3850d","announcement-banner-settings~auto-decline~create-pull-request~default-branch-admin~extension-git-reb~2ce7521e","announcement-banner-settings~auto-decline~create-pull-request~default-branch-admin~extension-jira-pu~77a4de4b","announcement-banner-settings~auto-decline~create-pull-request~default-branch-admin~extension-git-reb~5f3ea1fc","announcement-banner-settings~create-pull-request~extension-git-rebase-pull-request-action-item-exten~e73a8e0d","auto-decline~create-pull-request~extension-git-rebase-pull-request-action-item-extension-action-item~2a2246cc","create-pull-request~extension-git-rebase-pull-request-action-item-extension-action-item-extension-js~7e4acfcd","create-pull-request~extension-git-rebase-pull-request-action-item-extension-action-item-extension-js~e2f477ed","create-pull-request~extension-jira-pull-request-comment-action-extension-comment-action-extension-js~6fa291ae","create-pull-request~extension-jira-pull-request-comment-extension-comment-extension-js~extension-jir~d37111b1","create-pull-request~extension-jira-pull-request-comment-action-extension-comment-action-extension-js~8e802470","create-pull-request~extension-jira-pull-request-comment-extension-comment-extension-js~pull-request-ui","extension-jira-pull-request-comment-action-extension-comment-action-extension-js~extension-jira-pull~d6aab13d","extension-jira-pull-request-comment-extension-comment-extension-js~extension-jira-pull-request-overv~77f39eac"]]]);;
//# sourceMappingURL=/download/contextbatch/js/bitbucket.ui.pullrequest.comment.action,bitbucket.ui.pullrequest.comment.extra,-_super,-bitbucket.page.pullRequest.detail,-bitbucket.ui.pullrequest.overview.summary,-atl.general,-bitbucket.layout.repository,-bitbucket.layout.base,-bitbucket.ui.pullrequest.action/batch.js.map?_statichash=7ffd79ed4966b9170107e1d0e26c2c28-CDN%2F1126798137%2F6433dff%2F382%2F0bddecbdf9e36e72117bb5a5d99cfc72&awesome.graphs.adg3=true&awesome.graphs.isLoggedIn=true&feature.smart.mirrors.enabled=true&hasConnectAddons=true&isJiraLinked=true&locale=en-US