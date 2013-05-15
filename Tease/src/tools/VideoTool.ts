///<reference path="MediaTool.ts" />
///<reference path="Tool.ts" />

class VideoTool implements Tool extends MediaTool {
    constructor(public id: string, private pageId) {
        super(id, $('<video id="' + id + '">Your browser does not support the video element.</video>'), pageId);

        this.displayName = 'Video';
        this.displayImagePath = 'Tease/src/res/video-tool.png';

    }
}