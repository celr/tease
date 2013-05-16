///<reference path="../toolbars/Toolbar.ts" />
///<reference path="../../base/AnimationRenderer.ts" />
///<reference path="../../base/Layer.ts" />
///<reference path="../../base/Environment.ts" />
///<reference path="../../base/Element.ts" />
///<reference path="../../base/Eventable.ts" />
///<reference path="../canvas/SizingTool.ts" />
///<reference path="../canvas/SelectionTool.ts" />
///<reference path="../canvas/ElementGroup.ts" />
///<reference path="SelectedElementOptions.ts" />
///<reference path="../../tools/CanvasTool.ts" />
///<reference path="RotationTool.ts" />

// Canvas
// Represents a canvas in the GUI
// owner: jair
class Canvas extends Eventable {
    private elementMap: Object; // Elements currently shown on canvas
    private sizingTool: SizingTool;
    private allowInput: bool;
    private selectionTool: SelectionTool;
    private selectedGroup: ElementGroup;
    private layerGroups: ElementGroup[];
    private move: bool;
    private SEOptions: SelectedElementOptions;
    private nextElementId: number;
    private canvasElement: Tease.Element;
    private rotationTool: RotationTool;
    public currentLayerIndex: number;

    constructor(private DOMElement: JQuery, public currentTool: Tool, private environment: Environment) {
        super();
        this.currentLayerIndex = 0;
        this.allowInput = true;
        this.selectedGroup = new ElementGroup(null, this.DOMElement);
        this.layerGroups = [];
        this.SEOptions = new SelectedElementOptions(this.DOMElement, environment);
        this.sizingTool = new SizingTool();
        this.rotationTool = new RotationTool();
        this.DOMElement.css('position', 'relative');
        this.elementMap = {};
        this.nextElementId = 0;

        this.canvasElement = new Tease.Element(new CanvasTool('canvastool'), this.nextElementId++);
        this.canvasElement.setDOMElement(this.DOMElement);
        this.canvasElement.setAttribute('height', parseInt(this.DOMElement.css('height')).toString());
        this.canvasElement.setAttribute('width', parseInt(this.DOMElement.css('width')).toString());

        environment.canvasAttributes = this.canvasElement.attributes;
        environment.canvasPropertyUnits = this.canvasElement.propertyUnits;

        this.DOMElement.click((e: Event) => {
            this.handleCanvasClick(e);
        });
        this.DOMElement.mousedown((e: JQueryEventObject) => {
            this.handleSelectionTool(e);
        });
        this.DOMElement.on('elementDeleted', (e, element: Tease.Element) => {
            this.handleElementDeleted(element);
        });
        this.DOMElement.on('elementResized', (e, element: Tease.Element) => {
            this.selectElement(element);
        });
        this.DOMElement.on('elementResizing', (e, element: Tease.Element) => {
            this.handleElementResizing(element);
        });
        this.DOMElement.on('elementRotated', (e, element: Tease.Element) => {
            this.selectElement(element);
        });

        this.DOMElement.on('elementEdited', (e, element: Tease.Element) => {
            this.eraseEditionTools();
            this.selectElement(element);
        });
        this.move = false;
        this.DOMElement.css('overflow', 'auto');

        // Create element groups for layers
        for (var i = 0; i < this.environment.layers.length; i++) {
            this.createLayerGroup();
        }
    }

    public blockInput() {
        this.allowInput = false;
    }

    public unblockInput() {
        this.allowInput = true;
    }

    public clear() {
        this.sizingTool.erase();
        this.DOMElement.text('');
        this.elementMap = {};

        for (var i = 0; i < this.layerGroups.length; i++) {
            this.layerGroups[i].clear();
        }
    }

    public insertRenderedElements(elements: RenderedElement[]) {
        for (var i = 0; i < elements.length; i++) {
            $(this.DOMElement).append(elements[i].DOMElement);
        }
    }

    public insertElements(elementLayers: Tease.Element[][]) {
        for (var i = 0; i < elementLayers.length; i++) {
            for (var j = 0; j < elementLayers[i].length; j++) {
                this.insertElementInLayer(elementLayers[i][j], i);
            }
        }
    }

    public createLayerGroup() {
        var elementGroup = new ElementGroup([], this.DOMElement);
        this.layerGroups.push(elementGroup);
    }

    public insertElement(element: Tease.Element) {
        this.insertElementInLayer(element, this.currentLayerIndex);
    }

    // Inserts an element into the canvas
    public insertElementInLayer(element: Tease.Element, layerIndex: number) {
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
        //set id and zIndex properties, insert element into canvas and currentElements
        element.DOMElement.attr('id', element.id);
        this.elementMap[element.id.toString()] = element;
        this.DOMElement.append(element.DOMElement);
        this.setZIndexProperty(element);

        //set element-name
        element.attributes["elementName"] = element.parentTool.displayName + this.environment.getNextToolNumber(element.parentTool.id);
        element.DOMElement.attr('element-name', element.attributes["elementName"]);

        // Insert element into layer group
        this.layerGroups[layerIndex].insertElement(element.id.toString(), element);
    }

