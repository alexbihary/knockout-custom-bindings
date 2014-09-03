// <styles data-bind="textcss: { selector:'body:hover', styles:{ border:'2px solid red' } }"></styles>
// <pre data-bind="textcss: { styles:{ border:'2px solid red' } }"></pre>

;(function (factory) {
    //CommonJS
    if (typeof require === "function" && typeof exports === "object" && typeof module === "object") {
        factory(require("knockout"), exports);
    //AMD
    } else if (typeof define === "function" && define.amd) {
        define(["knockout", "exports"], factory);
    //normal script tag
    } else {
        factory(ko, {});
    }
}(function (ko, exports, undefined) {

    function selectorPath(el) {
        var names = [];
        while (el.parentNode) {
            if (el.id) {
                names.unshift('#' + el.id);
                break;
            } else {
                if (el == el.ownerDocument.documentElement) names.unshift(el.tagName);
                else {
                    for (var c = 1, e = el; e.previousElementSibling; e = e.previousElementSibling, c++);
                    names.unshift(el.tagName + ":nth-child(" + c + ")");
                }
                el = el.parentNode;
            }
        }
        return names.join(" > ");
    }

    function cssRuleIsValid(attr, value) {
        return document.documentElement.style[attr] !== undefined && typeof ko.unwrap(value) === 'string';
    }

    function cssRulesFromObject(styles) {
        var rules = [];
        ko.utils.objectForEach(ko.unwrap(styles) || {}, function (attr, value) {
            if (cssRuleIsValid(attr, value))
                rules.push(attr + ':' + value);
        });
        return rules.join(';');
    }

    ko.bindingHandlers.textcss = {
        init: function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
            // This will be called when the binding is first applied to an element
            // Set up any initial state, event handlers, etc. here
            ko.computed(function () {
                var settings = ko.unwrap(valueAccessor()),
                    selector = settings.id
                        ? '#' + settings.id 
                        : settings.selector || selectorPath(element);

                if (!selector) return;
                element.innerText = selector + '{' + cssRulesFromObject(settings.styles) + '}';
            });
        }
    };
}));
