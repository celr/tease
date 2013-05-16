///<reference path="BaseTool.ts" />
///<reference path="PropertyDisplayGroup.ts" />
///<reference path="Tool.ts" />
///<reference path="../gui/toolbars/property-controls/FontPropertyControl.ts" />
///<reference path="../gui/toolbars/property-controls/DimensionPropertyControl.ts" />
///<reference path="../gui/toolbars/property-controls/SliderPropertyControl.ts" />
///<reference path="../gui/toolbars/property-controls/SelectPropertyControl.ts" />

class TextTool implements Tool extends BaseTool {
    constructor(public id: string) {
        super(id, $('<div></div>'));
        this.displayName = 'Texto';
        this.displayImagePath = 'Tease/src/res/text-tool.png';
        this.description = 'Herramienta para insertar texto';

        this.properties['color'] = '#000000';
        this.properties['text-align'] = 'left';
        this.properties['font-size'] = '14';
        this.properties['font-family'] = 'Arial';
        this.properties['text-shadow'] = 'none';
        this.properties['text-decoration'] = 'none';
        this.properties['line-height'] = 'normal';
        this.properties['word-spacing'] = 'normal';
        this.properties['text'] = 'Texto';

        this.propertyUnits['font-size'] = 'px';

        this.propertyMapper.directCSSMapping.mapProperty('color');
        this.propertyMapper.directCSSMapping.mapProperty('text-align');
        this.propertyMapper.directCSSMapping.mapProperty('font-size');
        this.propertyMapper.directCSSMapping.mapProperty('text-shadow');
        this.propertyMapper.directCSSMapping.mapProperty('text-decoration');
        this.propertyMapper.directCSSMapping.mapProperty('line-height');
        this.propertyMapper.directCSSMapping.mapProperty('word-spacing');
        this.propertyMapper.directCSSMapping.mapProperty('font-family');
        this.propertyMapper.callbackMapping.mapProperty('text', (property: string, value: string, DOMElement: JQuery) => {
            if (property === 'text') {
                DOMElement.text(value);
            }
        });

        this.displayGroups.push(
            new PropertyDisplayGroup('Texto',
                ['text', 'color', 'text-align', 'font-size', 'font-family', 'text-shadow',
                'text-decoration', 'line-height', 'word-spacing'],
                ['Texto', 'Color de texto', 'Alineaci�n', 'Tama�o',
                'Fuente', 'Sombra', 'Decoraci�n', 'Alto de l�nea', 'Espaciado'],
                [new StringPropertyControl('text'),
                new ColorPropertyControl('color'),
                new StringPropertyControl('text-align'),
                new DimensionPropertyControl('font-size', ['px', 'pt'], ['pixeles', 'puntos']),
                new FontPropertyControl('font-family'),
                new StringPropertyControl('text-shadow'),
                new StringPropertyControl('text-decoration'),
                new DimensionPropertyControl('line-height', ['px', 'pt'], ['pixeles', 'puntos']),
                new StringPropertyControl('word-spacing')]
            )
        );
    }
}