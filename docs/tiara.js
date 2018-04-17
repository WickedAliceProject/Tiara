define("Tiara", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Tiara;
    (function (Tiara) {
        function ConvertLower(c) { return '-' + String.fromCharCode(c.charCodeAt(0) | 32); }
        class Style {
            constructor(selector) {
                this.selector = selector;
                this.style = {};
                this.rules = [];
            }
            set(name, value = '') {
                if (name === 'length' || name === 'parentRule') {
                    return this;
                }
                if (typeof name === 'string') {
                    this.style[name] = value;
                }
                else {
                    Object.keys(name).forEach((key) => {
                        if (key === 'length' || key === 'parentRule') {
                            return this;
                        }
                        this.style[key] = name[key] || '';
                    });
                }
                return this;
            }
            unset(...names) {
                names.forEach((name) => { delete this.style[name]; });
                return this;
            }
            add(style) {
                if (typeof style === 'string') {
                    const selectors = style.split(' ');
                    const selector = selectors.shift() || '';
                    let _style = this.search(selector);
                    if (!_style) {
                        _style = new Style(selector);
                        this.rules.push(_style);
                    }
                    selectors.forEach((selector) => {
                        _style = _style.add(selector);
                    });
                    return _style;
                }
                for (let i = 0; i < this.rules.length; ++i) {
                    if (this.rules[i].selector === style.selector) {
                        this.rules[i] = style;
                        return style;
                    }
                }
                this.rules.push(style);
                return style;
            }
            search(selector) {
                for (let i = 0; i < this.rules.length; ++i) {
                    if (this.rules[i].selector === selector) {
                        return this.rules[i];
                    }
                }
                return null;
            }
            remove(selector) {
                for (let i = 0; i < this.rules.length; ++i) {
                    if (this.rules[i].selector === selector) {
                        this.rules.splice(i, 1);
                    }
                }
                return this;
            }
            update(selector, name, value = '') {
                const rule = this.search(selector);
                if (!rule) {
                    return null;
                }
                rule.set(name, value);
                return rule;
            }
            clear(selector) {
                const rule = this.search(selector);
                if (!rule) {
                    return this;
                }
                rule.style = {};
                return this;
            }
            toStoring(selector = '') {
                if (selector) {
                    if (this.selector[0] === '&') {
                        selector += this.selector.substring(1);
                    }
                    else {
                        selector += ' ' + this.selector;
                    }
                }
                else {
                    selector = this.selector;
                }
                const style = Object.keys(this.style).map((key) => {
                    return key.replace(/[A-Z]/g, ConvertLower) + ':' + this.style[key];
                }).join(';');
                return (this.selector && style ? (selector + '{' + style + '}') : '') + this.rules.map((rule) => { return rule.toStoring(selector); }).join('');
            }
            reflectStyleSheet() {
                if (!this.element) {
                    this.element = document.createElement('style');
                    this.element.appendChild(document.createTextNode(''));
                    document.head.appendChild(this.element);
                }
                this.element.textContent = this.toStoring();
                return this.element;
            }
        }
        Tiara.Style = Style;
        function CreateTemplateElement(contents) {
            const template = document.createElement('template');
            if (typeof contents !== 'string') {
                template.content.appendChild(contents);
                return;
            }
            const parent = document.createElement('div');
            parent.innerHTML = contents;
            const children = parent.children;
            for (let i = 0; i < children.length; ++i) {
                template.content.appendChild(children[i]);
            }
            return template;
        }
        Tiara.CreateTemplateElement = CreateTemplateElement;
        class Template {
            constructor(template) {
                this.setTemplate(template);
            }
            static create(contents) {
                return new Template(CreateTemplateElement(contents));
            }
            defaultTemplate() {
                return document.createElement('template');
            }
            onSetTemplate(template) { return true; }
            setTemplate(template) {
                if (typeof template === 'string') {
                    template = document.getElementById(template);
                }
                if (!template || !template.content) {
                    template = this.defaultTemplate();
                }
                if (this.onSetTemplate(template) !== false) {
                    this.template = template;
                }
                return this.get();
            }
            querySelectorAll(selector) {
                const list = [];
                const elements = this.template.content.querySelectorAll(selector);
                for (let i = 0; i < elements.length; ++i) {
                    list.push(elements[i]);
                }
                return list;
            }
            clearTemplate() {
                const parent = this.getContent();
                const children = parent.children;
                for (let i = children.length - 1; 0 <= i; --i) {
                    parent.removeChild(children[i]);
                }
            }
            get() { return this.template; }
            getContent() { return this.get().content; }
            getCloneNode(deep = true) { return document.importNode(this.getContent(), deep); }
            renderTemplate(target) {
                if (!target) {
                    return;
                }
                const children = target.children;
                if (!children) {
                    return;
                }
                for (let i = children.length - 1; 0 <= i; --i) {
                    target.removeChild(children[i]);
                }
                target.appendChild(this.getCloneNode());
            }
        }
        Tiara.Template = Template;
    })(Tiara = exports.Tiara || (exports.Tiara = {}));
});