    private setZIndexProperty(element: Tease.Element) {
        var $elements = element.DOMElement.siblings().not('[canvasTool="sizingTool"], [canvas="selectedGroupTool"], .dropdown');
        element.DOMElement.css('zIndex', $elements.length);
    }

    public selectElement(element: Tease.Element) {
        if (element != this.canvasElement) {//if the selected element is not the canvas
            this.rotationTool.render(element);
            this.sizingTool.render(element);
            this.SEOptions.render(element);
            this.createGroup(element);
        }
        this.fireEvent('canvasselect', element);
    }

    public selectLayerElements(layerIndex: number) {
        if (this.layerGroups[layerIndex]) {
            this.layerGroups[layerIndex].markElements();
        }
    }

    private handleElementDeleted(element: Tease.Element) {
        delete this.elementMap[element.id.toString()];
        element.DOMElement.remove();
        this.sizingTool.erase();
        this.SEOptions.erase();
        this.selectedGroup.clear();
        this.rotationTool.erase();
    }

    private handleElementResizing(element: Tease.Element) {
        this.SEOptions.erase();
        this.selectedGroup.eraseDots();
        this.rotationTool.erase();
    }

    private handleCanvasClick(e) {
        if (!(this.currentTool.id == 'pointertool')) {
            if (this.allowInput) {
                var element = new Tease.Element(this.currentTool, this.nextElementId++);
                var offset = this.DOMElement.offset();

                element.setAttribute('position', 'absolute');
                element.setAttribute('top', (e.clientY + $(document).scrollTop() - offset.top).toString());
                element.setAttribute('left', (e.clientX + $(document).scrollLeft() - offset.left).toString());

                this.insertElement(element);
                this.fireEvent('canvasinsert', element);
            }
        }
    }

    private handleElementMove(e: MouseEvent, element: Tease.Element) {
        if (this.allowInput) {
            this.sizingTool.erase();
            this.SEOptions.erase();
            this.rotationTool.erase();
            this.selectedGroup.eraseDots();
            var that = this;
            if (!this.selectedGroup.isInGroup(element.id.toString())) {
                this.createGroup(element);
            }
            this.selectedGroup.updateInitialPositions();
            function handleMove(eMove: MouseEvent) {
                that.selectedGroup.move(eMove.clientX - e.clientX, eMove.clientY - e.clientY);
                that.move = true;
            }

            function handleUp(e: MouseEvent) {
                that.DOMElement.unbind('mousemove');
                $(document).unbind('mouseup');
                that.selectedGroup.updateInitialPositions();
                if (that.selectedGroup.hasMultipleElements()) {
                    that.selectedGroup.markElements();
                }
                else {
                    that.selectElement(that.selectedGroup.getElement());
                }
            }
            this.DOMElement.bind('mousemove', handleMove);
            $(document).bind('mouseup', handleUp);
        }
    }

    private handleElementSelect(e: Event, element: Tease.Element) {
        if (this.allowInput) {
            var selectedDOME = <HTMLElement> e.target;
            this.selectElement(element);
        }
    }

    private handleSelectionTool(e) {
        if (this.currentTool.id == 'pointertool') {
            this.sizingTool.erase();
            this.SEOptions.erase();
            this.rotationTool.erase();
            if (this.selectedGroup) {
                this.selectedGroup.clear();
            }

            var initialX = e.clientX + $(document).scrollLeft() - this.DOMElement.offset().left;
            var initialY = e.clientY + $(document).scrollTop() - this.DOMElement.offset().top;

            this.selectionTool = new SelectionTool(initialY, initialX, this.DOMElement);


            var that = this;

            function handleMove(event) {
                that.selectionTool.resize(event.clientX - e.clientX, event.clientY - e.clientY);
            }

            function handleUp(event) {
                document.removeEventListener('mouseup', handleUp);
                that.DOMElement.off('mousemove', handleMove);
                var finalX = event.clientX + $(document).scrollLeft() - that.DOMElement.offset().left;
                var finalY = event.clientY + $(document).scrollTop() - that.DOMElement.offset().top;
                that.selectedGroup = that.selectionTool.getSelectedElements(that.elementMap, finalX, finalY);
                that.selectionTool.erase();
                if (that.selectedGroup.hasMultipleElements()) {
                    that.selectedGroup.markElements();
                }
                else if (that.selectedGroup.isEmpty()) {
                    that.selectElement(that.canvasElement);
                }
                else { // then the group has just one element
                    that.selectElement(that.selectedGroup.getElement());
                }
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
        this.selectedGroup.insertElement(element.id.toString(), element);
    }

    private eraseEditionTools() {
        this.rotationTool.erase();
        this.sizingTool.erase();
        this.SEOptions.erase();
    }
}