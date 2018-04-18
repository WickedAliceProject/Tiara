declare class Tiara {
    static createTemplateElement(contents: HTMLElement | string): HTMLTemplateElement;
    static create(contents: HTMLElement | string): Tiara;
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
declare module "tiara" {
    export = Tiara;
}
