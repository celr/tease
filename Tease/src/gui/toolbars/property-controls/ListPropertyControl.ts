///<reference path="../../../base/Attribute.ts" />
///<reference path="../../../base/Eventable.ts" />
///<reference path="PropertyControl.ts" />

// PropertyControl to manipulate the value of a list.
class ListPropertyControl implements PropertyControl extends Eventable {
    public DOMElement: JQuery;
    private value: string;

    constructor(public property: string) {
        super();
        this.DOMElement = $('<textarea rows="10" cols="50" id="' + this.property + '" type="text"></input>');
        this.DOMElement.blur((e: Event) => {
            this.handleChange(e);
        });
    }

    public getValue() {
        return this.value;
    }

    public getCopy() {
        var copy = new ListPropertyControl(this.property);
        return copy;
    }

    public setGUIValue(value: string, propertyUnit: string) {
        this.value = value;
        var kDefaultValue = "Lista";
        if (value.trim().length === 0) {
            value = kDefaultValue;
        }

        this.DOMElement.val(value.replace(/\|\&\|/g, "\n"));
    }

    private handleChange(e: Event) {
        var valuesString = $(e.target).val().replace(/\n/g, "\|\&\|");
        this.setGUIValue(valuesString, null);
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