window.onload = function () {
    var toolbar = new Toolbar(document.getElementById('toolbar'));
    var canvas = new Canvas(document.getElementById('canvas'), toolbar);
    var propertyEditor = new PropertyEditor(document.getElementById('propertyeditor'), canvas);
};
