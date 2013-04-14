///<reference path="../lib/jquery.d.ts" />

class Property {
    range: Object;
    constructor (public id: string, public displayName: string) { }
}

class Attribute {
    constructor (public property: Property, public value: string) { }
}

class AttributeList {
    public attributes: Object;

    constructor() {
        this.attributes = {};
    }

    setAttribute(attribute: Attribute) {
        this.attributes[attribute.property.id] = attribute;
    }
    
    getAttribute(property: Property) {
        return this.getAttributeByPropertyId(property.id);
    }

    getAttributeByPropertyId(propertyId: string) {
        var res = null;
        if (this.attributes[propertyId]) {
            res = this.attributes[propertyId];
        }
        return res;
    }
}

interface Tool {
    displayName: string;
    displayImagePath: string; // Image to be shown on the toolbar
    id: string; // Unique id for this tool
    properties: Property[]; // Supported properties
    defaultAttributes: AttributeList;
    defaultDOMElement: HTMLElement; // Vanilla DOM element to be inserted by Tool, WITHOUT any default attributes
    toolbarDOMElement: HTMLElement; // DOM Element for the tool button in the toolbar
    sizingToolAttributes: AttributeList;

    setAttributesInDOMElement(attributes: AttributeList, DOMElement: HTMLElement): void;
    getAttributesFromDOMElement(DOMElement: HTMLElement): Attribute[];
}

class ImageTool implements Tool {
    displayName: string;
    displayImagePath: string;
    properties: Property[];
    defaultAttributes: AttributeList;
    defaultDOMElement: HTMLImageElement;
    toolbarDOMElement: HTMLElement;
    sizingToolAttributes: AttributeList;

    constructor(public id: string, defaultImage: string) {
        this.displayName = 'Image';
        this.displayImagePath = 'res/imageTool.png';
        this.defaultDOMElement = <HTMLImageElement> document.createElement('img');
        this.defaultDOMElement.src = defaultImage;
        this.id = id;
        this.properties = new Property[];
        this.sizingToolAttributes = new AttributeList; //properties that indicate how sizing tool manipulates this tool

        var widthProperty = new Property('width', 'ancho');
        var heightProperty = new Property('height', 'largo');
        var topProperty = new Property('top', 'top');
        var leftProperty = new Property('left', 'left');
        var mirrorXProperty = new Property('mirrorX', 'mirrorX');
        var mirrorYProperty = new Property('mirrorY', 'mirrorY');
        var positionProperty = new Property('position', 'Posicion');

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

        this.defaultDOMElement.addEventListener('load', () => {
            this.defaultAttributes = new AttributeList;
            this.defaultAttributes.setAttribute(new Attribute(widthProperty, this.defaultDOMElement.width.toString()));
            this.defaultAttributes.setAttribute(new Attribute(heightProperty, this.defaultDOMElement.height.toString()));

        });
    }

    setAttributesInDOMElement(attributes: AttributeList, DOMElement: HTMLElement) {
        var result = false;
        if (attributes) {
            result = true;
            for (var i in attributes.attributes) {
                var value = attributes.attributes[i].value;
                switch (attributes.attributes[i].property.id) {
                    case 'width':
                        DOMElement.style.width = value + 'px';
                        break;
                    case 'height':
                        DOMElement.style.height = value + 'px';
                        break;
                    case 'left':
                        DOMElement.style.left = value + 'px';
                        break;
                    case 'top':
                        DOMElement.style.top = value + 'px';
                        break;
                    case 'position':
                        DOMElement.style.position = value;
                        break;
                    default:
                        result = false;
                        break;
                }
            }
        }

        return result;
    }

    getAttributesFromDOMElement(DOMElement: HTMLElement) {
        var attributes = new Attribute[];
        return attributes;
    }
}

class AudioTool implements Tool {
    displayName: string;
    displayImagePath: string;
    properties: Property[];
    defaultAttributes: AttributeList;
    defaultDOMElement: HTMLAudioElement;
    toolbarDOMElement: HTMLElement;
    sourceElement: HTMLSourceElement;
    sizingToolAttributes: AttributeList;

    constructor(public id: string) {
        this.displayName = 'Audio';
        this.displayImagePath = 'res/audioTool.png';
        this.defaultDOMElement = <HTMLAudioElement> document.createElement('audio');
        this.defaultDOMElement.controls = true;
        this.id = id;
        this.properties = new Property[];
        this.sizingToolAttributes = new AttributeList;
        var srcProperty = new Property('source', 'archivo');
        var apProperty = new Property('autoplay', 'autoplay');

        //sizingTool Properties
        var topProperty = new Property('top', 'top');
        var leftProperty = new Property('left', 'left');
        var widthProperty = new Property('width', 'ancho');
        var positionProperty = new Property('position', 'position');


        //adding sizing tool properties
        this.sizingToolAttributes.setAttribute(new Attribute(widthProperty, '300'));
        this.sizingToolAttributes.setAttribute(new Attribute(topProperty, ''));
        this.sizingToolAttributes.setAttribute(new Attribute(leftProperty, ''));
        this.sizingToolAttributes.setAttribute(new Attribute(positionProperty, 'absolute'));

        this.properties.push(srcProperty);
        this.defaultAttributes = new AttributeList;
        this.defaultAttributes.setAttribute(new Attribute(apProperty, 'true'));
        this.defaultAttributes.setAttribute(new Attribute(srcProperty, 'res/audio.mp3'));
    }

    setAttributesInDOMElement(attributes: AttributeList, DOMElement: HTMLAudioElement) {
        var result = false;
        if (attributes) {
            result = true;
            for (var i in attributes.attributes) {
                var value = attributes.attributes[i].value;
                switch (attributes.attributes[i].property.id) {
                    case 'source':
                        // Remove any previous source tags
                        while (DOMElement.childNodes.length > 0) {
                            DOMElement.removeChild(DOMElement.childNodes[0]);
                        }

                        var source = <HTMLSourceElement> document.createElement('source');
                        source.src = attributes[i].value;
                        source.type = 'audio/mp3';
                        DOMElement.appendChild(source);
                        DOMElement.load();
                        DOMElement.play();
                        DOMElement.addEventListener('canplay', (e: Event) => { // Make it work with chrome
                            DOMElement.play();
                        });

                        break;
                    case 'autoplay':
                        <any>DOMElement.autoplay = 'autoplay';
                        break;
                    case 'width':
                        DOMElement.style.width = value + 'px';
                        break;
                    case 'left':
                        DOMElement.style.left = value + 'px';
                        break;
                    case 'top':
                        DOMElement.style.top = value + 'px';
                        break;
                    case 'position':
                        DOMElement.style.position = value;
                        break;
                    default:
                        result = false;
                        break;
                }
            }
        }

        return result;
    }

    getAttributesFromDOMElement(DOMElement: HTMLElement) {
        var attributes = new Attribute[];
        return attributes;
    }
}