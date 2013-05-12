///<reference path="BackgroundableTool.ts" />
///<reference path="PropertyDisplayGroup.ts" />
///<reference path="Tool.ts" />

class RectangleTool implements Tool extends BackgroundableTool {
    constructor(public id: string) {
        super(id, $('<div id="rect-element"></div>'));
        this.displayName = 'Rectangle';
        this.displayImagePath = 'Tease/res/rect-tool.png';

        this.properties['width'] = '150';
        this.properties['height'] = '150';
        this.properties['border'] = 'solid black 1px';
        this.properties['background-color'] = '#ccc';
    }
}