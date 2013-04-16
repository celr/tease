///<reference path="Tool.ts" />

class ImageTool implements Tool {
    public displayName: string;
    public displayImagePath: string;
    public properties: Property[];
    public defaultAttributes: AttributeList;
    public defaultDOMElement: JQuery;
    public toolbarDOMElement: JQuery;
    public sizingToolAttributes: AttributeList;

    constructor(public id: string, defaultImagePath: string) {
        this.displayName = 'Image';
        this.displayImagePath = 'res/imageTool.png';
        this.defaultDOMElement = $('<img id="' + id + '" src = "' + defaultImagePath + '"></img>');
        this.properties = new Property[];
        this.sizingToolAttributes = new AttributeList; //properties that indicate how sizing tool manipulates this tool

        var widthProperty = new Property('width', 'ancho', 'width');
        var heightProperty = new Property('height', 'largo', 'height');
        var topProperty = new Property('top', 'top', 'top');
        var leftProperty = new Property('left', 'left', 'left');
        var mirrorXProperty = new Property('mirrorX', 'mirrorX');
        var mirrorYProperty = new Property('mirrorY', 'mirrorY');
        var positionProperty = new Property('position', 'Posicion', 'position');

        //adding sizing tool properties
        this.sizingToolAttributes.setAttribute(new Attribute(widthProperty, this.defaultDOMElement.width.toString()));
        this.sizingToolAttributes.setAttribute(new Attribute(heightProperty, this.defaultDOMElement.height.toString()));
        this.sizingToolAttributes.setAttribute(new Attribute(mirrorXProperty, '1'));
        this.sizingToolAttributes.setAttribute(new Attribute(mirrorYProperty, '1'));
        this.sizingToolAttributes.setAttribute(new Attribute(topProperty, ''));
        this.sizingToolAttributes.setAttribute(new Attribute(leftProperty, ''));
        this.sizingToolAttributes.setAttribute(new Attribute(positionProperty, 'absolute'));

        this.properties.push(widthProperty);
        this.properties.push(heightProperty);
        this.properties.push(topProperty);
        this.properties.push(leftProperty);

        this.defaultDOMElement.ready((e: Event) => {
            this.defaultAttributes = new AttributeList;
            this.defaultAttributes.setAttribute(new Attribute(widthProperty, this.defaultDOMElement.css('width').toString()));
            this.defaultAttributes.setAttribute(new Attribute(heightProperty, this.defaultDOMElement.css('height').toString()));
            this.defaultAttributes.setAttribute(new Attribute(leftProperty, this.defaultDOMElement.css('left').toString()));
            this.defaultAttributes.setAttribute(new Attribute(topProperty, this.defaultDOMElement.css('top').toString()));
        });
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