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
            this.blurHandler(e);
        });
    }

    public getValue() {
        return this.value;
    }

    public setValue(value: string) {
        var kDefaultValue = "Lista";
        if (value.trim().length === 0) {
            value = kDefaultValue;
        }

        var attribute = {};
        attribute[this.property] = value;
        this.value = value;
        this.DOMElement.val(value.replace(/\|\&\|/g, "\n"));
        this.fireEvent('valuechange', attribute);
    }

    private blurHandler(e: Event) {
        var valuesString = $(e.target).val().replace(/\n/g, "\|\&\|");

        this.setValue(valuesString);
    }
}