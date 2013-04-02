var __extends = this.__extends || function (d, b) {
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
///<reference path="Element.ts" />
var Frame = (function () {
    function Frame(position) {
        this.position = position;
    }
    return Frame;
})();
var Keyframe = (function (_super) {
    __extends(Keyframe, _super);
    function Keyframe(position, elements) {
        _super.call(this, position);
        this.position = position;
        this.elements = elements;
    }
    return Keyframe;
})(Frame);
var Layer = (function () {
    function Layer(title, visible, editable) {
        this.title = title;
        this.visible = visible;
        this.editable = editable;
        // Insert an empty keyframe
        this.frames = [
            new Keyframe(1, [])
        ];
    }
    Layer.prototype.insertFrame = function (frame) {
        var i;
        for(i = 0; i < this.frames.length && this.frames[i].position <= frame.position; i++) {
            ;
        }
        this.frames.splice(i, 0, frame);
    };
    Layer.prototype.insertElementInPosition = function (position, element) {
        var keyframe = this.findKeyframeForPosition(position);
        keyframe.elements.push(element);
    };
    Layer.prototype.findKeyframeForPosition = // Finds the keyframe object corresponding to a position (GUI index) in the timeline
    // If no exact match is found it returns the previous keyframe
    function (position) {
        var low = 0;
        var high = this.frames.length;
        var mid;
        var found = false;
        var result;
        // Binary search
        while(!found && high > low) {
            mid = Math.floor((high + low) / 2);
            if(position < this.frames[mid].position) {
                high = mid - 1;
            } else if(position > this.frames[mid].position) {
                low = mid + 1;
            } else {
                found = true;
                result = this.frames[mid];
            }
        }
        // If no exact match is found return the previous keyframe
        if(!result) {
            if(position > this.frames[mid].position) {
                result = this.frames[mid];
            } else {
                result = this.frames[mid - 1];
            }
        }
        return result;
    };
    return Layer;
})();
var Environment = (function () {
    function Environment() { }
    Environment.prototype.getVisibleElements = // Returns an array containing the elements on all visible layers in a specified position in time
    function (position) {
        var elements = [];
        for(var i = 0; i < this.layers.length; i++) {
            if(this.layers[i].visible) {
                var visibleKeyframe = this.layers[i].findKeyframeForPosition(position);
                elements = elements.concat(visibleKeyframe.elements);
            }
        }
        return elements;
    };
    return Environment;
})();
//@ sourceMappingURL=Layer.js.map
