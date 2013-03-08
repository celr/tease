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
