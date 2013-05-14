///<reference path="../../../base/Attribute.ts" />
///<reference path="../../../base/Eventable.ts" />
///<reference path="PropertyControl.ts" />

// PropertyControl to manipulate the value of attributes with string properties
class ColorPropertyControl implements PropertyControl extends Eventable {
    public DOMElement: JQuery;
    public inputDOMElement: JQuery;
    public colorPicker: JQuery;
    private value: string;
    private farbtastic: any;

    constructor(public property: string) {
        super();
        this.DOMElement = $('<div></div>');
        this.inputDOMElement = $('<input type="text" id="color" name="color" value="#123456" />');
        this.DOMElement.append(this.inputDOMElement);
        this.colorPicker = $('<div id="colorpicker"></div>');
        this.DOMElement.append(this.colorPicker);
        this.inputDOMElement.change((e: Event) => {
            this.handleChange($(e.target).val());
        });
        this.farbtastic = (<any>$).farbtastic(this.colorPicker, (color: string) => {
            this.handleChange(color);
        });
    }

    public getCopy() {
        var copy = new ColorPropertyControl(this.property);
        return copy;
    }

    public getValue() {
        return this.value;
    }

    public setGUIValue(value: string, propertyUnit: string) {
        this.value = value;
        this.inputDOMElement.val(this.value);
        this.inputDOMElement.css('background-color', this.value);
        this.farbtastic.setColor(value);
    }

    private handleChange(color: string) {
        if (color != '#NaNNaNNaN') {
            this.setGUIValue(color, null);
            this.triggerEvent();
        }
    }

    private triggerEvent() {
        var attributes = {};
        attributes[this.property] = this.value;

        var propertyUnits = {};
        propertyUnits[this.property] = null;

        this.fireEvent('valuechange', { attributes: attributes, propertyUnits: propertyUnits });
    }
}