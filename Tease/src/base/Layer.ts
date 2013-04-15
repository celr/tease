///<reference path="Element.ts" />
///<reference path="Frame.ts" />

// Represents a layer. Contains frames
class Layer {
    public keyframes: Keyframe[];

    constructor(public title: string, public visible: bool, public editable: bool, public index: number) {
        // Insert an empty keyframe
        this.keyframes = [new Keyframe(1)];
    }

    // Inserts a frame to the layer
    public insertKeyframe(keyframe: Keyframe) {
        var i;
        for (i = 0; i < this.keyframes.length && this.keyframes[i].position <= keyframe.position; i++);
        this.keyframes.splice(i, 0, keyframe);
    }

    // Inserts an element in the specified timeline position
    public insertElementInPosition(position: number, element: Tease.Element) {
        var keyframe = <Keyframe> this.findKeyframeForPosition(position);
        keyframe.addElement(element);
    }

    // Returns the keyframe object corresponding to a timeline position.
    // If no exact match is found it returns the previous keyframe
    public findKeyframeForPosition(position: number) {
        return this.keyframes[this.findFrameIndexForPosition(position)];
    }

    public findFrameIndexForPosition(position: number) {
        var low = 0;
        var high = this.keyframes.length - 1;
        var mid;
        var found = false;
        var result;

        // Binary search
        while (!found && high >= low) {
            mid = Math.floor((high + low) / 2);
            if (position < this.keyframes[mid].position) {
                high = mid - 1;
            } else if (position > this.keyframes[mid].position) {
                low = mid + 1;
            } else {
                found = true;
                result = mid;
            }
        }

        // If no exact match is found return the previous keyframe
        if (!result && result != 0) {
            if (position > this.keyframes[mid].position) {
                result = mid;
            } else {
                result = mid - 1;
            }
        }

        return result;
    }
}