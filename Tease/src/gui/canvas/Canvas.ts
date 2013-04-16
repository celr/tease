///<reference path="../toolbars/Toolbar.ts" />
///<reference path="../../base/AnimationRenderer.ts" />
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
    private allowInput: bool;

    constructor(private DOMElement: JQuery, public currentTool: Tool, private environment: Environment) {
        super();
        this.allowInput = true;
        this.sizingTool = new SizingTool();
        this.DOMElement.css('position', 'relative');
        this.currentElements = [];
        this.DOMElement.click((e: Event) => {
            this.handleCanvasClick(e);
        });
    }

    public blockInput() {
        this.allowInput = false;
    }

    public unblockInput() {
        this.allowInput = true;
    }

    public clear() {
        this.DOMElement.text('');
    }

    public insertRenderedElements(elements: RenderedElement[]) {
        for (var i = 0; i < elements.length; i++) {
            $(this.DOMElement).append(elements[i].DOMElement);
        }
    }

    public insertElements(elements: Tease.Element[]) {
        for (var i = 0; i < elements.length; i++) {
            this.insertElement(elements[i]);
        }
    }

    // Inserts an element into the canvas
    public insertElement(element: Tease.Element) {
        element.DOMElement.click((e: Event) => {
            e.stopPropagation();
            e.preventDefault();
            e.cancelBubble = true;
            this.handleElementSelect(e, element);
        });

        element.DOMElement.bind('mousedown', (e: MouseEvent) => {
            e.stopPropagation();
            e.preventDefault();
            e.cancelBubble = true;
            this.handleElementMove(e, element);
        });

        element.DOMElement.attr('id', this.currentElements.length.toString());
        this.DOMElement.append(element.DOMElement);
        this.currentElements.push(element);
        this.sizingTool.render(element);
    }

    public selectElement(element: Tease.Element) {
        this.currentSelection = element;
        this.fireEvent('canvasselect', element);
    }

    private handleCanvasClick(e) {
        if (this.allowInput) {
            var element = new Tease.Element(this.currentTool);
            // TODO: Usar atributos internos en lugar de modificar directamente el DOMElement
            var posAttr = new Attribute(new Property('position', ''), 'absolute'); //auxiliar variable
            var topAttr = new Attribute(new Property('top', 'top'), '0px'); //auxiliar variable
            var leftAttr = new Attribute(new Property('left', 'left'), '0px'); //auxiliar variable
            element.setAttribute(posAttr);

            var offset = this.DOMElement.offset();

            topAttr.value = (e.clientY - offset.top).toString();
            element.setAttribute(topAttr);

            console.log(element);

            leftAttr.value = (e.clientX - offset.left).toString();
            element.setAttribute(leftAttr);

            console.log(element);

            this.insertElement(element);
            this.selectElement(element); // Automatically select newly inserted element
            this.fireEvent('canvasinsert', element);
        }
    }

    private handleElementMove(e: MouseEvent, element: Tease.Element) {
        if (this.allowInput) {
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
                that.DOMElement.unbind('mousemove');
                that.DOMElement.unbind('mouseup');
            }

            this.DOMElement.bind('mousemove', handleMove);
            this.DOMElement.bind('mouseup', handleUp);
        }
    }

    private handleElementSelect(e: Event, element: Tease.Element) {
        if (this.allowInput) {
            var selectedDOME = <HTMLElement> e.target;
            this.selectElement(this.currentElements[parseInt(selectedDOME.id)]);
            this.sizingTool.render(element);
        }
    }
}