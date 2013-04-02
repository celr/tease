///<reference path="Element.ts" />

class Frame {
    constructor(public position: number) {
    }
}

class Keyframe extends Frame {
    constructor(public position: number, public elements: Tease.Element[]) {
        super(position);
    }
}

class Layer {
    public frames: Frame[];

    public insertFrame(frame: Frame) {
        var i;
        for (i = 0; i < this.frames.length && this.frames[i].position <= frame.position; i++);
        this.frames.splice(i, 0, frame);
    }

    public insertElementInPosition(position: number, element: Tease.Element) {
        var keyframe = this.findKeyframeForPosition(position);
        keyframe.elements.push(element);
    }

    // Finds the keyframe object corresponding to a position (GUI index) in the timeline
    // If no exact match is found it returns the previous keyframe
    public findKeyframeForPosition(position: number) {
        var low = 0;
        var high = this.frames.length;
        var mid;
        var found = false;
        var result;

        // Binary search
        while (!found && high > low) {
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

    constructor(public title: string, public visible: bool, public editable: bool) {
        // Insert an empty keyframe
        this.frames = [new Keyframe(1, [])];
    }
}

class Environment {
    public layers: Layer[];

    // Returns an array containing the elements on all visible layers in a specified position in time
    public getVisibleElements(position: number) {
        var elements = [];

        for (var i = 0; i < this.layers.length; i++) {
            if (this.layers[i].visible) {
                var visibleKeyframe = this.layers[i].findKeyframeForPosition(position);
                elements = elements.concat(visibleKeyframe.elements);
            }
        }

        return elements;
    }
}