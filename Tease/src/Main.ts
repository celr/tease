///<reference path="gui/toolbars/Toolbar.ts" />
///<reference path="gui/canvas/Canvas.ts" />
///<reference path="gui/toolbars/PropertyEditor.ts" />
///<reference path="gui/toolbars/Timeline.ts" />
///<reference path="base/Layer.ts" />

window.onload = () => {
    // Initialize environment
    var env = new Environment;
    env.layers = [new Layer("Layer 1", true, true, 0)];

    var toolbar = new Toolbar(document.getElementById('toolbar'));
    var canvas = new Canvas(document.getElementById('canvas'), toolbar.currentTool, env);
    var propertyEditor = new PropertyEditor(document.getElementById('propertyeditor'), canvas.currentSelection);
    var timeline = new Timeline(document.getElementById('timeline'), env, { framerate: 12, defaultLength: 30 }); // TODO: Replace settings with real objects
    
    timeline.addEventListener('frameselect', (e: CustomEvent) => {
        canvas.setCurrentPosition(<number> e.detail);
    }, true);

    timeline.addEventListener('layerselect', (e: CustomEvent) => {
        canvas.setCurrentLayer(<number> e.detail);
    }, true);

    canvas.addEventListener('canvasselect', (e: CustomEvent) => {
        propertyEditor.renderPropertiesForElement(<Tease.Element> e.detail);
        propertyEditor.currentElement = <Tease.Element> e.detail;
    }, true);

    canvas.addEventListener('canvasinsert', (e: CustomEvent) => {
        timeline.selectedKeyframe.elements.push(<Tease.Element> e.detail);
    }, true);

    toolbar.addEventListener('toolselect', (e: CustomEvent) => {
        canvas.currentTool = <Tool> e.detail;
    }, true);
};