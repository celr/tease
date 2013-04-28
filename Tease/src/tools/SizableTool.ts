class SizableTool implements Tool {
    // Menu display properties
    public displayName: string;
    public displayImagePath: string;

    // Attributes and properties
    public properties: {};
    public defaultAttributes: AttributeList;
    public sizingToolAttributes: AttributeList; // Properties that indicate how sizing tool manipulates this tool

    // DOM Elements
    public toolbarDOMElement: JQuery;
    
    constructor(public id: string, public defaultDOMElement: JQuery) {
        this.properties = new Object;
        this.sizingToolAttributes = new AttributeList;
        this.defaultAttributes = new AttributeList;

        // Create sizable properties
        this.properties['top'] = new Property('top', 'top', 'top');
        this.properties['left'] = new Property('left', 'left', 'left');
        this.properties['position'] = new Property('position', 'Posicion', 'position');
        this.properties['width'] = new Property('width', 'ancho', 'width');
        this.properties['height'] = new Property('height', 'largo', 'height');

        // Set default attributes when DOM element is in the DOM tree
        this.defaultAttributes.setAttribute(new Attribute(this.properties['left'], '0'));
        this.defaultAttributes.setAttribute(new Attribute(this.properties['top'], '0'));
        this.defaultAttributes.setAttribute(new Attribute(this.properties['width'], '300'));
        this.defaultAttributes.setAttribute(new Attribute(this.properties['height'], '300'));
    }

    public setAttributesInDOMElement(attributes: AttributeList, DOMElement: JQuery) {
        var result = false;
        if (attributes) {
            result = true;
            for (var i in attributes.attributes) {
                var value = attributes.attributes[i].value;
                switch (attributes.attributes[i].property.id) {
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
        }

        return result;
    }

    public getAttributesFromDOMElement(DOMElement: JQuery) {
        var attributes = new Attribute[];
        return attributes;
    }
}