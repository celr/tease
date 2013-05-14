///<reference path="Tool.ts" />
///<reference path="DimensionableTool.ts" />

class CanvasTool implements Tool{
    public displayName: string;
    public displayImagePath: string; // Image to be shown on the toolbar
    public properties: Object; // Supported properties
    public defaultDOMElement: JQuery; // Vanilla DOM element to be inserted by Tool, WITHOUT any default attributes
    public toolbarDOMElement: JQuery; // DOM Element for the tool button in the toolbar
    public sizingToolAttributes: {};
    public displayGroups: PropertyDisplayGroup[];
    private propertyMapper: PropertyMapper;
    private propertyUnits: Object;



    constructor(public id: string) {
        this.displayName = 'Canvas';
        
        // Set default values
        this.properties = {
            height: 500,
            width: 800,
            'background-color': 'none',
            'background-image': 'none'
        };
        
        this.propertyUnits = {
            height: 'px',
            width: 'px'
        };
        
        this.propertyMapper = new PropertyMapper();
        this.propertyMapper.directCSSMapping.mapProperty('width');
        this.propertyMapper.directCSSMapping.mapProperty('height');
        this.propertyMapper.directCSSMapping.mapProperty('background-color');
        this.propertyMapper.directCSSMapping.mapProperty('background-image');


        this.displayGroups = [
            new PropertyDisplayGroup("Tamaño",
            ['width', 'height'],
            ['Ancho', 'Alto'],
            [new StringPropertyControl('width'), new StringPropertyControl('height')] 
        )];

        this.displayGroups.push(
            new PropertyDisplayGroup('Fondo',
                ['background-color', 'background-image'],
                ['Color de fondo', 'Imagen de fondo'],
                [new StringPropertyControl('background-color'), new StringPropertyControl('background-image')]
            )
        );

        this.defaultDOMElement = $('<div></div>');
    }

    public setAttributesInDOMElement(attributes: {}, propertyUnits: {}, DOMElement: JQuery) {
        this.propertyMapper.applyAttributes(attributes, propertyUnits, DOMElement);
    }

    public setAttributeInDOMElement(property: string, value: string, propertyUnit: string, DOMElement: JQuery) {
        this.propertyMapper.applyAttribute(property, value, propertyUnit, DOMElement);
    }
}