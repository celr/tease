///<reference path="SizableTool.ts" />
///<reference path="Tool.ts" />

class PointerTool implements Tool{
    public displayName: string;
    public displayImagePath: string; // Image to be shown on the toolbar
    public properties: Property[]; // Supported properties
    public defaultAttributes: AttributeList;
    public defaultDOMElement: JQuery; // Vanilla DOM element to be inserted by Tool, WITHOUT any default attributes
    public toolbarDOMElement: JQuery; // DOM Element for the tool button in the toolbar
    public sizingToolAttributes: AttributeList;

    

    constructor(public id: string) {
        this.displayName = 'Pointer';
        this.displayImagePath = 'res/pointerTool.png';
    }
    public setAttributesInDOMElement(attributes: AttributeList, DOMElement: JQuery) {
    }
    public getAttributesFromDOMElement(DOMElement: JQuery) {
        var attributes = new Attribute[];
        return attributes;
    }
}