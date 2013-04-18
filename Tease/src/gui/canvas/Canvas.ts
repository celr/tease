///<reference path="../toolbars/Toolbar.ts" />
///<reference path="../../base/AnimationRenderer.ts" />
///<reference path="../../base/Layer.ts" />
///<reference path="../../base/Environment.ts" />
///<reference path="../../base/Element.ts" />
///<reference path="../../base/Eventable.ts" />
///<reference path="../canvas/SizingTool.ts" />
///<reference path="../canvas/SelectionTool.ts" />
///<reference path="../canvas/ElementGroup.ts" />
// Canvas
// Represents a canvas in the GUI
// owner: jair
class Canvas extends Eventable {
    private currentElements: Tease.Element[]; // Elements currently shown on canvas
    private currentSelection: Tease.Element; // TODO: Multiple selection
    private sizingTool: SizingTool;
    private allowInput: bool;
    private selectionTool: SelectionTool;
    private selectedGroup: ElementGroup;
    private move: bool;

    constructor(private DOMElement: JQuery, public currentTool: Tool, private environment: Environment) {
        super();
        this.allowInput = true;
        this.sizingTool = new SizingTool();
        this.selectedGroup = new ElementGroup(null, this.DOMElement);
        this.DOMElement.css('position', 'relative');
        this.currentElements = [];
        this.DOMElement.click((e: Event) => {
            this.handleCanvasClick(e);
        });
        this.DOMElement.mousedown((e: JQueryEventObject) => {
            this.handleSelectionTool(e);
        });
        this.move = false;
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
            if (this.currentTool.id == 'pointertool') {
                e.stopPropagation();
                e.preventDefault();
                e.cancelBubble = true;
                if (!this.move) {
                    this.handleElementSelect(e, element);
                }
                this.move = false;
            }
        });

        element.DOMElement.bind('mousedown', (e: MouseEvent) => {
            e.stopPropagation();
            e.preventDefault();
            e.cancelBubble = true;
            if (this.currentTool.id == 'pointertool') {
                this.handleElementMove(e, element);
            }
        });

        element.DOMElement.attr('id', this.currentElements.length.toString());
        this.DOMElement.append(element.DOMElement);
        this.currentElements.push(element);
    }

    public selectElement(element: Tease.Element) {
        this.currentSelection = element;
        this.fireEvent('canvasselect', element);
    }

    private handleCanvasClick(e) {
        if (!(this.currentTool.id == 'pointertool')) {
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

                leftAttr.value = (e.clientX - offset.left).toString();
                element.setAttribute(leftAttr);

                this.insertElement(element);
                this.selectElement(element); // Automatically select newly inserted element
                this.fireEvent('canvasinsert', element);
            }
        }
    }

    private handleElementMove(e: MouseEvent, element: Tease.Element) {
        if (this.allowInput) {
            var wasGroupVisible = this.selectedGroup.isVisible();
            this.sizingTool.erase();
            this.selectedGroup.eraseDots();
            var that = this;
            console.log('dine');
            if (!wasGroupVisible || !this.selectedGroup.isInGroup(element.DOMElement.attr('id'))) {
                this.createGroup(element);
            }

            function handleMove(eMove: MouseEvent) {
                that.selectedGroup.move(eMove.clientX - e.clientX, eMove.clientY - e.clientY);
                that.move = true;
            }

            function handleUp(e: MouseEvent) {
                that.DOMElement.unbind('mousemove');
                that.DOMElement.unbind('mouseup');
                that.selectedGroup.updateInitialPositions();
                if (wasGroupVisible) {
                    that.selectedGroup.markElements();
                }
                else {
                    that.sizingTool.render(element);
                }
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
            this.createGroup(element);
        }
    }

    private handleSelectionTool(e) {
        if (this.currentTool.id == 'pointertool') {
            this.sizingTool.erase();
            if (this.selectedGroup) {
                this.selectedGroup.clear();
            }
            var initialX = e.clientX - this.DOMElement.offset().left;
            var initialY = e.clientY - this.DOMElement.offset().top;
            this.selectionTool = new SelectionTool(initialY, initialX, this.DOMElement);


            var that = this;

            function handleMove(event) {
                console.log('done');
                that.selectionTool.resize(event.clientX-e.clientX, event.clientY-e.clientY);
            }
            function handleUp(event) {
                document.removeEventListener('mouseup', handleUp);
                that.DOMElement.off('mousemove', handleMove);
                that.selectedGroup = that.selectionTool.getSelectedElements(that.currentElements, event.clientX - that.DOMElement.offset().left, event.clientY - that.DOMElement.offset().left);
                that.selectionTool.erase();
                that.selectedGroup.markElements();
            }
            this.DOMElement.on('mousemove', handleMove);
            document.addEventListener('mouseup', handleUp);
            e.preventDefault();
            e.stopPropagation();
        }
    }

    private createGroup(element: Tease.Element) {
        this.selectedGroup.clear();
        this.selectedGroup = new ElementGroup(null, this.DOMElement);
        this.selectedGroup.insertElement(element.DOMElement.attr('id'), element);
    }
}