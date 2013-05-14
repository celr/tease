///<reference path="../../../base/Attribute.ts" />
///<reference path="../../../base/Eventable.ts" />
///<reference path="PropertyControl.ts" />

// PropertyControl to manipulate the value of attributes with string properties
class SelectPropertyControl implements PropertyControl extends Eventable {
    public DOMElement: JQuery;
    public inputDOMElement: JQuery;
    public displayValue: JQuery;
    private value: string;

    constructor(public property: string, public optionValues: string[], public optionLabels: string[]) {
        super();
        this.DOMElement = $('<select></select>');

        for (var i in optionValues) {
            $('<option value="' + optionValues[i] + '">' + optionLabels[i] + '</option>').appendTo(this.DOMElement);
        }

        this.DOMElement.change((e: Event) => {
            this.handleChange(e);
        });
    }

    public getCopy() {
        var copy = new SelectPropertyControl(this.property, this.optionValues, this.optionLabels);
        return copy;
    }

    public getValue() {
        return this.value;
    }

    public setGUIValue(value: string, propertyUnit: string) {
        this.DOMElement.find('[value="' + value + '"]').prop('selected', true);
        this.value = value;
    }

    private handleChange(e: Event) {
        this.value = $(e.target).val();
        this.setGUIValue(this.value, null);
        this.triggerEvent();
    }
    
    private triggerEvent() {
        var attributes = {};
        attributes[this.property] = this.value;

        var propertyUnits = {};
        propertyUnits[this.property] = null;

        this.fireEvent('valuechange', { attributes: attributes, propertyUnits: propertyUnits });
    }


    private setValue(value: string, propertyUnit: string) {
        var attribute = {};
        var propertyUnits = {};

        attribute[this.property] = value;
        propertyUnits[this.property] = propertyUnit;
        this.value = value;
        this.fireEvent('valuechange', { attributes: attribute, propertyUnits: propertyUnits });
    }
}