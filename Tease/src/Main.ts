///<reference path="gui/toolbars/Toolbar.ts" />
///<reference path="gui/canvas/Canvas.ts" />
///<reference path="gui/toolbars/PropertyEditor.ts" />
///<reference path="gui/toolbars/Timeline.ts" />
///<reference path="base/Layer.ts" />
///<reference path="base/Environment.ts" />

// Manages system wide events and global environment
class MainController {
    private environment: Environment;
    private toolbar: Toolbar;
    private canvas: Canvas;
    private propertyEditor: PropertyEditor;
    private timeline: Timeline;

    private currentLayerIndex;

    // Initializes the app
    constructor() {
        // Initialize layers
        this.environment = new Environment;
        this.environment.layers = [new Layer("Layer 1", true, true, 0)];
        this.currentLayerIndex = 0;

        // Initialize GUI components
        this.toolbar = new Toolbar(document.getElementById('toolbar'));
        this.canvas = new Canvas(document.getElementById('canvas'), this.toolbar.currentTool, this.environment);
        this.propertyEditor = new PropertyEditor(document.getElementById('propertyeditor'));
        this.timeline = new Timeline(document.getElementById('timeline'), this.environment, { framerate: 12, defaultLength: 30 }); // TODO: Replace settings with real objects

        // Add event handlers
        this.timeline.addEventListener('frameselect', (e: CustomEvent) => {
            this.handleFrameSelect(e);
        }, true);

        this.timeline.addEventListener('layerselect', (e: CustomEvent) => {
            this.handleLayerSelect(e);
        }, true);

        this.canvas.addEventListener('canvasselect', (e: CustomEvent) => {
            this.handleCanvasSelect(e);
        }, true);
        
        this.canvas.addEventListener('canvasinsert', (e: CustomEvent) => {
            this.handleCanvasInsert(e);
        }, true);

        this.toolbar.addEventListener('toolselect', (e: CustomEvent) => {
            this.handleToolSelect(e);
        }, true);
    }

    // Event handler for frameselect timeline event
    private handleFrameSelect(e: CustomEvent) {
        var elements = this.environment.getVisibleElements(<number> e.detail);
        this.canvas.clear();
        this.canvas.insertElements(elements);
        if (elements.length > 0) {
            this.canvas.selectElement(elements[0]);
        }
    }

    // Event handler for layerselect timeline event
    private handleLayerSelect(e: CustomEvent) {
        this.currentLayerIndex = <number> e.detail;
    }

    // Event handler for canvasselect canvas event
    private handleCanvasSelect(e: CustomEvent) {
        this.propertyEditor.renderPropertiesForElement(<Tease.Element> e.detail);
        this.propertyEditor.currentElement = <Tease.Element> e.detail;
    }

    // Event handler for canvasinsert canvas event
    private handleCanvasInsert(e: CustomEvent) {
        // Add element to the environment
        this.timeline.selectedKeyframe.addElement(<Tease.Element> e.detail);
    }

    // Event handler for toolselect toolbar event
    private handleToolSelect(e: CustomEvent) {
        this.canvas.currentTool = <Tool> e.detail;
    }
}

window.onload = () => {
    var mainController = new MainController();
};