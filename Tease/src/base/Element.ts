///<reference path="Frame.ts" />
///<reference path="../tools/Tool.ts" />
class ElementTransition {
    constructor(public previousElement: Tease.Element, public nextElement: Tease.Element, public changeListToNext: {}[]) {
    }
}

module Tease {
    export class Element {
        attributes: {};
        DOMElement: JQuery;
        elementTransition: ElementTransition;
        keyframe: Keyframe;

        constructor(public parentTool?: Tool) {
            this.attributes = {};

            if (this.parentTool) {
                // Clone default attributes
                var defaultAttributes = this.parentTool.defaultAttributes;
                
                for (var i in defaultAttributes) {
                    this.attributes[i] = defaultAttributes[i];;
                }
                                
                this.DOMElement = this.parentTool.defaultDOMElement.clone(true);
                this.DOMElement.css('z-index', '9999');
                this.parentTool.setAttributesInDOMElement(this.parentTool.defaultAttributes, this.DOMElement);
            }

            this.elementTransition = new ElementTransition(null, null, []);
        }

        setAttributes(attributes: {}) {
            for (var i in attributes) {
                this.attributes[i] = attributes[i];
            }
        }

        setAttribute(key: string, value: string) {
            this.attributes[key] = value;
            this.parentTool.setAttributesInDOMElement(this.attributes, this.DOMElement);

            // Update changelist in transition
            if (this.elementTransition.previousElement) {
                this.elementTransition.previousElement.elementTransition.changeListToNext[key] = value;
            }
        }

        getCopy() {
            var newElement = new Tease.Element();
            newElement.parentTool = this.parentTool;
            newElement.elementTransition.previousElement = this.elementTransition.previousElement;
            newElement.elementTransition.nextElement = this.elementTransition.nextElement;
            newElement.elementTransition.changeListToNext = [].concat(this.elementTransition.changeListToNext);
            newElement.DOMElement = this.DOMElement.clone(true);
            newElement.setAttributes(this.attributes);
            return newElement;
        }

        private  swingEasing(p: number) {
            return 0.5 - Math.cos(p * Math.PI) / 2;
        }

        private applyTransition(percentDone: number) {
            for (var i in this.elementTransition.changeListToNext) {
                var startValue = parseInt(this.attributes[i]);
                var endValue = parseInt(this.elementTransition.changeListToNext[i]);
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