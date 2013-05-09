///<reference path="Tool.ts" />
///<reference path="BaseTool.ts" />

class DimensionableTool extends BaseTool implements Tool {
    constructor(id: string, DOMElement: JQuery) {
        super(id, DOMElement);

        // Set default values
        this.properties['width'] = '300';
        this.properties['height'] = '300';
        
        this.propertyUnits['width'] = 'px';
        this.propertyUnits['height'] = 'px';

        this.propertyMapper.directCSSMapping.mapProperty('width');
        this.propertyMapper.directCSSMapping.mapProperty('height');
    }
}