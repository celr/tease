///<reference path="../../../base/Attribute.ts" />
///<reference path="../../../base/Eventable.ts" />
///<reference path="PropertyControl.ts" />

// PropertyControl to manipulate the value of attributes with string properties
class SliderPropertyControl implements PropertyControl extends Eventable {
    public DOMElement: JQuery;
    public inputDOMElement: JQuery;
    public displayValue: JQuery;
    private value: string;

    constructor(public property: string, public minValue: number, public maxValue: number, public step: number, public defaultValue) {
        super();
        this.DOMElement = $('<div></div>');
        this.displayValue = $('<span class="display-value-' + this.property + '">' + defaultValue + '</span>');
        this.inputDOMElement = $('<input type="range" id="sliderBar" min="'+ minValue +'" max="' + maxValue + '" step="' + step + '" value="' + defaultValue + '"></input>');
        this.DOMElement.append(this.displayValue);
        this.DOMElement.append(this.inputDOMElement);
        //(<any>this.DOMElement).slider();

        this.DOMElement.change((e: Event) => {
            this.handleChange(e);
        });
    }

    public getCopy() {
        var copy = new SliderPropertyControl(this.property, this.minValue, this.maxValue, this.step, this.defaultValue);
        return copy;
    }

    public getValue() {
        return this.value;
    }

    public setGUIValue(value: string, propertyUnit: string) {
        this.displayValue.text(value);
        this.inputDOMElement.val(value);
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
}