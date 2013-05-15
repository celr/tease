///<reference path="BackgroundableTool.ts" />
///<reference path="PropertyDisplayGroup.ts" />
///<reference path="Tool.ts" />

class EllipseTool implements Tool extends BackgroundableTool {
    constructor(public id: string) {
        super(id, $('<div id="' + id + '"></div>'));
        this.displayName = 'Ellipse';
        this.displayImagePath = 'Tease/src/res/ellipse-tool.png';

        this.properties['width'] = '100';
        this.properties['height'] = '100';
        this.properties['border'] = 'solid black 1px';
        this.properties['background-color'] = '#cccccc';

        this.propertyUnits['width'] = 'px';
        this.propertyUnits['height'] = 'px';


        this.propertyMapper.callbackMapping.mapProperty('width',
            (property: string, value: string, DOMElement: JQuery) => {
                if (property === 'width') {
                    DOMElement[0].style.width = value;
                    DOMElement[0].style.borderRadius = (parseInt(DOMElement[0].style.width) / 2) + this.propertyUnits['width'] + " / " +
                                                       (parseInt(DOMElement[0].style.height) / 2) + this.propertyUnits['height'];
                }
            }
        );
        this.propertyMapper.callbackMapping.mapProperty('height',
            (property: string, value: string, DOMElement: JQuery) => {
                if (property === 'height') {
                    DOMElement[0].style.height = value;
                    DOMElement[0].style.borderRadius = (parseInt(DOMElement[0].style.width) / 2) + this.propertyUnits['width'] + " / " +
                                                       (parseInt(DOMElement[0].style.height) / 2) + this.propertyUnits['height'];
                }
            }
        );
        this.propertyMapper.directCSSMapping.mapProperty('background-color');
    }
}

