///<reference path="BaseTool.ts" />
///<reference path="PropertyDisplayGroup.ts" />
///<reference path="Tool.ts" />

class ListTool implements Tool extends BaseTool {
    constructor(public id: string) {
        super(id, $('<ul></ul>'));
        this.displayName = 'List';
        this.displayImagePath = 'res/list-tool.png';

        this.properties['ordered'] = 'false';
        this.properties['values'] = 'Lista';

        this.propertyMapper.callbackMapping.mapProperty('ordered',
            (property: string, value: string, DOMElement: JQuery) => {
                if (property === 'ordered') {
                    if (value === 'true') {
                        DOMElement[0].style.listStyle = "decimal";
                    } else {
                        DOMElement[0].style.listStyle = "circle";
                    }
                }
            }
        );

        this.propertyMapper.callbackMapping.mapProperty('values',
            (property: string, value: string, DOMElement: JQuery) => {
                DOMElement[0].innerHTML = "";  // Clears the contents of the list.
                var singleValues: string[] = value.split("\|\&\|");
                for (var i: number = 0; i < singleValues.length; ++i) {
                    if (singleValues[i].trim().length > 0) {  // If value is not only spaces.
                        var child = $("<li>" + singleValues[i] + "</li>");
                        DOMElement.append(child);
                    }
                }
            }
        );

        this.displayGroups.push(
            new PropertyDisplayGroup('Lista',
                ['ordered', 'values'],
                ['Ordenada', 'Valores'],
                [new StringPropertyControl('ordered'), new ListPropertyControl('values')]
            )
        );
    }

}