///<reference path="Toolbar.ts" />
///<reference path="Element.ts" />
///<reference path="SizingTool.ts" />
// Canvas
// Represents a canvas in the GUI
// owner: jair
class Canvas extends Eventable {
    currentSelection: Tease.Element; // TODO: Multiple selection
    private currentElements: Tease.Element[];
    private currentLayerIndex: number;
    private currentPosition: number;
    sizingTool: SizingTool;

    private doSelect(element: Tease.Element) {
        if (this.currentSelection) {
            this.currentSelection.DOMElement.classList.remove('selected');
        }

        //element.DOMElement.classList.add('selected');
        this.fireEvent('canvasselect', element);
        this.currentSelection = element;
    }

    private handleCanvasClick(e) {
        var element = new Tease.Element(this.currentTool);
        // TODO: Add element to document
        element.DOMElement.addEventListener('click', (e: Event) => {
            // Avoid event bubbling
            e.stopPropagation();
            e.cancelBubble = true;
            var selectedDOME = <HTMLElement> e.target;
            this.doSelect(this.currentElements[parseInt(selectedDOME.id)]);
            this.sizingTool.render(element.DOMElement);
            var that = this;
            //element.DOMElement.addEventListener('mouseout', function () { console.log('done!'); that.sizingTool.erase(); }, false);
        });

        element.DOMElement.addEventListener('mousedown', (e: MouseEvent) => {
            //calculate initial position of element
            var initialElemX= parseInt(window.getComputedStyle(element.DOMElement).left);
            var initialElemY = parseInt(window.getComputedStyle(element.DOMElement).top);

            //get initial position of mouse down
            var initialMouseX = e.clientX;
            var initialMouseY = e.clientY;


            var that = this;
            this.sizingTool.erase();

            function handleMove(e: MouseEvent) {
                element.DOMElement.style.top = (initialElemY + e.clientY - initialMouseY) + 'px';
                element.DOMElement.style.left = (initialElemX + e.clientX - initialMouseX) + 'px';
            }

            function handleUp(e: MouseEvent) {
                that.DOMElement.removeEventListener('mousemove', handleMove, true);
                that.DOMElement.removeEventListener('mouseup', handleUp, true);
            }

            this.DOMElement.addEventListener('mousemove', handleMove, true);
            this.DOMElement.addEventListener('mouseup', handleUp, true);

            e.stopPropagation();
            e.preventDefault();
        }, false);

        element.DOMElement.id = this.currentElements.length.toString();
        this.environment.layers[this.currentLayerIndex].insertElementInPosition(this.currentPosition, element);
        this.currentElements.push(element);
        
        this.doSelect(element); // Automatically select newly inserted element
        this.fireEvent('çanvasinsert', element);
        element.DOMElement.style.position = 'absolute';
        element.DOMElement.style.left = (e.clientX - this.DOMElement.offsetLeft) + 'px';
        element.DOMElement.style.top = (e.clientY - this.DOMElement.offsetTop)+'px';
        this.DOMElement.appendChild(element.DOMElement);
    }

    private handleDown(e: MouseEvent) {
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
        this.sizingTool = new SizingTool();
        this.DOMElement.style.position = 'relative';
        this.DOMElement.addEventListener('click', (e: Event) => {
            this.handleCanvasClick(e);
        });
    }
}