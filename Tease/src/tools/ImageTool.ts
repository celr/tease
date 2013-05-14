///<reference path="BackgroundableTool.ts" />
///<reference path="PropertyDisplayGroup.ts" />
///<reference path="Tool.ts" />

class ImageTool implements Tool extends BackgroundableTool {
    private propertyDisplayMap: Object;
    public propertyDisplayGroups: PropertyDisplayGroup[];

    constructor(public id: string) {
        super(id, $('<img id="' + id + '" src = "Tease/src/res/default-image.png"></img>'));
        this.displayName = 'Image';
        this.displayImagePath = 'Tease/src/res/image-tool.png';

        this.properties['image-source'] = 'Tease/src/res/default-image.png';
        this.properties['width'] = '150';
        this.properties['height'] = '150';

        this.displayGroups.push(
            new PropertyDisplayGroup('Imagen',
                ['image-source'],
                ['Fuente de imagen'],
                [new StringPropertyControl('image-source')]
            )
        );

        this.propertyMapper.callbackMapping.mapProperty('image-source',
            (property: string, value: string, DOMElement: JQuery) => {
                if (property === 'image-source') {
                    DOMElement.attr('src', value);
                }
            }
        );
    }
}