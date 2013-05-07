///<reference path="gui/toolbars/Toolbar.ts" />
///<reference path="gui/canvas/Canvas.ts" />
///<reference path="gui/toolbars/PropertyEditor.ts" />
///<reference path="gui/toolbars/Timeline.ts" />
///<reference path="base/Layer.ts" />
///<reference path="base/Environment.ts" />
///<reference path="base/AnimationRenderer.ts" />
///<reference path="base/code_generation/CodeGenerator.ts" />

// Manages system wide events and global environment
class MainController {
    private environment: Environment;
    private toolbar: Toolbar;
    private canvas: Canvas;
    private propertyEditor: PropertyEditor;
    private timeline: Timeline;
    private animationSettings: AnimationSettings;
    private propertyDisplayMap: Object;

    private currentLayerIndex;

    // Initializes the app
    constructor() {
        // Initialize layers
        this.environment = new Environment;
        this.environment.layers = [new Layer("Layer 1", true, true, 0)];
        this.currentLayerIndex = 0;

        // Initialize GUI components
        this.toolbar = new Toolbar($('#toolbar'));
        this.canvas = new Canvas($('#canvas'), this.toolbar.currentTool, this.environment);
        this.propertyEditor = new PropertyEditor($('#propertyeditor'));
        this.timeline = new Timeline($('#timeline'), this.environment, { framerate: 12, defaultLength: 30 }); // TODO: Replace settings with real objects

        // Add event handlers
        this.timeline.addEventListener('frameselect', (e: CustomEvent) => {
            this.handleFrameSelect(e);
        }, true);

        this.timeline.addEventListener('layerselect', (e: CustomEvent) => {
            this.handleLayerSelect(e);
        }, true);

        this.timeline.addEventListener('playbuttonclick', (e: CustomEvent) => {
            this.handlePlayButtonClick(e);
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

        // Initialize animation settings
        this.animationSettings = new AnimationSettings(1, 24); // TODO: Set fps from GUI
    }

    // Event handler for play button click
    private handlePlayButtonClick(e: CustomEvent) {
        var animationRenderer = new AnimationRenderer();
        var renderedEnv = animationRenderer.getRenderedEnvironment(this.environment, this.animationSettings);
        // TODO(chadan): Remove this 2 lines. When needed.
        var codeGenerator: CodeGenerator = new CodeGenerator;
        var pageCode = codeGenerator.generate(renderedEnv);
        this.canvas.clear();
        this.canvas.blockInput();
        this.canvas.insertRenderedElements(renderedEnv.renderedElements);
        renderedEnv.play(() => {
            this.canvas.unblockInput();
        });
    }

    // Event handler for frameselect timeline event
    private handleFrameSelect(e: CustomEvent) {
        var elements = this.environment.getVisibleElements(<number> e.detail);
        this.canvas.clear();
        this.canvas.insertElements(elements);

        if (elements.length > 0) {
            this.canvas.selectElement(elements[0]);
        }

        this.animationSettings.initialPosition = <number> e.detail;
    }

    // Event handler for layerselect timeline event
    private handleLayerSelect(e: CustomEvent) {
        this.currentLayerIndex = <number> e.detail;
    }

    // Event handler for canvasselect canvas event
    private handleCanvasSelect(e: CustomEvent) {
        this.propertyEditor.currentElement = <Tease.Element> e.detail;
        this.propertyEditor.renderPropertiesForElement(<Tease.Element> e.detail);
    }

    // Event handler for canvasinsert canvas event
    private handleCanvasInsert(e: CustomEvent) {
        // Add element to the environment
        this.timeline.selectedFrame.addElement(<Tease.Element> e.detail);
    }

    // Event handler for toolselect toolbar event
    private handleToolSelect(e: CustomEvent) {
        this.canvas.currentTool = <Tool> e.detail;
    }
}

window.onload = () => {
    var mainController = new MainController();
};