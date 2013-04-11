///<reference path="../tools/Tool.ts" />
class ElementTransition {
    constructor(public previousElement: Tease.Element, public nextElement: Tease.Element, public changeListToNext: Attribute[]) {
    }
}

module Tease {
    export class Element {
        attributes: Attribute[];
        DOMElement: HTMLElement;
        elementTransition: ElementTransition;

        constructor(public parentTool?: Tool) {
            this.attributes = [];

            if (this.parentTool) {
                // Clone default attributes
                var defaultAttributes = this.parentTool.defaultAttributes;
                for (var i = 0; i < defaultAttributes.length; i++) {
                    this.attributes.push(new Attribute(defaultAttributes[i].property, defaultAttributes[i].value));
                }
                this.DOMElement = <HTMLElement> this.parentTool.defaultDOMElement.cloneNode(true);
                this.DOMElement.style.zIndex = '9999';
                this.parentTool.setAttributesInDOMElement(this.parentTool.defaultAttributes, this.DOMElement);
            }

            
            this.elementTransition = new ElementTransition(null, null, []);

            //jair
            var sizingToolAttributes = this.parentTool.sizingToolAttributes;

            for (var i = 0; i < sizingToolAttributes.length; i++) {
                var tempAttr = this.lookForAttribute(sizingToolAttributes[i]); //auxiliar variable
                if (tempAttr == null) {
                    this.attributes.push(new Attribute(sizingToolAttributes[i].property, sizingToolAttributes[i].value));
                }
            }

            this.DOMElement = <HTMLElement> this.parentTool.defaultDOMElement.cloneNode(true);
            this.DOMElement.style.zIndex = '9999';
            this.parentTool.setAttributesInDOMElement(this.parentTool.defaultAttributes, this.DOMElement);
            //jair
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

        setAttributes(attributes: Attribute[]) {
            for (var i = 0; i < attributes.length; i++) {
                this.setAttribute(attributes[i]);
            }
        }

        setAttribute(attribute: Attribute) {
            var existingAttribute = this.lookForAttribute(attribute);

            if (existingAttribute) {
                existingAttribute.value = attribute.value;
            } else {
                this.attributes.push(attribute);
            }

            this.parentTool.setAttributesInDOMElement(this.attributes, this.DOMElement);

            // Update changelist in transition
            if (this.elementTransition.previousElement) {
                this.elementTransition.previousElement.elementTransition.changeListToNext.push(attribute);
            }
        }

        getCopy() {
            var newElement = new Tease.Element();
            newElement.parentTool = this.parentTool;
            newElement.DOMElement = <HTMLElement> this.DOMElement.cloneNode(true);
            newElement.setAttributes(this.attributes);
            return newElement;
        }

        createTransition(nextElement: Tease.Element) {
            var newElement = nextElement.getCopy();
            this.elementTransition.nextElement = newElement;
            newElement.elementTransition.previousElement = this;
            return newElement;
        }

        applyTransition(percentDone?: number = 100) {
            if (this.elementTransition.nextElement) {
                this.setAttributes(this.elementTransition.changeListToNext);
            }
        }

        getAttribute(propertyId: string) {
            var result = null;

            for (var i = 0; i < this.attributes.length; i++) {
                if (this.attributes[i].property.id == propertyId) {
                    result = this.attributes[i];
                    break;
                }
            }

            return result;
        }
    }
}