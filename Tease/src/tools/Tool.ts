///<reference path="../base/Attribute.ts" />
///<reference path="../lib/jquery.d.ts" />
///<reference path="PropertyDisplayGroup.ts" />
///<reference path="PropertyMapping.ts" />

interface Tool {
    displayName: string;
    displayImagePath: string; // Image to be shown on the toolbar
    id: string; // Unique id for this tool
    properties: Object; // Supported properties
    defaultDOMElement: JQuery; // Vanilla DOM element to be inserted by Tool, WITHOUT any default attributes
    toolbarDOMElement: JQuery; // DOM Element for the tool button in the toolbar
    sizingToolAttributes: Object;
    displayGroups: PropertyDisplayGroup[]; // Tells us how to display the tool's properties 
    propertyMapper: PropertyMapper;
    propertyUnits: Object;

    setAttributeInDOMElement(property: string, value: string, propertyUnit: string, DOMElement: JQuery): void;
    setAttributesInDOMElement(attributes: Object, propertyUnits: Object, DOMElement: JQuery): void;
}