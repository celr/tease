///<reference path="MediaTool.ts" />
///<reference path="Tool.ts" />

class AudioTool implements Tool extends MediaTool {
    constructor(public id: string) {
        super(id, $('<audio id="' + id + '">Your browser does not support the audio element.</audio>'));

        this.properties['height'] = '50';

        this.displayName = 'Audio';
        this.displayImagePath = 'Tease/src/res/audioTool.png';

    }
}