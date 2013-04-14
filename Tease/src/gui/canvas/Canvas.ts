///<reference path="../toolbars/Toolbar.ts" />
///<reference path="../../base/Layer.ts" />
///<reference path="../../base/Environment.ts" />
///<reference path="../../base/Element.ts" />
///<reference path="../../base/Eventable.ts" />
///<reference path="../canvas/SizingTool.ts" />
// Canvas
// Represents a canvas in the GUI
// owner: jair
class Canvas extends Eventable {
    private currentElements: Tease.Element[]; // Elements currently shown on canvas
    private currentSelection: Tease.Element; // TODO: Multiple selection
    private sizingTool: SizingTool;

    constructor(private DOMElement: HTMLElement, public currentTool: Tool, private environment: Environment) {
        super();
        this.sizingTool = new SizingTool();
        this.DOMElement.style.position = 'relative';
        this.currentElements = [];
        this.DOMElement.addEventListener('click', (e: Event) => {
            this.handleCanvasClick(e);
        });
    }

    public clear() {
        this.DOMElement.innerText = '';
    }

    public insertElements(elements: Tease.Element[]) {
        for (var i = 0; i < elements.length; i++) {
            this.insertElement(elements[i]);
        }
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
        this.sizingTool.render(element);
    }

    public selectElement(element: Tease.Element) {
        this.currentSelection = element;
        this.fireEvent('canvasselect', element);
    }

    private handleCanvasClick(e) {
        var element = new Tease.Element(this.currentTool);
        // TODO: Usar atributos internos en lugar de modificar directamente el DOMElement
        var posAttr = new Attribute(new Property('position', ''), 'absolute'); //auxiliar variable
        var topAttr = new Attribute(new Property('top', 'top'), '0px'); //auxiliar variable
        var leftAttr = new Attribute(new Property('left', 'left'), '0px'); //auxiliar variable
        element.setAttribute(posAttr);

        topAttr.value = (e.clientY - this.DOMElement.offsetTop).toString();
        element.setAttribute(topAttr);

        console.log(element);

        leftAttr.value = (e.clientX - this.DOMElement.offsetLeft).toString();
        element.setAttribute(leftAttr);

        console.log(element);

        this.insertElement(element);
        this.selectElement(element); // Automatically select newly inserted element
        this.fireEvent('canvasinsert', element);
    }

    private handleElementMove(e: MouseEvent, element: Tease.Element) {
        this.sizingTool.erase();

        //calculate initial position of element
        var initialElemX = parseInt(element.getAttribute('left').value);
        var initialElemY = parseInt(element.getAttribute('top').value);

        //get initial position of mouse down
        var initialMouseX = e.clientX;
        var initialMouseY = e.clientY;

        var that = this;

        var topAtt = new Attribute(new Property('top', 'top'), '');
        var leftAtt = new Attribute(new Property('left', 'left'), '');

        function handleMove(e: MouseEvent) {
            topAtt.value = (initialElemY + e.clientY - initialMouseY).toString();
            leftAtt.value = (initialElemX + e.clientX - initialMouseX).toString();
            element.setAttribute(topAtt);
            element.setAttribute(leftAtt);
        }

        function handleUp(e: MouseEvent) {
            that.DOMElement.removeEventListener('mousemove', handleMove, true);
            that.DOMElement.removeEventListener('mouseup', handleUp, true);
        }

        this.DOMElement.addEventListener('mousemove', handleMove, true);
        this.DOMElement.addEventListener('mouseup', handleUp, true);
    }

    private handleElementSelect(e: Event, element: Tease.Element) {
        var selectedDOME = <HTMLElement> e.target;
        this.selectElement(this.currentElements[parseInt(selectedDOME.id)]);
        this.sizingTool.render(element);
    }
}