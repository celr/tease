///<reference path="SizableTool.ts" />
///<reference path="Tool.ts" />

class ImageTool implements Tool extends SizableTool {
    constructor(public id: string, defaultImagePath: string) {
        super(id, $('<img id="' + id + '" src = "' + defaultImagePath + '"></img>'));

        this.defaultAttributes['height'] = '300';
        this.defaultAttributes['width'] = '300';
        this.defaultAttributes['image-source'] = defaultImagePath;

        this.displayName = 'Image';
        this.displayImagePath = 'res/imageTool.png';
    }

    public setAttributesInDOMElement(attributes: {}, DOMElement: JQuery) {
        var result = super.setAttributesInDOMElement(attributes, DOMElement);

        for (var i in attributes) {
            var value = attributes[i];
            switch (i) {
                case 'image-source':
                    DOMElement.css('background-image', 'url(\'' + value + '\')');
                    break;
                default:
                    result = false;
                    break;
            }
        }

        return result;
    }
}