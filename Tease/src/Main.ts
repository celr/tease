///<reference path="gui/toolbars/Toolbar.ts" />
///<reference path="gui/canvas/Canvas.ts" />
///<reference path="gui/toolbars/PropertyEditor.ts" />
///<reference path="gui/toolbars/Timeline.ts" />
///<reference path="base/Layer.ts" />

window.onload = () => {
    // Initialize environment
    var env = new Environment;
    env.layers = [new Layer("Layer 1", true, true, 0)];

    // Initialized components
    var toolbar = new Toolbar(document.getElementById('toolbar'));
    var canvas = new Canvas(document.getElementById('canvas'), toolbar.currentTool, env);
    var propertyEditor = new PropertyEditor(document.getElementById('propertyeditor'), canvas.currentSelection);
    var timeline = new Timeline(document.getElementById('timeline'), env, { framerate: 12, defaultLength: 30 }); // TODO: Replace settings with real objects
    var currentLayerIndex = 0;
      
    // Frame selection event handler
    timeline.addEventListener('frameselect', (e: CustomEvent) => {
        var elements = env.getVisibleElements(<number> e.detail);
        canvas.clear();
        canvas.insertElements(elements);
    }, true);

    // Layer selection event handler
    timeline.addEventListener('layerselect', (e: CustomEvent) => {
        currentLayerIndex = <number> e.detail;
    }, true);

    // Selection on canvas event handler
    canvas.addEventListener('canvasselect', (e: CustomEvent) => {
        propertyEditor.renderPropertiesForElement(<Tease.Element> e.detail);
        propertyEditor.currentElement = <Tease.Element> e.detail;
    }, true);

    // Insertion on canvas event handler
    canvas.addEventListener('canvasinsert', (e: CustomEvent) => {
        // Add element to the environment
        timeline.selectedKeyframe.elements.push(<Tease.Element> e.detail);
    }, true);

    // Tool selection event handler
    toolbar.addEventListener('toolselect', (e: CustomEvent) => {
        canvas.currentTool = <Tool> e.detail;
    }, true);
};