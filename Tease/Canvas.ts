///<reference path="Toolbar.ts" />
///<reference path="Element.ts" />

// Canvas
// Represents a canvas in the GUI
// owner: jair
class Canvas extends Eventable {
    currentSelection: Tease.Element; // TODO: Multiple selection
    private currentElements: Tease.Element[];
    private currentLayerIndex: number;
    private currentPosition: number;

    private doSelect(element: Tease.Element) {
        if (this.currentSelection) {
            this.currentSelection.DOMElement.classList.remove('selected');
        }

        element.DOMElement.classList.add('selected');
        this.fireEvent('canvasselect', element);
        this.currentSelection = element;
    }

    private handleCanvasClick(e: Event) {
        var element = new Tease.Element(this.currentTool);
        // TODO: Add element to document
        element.DOMElement.addEventListener('click', (e: Event) => {
            // Avoid event bubbling
            e.stopPropagation();
            e.cancelBubble = true;
            var selectedDOME = <HTMLElement> e.target;
            this.doSelect(this.currentElements[parseInt(selectedDOME.id)]);
        });
        element.DOMElement.id = this.currentElements.length.toString();
        this.environment.layers[this.currentLayerIndex].insertElementInPosition(this.currentPosition, element);
        this.currentElements.push(element);
        this.DOMElement.appendChild(element.DOMElement);
        this.doSelect(element); // Automatically select newly inserted element
        this.fireEvent('çanvasinsert', element);
    }

    private renderCurrentElements() {
        for (var i = 0; i < this.currentElements.length; i++) {
            this.DOMElement.appendChild(this.currentElements[i].DOMElement);
        }
    }

    public setCurrentPosition(position: number) {
        this.DOMElement.innerHTML = '';
        this.currentElements = this.environment.getVisibleElements(position);
        this.renderCurrentElements();
        this.currentPosition = position;
    }

    public setCurrentLayer(index: number) {
        this.currentLayerIndex = index;
    }

    constructor (private DOMElement: HTMLElement, public currentTool: Tool, private environment: Environment) {
        super();
        this.setCurrentPosition(1);
        this.setCurrentLayer(0);
        this.DOMElement.addEventListener('click', (e: Event) => {
            this.handleCanvasClick(e);
        });
    }
}