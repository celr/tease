///<reference path="../../../base/Attribute.ts" />
///<reference path="../../../base/Eventable.ts" />
///<reference path="PropertyControl.ts" />

// PropertyControl to manipulate the value of attributes with string properties
class StringPropertyControl implements PropertyControl extends Eventable {
    public DOMElement: JQuery;
    private value: string;

    constructor(public property: string) {
        super();
        this.DOMElement = $('<input id="' + this.property + '" type="text"></input>');
        this.DOMElement.change((e: Event) => {
            this.handleChange(e);
        });
    }

    public getCopy() {
        var copy = new StringPropertyControl(this.property);
        return copy;
    }

    public getValue() {
        return this.value;
    }

    public setGUIValue(value: string, propertyUnit: string) {
        this.DOMElement.val(value);
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