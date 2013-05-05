///<reference path="../../base/Eventable.ts" />
///<reference path="../canvas/Canvas.ts" />
///<reference path="../../base/Element.ts" />
///<reference path="../../tools/PropertyDisplayGroup.ts" />

class PropertyEditor extends Eventable {
    private propertyMap: Object;
    public currentElement: Tease.Element;

    constructor (private DOMElement: JQuery) {
        super();
        this.propertyMap = new Object;
    }

    public renderPropertiesForElement(element: Tease.Element) {
        this.DOMElement.text('');

        if (element.parentTool.displayGroups) {
            for (var i in element.parentTool.displayGroups) {
                this.renderDisplayGroup(element, element.parentTool.displayGroups[i]);
            }
        }
    }

    private renderDisplayGroup(element: Tease.Element, displayGroup: PropertyDisplayGroup) {
        $('<div class="nav-header">' + displayGroup.label + '</div>').appendTo(this.DOMElement);
        
        for (var i in displayGroup.properties) {
            var property = displayGroup.properties[i];
            var defaultValue = element.parentTool.properties[property];

            if (element.attributes[property]) {
                defaultValue = element.attributes[property];
            }

            this.renderProperty(property, defaultValue, displayGroup.propertyLabels[i],
                displayGroup.propertyControls[i]);
        }
    }

    private handlePropertyValueChange(property: string, value: string) {
        this.currentElement.setAttribute(this.propertyMap[property], value);
    }

    private renderProperty(property: string, defaultValue: string, propertyLabel: string, propertyControl?: PropertyControl) {
        var propertyLabelDiv = $('<div>' + property + '</div>');

        // Default property setter
        var propertySetter = $('<input id="' + property + '" type="text"></input>');

        // Get fancy property control if supported
        if (propertyControl) {
            propertyControl.setValue(defaultValue);
            propertySetter = propertyControl.DOMElement.clone(true);
            propertyLabelDiv.text(propertyLabel);
            propertyControl.addEventListener('valuechange', (e: CustomEvent) => {
                for (var i in e.detail) {
                    this.handlePropertyValueChange(i, e.detail[i]);
                }               
            }, true);
        } else {
            // Event handler for default property setter
            propertySetter.blur((e: Event) => {
                this.handlePropertyValueChange($(e.target).attr('id'), $(e.target).val());
            });
        }
        
        this.propertyMap[property] = property;

        propertyLabelDiv.append(propertySetter);
        this.DOMElement.append(propertyLabelDiv);
    }
}