///<reference path="Tool.ts" />

class PointerTool implements Tool{
    public displayName: string;
    public displayImagePath: string; // Image to be shown on the toolbar
    public properties: Object; // Supported properties
    public defaultAttributes: Object;
    public defaultDOMElement: JQuery; // Vanilla DOM element to be inserted by Tool, WITHOUT any default attributes
    public toolbarDOMElement: JQuery; // DOM Element for the tool button in the toolbar
    public sizingToolAttributes: Object;
    public displayGroups: PropertyDisplayGroup[];
    private propertyMapper: PropertyMapper;
    private propertyUnits: Object;
    

    constructor(public id: string) {
        this.displayName = 'Pointer';
        this.displayImagePath = 'res/pointerTool.png';
    }

    public setAttributesInDOMElement(attributes: Object, propertyUnits: Object, DOMElement: JQuery) {
    }

    public setAttributeInDOMElement(property: string, value: string, propertyUnits: Object, DOMElement: JQuery) {
    }
}