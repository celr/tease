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

    constructor (public id: string, defaultImage: string) {
        this.displayName = 'Image';
        this.displayImagePath = 'res/imageTool.png';
        this.defaultDOMElement = <HTMLImageElement> document.createElement('img');
        this.defaultDOMElement.src = defaultImage;
        this.id = id;
        this.properties = new Property[];
        var widthProperty = new Property('width', 'ancho');
        var heightProperty = new Property('height', 'largo');
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

    constructor (public id: string) {
        this.displayName = 'Audio';
        this.displayImagePath = 'res/audioTool.png';
        this.defaultDOMElement = <HTMLAudioElement> document.createElement('audio');
        this.defaultDOMElement.controls = true;
        this.id = id;
        this.properties = new Property[];
        var srcProperty = new Property('source', 'archivo');
        var apProperty = new Property('autoplay', 'autoplay');
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