///<reference path="../../../base/Attribute.ts" />
///<reference path="../../../base/Eventable.ts" />
///<reference path="PropertyControl.ts" />

// PropertyControl to manipulate the value of attributes with string properties
class DimensionPropertyControl implements PropertyControl extends Eventable {
    public DOMElement: JQuery;
    private value: string;
    private propertyUnit: string;
    private unitPickerDOMElement: JQuery;
    private inputDOMElement: JQuery;

    constructor(public property: string, public propertyUnits: string[], public unitLabels: string[]) {
        super();
        this.DOMElement = $('<div id="control-' + this.property + '"></div>');
        this.inputDOMElement = $('<input type="number" id="control-' + this.property + '-input"></input>');
        this.DOMElement.append(this.inputDOMElement);
        this.unitPickerDOMElement = $('<select id="control-' + this.property + '-unit"></select>');
        
        for (var i in propertyUnits) {
            $('<option value="' + propertyUnits[i] + '">' + unitLabels[i] + '</option>').appendTo(this.unitPickerDOMElement);
        }

        this.inputDOMElement.change((e: Event) => {
            this.handleChange(e);
        });

        this.unitPickerDOMElement.change((e: Event) => {
            this.handleUnitChange(e);
        });
        
        this.DOMElement.append(this.unitPickerDOMElement);
    }

    public getCopy() {
        var copy = new DimensionPropertyControl(this.property, this.propertyUnits, this.unitLabels);
        return copy;
    }
    
    public getValue() {
        return this.value;
    }

    public setGUIValue(value: string, propertyUnit: string) {
        this.inputDOMElement.val(value);
        this.unitPickerDOMElement.find('[value="' + propertyUnit + '"]').prop('selected', true);
        this.value = value;
        this.propertyUnit = propertyUnit;
    }

    private triggerEvent() {
        var attributes = {};
        attributes[this.property] = this.value;

        var propertyUnits = {};
        propertyUnits[this.property] = this.propertyUnit;

        this.fireEvent('valuechange', { attributes: attributes, propertyUnits: propertyUnits });
    }

    private handleChange(e: Event) {
        this.value = $(e.target).val();
        this.setGUIValue(this.value, this.propertyUnit);
        this.triggerEvent();
    }

    private handleUnitChange(e: Event) {
        this.propertyUnit = $(e.target).val();
        this.setGUIValue(this.value, this.propertyUnit);
        this.triggerEvent();
    }
}