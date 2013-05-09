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

            // If there's already a transition remap the linked list
            if (transitionElements[i].elementTransition.nextElement) {
                newElement.elementTransition.nextElement = transitionElements[i].elementTransition.nextElement;
                transitionElements[i].elementTransition.nextElement.elementTransition.previousElement = newElement;
            }

            newElement.elementTransition.previousElement = transitionElements[i];
            transitionElements[i].elementTransition.nextElement = newElement;
            this.addElement(newElement);
        }
    }

    // Removes nextElement transitions on the elements in the keyframe
    public removeFutureTransitions() {
        for (var i = 0; i < this.elements.length; i++) {
            this.elements[i].elementTransition.nextElement = null;
        }
    }

    // Removes previousElement transition on the elements in the keyframe
    public removePastTransitions() {
        for (var i = 0; i < this.elements.length; i++) {
            this.elements[i].elementTransition.previousElement = null;
        }
    }

    // Adds an element to the keyframe
    public addElement(element: Tease.Element) {
        element.keyframe = this;
        this.elements.push(element);
    }
}