var Comet;
(function (Comet) {
    var Element = (function () {
        function Element(parentTool) {
            this.parentTool = parentTool;
            var defaultAttributes = this.parentTool.defaultAttributes;
            this.attributes = new Array();
            for(var i = 0; i < defaultAttributes.length; i++) {
                this.attributes.push(new Attribute(defaultAttributes[i].property, defaultAttributes[i].value));
            }
            this.DOMElement = this.parentTool.defaultDOMElement.cloneNode(true);
            this.DOMElement.style.zIndex = '9999';
            this.parentTool.setAttributesInDOMElement(this.parentTool.defaultAttributes, this.DOMElement);
        }
        Element.prototype.lookForAttribute = function (attribute) {
            var result = null;
            for(var i = 0; i < this.attributes.length; i++) {
                if(this.attributes[i].property.id == attribute.property.id) {
                    result = this.attributes[i];
                    break;
                }
            }
            return result;
        };
        Element.prototype.setAttribute = function (attribute) {
            var existingAttribute = this.lookForAttribute(attribute);
            if(existingAttribute) {
                existingAttribute.value = attribute.value;
            } else {
                this.attributes.push(attribute);
            }
            this.parentTool.setAttributesInDOMElement(this.attributes, this.DOMElement);
        };
        return Element;
    })();
    Comet.Element = Element;    
})(Comet || (Comet = {}));

