// knockout-textcss
// <styles data-bind="textcss: { selector:'body:hover', styles:{ border:'2px solid red' } }"></styles>
// <pre data-bind="textcss: { styles:{ border:'2px solid red', pretty:true } }"></pre>

; (function (factory) {
    if (typeof require === "function" && typeof exports === "object" && typeof module === "object") {
        factory(require("knockout"), exports);
    } else if (typeof define === "function" && define.amd) {
        define(["knockout", "exports"], factory);
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

    function cssRulesFromObject(styles, pretty) {
        var rules = [],
            separator = !!pretty ? ': ' : ':',
            prefix = !!pretty ? '\n  ' : '';

        ko.utils.objectForEach(ko.unwrap(styles) || {}, function (attr, value) {
            if (cssRuleIsValid(attr, value))
                var rule = prefix + attr + separator + value;
                rules.push(rule);
        });

        return rules.join(';');
    }

    ko.bindingHandlers.textcss = {
        init: function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
            ko.computed(function () {
                var settings = ko.unwrap(valueAccessor()),
                    pretty = !!ko.unwrap(settings.pretty),
                    openingBrace = !!pretty ? ' {' : '{',
                    closingBrace = !!pretty ? '\n}' : '}',
                    selector = settings.id
                        ? '#' + settings.id
                        : settings.selector || selectorPath(element);

                if (!selector) return;
                element.innerText = selector + openingBrace + cssRulesFromObject(settings.styles, pretty) + closingBrace;
            });
        }
    };
}));
