///<reference path="BackgroundableTool.ts" />
///<reference path="PropertyDisplayGroup.ts" />
///<reference path="Tool.ts" />

class EllipseTool implements Tool extends BackgroundableTool {
    constructor(public id: string) {
        super(id, $('<div id="' + id + '"></div>'));
        this.displayName = 'Elipse';
        this.displayImagePath = 'Tease/src/res/ellipse-tool.png';
        this.description = "Herramienta para insertar elipses";

        this.properties['width'] = '100';
        this.properties['height'] = '100';
        this.properties['border'] = 'solid black 1px';
        this.properties['background-color'] = '#cccccc';

        this.propertyUnits['width'] = '';
        this.propertyUnits['height'] = '';

        this.propertyMapper.multipleCSSMapping.mapProperty('width', {
            'border-radius': (value: string, DOMElement: JQuery) => {
                return (parseInt(value) / 2) + 'px' + " / " +
                          (parseInt(DOMElement[0].style.height) / 2) + 'px';
            },

            width: (value: string, DOMElement: JQuery) => {
                return value + 'px';
            }
        });

        this.propertyMapper.multipleCSSMapping.mapProperty('height', {
            'border-radius': (value: string, DOMElement: JQuery) => {
                return (parseInt(DOMElement[0].style.width) / 2) + 'px' + " / " +
                         (parseInt(value) / 2) + 'px';
            },

            height: (value: string, DOMElement: JQuery) => {
                return value + 'px';
            }
        });


        
        this.propertyMapper.directCSSMapping.mapProperty('background-color');
    }
}

