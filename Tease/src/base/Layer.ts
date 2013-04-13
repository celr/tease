///<reference path="Element.ts" />
///<reference path="Frame.ts" />

// Represents a layer. Contains frames
class Layer {
    public frames: Frame[];

    constructor(public title: string, public visible: bool, public editable: bool, public index: number) {
        // Insert an empty keyframe
        this.frames = [new Keyframe(1)];
    }

    // Inserts a frame to the layer
    public insertFrame(frame: Frame) {
        var i;
        for (i = 0; i < this.frames.length && this.frames[i].position <= frame.position; i++);
        this.frames.splice(i, 0, frame);
    }

    // Inserts an element in the specified timeline position
    public insertElementInPosition(position: number, element: Tease.Element) {
        var keyframe = this.findKeyframeForPosition(position);
        keyframe.addElement(element);
    }

    // Returns the keyframe object corresponding to a timeline position.
    // If no exact match is found it returns the previous keyframe
    public findKeyframeForPosition(position: number) {
        var low = 0;
        var high = this.frames.length - 1;
        var mid;
        var found = false;
        var result;

        // Binary search
        while (!found && high >= low) {
            mid = Math.floor((high + low) / 2);
            if (position < this.frames[mid].position) {
                high = mid - 1;
            } else if (position > this.frames[mid].position) {
                low = mid + 1;
            } else {
                found = true;
                result = this.frames[mid];
            }
        }

        // If no exact match is found return the previous keyframe
        if (!result) {
            if (position > this.frames[mid].position) {
                result = this.frames[mid];
            } else {
                result = this.frames[mid - 1];
            }
        }

        return result;
    }
}