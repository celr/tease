var __extends = this.__extends || function (d, b) {
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
///<reference path="Tool.ts" />
///<reference path="Eventable.ts" />
// Toolbar
// Represents a toolbar in the GUI
// owner: carlos
var Toolbar = (function (_super) {
    __extends(Toolbar, _super);
    function Toolbar(DOMElement) {
        _super.call(this);
        this.DOMElement = DOMElement;
        this.tools = new Array();
        this.toolMap = new Object();
        this.loadTools();
        this.renderTools();
        this.selectTool(this.tools[0])// Automatically select the first tool
        ;
    }
    Toolbar.prototype.loadTools = // id => tool mapping
    // Loads the available tools into the tools array
    function () {
        this.tools.push(new ImageTool('imagetool', 'res/jair.png'));
        this.tools.push(new ImageTool('imagetool2', 'res/chadan.png'));
        this.tools.push(new ImageTool('imagetool3', 'res/carlos.png'));
        this.tools.push(new AudioTool('audiotool'));
    };
    Toolbar.prototype.renderTool = // Creates and adds the html element for the passed tool
    function (tool) {
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
    Toolbar.prototype.renderTools = // Helper function to render all the tools in the tool array
    function () {
        for(var i = 0; i < this.tools.length; i++) {
            this.renderTool(this.tools[i]);
            if((i + 1) % 2 == 0 && i != 0) {
                this.DOMElement.appendChild(document.createElement('br'))// Add newline every two tools
                ;
            }
        }
    };
    return Toolbar;
})(Eventable);
//@ sourceMappingURL=Toolbar.js.map
