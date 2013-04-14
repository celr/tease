///<reference path="../tools/Tool.ts" />
class ElementTransition {
    constructor(public previousElement: Tease.Element, public nextElement: Tease.Element, public changeListToNext: Attribute[]) {
    }
}

module Tease {
    export class Element {
        attributes: AttributeList;
        DOMElement: HTMLElement;
        elementTransition: ElementTransition;
        keyframe: Keyframe;

        constructor(public parentTool?: Tool) {
            this.attributes = new AttributeList;

            if (this.parentTool) {
                // Clone default attributes
                var defaultAttributes = this.parentTool.defaultAttributes;

                for (var i in defaultAttributes.attributes) {
                    this.attributes.setAttribute(new Attribute(defaultAttributes.attributes[i].property, defaultAttributes.attributes[i].value));
                }

                this.DOMElement = <HTMLElement> this.parentTool.defaultDOMElement.cloneNode(true);
                this.DOMElement.style.zIndex = '9999';
                this.parentTool.setAttributesInDOMElement(this.parentTool.defaultAttributes, this.DOMElement);
            }

            this.elementTransition = new ElementTransition(null, null, []);

            //jair
            if (this.parentTool) {
                var sizingToolAttributes = this.parentTool.sizingToolAttributes;

                for (var k in sizingToolAttributes.attributes) {
                    var tempAttr = this.attributes.getAttribute(sizingToolAttributes.attributes[k].property); //auxiliar variable
                    if (tempAttr == null) {
                        this.attributes.setAttribute(new Attribute(sizingToolAttributes.attributes[k].property, sizingToolAttributes.attributes[k].value));
                    }
                }

                this.DOMElement = <HTMLElement> this.parentTool.defaultDOMElement.cloneNode(true);
                this.DOMElement.style.zIndex = '9999';
                this.parentTool.setAttributesInDOMElement(this.parentTool.defaultAttributes, this.DOMElement);
            }
            //jair
        }

        setAttributes(attributes: AttributeList) {
            for (var i in attributes.attributes) {
                this.setAttribute(attributes.attributes[i]);
            }
        }

        setAttribute(attribute: Attribute) {
            this.attributes.setAttribute(attribute);
            this.parentTool.setAttributesInDOMElement(this.attributes, this.DOMElement);

            // Update changelist in transition
            if (this.elementTransition.previousElement) {
                this.elementTransition.previousElement.elementTransition.changeListToNext.push(attribute);
            }
        }

        getCopy() {
            var newElement = new Tease.Element();
            newElement.parentTool = this.parentTool;
            newElement.elementTransition.previousElement = this.elementTransition.previousElement;
            newElement.elementTransition.nextElement = this.elementTransition.nextElement;
            newElement.elementTransition.changeListToNext = [].concat(this.elementTransition.changeListToNext);
            newElement.DOMElement = <HTMLElement> this.DOMElement.cloneNode(true);
            newElement.setAttributes(this.attributes);
            return newElement;
        }

        private  swingEasing(p: number) {
            return 0.5 - Math.cos(p * Math.PI) / 2;
        }

        private applyTransition(percentDone: number) {
            for (var i = 0; i < this.elementTransition.changeListToNext.length; i++) {
                var attr = this.attributes.getAttribute(this.elementTransition.changeListToNext[i].property);
                var start = parseInt(attr.value);
                var end = parseInt(this.elementTransition.changeListToNext[i].value);
                var currentValue = (end - start) * this.swingEasing(percentDone) + start;
                var newAttr = new Attribute(attr.property, currentValue.toString());
                this.setAttribute(newAttr);
            }
        }

        getAttribute(propertyId: string) {
            return this.attributes.getAttributeByPropertyId(propertyId);
        }

        getElementWithTransition(percentDone?: number = 100) {
            var newElement = null;
            if (this.hasTransition()) {
                newElement = this.getCopy();
                newElement.applyTransition(percentDone);
            }
            return newElement;
        }

        hasTransition() {
            var res = false;
            if (this.elementTransition.nextElement) {
                res = true;
            }
            return res;
        }
    }
}