///<reference path="../lib/jquery.d.ts" />

class Property {
    range: Object;

    constructor (public id: string, public displayName: string) { }
}

class Attribute {
    constructor (public property: Property, public value: string) { }
}

interface Tool {
    displayName: string;
    displayImagePath: string; // Image to be shown on the toolbar
    id: string; // Unique id for this tool
    properties: Property[]; // Supported properties
    defaultAttributes: Attribute[];
    defaultDOMElement: HTMLElement; // Vanilla DOM element to be inserted by Tool, WITHOUT any default attributes
    toolbarDOMElement: HTMLElement; // DOM Element for the tool button in the toolbar
    sizingToolAttributes: Attribute[];

    setAttributesInDOMElement(attributes: Attribute[], DOMElement: HTMLElement): void;
    getAttributesFromDOMElement(DOMElement: HTMLElement): Attribute[];
}

class ImageTool implements Tool {
    displayName: string;
    displayImagePath: string;
    properties: Property[];
    defaultAttributes: Attribute[];
    defaultDOMElement: HTMLImageElement;
    toolbarDOMElement: HTMLElement;
    sizingToolAttributes: Attribute[];

    constructor (public id: string, defaultImage: string) {
        this.displayName = 'Image';
        this.displayImagePath = 'res/imageTool.png';
        this.defaultDOMElement = <HTMLImageElement> document.createElement('img');
        this.defaultDOMElement.src = defaultImage;
        this.id = id;
        this.properties = new Property[];
        this.sizingToolAttributes = new Attribute[]; //properties that indicate how sizing tool manipulates this tool

        var widthProperty = new Property('width', 'ancho');
        var heightProperty = new Property('height', 'largo');
        var topProperty = new Property('top', 'top');
        var leftProperty = new Property('left', 'left');
        var mirrorXProperty = new Property('mirrorX', 'mirrorX');
        var mirrorYProperty = new Property('mirrorY', 'mirrorY');
        var positionProperty = new Property('position', 'Posicion');

        //adding sizing tool properties
        this.sizingToolAttributes.push(new Attribute(widthProperty, this.defaultDOMElement.width.toString()));
        this.sizingToolAttributes.push(new Attribute(heightProperty, this.defaultDOMElement.height.toString()));
        this.sizingToolAttributes.push(new Attribute(mirrorXProperty, '1'));
        this.sizingToolAttributes.push(new Attribute(mirrorYProperty, '1'));
        this.sizingToolAttributes.push(new Attribute(topProperty, ''));
        this.sizingToolAttributes.push(new Attribute(leftProperty, ''));
        this.sizingToolAttributes.push(new Attribute(positionProperty, 'absolute'));

        this.properties.push(widthProperty);
        this.properties.push(heightProperty);

        this.defaultDOMElement.addEventListener('load', () => {
            this.defaultAttributes = [
                new Attribute(widthProperty, this.defaultDOMElement.width.toString()),
                new Attribute(heightProperty, this.defaultDOMElement.height.toString())
            ];
        });
    }

    setAttributesInDOMElement(attributes: Attribute[], DOMElement: HTMLElement) {
        var result = false;
        if (attributes) {
            result = true;
            for (var i = 0; i < attributes.length; i++) {
                switch (attributes[i].property.id) {
                    case 'width':
                        DOMElement.style.width = attributes[i].value + 'px';
                        break;
                    case 'height':
                        DOMElement.style.height = attributes[i].value + 'px';
                        break;
                    case 'left':
                        DOMElement.style.left = attributes[i].value + 'px';
                        break;
                    case 'top':
                        DOMElement.style.top = attributes[i].value + 'px';
                        break;
                    case 'mirrorX':
                        if (attributes[i].value == '') attributes[i].value = '1';
                        var regex = /scale\s*\(\s*(-?\d+)\s*,\s*(-?\d+)\s*\)/;
                        var style = <string>$(DOMElement).css('transform');
                        var newStyle = "";
                        if (style.length == 0) {
                            newStyle = "scale(" + attributes[i].value + ", 1)";
                        }
                        else {
                            newStyle = style.replace(regex, "scale(" + attributes[i].value + ", $2)");
                        }
                        $(DOMElement).css('transform', newStyle);
                        break;
                    case 'mirrorY':
                        if (attributes[i].value == '') attributes[i].value = '1';
                        var regex = /scale\s*\(\s*(-?\d+)\s*,\s*(-?\d+)\s*\)/;
                        var style = $(DOMElement).css('webkitTransform');
                        if (style.length == 0) {
                            var newStyle = "scale(1, " + attributes[i].value + ")";
                        }
                        var newStyle = style.replace(regex, "scale($1," + attributes[i].value + ", $2)");
                        $(DOMElement).css('webkitTransform', newStyle);
                        break;
                    case 'position':
                        DOMElement.style.position = attributes[i].value;
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
    defaultAttributes: Attribute[];
    defaultDOMElement: HTMLAudioElement;
    toolbarDOMElement: HTMLElement;
    sourceElement: HTMLSourceElement;
    sizingToolAttributes: Attribute[];

    constructor (public id: string) {
        this.displayName = 'Audio';
        this.displayImagePath = 'res/audioTool.png';
        this.defaultDOMElement = <HTMLAudioElement> document.createElement('audio');
        this.defaultDOMElement.controls = true;
        this.id = id;
        this.properties = new Property[];
        this.sizingToolAttributes = new Attribute[];
        var srcProperty = new Property('source', 'archivo');
        var apProperty = new Property('autoplay', 'autoplay');

        //sizingTool Properties
        var topProperty = new Property('top', 'top');
        var leftProperty = new Property('left', 'left');
        var widthProperty = new Property('width', 'ancho');
        var positionProperty = new Property('position', 'position');


        //adding sizing tool properties
        this.sizingToolAttributes.push(new Attribute(widthProperty, '300'));
        this.sizingToolAttributes.push(new Attribute(topProperty, ''));
        this.sizingToolAttributes.push(new Attribute(leftProperty, ''));
        this.sizingToolAttributes.push(new Attribute(positionProperty, 'absolute'));

        this.properties.push(srcProperty);
        this.defaultAttributes = [
            new Attribute(apProperty, 'true'),
            new Attribute(srcProperty, 'res/audio.mp3')
        ];
    }

    setAttributesInDOMElement(attributes: Attribute[], DOMElement: HTMLAudioElement) {
        var result = false;
        if (attributes) {
            result = true;
            for (var i = 0; i < attributes.length; i++) {
                switch (attributes[i].property.id) {
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
                        DOMElement.style.width = attributes[i].value + 'px';
                        break;
                    case 'left':
                        DOMElement.style.left = attributes[i].value + 'px';
                        break;
                    case 'top':
                        DOMElement.style.top = attributes[i].value + 'px';
                        break;
                    case 'position':
                        DOMElement.style.position = attributes[i].value;
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