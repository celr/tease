///<reference path="SizableTool.ts" />
///<reference path="Tool.ts" />

class ImageTool implements Tool extends SizableTool {
    constructor(public id: string, defaultImagePath: string) {
        super(id, $('<img id="' + id + '" src = "' + defaultImagePath + '"></img>'));

        this.defaultAttributes.setAttribute(new Attribute(this.properties['height'], '50'));
        this.defaultAttributes.setAttribute(new Attribute(this.properties['width'], '50'));
        this.displayName = 'Image';
        this.displayImagePath = 'res/imageTool.png';

        // Supported properties
        var sourceProperty = new Property('image-source', 'Source', 'background-image');
        this.defaultAttributes.setAttribute(new Attribute(sourceProperty, defaultImagePath));
    }

    public setAttributesInDOMElement(attributes: AttributeList, DOMElement: JQuery) {
        var result = super.setAttributesInDOMElement(attributes, DOMElement);
        if (!result && attributes) {
            result = true;
            for (var i in attributes.attributes) {
                var value = attributes.attributes[i].value;
                switch (attributes.attributes[i].property.id) {
                    case 'source':
                        DOMElement.css('background-image', 'url(\'' + value + '\')');
                        break;
                    default:
                        result = false;
                        break;
                }
            }
        }

        return result;
    }
}