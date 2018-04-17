declare namespace Tiara {
    class Style {
        selector: string;
        private style;
        private rules;
        private element;
        constructor(selector: string);
        set(name: keyof CSSStyleDeclaration | {
            [key in keyof CSSStyleDeclaration]?: string;
        }, value?: string): this;
        unset(...names: (keyof CSSStyleDeclaration)[]): this;
        add(style: Style | string): Style;
        search(selector: string): Style | null;
        remove(selector: string): this;
        update(selector: string, name: keyof CSSStyleDeclaration | {
            [key in keyof CSSStyleDeclaration]?: string;
        }, value?: string): Style | null;
        clear(selector: string): this;
        toStoring(selector?: string): string;
        private reflectStyleSheet();
    }
    function CreateTemplateElement(contents: HTMLElement | string): HTMLTemplateElement | undefined;
    class Template {
        static create(contents: HTMLElement | string): Template;
        protected template: HTMLTemplateElement;
        constructor(template?: HTMLTemplateElement | string);
        protected defaultTemplate(): HTMLTemplateElement;
        protected onSetTemplate(template: HTMLTemplateElement): boolean;
        setTemplate(template?: HTMLTemplateElement | string): HTMLTemplateElement;
        querySelectorAll<T extends HTMLElement>(selector: string): T[];
        clearTemplate(): void;
        get(): HTMLTemplateElement;
        getContent(): DocumentFragment;
        getCloneNode(deep?: boolean): DocumentFragment;
        renderTemplate(target: HTMLElement): void;
    }
}
