///<reference path="../../base/Eventable.ts" />
///<reference path="../canvas/Canvas.ts" />
///<reference path="../../base/Element.ts" />
class PropertyEditor extends Eventable {
    private propertyMap: Object;

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
        var value = (<HTMLInputElement>e.currentTarget).value;
        var attribute = new Attribute(this.propertyMap[(<HTMLInputElement>e.currentTarget).id], value);
        this.currentElement.setAttribute(attribute);
    }

    private renderProperty(property: Property, defaultValue: string) {
        var newProperty = document.createElement('div');
        newProperty.innerText = property.displayName;
        var newValue = <HTMLInputElement> document.createElement('input');
        newValue.id = property.id;
        this.propertyMap[property.id] = property;

        newValue.addEventListener('blur', (e: Event) => {
            this.handlePropertyBlur(e);
        });

        if (defaultValue) {
            newValue.value = defaultValue;
        }
        newProperty.appendChild(newValue);
        this.DOMElement.appendChild(newProperty);
    }

    renderPropertiesForElement(element: Tease.Element) {
        this.DOMElement.innerHTML = '';
        for (var i = 0; i < element.parentTool.properties.length; i++) {
            var defaultValue = this.findAttributeForProperty(element.parentTool.properties[i], element.attributes);
            this.renderProperty(element.parentTool.properties[i], defaultValue);
        }
    }

    constructor (private DOMElement: HTMLElement, public currentElement: Tease.Element) {
        super();
        this.propertyMap = new Object;
    }
}