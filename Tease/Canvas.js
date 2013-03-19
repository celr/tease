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
    function Canvas(DOMElement, currentTool) {
        var _this = this;
        _super.call(this);
        this.DOMElement = DOMElement;
        this.currentTool = currentTool;
        this.elementList = [];
        this.DOMElement.addEventListener('click', function (e) {
            _this.handleCanvasClick(e);
        });
    }
    Canvas.prototype.doSelect = // TODO: Hacer un elementtree?
    function (element) {
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
            var selectedDOME = e.currentTarget;
            _this.doSelect(_this.elementList[parseInt(selectedDOME.id)]);
        });
        element.DOMElement.id = this.elementList.length.toString();
        this.elementList.push(element);
        this.DOMElement.appendChild(element.DOMElement);
        this.doSelect(element)// Automatically select newly inserted element
        ;
    };
    return Canvas;
})(Eventable);
//@ sourceMappingURL=Canvas.js.map
