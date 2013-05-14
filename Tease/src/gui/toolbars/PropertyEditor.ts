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
            var defaultValue = element.attributes[property] || element.parentTool.properties[property];
            var propertyUnit = element.propertyUnits[property] || '';

            this.renderProperty(property, defaultValue, propertyUnit, displayGroup.propertyLabels[i],
                displayGroup.propertyControls[i]);
        }
    }

    private handlePropertyValueChange(property: string, value: string, unit: string) {
        this.currentElement.setPropertyUnit(property, unit);
        this.currentElement.setAttribute(this.propertyMap[property], value);
        this.currentElement.DOMElement.trigger('elementEdited', this.currentElement);
    }

    private renderProperty(property: string, defaultValue: string, propertyUnit: string, propertyLabel: string, propertyControl?: PropertyControl) {
        // Create property label
        var propertyLabelDiv = $('<div>' + propertyLabel + '</div>');

        // Default property setter
        var propertySetter = $('<input id="' + property + '" type="text"></input>');

        // Get fancy property control if supported
        if (propertyControl) {
            var propertyControlInstance = propertyControl.getCopy();
            propertySetter = propertyControlInstance.DOMElement;
            propertyLabelDiv.append(propertySetter);
            this.DOMElement.append(propertyLabelDiv);
            propertyControlInstance.setGUIValue(defaultValue, propertyUnit);

            propertyControlInstance.addEventListener('valuechange', (e: CustomEvent) => {
                var attributes = e.detail['attributes'];
                var propertyUnits = e.detail['propertyUnits'];
                for (var i in attributes) {
                    var unit = propertyUnits[i] || '';
                    this.handlePropertyValueChange(i, attributes[i], unit);
                }               
            }, true);
        } else {
            // Event handler for default property setter
            propertySetter.blur((e: Event) => {
                this.handlePropertyValueChange($(e.target).attr('id'), $(e.target).val(), '');
            });

            propertyLabelDiv.append(propertySetter);
            this.DOMElement.append(propertyLabelDiv);
        }
        
        this.propertyMap[property] = property;
    }
}