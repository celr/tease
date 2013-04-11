///<reference path="../toolbars/Toolbar.ts" />
///<reference path="../../base/Layer.ts" />
///<reference path="../../base/Element.ts" />
///<reference path="../../base/Eventable.ts" />
///<reference path="../canvas/SizingTool.ts" />
// Canvas
// Represents a canvas in the GUI
// owner: jair
class Canvas extends Eventable {
    private currentElements: Tease.Element[]; // Elements currently shown on canvas
    currentSelection: Tease.Element; // TODO: Multiple selection
    sizingTool: SizingTool;

    private selectElement(element: Tease.Element) {
        this.currentSelection = element;
        this.fireEvent('canvasselect', element);
    }

    private handleCanvasClick(e) {
        var element = new Tease.Element(this.currentTool);
<<<<<<< HEAD
        // TODO: Add element to document
        element.DOMElement.addEventListener('click', (e: Event) => {
            // Avoid event bubbling
            e.stopPropagation();
            e.cancelBubble = true;
            var selectedDOME = <HTMLElement> e.target;
            this.doSelect(this.currentElements[parseInt(selectedDOME.id)]);
            this.sizingTool.render(element);
        });



        element.DOMElement.addEventListener('mousedown', (e: MouseEvent) => {
            //calculate initial position of element
            var initialElemX= parseInt(element.getAttribute('left').value);
            var initialElemY = parseInt(element.getAttribute('top').value);
=======
        // TODO: Usar atributos internos en lugar de modificar directamente el DOMElement
        element.DOMElement.style.position = 'absolute';
        element.DOMElement.style.left = (e.clientX - this.DOMElement.offsetLeft) + 'px';
        element.DOMElement.style.top = (e.clientY - this.DOMElement.offsetTop) + 'px';

        this.insertElement(element);
        this.selectElement(element); // Automatically select newly inserted element
        this.fireEvent('canvasinsert', element);
    }
>>>>>>> 86c8ed5845af67c55a0dec6a0c9a288dccc6a5d4

    public clear() {
        this.DOMElement.innerText = '';
    }

    public insertElements(elements: Tease.Element[]) {
        for (var i = 0; i < elements.length; i++) {
            this.insertElement(elements[i]);
        }
    }

    private handleElementMove(e: MouseEvent, element: Tease.Element) {
        //calculate initial position of element
        var initialElemX = parseInt(window.getComputedStyle(element.DOMElement).left);
        var initialElemY = parseInt(window.getComputedStyle(element.DOMElement).top);

<<<<<<< HEAD
            var topAtt = new Attribute(new Property('top', 'top'), '');
            var leftAtt = new Attribute(new Property('left', 'left'), '');

            function handleMove(e: MouseEvent) {
                topAtt.value = (initialElemY + e.clientY - initialMouseY).toString();
                leftAtt.value = (initialElemX + e.clientX - initialMouseX).toString();
                element.setAttribute(topAtt);
                element.setAttribute(leftAtt);
            }
=======
        //get initial position of mouse down
        var initialMouseX = e.clientX;
        var initialMouseY = e.clientY;
>>>>>>> 86c8ed5845af67c55a0dec6a0c9a288dccc6a5d4

        var that = this;
        //this.sizingTool.erase();

        function handleMove(e: MouseEvent) {
            element.DOMElement.style.top = (initialElemY + e.clientY - initialMouseY) + 'px';
            element.DOMElement.style.left = (initialElemX + e.clientX - initialMouseX) + 'px';
        }

        function handleUp(e: MouseEvent) {
            that.DOMElement.removeEventListener('mousemove', handleMove, true);
            that.DOMElement.removeEventListener('mouseup', handleUp, true);
        }

<<<<<<< HEAD
        element.DOMElement.id = this.currentElements.length.toString();
        this.environment.layers[this.currentLayerIndex].insertElementInPosition(this.currentPosition, element);
        this.currentElements.push(element);
        
        this.doSelect(element); // Automatically select newly inserted element
        this.fireEvent('çanvasinsert', element);

        var tempAttr = new Attribute(new Property('position', ''), 'absolute'); //auxiliar variable
        element.setAttribute(tempAttr);

        tempAttr.property.id = 'top';
        tempAttr.value = (e.clientY - this.DOMElement.offsetTop).toString();
        element.setAttribute(tempAttr);

        tempAttr.property.id = 'left';
        tempAttr.value = (e.clientX - this.DOMElement.offsetLeft).toString();
        element.setAttribute(tempAttr);

        this.DOMElement.appendChild(element.DOMElement);
=======
        this.DOMElement.addEventListener('mousemove', handleMove, true);
        this.DOMElement.addEventListener('mouseup', handleUp, true);
    }

    private handleElementSelect(e: Event, element: Tease.Element) {
        var selectedDOME = <HTMLElement> e.target;
        this.selectElement(this.currentElements[parseInt(selectedDOME.id)]);
        this.sizingTool.render(selectedDOME);
>>>>>>> 86c8ed5845af67c55a0dec6a0c9a288dccc6a5d4
    }

    // Inserts an element into the canvas
    public insertElement(element: Tease.Element) {
        element.DOMElement.addEventListener('click', (e: Event) => {
            e.stopPropagation();
            e.preventDefault();
            e.cancelBubble = true;
            this.handleElementSelect(e, element);
        }, false);

        element.DOMElement.addEventListener('mousedown', (e: MouseEvent) => {
            e.stopPropagation();
            e.preventDefault();
            e.cancelBubble = true;
            this.handleElementMove(e, element);
        }, false);

        element.DOMElement.id = this.currentElements.length.toString();
        this.DOMElement.appendChild(element.DOMElement);
        this.currentElements.push(element);
        this.sizingTool.render(element.DOMElement);
    }

    constructor (private DOMElement: HTMLElement, public currentTool: Tool, private environment: Environment) {
        super();
        this.sizingTool = new SizingTool();
        this.DOMElement.style.position = 'relative';
        this.currentElements = [];
        this.DOMElement.addEventListener('click', (e: Event) => {
            this.handleCanvasClick(e);
        });
    }
}