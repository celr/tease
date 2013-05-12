///<reference path="BaseTool.ts" />
///<reference path="Tool.ts" />

class AudioTool implements Tool extends BaseTool {
    constructor(public id: string) {
        super(id, $('<audio id="' + id + '" controls="true"></audio>'));
        this.displayName = 'Audio';
        this.displayImagePath = 'Tease/res/audioTool.png';

        this.properties['source'] = 'archivo';
        this.properties['autoplay'] = 'Tease/res/audio.mp3';
    }

    /*
    public setAttributesInDOMElement(attributes: {}, DOMElement: JQuery) {
        var result = super.setAttributesInDOMElement(attributes, DOMElement);

        if (!result && attributes) {
            result = true;
            for (var i in attributes) {
                var value = attributes[i];
                switch (i) {
                    case 'source':
                        // Remove any previous source tags
                        DOMElement.empty();

                        var source = $('<source src="' + value + '" type="audio/mp3"></source>');
                        DOMElement.append(source);
                        if (DOMElement.get().load)
                            DOMElement.get().load();
                        if (DOMElement.get().play)
                            DOMElement.get().play();
                        DOMElement.bind('canplay', (e: Event) => { // Make it work with chrome
                            if (DOMElement.get().play)
                                DOMElement.get().play();
                        });

                        break;
                    case 'autoplay':
                        DOMElement.attr('autoplay', 'autoplay');
                        break;
                    default:
                        result = false;
                        break;
                }
            }
        }

        //return result;
    }

    public getAttributesFromDOMElement(DOMElement: JQuery) {
        var attributes = {};
        return attributes;
    }*/
}