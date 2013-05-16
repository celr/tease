///<reference path="Tool.ts" />
///<reference path="PropertyMapping.ts" />
///<reference path="PropertyDisplayGroup.ts" />
///<reference path="../gui/toolbars/property-controls/StringPropertyControl.ts" />
///<reference path="../gui/toolbars/property-controls/DimensionPropertyControl.ts" />
///<reference path="../gui/toolbars/property-controls/SliderPropertyControl.ts" />
///<reference path="../gui/toolbars/property-controls/SelectPropertyControl.ts" />

class BaseTool implements Tool {
    // Menu display properties
    public displayName: string;
    public displayImagePath: string;
    public description: string;
    public displayGroups: PropertyDisplayGroup[];

    // Attributes and properties
    public properties: Object;
    public propertyUnits: Object;
    public sizingToolAttributes: Object; // Properties that indicate how sizing tool manipulates this tool
    public propertyMapper: PropertyMapper;

    // DOM Elements
    public toolbarDOMElement: JQuery;

    constructor(public id: string, public defaultDOMElement: JQuery) {
        this.sizingToolAttributes = {};

        // Set default attributes
        this.properties = {
            elementName: '',
            opacity: '1.0',
            left: '0',
            top: '0',
            visibility: 'visible',
            'border-color': '#000000',
            'border-width': '1',
            'border-style': 'solid',
            position: 'absolute',
            rotation: '0'
        };

        this.propertyUnits = {
            left: 'px',
            top: 'px',
            rotation: 'deg',
            'border-width': 'px'
        };

        this.propertyMapper = new PropertyMapper();

        this.propertyMapper.callbackMapping.mapProperty('elementName',
            (property: string, value: string, DOMElement: JQuery) => {
                if (property === 'elementName') {
                    DOMElement.attr('element-name', value);
                }
            }
        );

        this.propertyMapper.directCSSMapping.mapProperty('opacity');
        this.propertyMapper.directCSSMapping.mapProperty('left');
        this.propertyMapper.directCSSMapping.mapProperty('top');
        this.propertyMapper.directCSSMapping.mapProperty('visibility');
        this.propertyMapper.directCSSMapping.mapProperty('border-color');
        this.propertyMapper.directCSSMapping.mapProperty('border-width');
        this.propertyMapper.directCSSMapping.mapProperty('border-style');

        this.propertyMapper.directCSSMapping.mapProperty('position');
        this.propertyMapper.transformCSSMapping.mapProperty('rotation', 'rotate');

        var dimensionUnits = ['px', 'in', 'pt'];
        var dimensionUnitLabels = ['pixeles', 'pulgadas', 'puntos'];

        var rotationUnits = ['deg', 'rad'];
        var rotationUnitLabels = ['grados', 'radianes'];

        this.displayGroups = [
            new PropertyDisplayGroup('Nombrado',
                ['elementName'],
                ['Nombre'],
                [new StringPropertyControl('elementName')]
            ),

            new PropertyDisplayGroup('Posicionamiento',
                ['top', 'left', 'rotation'],
                ['Arriba', 'Izquierda', 'Rotación'],
                [new DimensionPropertyControl('top', dimensionUnits, dimensionUnitLabels),
                    new DimensionPropertyControl('left', dimensionUnits, dimensionUnitLabels),
                    new DimensionPropertyControl('rotation', rotationUnits, rotationUnitLabels)]
            ),

            new PropertyDisplayGroup('Borde',
                ['border-style', 'border-width', 'border-color'],
                ['Estilo de borde', 'Tamaño de borde', 'Color de borde'],
                [new SelectPropertyControl('border-style', ['solid', 'dashed', 'dotted', 'double', 'groove'], ['Sólido', 'Lineado', 'Puntos', 'Doble', '3D']),
                 new DimensionPropertyControl('border-width', dimensionUnits, dimensionUnitLabels),
                 new ColorPropertyControl('border-color')
                ]
            ),

            new PropertyDisplayGroup('Visibilidad',
                ['visibility', 'opacity'],
                ['Ocultar', 'Opacidad'],
                [new SelectPropertyControl('visibility', ['visible', 'hidden'], ['Mostrar', 'Ocultar']),
                 new SliderPropertyControl('opacity', 0, 1, 0.1, 1),
                ]
            )
        ];
    }

    public setAttributesInDOMElement(attributes: Object, propertyUnits: Object, DOMElement: JQuery) {
        this.propertyMapper.applyAttributes(attributes, propertyUnits, DOMElement);
    }

    public setAttributeInDOMElement(property: string, value: string, unit: string, DOMElement: JQuery) {
        this.propertyMapper.applyAttribute(property, value, unit, DOMElement);
    }

    public getAnimationPropertiesFromChangeList(changeList: Object, propertyUnits: Object, element: Tease.Element) {
        this.propertyMapper.getAnimationProperties(changeList, propertyUnits, element);
    }
}