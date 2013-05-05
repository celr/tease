///<reference path="Tool.ts" />

class SizableTool implements Tool {
    // Menu display properties
    public displayName: string;
    public displayImagePath: string;

    // Attributes and properties
    public properties: Object;
    public defaultAttributes: Object;
    public sizingToolAttributes: Object; // Properties that indicate how sizing tool manipulates this tool
    public displayGroups: PropertyDisplayGroup[];

    // DOM Elements
    public toolbarDOMElement: JQuery;
    
    constructor(public id: string, public defaultDOMElement: JQuery) {
        this.sizingToolAttributes = {};
        this.properties = {};

        this.properties['left'] = '0';
        this.properties['top'] = '0';
        this.properties['width'] = '400';
        this.properties['height'] = '400';
    }

    public setAttributesInDOMElement(attributes: Object, DOMElement: JQuery) {
        var result = false;

        for (var i in attributes) {
            var value = attributes[i];
            switch (i) {
                case 'width':
                    DOMElement.css('width', value + 'px');
                    break;
                case 'height':
                    DOMElement.css('height', value + 'px');
                    break;
                case 'left':
                    DOMElement.css('left', value + 'px');
                    break;
                case 'top':
                    DOMElement.css('top', value + 'px');
                    break;
                case 'position':
                    DOMElement.css('position', value);
                    break;
                default:
                    result = false;
                    break;
            }
        }

        return result;
    }

    public getAttributesFromDOMElement(DOMElement: JQuery) {
        var attributes = {};
        return attributes;
    }
}