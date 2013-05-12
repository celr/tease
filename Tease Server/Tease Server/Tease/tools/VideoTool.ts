///<reference path="DimensionableTool.ts" />
///<reference path="Tool.ts" />

class VideoTool implements Tool extends DimensionableTool {
    constructor(public id: string, defaultImagePath: string) {
        super(id, $('<video controls></video>'));
        
        this.displayName = 'Video';
        this.displayImagePath = 'Tease/res/videoTool.png';

        this.properties['video-source'] = '';

        this.propertyMapper.callbackMapping.mapProperty('video-source',
            (property: string, value: string, DOMElement: JQuery) => {
                if (property === 'image-source') {
                    DOMElement.attr('src', value);
                }
            }
        );
    }
}