///<reference path="Frame.ts" />
///<reference path="../tools/Tool.ts" />
class ElementTransition {
    constructor(public previousElement: Tease.Element, public nextElement: Tease.Element) {
    }
}

module Tease {
    export class Element {
        attributes: {};
        DOMElement: JQuery;
        elementTransition: ElementTransition;
        keyframe: Keyframe;
        propertyUnits: Object;

        constructor(public parentTool: Tool, public id: number) {
            this.attributes = {};
            this.propertyUnits = {};

            if (this.parentTool) {
                // Clone default attributes
                var defaultAttributes = this.parentTool.properties;
                
                for (var i in defaultAttributes) {
                    this.attributes[i] = defaultAttributes[i];
                }

                var propertyUnits = this.parentTool.propertyUnits;
                for (var i in propertyUnits) {
                    this.propertyUnits[i] = propertyUnits[i];
                }
                                
                this.DOMElement = this.parentTool.defaultDOMElement.clone(true);
                this.DOMElement.css('z-index', '9999');
                this.parentTool.setAttributesInDOMElement(defaultAttributes, propertyUnits, this.DOMElement);
            }

            this.elementTransition = new ElementTransition(null, null);
        }

        setAttributes(attributes: {}) {
            for (var i in attributes) {
                this.setAttribute(i, attributes[i]);
            }
        }

        setAttribute(key: string, value: string) {
            this.attributes[key] = value;
            this.parentTool.setAttributeInDOMElement(key, value, this.propertyUnits[key], this.DOMElement);
        }

        getCopy() {
            var newElement = new Tease.Element(this.parentTool, this.id);
            newElement.elementTransition.previousElement = this.elementTransition.previousElement;
            newElement.elementTransition.nextElement = this.elementTransition.nextElement;

            newElement.setAttributes(this.attributes);
            return newElement;
        }

        private  swingEasing(p: number) {
            return 0.5 - Math.cos(p * Math.PI) / 2;
        }

        private applyTransition(percentDone: number) {
            for (var i in this.elementTransition.nextElement.attributes) {
                var startValue = parseInt(this.attributes[i]);
                var endValue = parseInt(this.elementTransition.nextElement.attributes[i]);
                var currentValue = (endValue - startValue) * this.swingEasing(percentDone) + startValue;
                this.setAttribute(i, currentValue.toString())
            }
        }

        getAttribute(key: string) {
            return this.attributes[key];
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

        public setDOMElement(DOMElement: JQuery) {
            this.DOMElement = DOMElement;
        }
    }
}