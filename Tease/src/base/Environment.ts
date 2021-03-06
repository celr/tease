///<reference path="../lib/jquery.d.ts" />
///<reference path="Layer.ts" />

// Represents the global environment. Contains layers.
class Environment {
    public layers: Layer[];
    public toolCount: Object;
	public canvasAttributes: Object;
    public canvasPropertyUnits: Object;
	
    constructor() {
        this.toolCount = {
            audiotool: 0,
            imagetool: 0,
            recttool: 0,
            texttool: 0,
            videotool: 0,
            listtool: 0,
            ellipsetool: 0
        };

        this.layers = [];
        this.canvasAttributes = {};
        this.canvasPropertyUnits = {};
    }

    // Returns list containing the visible elements by layer
    public getVisibleElements(position: number) {
        var elementLayers = [];

        for (var i = 0; i < this.layers.length; i++) {
            elementLayers.push([]);
            if (this.layers[i].visible) {
                var visibleKeyframe = this.layers[i].findKeyframeForPosition(position);

                for (var j = 0; j < visibleKeyframe.elements.length; j++) {
                    var elementToInsert = visibleKeyframe.elements[j];

                    if (visibleKeyframe.elements[j].hasTransition() && visibleKeyframe.position != position) {
                        var transitionPercent = position / visibleKeyframe.elements[j].elementTransition.nextElement.keyframePosition;
                        elementToInsert = visibleKeyframe.elements[j].getElementWithTransition(transitionPercent);
                    }

                    elementLayers[i].push(elementToInsert);
                }
            }
        }

        return elementLayers;
    }

    public getCurrentToolNumber(id: string) {
        return this.toolCount[id];
    }

    public getNextToolNumber(id: string) {
        this.toolCount[id] = this.toolCount[id] + 1;
        return this.toolCount[id];
    }

    public generateNextToolNumber(id: string) {
        this.toolCount[id] = this.toolCount[id] + 1;
    }

    public deleteElement(element: Tease.Element) {
        // TODO: Make efficient
        for (var i = 0; i < this.layers.length; i++) {
            var frame = this.layers[i].findKeyframeForPosition(element.keyframePosition);

            if (frame) {
                for (var k = 0; k < frame.elements.length; k++) {
                    if (frame.elements[i].id === element.id) {
                        frame.elements.splice(i, 1);
                        break;
                    }
                }
            }
        }
    }
}