///<reference path="../../base/Eventable.ts" />
///<reference path="../canvas/Canvas.ts" />
///<reference path="../../base/Element.ts" />
class PropertyEditor extends Eventable {
    private propertyMap: Object;
    public currentElement: Tease.Element;

    constructor (private DOMElement: JQuery, private propertyDisplayMap: Object) {
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

    private handlePropertyValueChange(property: string, value: string) {
        this.currentElement.setAttribute(this.propertyMap[property], value);
    }

    private renderProperty(property: string, defaultValue: string) {
        var propertyLabel = $('<div>' + property + '</div>');

        // Default property setter
        var propertySetter = $('<input id="' + property + '" type="text"></input>');
        var propertyDisplay = this.propertyDisplayMap[property];

        // Get fancy property control if supported
        if (propertyDisplay) {
            var propertyControl = propertyDisplay.control;
            propertyControl.setValue(defaultValue);
            propertySetter = propertyControl.DOMElement.clone(true);
            propertyLabel.text(propertyDisplay.label);
            propertyControl.addEventListener('valuechange', (e: CustomEvent) => {
                for (var i in e.detail) {
                    this.handlePropertyValueChange(i, e.detail[i]);
                }               
            });
        } else {
            // Event handler for default property setter
            propertySetter.blur((e: Event) => {
                this.handlePropertyValueChange($(e.target).attr('id'), $(e.target).val());
            });
        }
        
        this.propertyMap[property] = property;

        propertyLabel.append(propertySetter);
        this.DOMElement.append(propertyLabel);
    }
}