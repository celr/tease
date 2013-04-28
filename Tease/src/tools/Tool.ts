///<reference path="../base/Attribute.ts" />
///<reference path="../lib/jquery.d.ts" />

interface Tool {
    displayName: string;
    displayImagePath: string; // Image to be shown on the toolbar
    id: string; // Unique id for this tool
    properties: Object; // Supported properties
    defaultAttributes: AttributeList;
    defaultDOMElement: JQuery; // Vanilla DOM element to be inserted by Tool, WITHOUT any default attributes
    toolbarDOMElement: JQuery; // DOM Element for the tool button in the toolbar
    sizingToolAttributes: AttributeList;

    setAttributesInDOMElement(attributes: AttributeList, DOMElement: JQuery): void;
    getAttributesFromDOMElement(DOMElement: JQuery): Attribute[];
}