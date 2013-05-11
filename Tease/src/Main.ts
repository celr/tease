///<reference path="gui/toolbars/Toolbar.ts" />
///<reference path="gui/canvas/Canvas.ts" />
///<reference path="gui/toolbars/PropertyEditor.ts" />
///<reference path="gui/toolbars/Timeline.ts" />
///<reference path="base/Layer.ts" />
///<reference path="base/Environment.ts" />
///<reference path="base/AnimationRenderer.ts" />
///<reference path="base/code_generation/CodeGenerator.ts" />
///<reference path="base/PageSynchronizer.ts" />

// Manages system wide events and global environment
class MainController {
    private environment: Environment;
    private toolbar: Toolbar;
    private canvas: Canvas;
    private propertyEditor: PropertyEditor;
    private timeline: Timeline;
    private animationSettings: AnimationSettings;
    private propertyDisplayMap: Object;
    private elementLayerMap: Object;

    private currentLayerIndex: number;
    private fps: number;
	private pageSynchrohizer: PageSynchronizer;
	
    // Initializes the app
    constructor() {
        // Initialize layers
        this.environment = new Environment;
        this.environment.layers = [new Layer("Layer 1", true, true, 0)];
        this.currentLayerIndex = 0;
        this.elementLayerMap = {};
        this.fps = 10;

        // Initialize GUI components
        this.toolbar = new Toolbar($('#toolbar'));
        this.canvas = new Canvas($('#canvas'), this.toolbar.currentTool, this.environment);
        this.propertyEditor = new PropertyEditor($('#propertyeditor'));
        this.timeline = new Timeline($('#timeline'), this.environment, this.fps); // TODO: Replace settings with real objects

        // Add event handlers
        this.timeline.addEventListener('frameselect', (e: CustomEvent) => {
            this.handleFrameSelect(e);
        }, true);

        this.timeline.addEventListener('layerselect', (e: CustomEvent) => {
            this.handleLayerSelect(e);
        }, true);

        this.timeline.addEventListener('layercreate', (e: CustomEvent) => {
            this.handleLayerCreate(e);
        }, true);

        this.timeline.addEventListener('playbuttonclick', (e: CustomEvent) => {
            this.handlePlayButtonClick(e);
        }, true);

        this.timeline.addEventListener('stopbuttonclick', (e: CustomEvent) => {
            this.handleStopButtonClick(e);
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

        $('#btnSave').on('click', () => {
            this.handleSavePage();
        });

        // Initialize animation settings
        this.animationSettings = new AnimationSettings(1, this.fps); // TODO: Set fps from GUI
		
		// Initialize Synchronizer
        this.pageSynchrohizer = new PageSynchronizer(this.environment, this.animationSettings);
    }

    // Event handler for play button click
    private handlePlayButtonClick(e: CustomEvent) {
        var animationRenderer = new AnimationRenderer();
        var renderedEnv = animationRenderer.getRenderedEnvironment(this.environment, this.animationSettings);
        this.timeline.hideWorkspace();
        this.canvas.clear();
        this.canvas.blockInput();
        this.canvas.insertRenderedElements(renderedEnv.renderedElements);
        $('#play-button').hide();
        $('#stop-button').show();
        renderedEnv.play(() => {
            this.canvas.unblockInput();
            this.handleStopButtonClick(e);
        });
    }

    // Event handler for stop button click
    private handleStopButtonClick(e: CustomEvent) {
        $('#play-button').show();
        $('#stop-button').hide();
        this.timeline.showWorkspace();
        this.timeline.selectFirstFrame();
    }

    // Event handler for frameselect timeline event
    private handleFrameSelect(e: CustomEvent) {
        var elements = this.environment.getVisibleElements(<number> e.detail);
        this.canvas.clear();
        this.canvas.insertElements(elements);
        this.animationSettings.initialPosition = <number> e.detail;
        //this.canvas.selectLayerElements(this.currentLayerIndex);
    }

    // Event handler for layerselect timeline event
    private handleLayerSelect(e: CustomEvent) {
        this.currentLayerIndex = <number> e.detail;
        this.canvas.currentLayerIndex = this.currentLayerIndex;
    }

    // Event handler for layercreate timeline event
    private handleLayerCreate(e: CustomEvent) {
        this.canvas.createLayerGroup();
    }

    // Event handler for canvasselect canvas event
    private handleCanvasSelect(e: CustomEvent) {
        var element = <Tease.Element> e.detail;
        this.propertyEditor.currentElement = element;
        this.propertyEditor.renderPropertiesForElement(element);

        if (element.parentTool.id != 'canvastool') {
            var elementId = element.id.toString();
            this.timeline.selectCurrentPositionInLayer(this.elementLayerMap[elementId]);
        }
    }
    
    // Event handler for canvasinsert canvas event
    private handleCanvasInsert(e: CustomEvent) {
        // Add element to the environment
        var element = <Tease.Element> e.detail;
        var elementId = element.id.toString();
        this.timeline.selectedFrame.addElement(element);
        this.elementLayerMap[elementId] = this.currentLayerIndex;
    }

    // Event handler for toolselect toolbar event
    private handleToolSelect(e: CustomEvent) {
        this.canvas.currentTool = <Tool> e.detail;
    }

    private handleSavePage() {
        this.pageSynchrohizer.updatePageFiles();
    }
}

window.onload = () => {
    var mainController = new MainController();
};