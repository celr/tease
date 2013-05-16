///<reference path="../../tools/TextTool.ts" />
///<reference path="../../tools/ImageTool.ts" />
///<reference path="../../tools/AudioTool.ts" />
///<reference path="../../tools/PointerTool.ts" />
///<reference path="../../tools/RectangleTool.ts" />
///<reference path="../../tools/VideoTool.ts" />
///<reference path="../../tools/ListTool.ts" />
///<reference path="../../tools/EllipseTool.ts" />
///<reference path="../../base/Eventable.ts" />

// Toolbar
// Represents a toolbar in the GUI
// owner: carlos

class Toolbar extends Eventable {
    public currentTool: Tool;

    constructor(private DOMElement: JQuery, private toolMap: Object, private defaultToolId) {
        super();
        this.renderTools();
        this.selectTool(this.toolMap[this.defaultToolId]); // Automatically select the first tool
    }
    
    // Creates and adds the html element for the passed tool
    private renderTool(tool: Tool) {
        tool.toolbarDOMElement = $('<span id="' + tool.id + '" class="tool" title="' + tool.displayName + ' - ' + tool.description + '"><img src="' + tool.displayImagePath + '"></img></span>');
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
        var count = 0;
        for (var i in this.toolMap) {
            this.renderTool(this.toolMap[i]);
            if ((count + 1) % 2 == 0 && count != 0) {
                $('<br />').appendTo(this.DOMElement); // Add newline every two tools
            }
            count++;
        }
    }
}