///<reference path="Tool.ts" />

class CanvasTool implements Tool {
    public displayName: string;
    public displayImagePath: string; // Image to be shown on the toolbar
    public properties: Object; // Supported properties
    public defaultDOMElement: JQuery; // Vanilla DOM element to be inserted by Tool, WITHOUT any default attributes
    public toolbarDOMElement: JQuery; // DOM Element for the tool button in the toolbar
    public sizingToolAttributes: {};
    public displayGroups: PropertyDisplayGroup[];
    private propertyMapper: PropertyMapper;
    private propertyUnits: Object;



    constructor(public id: string) {
        this.displayName = 'Canvas';
        this.properties = {};
        this.propertyUnits = {};

        this.properties['width'] = '650';
        this.properties['height'] = '500';

        this.defaultDOMElement = $('<div></div>');
    }

    public setAttributesInDOMElement(attributes: {}, propertyUnits: {}, DOMElement: JQuery) {
        
        for (var i in attributes) {
            var value = attributes[i];

            var unit = '';
            if (propertyUnits[i]) {
                unit = propertyUnits[i];
            }

            switch (i) {
                case 'width':
                    DOMElement.css('width', value + unit);
                    break;
                case 'height':
                    DOMElement.css('height', value + unit);
                    break;
                default:
                    break;
            }
        }
    }

    public setAttributeInDOMElement(property: string, value: string, propertyUnit: string, DOMElement: JQuery) {

    }
}