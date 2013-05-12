///<reference path="BaseTool.ts" />
///<reference path="PropertyDisplayGroup.ts" />
///<reference path="Tool.ts" />

class TextTool implements Tool extends BaseTool {
    constructor(public id: string) {
        super(id, $('<textarea class="text-element"></textarea>'));
        this.displayName = 'Text';
        this.displayImagePath = 'Tease/res/text-tool.png';

        this.properties['color'] = 'black';
        this.properties['text-align'] = 'left';
        this.properties['font-size'] = '11px';
        this.properties['font-family'] = 'Arial';
        this.properties['text-shadow'] = 'none';
        this.properties['text-decoration'] = 'none';
        this.properties['line-height'] = 'normal';
        this.properties['word-spacing'] = 'normal';

        this.propertyMapper.directCSSMapping.mapProperty('color');
        this.propertyMapper.directCSSMapping.mapProperty('text-align');
        this.propertyMapper.directCSSMapping.mapProperty('font-size');
        this.propertyMapper.directCSSMapping.mapProperty('text-shadow');
        this.propertyMapper.directCSSMapping.mapProperty('text-decoration');
        this.propertyMapper.directCSSMapping.mapProperty('line-height');
        this.propertyMapper.directCSSMapping.mapProperty('word-spacing');


        this.displayGroups.push(
            new PropertyDisplayGroup('Texto',
                ['color', 'text-align', 'font-size', 'font-family', 'text-shadow',
                'text-decoration', 'line-height', 'word-spacing'],
                ['Color de texto', 'Alineación', 'Tamaño',
                'Fuente', 'Sombra', 'Decoración', 'Alto de línea', 'Espaciado'],
                [new StringPropertyControl('color'),
                new StringPropertyControl('text-align'),
                new StringPropertyControl('font-size'),
                new StringPropertyControl('font-family'),
                new StringPropertyControl('text-shadow'),
                new StringPropertyControl('text-decoration'),
                new StringPropertyControl('line-height'),
                new StringPropertyControl('word-spacing')]
            )
        );
    }
}