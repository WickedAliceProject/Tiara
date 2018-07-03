class Tiara {
    static createTemplateElement(contents) {
        const template = document.createElement('template');
        if (typeof contents !== 'string') {
            if (Object.prototype.toString.call(contents) === "[object HTMLCollection]") {
                while (0 < contents.length) {
                    template.content.appendChild(contents[0]);
                }
            }
            else {
                template.content.appendChild(contents);
            }
            return template;
        }
        const parent = document.createElement('div');
        parent.innerHTML = contents;
        const children = parent.children;
        const length = children.length;
        for (let i = 0; i < length; ++i) {
            template.content.appendChild(children[0]);
        }
        return template;
    }
    static create(contents) {
        return new Tiara(this.createTemplateElement(contents));
    }
    constructor(template) {
        this.setTemplate(template);
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
window.Tiara = Tiara;
