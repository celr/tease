var __extends = this.__extends || function (d, b) {
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
}
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
        var element = new Comet.Element(this.currentTool);
        element.DOMElement.addEventListener('click', function (e) {
            e.stopPropagation();
            e.cancelBubble = true;
            var selectedDOME = e.currentTarget;
            _this.doSelect(_this.elementList[parseInt(selectedDOME.id)]);
        });
        element.DOMElement.id = this.elementList.length.toString();
        this.elementList.push(element);
        this.DOMElement.appendChild(element.DOMElement);
        this.doSelect(element);
    };
    return Canvas;
})(Eventable);
