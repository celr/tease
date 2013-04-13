///<reference path="Layer.ts" />

// Represents the global environment. Contains layers.
class Environment {
    public layers: Layer[];

    // Returns list containing the elements on all visible layers in a specified timeline position
    public getVisibleElements(position: number) {
        var elements = [];

        for (var i = 0; i < this.layers.length; i++) {
            if (this.layers[i].visible) {
                var visibleKeyframe = this.layers[i].findKeyframeForPosition(position);

                for (var i = 0; i < visibleKeyframe.elements.length; i++) {
                    var elementToInsert = visibleKeyframe.elements[i];

                    if (visibleKeyframe.elements[i].hasTransition() && visibleKeyframe.position != position) {
                        var transitionPercent = position / visibleKeyframe.elements[i].elementTransition.nextElement.keyframe.position;
                        elementToInsert = visibleKeyframe.elements[i].getElementWithTransition(transitionPercent);
                    }

                    elements.push(elementToInsert);
                }
            }
        }

        return elements;
    }
}