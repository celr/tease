///<reference path="gui/toolbars/Toolbar.ts" />
///<reference path="gui/canvas/Canvas.ts" />
///<reference path="gui/toolbars/PropertyEditor.ts" />
///<reference path="gui/toolbars/Timeline.ts" />
///<reference path="base/Layer.ts" />
///<reference path="base/Environment.ts" />
///<reference path="base/AnimationRenderer.ts" />
///<reference path="base/code_generation/CodeGenerator.ts" />
///<reference path="base/PageSynchronizer.ts" />
///<reference path="lib/json2.ts" />

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
    private tools: Object;

    private currentLayerIndex: number;
    private fps: number;
    private pageSynchronizer: PageSynchronizer;

    // Initializes the app
    constructor() {
        // Initialize layers
        this.environment = new Environment;
        this.environment.layers = [new Layer("Layer 1", true, true, 0)];
        this.environment.layers[0].keyframes.push(new Keyframe(1));
        this.currentLayerIndex = 0;
        this.elementLayerMap = {};
        this.fps = 10;

        var pageId = $('#pageID').val();

        // Create tools
        this.tools = {
            texttool: new TextTool('texttool'),
            imagetool: new ImageTool('imagetool', pageId),
            recttool: new RectangleTool('recttool'),
            audiotool: new AudioTool('audiotool'),
            videotool: new VideoTool('videotool'),
            listtool: new ListTool('listtool'),
            pointertool: new PointerTool('pointertool')
        };

        // Initialize Synchronizer
        this.pageSynchronizer = new PageSynchronizer();

        if (pageId) {
            this.openExistingPage(pageId);
        } else {
            this.init();
        }
    }

    private init() {
        // Initialize GUI components
        this.toolbar = new Toolbar($('#toolbar'), this.tools, 'pointertool');
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

        // Select first frame
        this.timeline.selectFirstFrame();
    }

    private openExistingPage(pageId: number) {
        var AjaxSettings = {
            type: "POST",
            url: "Json/GetPage?pageID=" + pageId,
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: (data: Object, textStatus: string) => {
                if (data) {
                    this.environment = this.getEnvironmentWithData(data);
                }
                this.init();
            }
        };
        $.ajax(AjaxSettings);
    }

    private getEnvironmentWithData(data: Object) {
        var remoteEnvironment = JSON2.parse(data);
        var environment = new Environment();
        environment.canvasAttributes = remoteEnvironment.canvasAttributes;
        environment.canvasPropertyUnits = remoteEnvironment.canvasPropertyUnits;
        environment.toolCount = remoteEnvironment.toolCount;

        // Create layers and keyframes
        for (var layerIndex in remoteEnvironment.layers) {
            var remoteLayer = remoteEnvironment.layers[layerIndex];
            var layer = new Layer(remoteLayer.title, remoteLayer.visible, remoteLayer.editable, remoteLayer.index);

            for (var keyframeIndex in remoteLayer.keyframes) {
                var remoteKeyframe = remoteLayer.keyframes[keyframeIndex];
                var keyframe = new Keyframe(remoteKeyframe.position);
                layer.insertKeyframe(keyframe);
            }
            environment.layers.push(layer);
        }


        // Fix element transitions
        for (var layerIndex in environment.layers) {
            var layer = environment.layers[layerIndex];

            for (var keyframeIndex in layer.keyframes) {
                var keyframe = remoteEnvironment.layers[layerIndex].keyframes[keyframeIndex];

                for (var elementIndex in keyframe.elements) {
                    var remoteElement = keyframe.elements[elementIndex];
                    var element = this.parseElement(remoteElement, layer);
                    if (element) {
                        environment.layers[layerIndex].keyframes[keyframeIndex].addElement(element);
                    }
                }
            }
        }

        console.log(data);

        return environment;
    }
    
    private parseElement(remoteElement: any, layer: Layer) {
        if (remoteElement) {
            var element = new Tease.Element(<Tool>(this.tools[remoteElement.parentTool]), parseInt(remoteElement.id));
            element.setAttributes(remoteElement.attributes);
            element.keyframePosition = remoteElement.keyframePosition;
            element.propertyUnits = remoteElement.propertyUnits;

            if (remoteElement.elementTransition.nextElement) {
                var nextElement = this.parseElement(remoteElement.elementTransition.nextElement, layer);
                element.elementTransition.nextElement = nextElement;
                nextElement.elementTransition.hasPreviousElement = true;
                layer.insertElementInPosition(nextElement.keyframePosition, nextElement);
            }

            this.elementLayerMap[element.id.toString()] = layer.index;

            return element;
        }
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

        this.pageSynchronizer.updatePageFiles(this.environment, this.animationSettings);
    }
}

window.onload = () => {
    var mainController = new MainController();
};