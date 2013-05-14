///<reference path="../../../base/Eventable.ts" />
///<reference path="../../../lib/jquery.d.ts" />

// Represents an HTML control that enables the user to modify the value of an attribute with a specified kind of property
interface PropertyControl {
    DOMElement: JQuery;
    getValue();
    addEventListener(type: string, listener: EventListener, useCapture: bool);
    removeEventListener(type: string, listener: EventListener, useCapture: bool);
    getCopy(): PropertyControl;
    setGUIValue(value: string, propertyUnit: string);
}