///<reference path="../../tools/Tool.ts" />
///<reference path="../../base/Eventable.ts" />

// Toolbar
// Represents a toolbar in the GUI
// owner: carlos

class Toolbar extends Eventable {
    public currentTool: Tool;
    private tools: Tool[];
    private toolMap: Object; // id => tool mapping

    constructor (private DOMElement: HTMLElement) {
        super();
        this.tools = new Tool[];
        this.toolMap = new Object();
        this.loadTools();
        this.renderTools();
        this.selectTool(this.tools[0]); // Automatically select the first tool
    }

    // Loads the available tools into the tools array
    private loadTools() {
        this.tools.push(new ImageTool('imagetool', 'res/jair.png'));
        this.tools.push(new ImageTool('imagetool2', 'res/chadan.png'));
        this.tools.push(new ImageTool('imagetool3', 'res/carlos.png'));
        this.tools.push(new AudioTool('audiotool'));
    }

    // Creates and adds the html element for the passed tool
    private renderTool(tool: Tool) {
        var toolDOMElement = <HTMLSpanElement> document.createElement('span');
        var toolImage = <HTMLImageElement> document.createElement('img');
        toolDOMElement.id = tool.id;
        toolDOMElement.classList.add('tool');
        toolImage.src = tool.displayImagePath;
        toolDOMElement.appendChild(toolImage);
        this.DOMElement.appendChild(toolDOMElement);
        tool.toolbarDOMElement = toolDOMElement;

        toolDOMElement.addEventListener('click', (event: MouseEvent) => {
            var element = <HTMLElement> event.currentTarget;
            var selectedTool = this.toolMap[element.id];
            this.selectTool(selectedTool);
        });

        this.toolMap[tool.id] = tool;
    }

    private selectTool(tool: Tool) {
        if (this.currentTool) {
            this.currentTool.toolbarDOMElement.classList.remove('selectedtool');
        }

        tool.toolbarDOMElement.classList.add('selectedtool');
        this.currentTool = tool;
        this.fireEvent('toolselect', tool);
    }

    // Helper function to render all the tools in the tool array
    private renderTools() {
        for (var i = 0; i < this.tools.length; i++) {
            this.renderTool(this.tools[i]);
            if ((i + 1) % 2 == 0 && i != 0) {
                this.DOMElement.appendChild(document.createElement('br')); // Add newline every two tools
            }
        }
    }
}