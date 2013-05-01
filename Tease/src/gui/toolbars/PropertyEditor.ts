///<reference path="../../base/Eventable.ts" />
///<reference path="../canvas/Canvas.ts" />
///<reference path="../../base/Element.ts" />
class PropertyEditor extends Eventable {
    private propertyMap: Object;
    public currentElement: Tease.Element;

    constructor (private DOMElement: JQuery) {
        super();
        this.propertyMap = new Object;
    }

    public renderPropertiesForElement(element: Tease.Element) {
        this.DOMElement.text('');

        for (var i in element.parentTool.properties) {
            var defaultValue = element.getAttribute(element.parentTool.properties[i]);
            this.renderProperty(element.parentTool.properties[i], defaultValue);
        }
    }

    private handlePropertyBlur(e: Event) {
        var value = $(e.currentTarget).val();
        this.currentElement.setAttribute(this.propertyMap[$(e.currentTarget).attr('id')], value);
    }

    private renderProperty(property: string, defaultValue: string) {
        var newProperty = $('<div>' + property + '</div>');
        var newValue = $('<input id="' + property + '"></input>');
        this.propertyMap[property] = property;

        newValue.bind('blur', (e: Event) => {
            this.handlePropertyBlur(e);
        });

        if (defaultValue) {
            newValue.val(defaultValue);
        }
        newProperty.append(newValue);
        this.DOMElement.append(newProperty);
    }
}