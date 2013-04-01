///<reference path="Toolbar.ts" />
///<reference path="Canvas.ts" />
///<reference path="PropertyEditor.ts" />
///<reference path="Timeline.ts" />
///<reference path="Layer.ts" />
window.onload = function () {
    // Initialize environment
    var env = new Environment();
    env.layers = [
        new Layer("Layer 1", true, true)
    ];
    var toolbar = new Toolbar(document.getElementById('toolbar'));
    var canvas = new Canvas(document.getElementById('canvas'), toolbar.currentTool, env);
    var propertyEditor = new PropertyEditor(document.getElementById('propertyeditor'), canvas.currentSelection);
    var timeline = new Timeline(document.getElementById('timeline'), env, {
        framerate: 12,
        defaultLength: 30
    });// TODO: Replace settings with real objects
    
    timeline.addEventListener('frameselect', function (e) {
        canvas.setCurrentPosition(e.detail);
    }, true);
    timeline.addEventListener('layerselect', function (e) {
        canvas.setCurrentLayer(e.detail);
    }, true);
    canvas.addEventListener('canvasselect', function (e) {
        propertyEditor.renderPropertiesForElement(e.detail);
        propertyEditor.currentElement = e.detail;
    }, true);
    canvas.addEventListener('canvasinsert', function (e) {
        timeline.selectedKeyframe.elements.push(e.detail);
    }, true);
    toolbar.addEventListener('toolselect', function (e) {
        canvas.currentTool = e.detail;
    }, true);
};
//@ sourceMappingURL=Main.js.map
