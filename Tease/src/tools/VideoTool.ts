///<reference path="MediaTool.ts" />
///<reference path="Tool.ts" />

class VideoTool implements Tool extends MediaTool {
    constructor(public id: string) {
        super(id, $('<video id="' + id + '">Your browser does not support the video element.</video>'));

        this.displayName = 'Video';
        // TODO(chadan): Change to proper icon.
        this.displayImagePath = 'res/play-icon.png';

    }
}