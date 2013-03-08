var Property = (function () {
    function Property(id, displayName) {
        this.id = id;
        this.displayName = displayName;
    }
    return Property;
})();
var Attribute = (function () {
    function Attribute(property, value) {
        this.property = property;
        this.value = value;
    }
    return Attribute;
})();
var ImageTool = (function () {
    function ImageTool(id, defaultImage) {
        this.id = id;
        var _this = this;
        this.displayName = 'Image';
        this.displayImagePath = 'res/imageTool.png';
        this.defaultDOMElement = document.createElement('img');
        this.defaultDOMElement.src = defaultImage;
        this.id = id;
        this.properties = new Array();
        var widthProperty = new Property('width', 'ancho');
        var heightProperty = new Property('height', 'largo');
        this.properties.push(widthProperty);
        this.properties.push(heightProperty);
        this.defaultDOMElement.addEventListener('load', function () {
            _this.defaultAttributes = [
                new Attribute(widthProperty, _this.defaultDOMElement.width.toString()), 
                new Attribute(heightProperty, _this.defaultDOMElement.height.toString())
            ];
        });
    }
    ImageTool.prototype.setAttributesInDOMElement = function (attributes, DOMElement) {
        var result = false;
        if(attributes) {
            result = true;
            for(var i = 0; i < attributes.length; i++) {
                switch(attributes[i].property.id) {
                    case 'width': {
                        DOMElement.style.width = attributes[i].value + 'px';
                        break;

                    }
                    case 'height': {
                        DOMElement.style.height = attributes[i].value + 'px';
                        break;

                    }
                    default: {
                        result = false;
                        break;

                    }
                }
            }
        }
        return result;
    };
    ImageTool.prototype.getAttributesFromDOMElement = function (DOMElement) {
        var attributes = new Array();
        return attributes;
    };
    return ImageTool;
})();
var AudioTool = (function () {
    function AudioTool(id) {
        this.id = id;
        this.displayName = 'Audio';
        this.displayImagePath = 'res/audioTool.png';
        this.defaultDOMElement = document.createElement('audio');
        this.defaultDOMElement.controls = true;
        this.id = id;
        this.properties = new Array();
        var srcProperty = new Property('source', 'archivo');
        var apProperty = new Property('autoplay', 'autoplay');
        this.properties.push(srcProperty);
        this.defaultAttributes = [
            new Attribute(apProperty, 'true'), 
            new Attribute(srcProperty, 'res/audio.mp3')
        ];
    }
    AudioTool.prototype.setAttributesInDOMElement = function (attributes, DOMElement) {
        var result = false;
        if(attributes) {
            result = true;
            for(var i = 0; i < attributes.length; i++) {
                switch(attributes[i].property.id) {
                    case 'source': {
                        while(DOMElement.childNodes.length > 0) {
                            DOMElement.removeChild(DOMElement.childNodes[0]);
                        }
                        var source = document.createElement('source');
                        source.src = attributes[i].value;
                        source.type = 'audio/mp3';
                        DOMElement.appendChild(source);
                        DOMElement.load();
                        DOMElement.play();
                        DOMElement.addEventListener('canplay', function (e) {
                            DOMElement.play();
                        });
                        break;

                    }
                    case 'autoplay': {
                        DOMElement.autoplay = 'autoplay';
                        break;

                    }
                    default: {
                        result = false;
                        break;

                    }
                }
            }
        }
        return result;
    };
    AudioTool.prototype.getAttributesFromDOMElement = function (DOMElement) {
        var attributes = new Array();
        return attributes;
    };
    return AudioTool;
})();
