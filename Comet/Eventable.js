var Eventable = (function () {
    function Eventable() {
        this.eventHolder = document.createElement('a');
    }
    Eventable.prototype.fireEvent = function (type, detail) {
        var event = document.createEvent('CustomEvent');
        event.initCustomEvent(type, false, false, detail);
        this.eventHolder.dispatchEvent(event);
    };
    Eventable.prototype.addEventListener = function (type, listener, useCapture) {
        this.eventHolder.addEventListener(type, listener, useCapture);
    };
    Eventable.prototype.removeEventListener = function (type, listener, useCapture) {
        this.eventHolder.removeEventListener(type, listener, useCapture);
    };
    return Eventable;
})();
