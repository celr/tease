///<reference path="BaseTool.ts" />
///<reference path="PropertyDisplayGroup.ts" />
///<reference path="Tool.ts" />

class ListTool implements Tool extends BaseTool {
    constructor(public id: string) {
        super(id, $('<ul></ul>'));
        this.displayName = 'List';
        this.displayImagePath = 'Tease/res/list-tool.png';

        this.properties['ordered'] = 'false';

        this.propertyMapper.callbackMapping.mapProperty('ordered',
            (property: string, value: string, DOMElement: JQuery) => {
                if (property === 'ordered') {
                    if (value === 'true') {
                        this.orderList(DOMElement);
                    } else {
                        this.unorderList(DOMElement);
                    }
                }
            }
        );
    }

    private orderList(DOMElement: JQuery) {
        var currentList = DOMElement.clone(true);
        DOMElement = $('<ol></ol>');
        DOMElement.append(currentList.find('li'));
    }

    private unorderList(DOMElement: JQuery) {
        var currentList = DOMElement.clone(true);
        DOMElement = $('<ul></ul>');
        DOMElement.append(currentList.find('li'));
    }
}