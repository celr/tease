var __extends = this.__extends || function (d, b) {
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
///<reference path="Toolbar.ts" />
///<reference path="Element.ts" />
// Canvas
// Represents a canvas in the GUI
// owner: jair
var Canvas = (function (_super) {
    __extends(Canvas, _super);
    function Canvas(DOMElement, currentTool, environment) {
        var _this = this;
        _super.call(this);
        this.DOMElement = DOMElement;
        this.currentTool = currentTool;
        this.environment = environment;
        this.setCurrentPosition(1);
        this.setCurrentLayer(0);
        this.DOMElement.addEventListener('click', function (e) {
            _this.handleCanvasClick(e);
        });
    }
    Canvas.prototype.doSelect = function (element) {
        if(this.currentSelection) {
            this.currentSelection.DOMElement.classList.remove('selected');
        }
        element.DOMElement.classList.add('selected');
        this.fireEvent('canvasselect', element);
        this.currentSelection = element;
    };
    Canvas.prototype.handleCanvasClick = function (e) {
        var _this = this;
        var element = new Tease.Element(this.currentTool);
        // TODO: Add element to document
        element.DOMElement.addEventListener('click', function (e) {
            // Avoid event bubbling
            e.stopPropagation();
            e.cancelBubble = true;
            var selectedDOME = e.target;
            _this.doSelect(_this.currentElements[parseInt(selectedDOME.id)]);
        });
        element.DOMElement.id = this.currentElements.length.toString();
        this.environment.layers[this.currentLayerIndex].insertElementInPosition(this.currentPosition, element);
        this.currentElements.push(element);
        this.DOMElement.appendChild(element.DOMElement);
        this.doSelect(element)// Automatically select newly inserted element
        ;
        this.fireEvent('çanvasinsert', element);
    };
    Canvas.prototype.renderCurrentElements = function () {
        for(var i = 0; i < this.currentElements.length; i++) {
            this.DOMElement.appendChild(this.currentElements[i].DOMElement);
        }
    };
    Canvas.prototype.setCurrentPosition = function (position) {
        this.DOMElement.innerHTML = '';
        this.currentElements = this.environment.getVisibleElements(position);
        this.renderCurrentElements();
        this.currentPosition = position;
    };
    Canvas.prototype.setCurrentLayer = function (index) {
        this.currentLayerIndex = index;
    };
    return Canvas;
})(Eventable);
//@ sourceMappingURL=Canvas.js.map
