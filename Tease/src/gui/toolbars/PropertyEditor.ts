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
        for (var i = 0; i < element.parentTool.properties.length; i++) {
            var defaultValue = element.attributes.getAttribute(element.parentTool.properties[i]).value;
            this.renderProperty(element.parentTool.properties[i], defaultValue);
        }
    }

    private findAttributeForProperty(property: Property, attributes: Attribute[]) {
        var value = null;

        if (attributes) {
            for (var i = 0; i < attributes.length; i++) {
                if (property === attributes[i].property) {
                    value = attributes[i].value;
                    break;
                }
            }
        }

        return value;
    }

    private handlePropertyBlur(e: Event) {
        var value = $(e.currentTarget).val();
        var attribute = new Attribute(this.propertyMap[$(e.currentTarget).attr('id')], value);
        this.currentElement.setAttribute(attribute);
    }

    private renderProperty(property: Property, defaultValue: string) {
        var newProperty = $('<div>' + property.displayName + '</div>');
        var newValue = $('<input id="' + property.id + '"></input>');
        this.propertyMap[property.id] = property;

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