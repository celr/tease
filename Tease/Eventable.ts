// Eventable
// General purpose class to support events on its children
// owner: carlos
class Eventable {
    private eventHolder: HTMLElement;

    constructor {
        this.eventHolder = document.createElement('a');
    }

    fireEvent(type: string, detail: any) {
        var event = <CustomEvent> document.createEvent('CustomEvent');
        event.initCustomEvent(type, false, false, detail);
        this.eventHolder.dispatchEvent(event);
    }

    addEventListener(type: string, listener: EventListener, useCapture: bool) {
        this.eventHolder.addEventListener(type, listener, useCapture);
    }

    removeEventListener(type: string, listener: EventListener, useCapture: bool) {
        this.eventHolder.removeEventListener(type, listener, useCapture);
    }
}