class SizableTool implements Tool {
    // Menu display properties
    public displayName: string;
    public displayImagePath: string;

    // Attributes and properties
    public properties: string[];
    public defaultAttributes: Object;
    public sizingToolAttributes: Object; // Properties that indicate how sizing tool manipulates this tool

    // DOM Elements
    public toolbarDOMElement: JQuery;
    
    constructor(public id: string, public defaultDOMElement: JQuery) {
        this.sizingToolAttributes = {};
        this.defaultAttributes = {};
        this.properties = [];

        this.defaultAttributes['left'] = '0';
        this.defaultAttributes['top'] = '0';
        this.defaultAttributes['width'] = '400';
        this.defaultAttributes['height'] = '400';
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