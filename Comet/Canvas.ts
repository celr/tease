///<reference path="Toolbar.ts" />
///<reference path="Element.ts" />

// Canvas
// Represents a canvas in the GUI
// owner: jair
class Canvas extends Eventable {
    currentSelection: Comet.Element; // TODO: Multiple selection
    elementList: any[]; // TODO: Hacer un elementtree?

    private doSelect(element: Comet.Element) {
        if (this.currentSelection) {
            this.currentSelection.DOMElement.classList.remove('selected');
        }

        element.DOMElement.classList.add('selected');
        this.fireEvent('canvasselect', element);
        this.currentSelection = element;
    }

    private handleCanvasClick(e: Event) {
        var element = new Comet.Element(this.currentTool);
        // TODO: Add element to document
        element.DOMElement.addEventListener('click', (e: Event) => {
            // Avoid event bubbling
            e.stopPropagation();
            e.cancelBubble = true;
            var selectedDOME = <HTMLElement> e.currentTarget;
            this.doSelect(this.elementList[parseInt(selectedDOME.id)]);
        });
        element.DOMElement.id = this.elementList.length.toString();
        this.elementList.push(element);
        this.DOMElement.appendChild(element.DOMElement);
        this.doSelect(element); // Automatically select newly inserted element
    }

    constructor (private DOMElement: HTMLElement, public currentTool: Tool) {
        super();
        this.elementList = [];
        this.DOMElement.addEventListener('click', (e: Event) => {
            this.handleCanvasClick(e);
        });
    }
}