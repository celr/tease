///<reference path="../../../base/Attribute.ts" />
///<reference path="../../../base/Eventable.ts" />
///<reference path="PropertyControl.ts" />

// PropertyControl to manipulate the value of attributes with string properties
class FontPropertyControl implements PropertyControl extends Eventable {
    public DOMElement: JQuery;
    public inputDOMElement: JQuery;
    public displayValue: JQuery;
    private value: string;

    constructor(public property: string) {
        super();
        this.DOMElement = $('<div id="fontSelect">\
                <span>Arial</span>\
                <div class = "arrow-down"> </div>\
                <ul>\
                    <li>Arial, Arial, Helvetica, sans -serif </li>\
                    <li>Arial Black, Arial Black, Gadget, sans -serif </li>\
                    <li>Comic Sans MS, Comic Sans MS, cursive </li>\
                    <li>Courier New, Courier New, Courier, monospace </li>\
                    <li>Georgia, Georgia, serif </li>\
                    <li>Impact, Charcoal, sans -serif </li>\
                    <li>Lucida Console, Monaco, monospace </li>\
                    <li>Lucida Sans Unicode, Lucida Grande, sans-serif </li>\
                    <li>Palatino Linotype, Book Antiqua, Palatino, serif </li>\
                    <li>Tahoma, Geneva, sans -serif </li>\
                    <li>Times New Roman, Times, serif </li>\
                    <li>Trebuchet MS, Helvetica, sans -serif </li>\
                    <li>Verdana, Geneva, sans -serif </li>\
                    <li>Gill Sans, Geneva, sans -serif </li>\
                </ul>\
            </div>');

        (<any>this.DOMElement).fontSelector({
            hide_fallbacks: true,
            initial: 'Lucida Sans Unicode, Lucida Grande, sans-serif',
            selected: (style: string) => {
                this.handleChange(style);
            }
        });
    }

    public getCopy() {
        var copy = new FontPropertyControl(this.property);
        return copy;
    }

    public getValue() {
        return this.value;
    }

    public setGUIValue(value: string, propertyUnit: string) {
        this.DOMElement.find('li:contains(' + value + ')').prop('selected', true);
        this.value = value;
    }

    private handleChange(style: string) {
        this.value = style;
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