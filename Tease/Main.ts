///<reference path="Toolbar.ts" />
///<reference path="Canvas.ts" />
///<reference path="PropertyEditor.ts" />

window.onload = () => {
    var toolbar = new Toolbar(document.getElementById('toolbar'));
    var canvas = new Canvas(document.getElementById('canvas'), toolbar.currentTool);
    var propertyEditor = new PropertyEditor(document.getElementById('propertyeditor'), canvas.currentSelection);

    canvas.addEventListener('canvasselect', (e: CustomEvent) => {
        propertyEditor.renderPropertiesForElement(<Tease.Element> e.detail);
        propertyEditor.currentElement = <Tease.Element> e.detail;
    }, true);

    toolbar.addEventListener('toolselect', (e: CustomEvent) => {
        canvas.currentTool = <Tool> e.detail;
    }, true);
};