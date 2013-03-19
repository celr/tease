///<reference path="Toolbar.ts" />
///<reference path="Canvas.ts" />
///<reference path="PropertyEditor.ts" />
///<reference path="Timeline.ts" />
window.onload = function () {
    var toolbar = new Toolbar(document.getElementById('toolbar'));
    var canvas = new Canvas(document.getElementById('canvas'), toolbar.currentTool);
    var propertyEditor = new PropertyEditor(document.getElementById('propertyeditor'), canvas.currentSelection);
    var timeline = new Timeline(document.getElementById('timeline'), {
        layers: [
            {
                title: 'Layer 1'
            }, 
            {
                title: 'Layer 2'
            }
        ]
    }, {
        framerate: 12,
        defaultLength: 30
    });// TODO: Replace dummy layers and settings with real objects
    
    canvas.addEventListener('canvasselect', function (e) {
        propertyEditor.renderPropertiesForElement(e.detail);
        propertyEditor.currentElement = e.detail;
    }, true);
    toolbar.addEventListener('toolselect', function (e) {
        canvas.currentTool = e.detail;
    }, true);
};
//@ sourceMappingURL=Main.js.map
