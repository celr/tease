///<reference path="Tool.ts" />
module Comet {
    export class Element {
        attributes: Attribute[];
        DOMElement: HTMLElement;

        constructor (public parentTool: Tool) {
            // Clone default attributes
            var defaultAttributes = this.parentTool.defaultAttributes;
            this.attributes = new Attribute[];
            for (var i = 0; i < defaultAttributes.length; i++) {
                this.attributes.push(new Attribute(defaultAttributes[i].property, defaultAttributes[i].value));
            }

            this.DOMElement = <HTMLElement> this.parentTool.defaultDOMElement.cloneNode(true);
            this.DOMElement.style.zIndex = '9999';
            this.parentTool.setAttributesInDOMElement(this.parentTool.defaultAttributes, this.DOMElement);
        }

        private lookForAttribute(attribute: Attribute) {
            var result = null;

            for (var i = 0; i < this.attributes.length; i++) {
                if (this.attributes[i].property.id == attribute.property.id) {
                    result = this.attributes[i];
                    break;
                }
            }

            return result;
        }

        setAttribute(attribute: Attribute) {
            var existingAttribute = this.lookForAttribute(attribute);

            if (existingAttribute) {
                existingAttribute.value = attribute.value;
            } else {
                this.attributes.push(attribute);
            }

            this.parentTool.setAttributesInDOMElement(this.attributes, this.DOMElement);
        }
    }
}