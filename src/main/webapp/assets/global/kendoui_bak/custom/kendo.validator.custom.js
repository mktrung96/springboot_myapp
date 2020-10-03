var NS = '.kendoValidator', INVALIDMSG = 'k-invalid-msg', invalidMsgRegExp = new RegExp(INVALIDMSG, 'i'), INVALIDINPUT = 'k-invalid', VALIDINPUT = 'k-valid', emailRegExp = /^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))$/i, urlRegExp = /^(https?|ftp):\/\/(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(\#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i, INPUTSELECTOR = ':input:not(:button,[type=submit],[type=reset],[disabled],[readonly],[k-skip-validator] input)', CHECKBOXSELECTOR = ':checkbox:not([disabled],[readonly],[k-skip-validator] input)', NUMBERINPUTSELECTOR = '[type=number]:not([k-skip-validator] input),[type=range]:not([k-skip-validator] input)', BLUR = 'blur', NAME = 'name', FORM = 'form', NOVALIDATE = 'novalidate', proxy = $.proxy, patternMatcher = function (value, pattern) {
                if (typeof pattern === 'string') {
                    pattern = new RegExp('^(?:' + pattern + ')$');
                }
                return pattern.test(value);
            }, matcher = function (input, selector, pattern) {
                var value = input.val();
                if (input.filter(selector).length && value !== '') {
                    return patternMatcher(value, pattern);
                }
                return true;
            }, hasAttribute = function (input, name) {
                if (input.length) {
                    return input[0].attributes[name] != null;
                }
                return false;
            };
            function resolveRules(element) {
                var resolvers = kendo.ui.validator.ruleResolvers || {}, rules = {}, name;
                for (name in resolvers) {
                    $.extend(true, rules, resolvers[name].resolve(element));
                }
                return rules;
            }
            function decode(value) {
                return value.replace(/&amp/g, '&amp;').replace(/&quot;/g, '"').replace(/&#39;/g, '\'').replace(/&lt;/g, '<').replace(/&gt;/g, '>');
            }
            function numberOfDecimalDigits(value) {
                value = (value + '').split('.');
                if (value.length > 1) {
                    return value[1].length;
                }
                return 0;
            }
            function parseHtml(text) {
                if ($.parseHTML) {
                    return $($.parseHTML(text));
                }
                return $(text);
            }
            function searchForMessageContainer(elements, fieldName) {
                var containers = $(), element, attr;
                for (var idx = 0, length = elements.length; idx < length; idx++) {
                    element = elements[idx];
                    if (invalidMsgRegExp.test(element.className)) {
                        attr = element.getAttribute(kendo.attr('for'));
                        if (attr === fieldName) {
                            containers = containers.add(element);
                        }
                    }
                }
                return containers;
            }

            kendo.ui.Validator.fn._checkValidity = function (input) {
                var rules = this.options.rules, rule;
                for (rule in rules) {
                    if (!rules[rule].call(this, input)) {
                        return {
                            valid: false,
                            key: rule
                        };
                    }
                }
                return { valid: true };
            }
            
kendo.ui.Validator.fn.validateInput = function (input) {
    input = $(input);
    this._isValidated = true;
    var that = this, template = that._errorTemplate, result = that._checkValidity(input), valid = result.valid, className = '.' + INVALIDMSG, fieldName = input.attr(NAME) || '', lbl = that._findMessageContainer(fieldName).add(input.next(className).filter(function () {
            var element = $(this);
            if (element.filter('[' + kendo.attr('for') + ']').length) {
                return element.attr(kendo.attr('for')) === fieldName;
            }
            return true;
        })).hide(), messageText;
    input.removeAttr('aria-invalid');
    if (!valid) {
        messageText = that._extractMessage(input, result.key);
        that._errors[fieldName] = messageText;
        var messageLabel = parseHtml(template({ message: decode(messageText) }));
        var lblId = lbl.attr('id');
        that._decorateMessageContainer(messageLabel, fieldName);
        if (lblId) {
            messageLabel.attr('id', lblId);
        }
        if (!lbl.replaceWith(messageLabel).length) {
            messageLabel.insertAfter(input);
        }
        messageLabel.show();
        input.attr('aria-invalid', true);
    } else {
        delete that._errors[fieldName];
    }
    input.toggleClass(INVALIDINPUT, !valid);
    input.toggleClass(VALIDINPUT, valid);
    return valid;
};