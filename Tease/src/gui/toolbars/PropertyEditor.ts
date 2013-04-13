///<reference path="../../base/Eventable.ts" />
///<reference path="../canvas/Canvas.ts" />
///<reference path="../../base/Element.ts" />
class PropertyEditor extends Eventable {
    private propertyMap: Object;
    public currentElement: Tease.Element;

    constructor (private DOMElement: HTMLElement) {
        super();
        this.propertyMap = new Object;
    }

    public renderPropertiesForElement(element: Tease.Element) {
        this.DOMElement.innerHTML = '';
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
}