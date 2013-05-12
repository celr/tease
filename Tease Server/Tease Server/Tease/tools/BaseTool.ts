///<reference path="Tool.ts" />
///<reference path="PropertyMapping.ts" />
///<reference path="PropertyDisplayGroup.ts" />
///<reference path="../gui/toolbars/property-controls/StringPropertyControl.ts" />

class BaseTool implements Tool {
    // Menu display properties
    public displayName: string;
    public displayImagePath: string;
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
            opacity: '1.0',
            left: '0',
            top: '0',
            visibility: 'visible',
            border: 'none',
            position: 'absolute',
            rotation: '0'
        };

        this.propertyUnits = {
            left: 'px',
            top: 'px',
            rotation: 'deg'
        };

        this.propertyMapper = new PropertyMapper();
        this.propertyMapper.directCSSMapping.mapProperty('opacity');
        this.propertyMapper.directCSSMapping.mapProperty('left');
        this.propertyMapper.directCSSMapping.mapProperty('top');
        this.propertyMapper.directCSSMapping.mapProperty('visibility');
        this.propertyMapper.directCSSMapping.mapProperty('border');
        this.propertyMapper.directCSSMapping.mapProperty('position');
        this.propertyMapper.transformCSSMapping.mapProperty('rotation', 'rotate');

        this.displayGroups = [
            new PropertyDisplayGroup('Posicionamiento y tamaño',
                ['width', 'height', 'top', 'left', 'rotation'],
                ['Ancho', 'Alto', 'Arriba', 'Izquierda', 'Rotación'],
                [new StringPropertyControl('width'), new StringPropertyControl('height'), new StringPropertyControl('top'), new StringPropertyControl('left'), new StringPropertyControl('rotation')]
            ),

            new PropertyDisplayGroup('Visibilidad',
                ['visibility', 'opacity', 'border'],
                ['Ocultar', 'Opacidad', 'Bordes'],
                [new StringPropertyControl('visibility'),
                 new StringPropertyControl('opacity'),
                 new StringPropertyControl('border')]
            )
        ];
    }

    public setAttributesInDOMElement(attributes: Object, propertyUnits: Object, DOMElement: JQuery) {
        this.propertyMapper.applyAttributes(attributes, propertyUnits, DOMElement);
    }

    public setAttributeInDOMElement(property: string, value: string, unit: string, DOMElement: JQuery) {
        this.propertyMapper.applyAttribute(property, value, unit, DOMElement);
    }

    public getAnimationPropertiesFromChangeList(changeList: Object, propertyUnits: Object) {
        this.propertyMapper.getAnimationProperties(changeList, propertyUnits);
    }
}