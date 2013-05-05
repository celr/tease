///<reference path="Tool.ts" />
///<reference path="BaseTool.ts" />

class DimensionableTool extends BaseTool implements Tool {
    constructor(id: string, DOMElement: JQuery) {
        super(id, DOMElement);

        // Set default values
        this.properties['width'] = '300px';
        this.properties['height'] = '300px';

        this.propertyMapper.directCSSMapping.mapProperty('width');
        this.propertyMapper.directCSSMapping.mapProperty('height');
    }
}