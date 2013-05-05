///<reference path="Tool.ts" />
///<reference path="DimensionableTool.ts" />

class BackgroundableTool extends DimensionableTool implements Tool {
    constructor(id: string, DOMElement: JQuery) {
        super(id, DOMElement);

        // Set default values
        this.properties['background-color'] = 'none';
        this.properties['background-image'] = 'none';

        this.propertyMapper.directCSSMapping.mapProperty('background-color');
        this.propertyMapper.directCSSMapping.mapProperty('background-image');

        this.displayGroups.push(
            new PropertyDisplayGroup('Fondo',
                ['background-color', 'background-image'],
                ['Color de fondo', 'Imagen de fondo'],
                [new StringPropertyControl('background-color'), new StringPropertyControl('background-image')]
            )
        );
    }
}