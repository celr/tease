///<reference path="Toolbar.ts" />
///<reference path="Canvas.ts" />
///<reference path="PropertyEditor.ts" />
window.onload = function () {
    var toolbar = new Toolbar(document.getElementById('toolbar'));
    var canvas = new Canvas(document.getElementById('canvas'), toolbar.currentTool);
    var propertyEditor = new PropertyEditor(document.getElementById('propertyeditor'), canvas.currentSelection);
    canvas.addEventListener('canvasselect', function (e) {
        propertyEditor.renderPropertiesForElement(e.detail);
        propertyEditor.currentElement = e.detail;
    }, true);
    toolbar.addEventListener('toolselect', function (e) {
        canvas.currentTool = e.detail;
    }, true);
};
//@ sourceMappingURL=Main.js.map
