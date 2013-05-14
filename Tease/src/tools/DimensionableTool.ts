///<reference path="Tool.ts" />
///<reference path="BaseTool.ts" />
///<reference path="../gui/toolbars/property-controls/DimensionPropertyControl.ts" />

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

        var dimensionUnits = ['px', 'in', 'pt'];
        var dimensionUnitLabels = ['pixeles', 'pulgadas', 'puntos'];

        this.displayGroups.push(new PropertyDisplayGroup('Tamaño',
                ['width', 'height'],
                ['Ancho', 'Alto'],
                [new DimensionPropertyControl('width', dimensionUnits, dimensionUnitLabels),
                    new DimensionPropertyControl('height', dimensionUnits, dimensionUnitLabels)]
        ));
    }
}