///<reference path="Tool.ts" />

class CanvasTool implements Tool {
    public displayName: string;
    public displayImagePath: string; // Image to be shown on the toolbar
    public properties: Object; // Supported properties
    public defaultDOMElement: JQuery; // Vanilla DOM element to be inserted by Tool, WITHOUT any default attributes
    public toolbarDOMElement: JQuery; // DOM Element for the tool button in the toolbar
    public sizingToolAttributes: {};
    public displayGroups: PropertyDisplayGroup[];



    constructor(public id: string) {
        this.displayName = 'Canvas';
        this.properties = {};

        this.properties['width'] = '650';
        this.properties['height'] = '500';

        this.defaultDOMElement = $('<div></div>');
    }

    public setAttributesInDOMElement(attributes: {}, DOMElement: JQuery) {
        
        for (var i in attributes) {
            var value = attributes[i];
            switch (i) {
                case 'width':
                    DOMElement.css('width', value + 'px');
                    break;
                case 'height':
                    DOMElement.css('height', value + 'px');
                    break;
                default:
                    break;
            }
        }
    }

    public getAttributesFromDOMElement(DOMElement: JQuery) {
        var attributes = {};
        return attributes;
    }
}