///<reference path="../../tools/TextTool.ts" />
///<reference path="../../tools/ImageTool.ts" />
///<reference path="../../tools/AudioTool.ts" />
///<reference path="../../tools/PointerTool.ts" />
///<reference path="../../tools/RectangleTool.ts" />
///<reference path="../../tools/VideoTool.ts" />
///<reference path="../../base/Eventable.ts" />

// Toolbar
// Represents a toolbar in the GUI
// owner: carlos

class Toolbar extends Eventable {
    public currentTool: Tool;
    private tools: Tool[];
    private toolMap: Object; // id => tool mapping

    constructor(private DOMElement: JQuery) {
        super();
        this.tools = new Tool[];
        this.toolMap = new Object();
        this.loadTools();
        this.renderTools();
        this.selectTool(this.tools[0]); // Automatically select the first tool
    }

    // Loads the available tools into the tools array
    private loadTools() {
        this.tools.push(new TextTool('texttool'));
        this.tools.push(new ImageTool('imagetool'));
        this.tools.push(new RectangleTool('recttool'));
        this.tools.push(new AudioTool('audiotool'));
        this.tools.push(new VideoTool('videotool'));
        this.tools.push(new PointerTool('pointertool'));
    }

    // Creates and adds the html element for the passed tool
    private renderTool(tool: Tool) {
        tool.toolbarDOMElement = $('<span id="' + tool.id + '" class="tool"><img src="' + tool.displayImagePath + '"></img></span>');
        this.DOMElement.append(tool.toolbarDOMElement);

        tool.toolbarDOMElement.click((event: MouseEvent) => {
            var element = $(event.currentTarget);
            var selectedTool = this.toolMap[element.attr('id')];
            this.selectTool(selectedTool);
        });

        this.toolMap[tool.id] = tool;
    }

    private selectTool(tool: Tool) {
        if (this.currentTool) {
            this.currentTool.toolbarDOMElement.removeClass('selectedtool');
        }

        tool.toolbarDOMElement.addClass('selectedtool');
        this.currentTool = tool;
        this.fireEvent('toolselect', tool);
    }

    // Helper function to render all the tools in the tool array
    private renderTools() {
        for (var i = 0; i < this.tools.length; i++) {
            this.renderTool(this.tools[i]);
            if ((i + 1) % 2 == 0 && i != 0) {
                $('<br />').appendTo(this.DOMElement); // Add newline every two tools
            }
        }
    }
}