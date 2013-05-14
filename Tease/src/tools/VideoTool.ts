///<reference path="MediaTool.ts" />
///<reference path="Tool.ts" />

class VideoTool implements Tool extends MediaTool {
    constructor(public id: string) {
        super(id, $('<video id="' + id + '">Your browser does not support the video element.</video>'));

        this.displayName = 'Video';
        this.displayImagePath = 'res/video-tool.png';

    }
}