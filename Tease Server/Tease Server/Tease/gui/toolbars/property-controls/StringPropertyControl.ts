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
        this.DOMElement.blur((e: Event) => {
            this.blurHandler(e);
        });
    }

    public getValue() {
        return this.value;
    }

    public setValue(value: string) {
        var attribute = {};
        attribute[this.property] = value;
        this.value = value;
        this.DOMElement.val(value);
        this.fireEvent('valuechange', attribute);
    }

    private blurHandler(e: Event) {
        this.setValue($(e.target).val());
    }
}