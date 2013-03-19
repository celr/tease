var __extends = this.__extends || function (d, b) {
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
///<reference path="Eventable.ts" />
var Timeline = (function (_super) {
    __extends(Timeline, _super);
    function Timeline(DOMElement) {
        _super.call(this);
        this.DOMElement = DOMElement;
        this.drawTimeline();
    }
    Timeline.prototype.drawTimeline = function () {
    };
    return Timeline;
})(Eventable);
//@ sourceMappingURL=Timeline.js.map
