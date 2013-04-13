///<reference path="Element.ts" />

// Represents a frame.
class Frame {
    constructor(public position: number) {
    }
}

// Represents a keyframe (frame that contains elements)
class Keyframe extends Frame {
    public elements: Tease.Element[];

    constructor(public position: number) {
        super(position);
        this.elements = [];
    }

    // Adds copies of the specified elements to the keyframe
    public copyElements(copyElements: Tease.Element[]) {
        for (var i = 0; i < copyElements.length; i++) {
            this.addElement(copyElements[i].getCopy());
        }
    }

    // Creates copies of the specified elements and adds them as transition elements of the originals
    public createTransitionsForElements(transitionElements: Tease.Element[]) {
        for (var i = 0; i < transitionElements.length; i++) {
            var newElement = transitionElements[i].getCopy();
            newElement.elementTransition.previousElement = transitionElements[i];
            transitionElements[i].elementTransition.nextElement = newElement;
            this.addElement(newElement);
        }
    }

    // Adds an element to the keyframe
    public addElement(element: Tease.Element) {
        element.keyframe = this;
        this.elements.push(element);
    }
}