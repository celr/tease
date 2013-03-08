var __extends = this.__extends || function (d, b) {
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
}
var PropertyEditor = (function (_super) {
    __extends(PropertyEditor, _super);
    function PropertyEditor(DOMElement, currentElement) {
        _super.call(this);
        this.DOMElement = DOMElement;
        this.currentElement = currentElement;
        this.propertyMap = new Object();
    }
    PropertyEditor.prototype.findAttributeForProperty = function (property, attributes) {
        var value = null;
        if(attributes) {
            for(var i = 0; i < attributes.length; i++) {
                if(property === attributes[i].property) {
                    value = attributes[i].value;
                    break;
                }
            }
        }
        return value;
    };
    PropertyEditor.prototype.handlePropertyBlur = function (e) {
        var value = (e.currentTarget).value;
        var attribute = new Attribute(this.propertyMap[(e.currentTarget).id], value);
        this.currentElement.setAttribute(attribute);
    };
    PropertyEditor.prototype.renderProperty = function (property, defaultValue) {
        var _this = this;
        var newProperty = document.createElement('div');
        newProperty.innerText = property.displayName;
        var newValue = document.createElement('input');
        newValue.id = property.id;
        this.propertyMap[property.id] = property;
        newValue.addEventListener('blur', function (e) {
            _this.handlePropertyBlur(e);
        });
        if(defaultValue) {
            newValue.value = defaultValue;
        }
        newProperty.appendChild(newValue);
        this.DOMElement.appendChild(newProperty);
    };
    PropertyEditor.prototype.renderPropertiesForElement = function (element) {
        this.DOMElement.innerHTML = '';
        for(var i = 0; i < element.parentTool.properties.length; i++) {
            var defaultValue = this.findAttributeForProperty(element.parentTool.properties[i], element.attributes);
            this.renderProperty(element.parentTool.properties[i], defaultValue);
        }
    };
    return PropertyEditor;
})(Eventable);
