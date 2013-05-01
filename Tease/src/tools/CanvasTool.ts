///<reference path="Tool.ts" />

class CanvasTool implements Tool {
    public displayName: string;
    public displayImagePath: string; // Image to be shown on the toolbar
    public properties: string[]; // Supported properties
    public defaultAttributes: {};
    public defaultDOMElement: JQuery; // Vanilla DOM element to be inserted by Tool, WITHOUT any default attributes
    public toolbarDOMElement: JQuery; // DOM Element for the tool button in the toolbar
    public sizingToolAttributes: {};



    constructor(public id: string) {
        this.displayName = 'Canvas';
        this.properties = [];
        this.defaultAttributes = {};

        this.properties.push('width');
        this.properties.push('height');

        this.defaultAttributes['width'] = '650';
        this.defaultAttributes['height'] = '500';

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