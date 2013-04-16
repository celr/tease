///<reference path="Tool.ts" />

class AudioTool implements Tool {
    public displayName: string;
    public displayImagePath: string;
    public properties: Property[];
    public defaultAttributes: AttributeList;
    public defaultDOMElement: JQuery;
    public toolbarDOMElement: JQuery;
    public sourceElement: JQuery;
    public sizingToolAttributes: AttributeList;

    constructor(public id: string) {
        this.displayName = 'Audio';
        this.displayImagePath = 'res/audioTool.png';
        this.defaultDOMElement = $('<audio id="' + id + '" controls="true"></audio>');
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
        this.properties.push(topProperty);
        this.properties.push(leftProperty);
        this.defaultAttributes = new AttributeList;
        this.defaultAttributes.setAttribute(new Attribute(apProperty, 'true'));
        this.defaultAttributes.setAttribute(new Attribute(srcProperty, 'res/audio.mp3'));
    }

    public setAttributesInDOMElement(attributes: AttributeList, DOMElement: JQuery) {
        var result = false;
        if (attributes) {
            result = true;
            for (var i in attributes.attributes) {
                var value = attributes.attributes[i].value;
                switch (attributes.attributes[i].property.id) {
                    case 'source':
                        // Remove any previous source tags
                        DOMElement.empty();

                        var source = $('<source src="' + attributes[i].value + '" type="audio/mp3"></source>');
                        DOMElement.append(source);
                        DOMElement.get().load();
                        DOMElement.get().play();
                        DOMElement.bind('canplay', (e: Event) => { // Make it work with chrome
                            DOMElement.get().play();
                        });

                        break;
                    case 'autoplay':
                        DOMElement.attr('autoplay', 'autoplay');
                        break;
                    case 'width':
                        DOMElement.css('width', value + 'px');
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