var __extends = this.__extends || function (d, b) {
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
}
var Toolbar = (function (_super) {
    __extends(Toolbar, _super);
    function Toolbar(DOMElement) {
        _super.call(this);
        this.DOMElement = DOMElement;
        this.tools = new Array();
        this.toolMap = new Object();
        this.loadTools();
        this.renderTools();
        this.selectTool(this.tools[0]);
    }
    Toolbar.prototype.loadTools = function () {
        this.tools.push(new ImageTool('imagetool', 'res/jair.png'));
        this.tools.push(new ImageTool('imagetool2', 'res/chadan.png'));
        this.tools.push(new ImageTool('imagetool3', 'res/carlos.png'));
        this.tools.push(new AudioTool('audiotool'));
    };
    Toolbar.prototype.renderTool = function (tool) {
        var _this = this;
        var toolDOMElement = document.createElement('span');
        var toolImage = document.createElement('img');
        toolDOMElement.id = tool.id;
        toolDOMElement.classList.add('tool');
        toolImage.src = tool.displayImagePath;
        toolDOMElement.appendChild(toolImage);
        this.DOMElement.appendChild(toolDOMElement);
        tool.toolbarDOMElement = toolDOMElement;
        toolDOMElement.addEventListener('click', function (event) {
            var element = event.currentTarget;
            var selectedTool = _this.toolMap[element.id];
            _this.selectTool(selectedTool);
        });
        this.toolMap[tool.id] = tool;
    };
    Toolbar.prototype.selectTool = function (tool) {
        if(this.currentTool) {
            this.currentTool.toolbarDOMElement.classList.remove('selectedtool');
        }
        tool.toolbarDOMElement.classList.add('selectedtool');
        this.currentTool = tool;
        this.fireEvent('toolselect', tool);
    };
    Toolbar.prototype.renderTools = function () {
        for(var i = 0; i < this.tools.length; i++) {
            this.renderTool(this.tools[i]);
            if((i + 1) % 2 == 0 && i != 0) {
                this.DOMElement.appendChild(document.createElement('br'));
            }
        }
    };
    return Toolbar;
})(Eventable);
