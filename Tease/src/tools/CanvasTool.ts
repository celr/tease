///<reference path="Tool.ts" />

class CanvasTool implements Tool {
    public displayName: string;
    public displayImagePath: string; // Image to be shown on the toolbar
<<<<<<< HEAD
    public properties: Object; // Supported properties
    public defaultAttributes: AttributeList;
    public defaultDOMElement: JQuery; // Vanilla DOM element to be inserted by Tool, WITHOUT any default attributes
    public toolbarDOMElement: JQuery; // DOM Element for the tool button in the toolbar
    public sizingToolAttributes: AttributeList;
=======
    public properties: string[]; // Supported properties
    public defaultAttributes: {};
    public defaultDOMElement: JQuery; // Vanilla DOM element to be inserted by Tool, WITHOUT any default attributes
    public toolbarDOMElement: JQuery; // DOM Element for the tool button in the toolbar
    public sizingToolAttributes: {};
>>>>>>> BROKEN: Se remplazó AttributeList por {}



    constructor(public id: string) {
        this.displayName = 'Canvas';
<<<<<<< HEAD
        this.properties = new Object;
        this.defaultAttributes = new AttributeList;

        this.properties['width'] = new Property('width', 'ancho', 'width');
        this.properties['height'] = new Property('height', 'largo', 'height');

        this.defaultAttributes.setAttribute(new Attribute(this.properties['width'], '650'));
        this.defaultAttributes.setAttribute(new Attribute(this.properties['height'], '500'));
=======
        this.properties = [];
        this.defaultAttributes = {};

        this.properties.push('width');
        this.properties.push('height');

        this.defaultAttributes['width'] = '650';
        this.defaultAttributes['height'] = '500';
>>>>>>> BROKEN: Se remplazó AttributeList por {}

        this.defaultDOMElement = $('<div></div>');
    }

<<<<<<< HEAD
    public setAttributesInDOMElement(attributes: AttributeList, DOMElement: JQuery) {
        
        for (var i in attributes.attributes) {
            var value = attributes.attributes[i].value;
            switch (attributes.attributes[i].property.id) {
=======
    public setAttributesInDOMElement(attributes: {}, DOMElement: JQuery) {
        
        for (var i in attributes) {
            var value = attributes[i];
            switch (i) {
>>>>>>> BROKEN: Se remplazó AttributeList por {}
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
<<<<<<< HEAD
        var attributes = new Attribute[];
=======
        var attributes = {};
>>>>>>> BROKEN: Se remplazó AttributeList por {}
        return attributes;
    }
}