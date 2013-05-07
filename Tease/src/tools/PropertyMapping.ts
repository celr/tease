///<reference path="../base/Element.ts" />

// Represents a way to map abstract properties to translated properties (CSS and DOM)
interface PropertyMapping {
    // Maps a property
    mapProperty(property: string, details: any): void;

    // Applies an attribute object to a DOM Element
    applyAttributes(attributes: Object, DOMElement: JQuery): void;
}

interface AnimatablePropertyMapping extends PropertyMapping {
    // Generates the animation properties and appends them to the specified properties object.
    appendAnimationProperties(changeList: Object, properties: Object): void;
}

// Represents a direct mapping between abstract and CSS property domains
class DirectCSSPropertyMapping implements AnimatablePropertyMapping {
    private propertyMap: string[];
    private defaultValues: Object;

    constructor() {
        this.propertyMap = [];
    }

    public mapProperty(property: string) {
        this.propertyMap.push(property);
    }

    public applyAttributes(attributes: Object, DOMElement: JQuery) {
        for (var i in this.propertyMap) {
            var property = this.propertyMap[i];
            if (attributes[property]) {
                DOMElement.css(property, attributes[property]);
            }
        }
    }

    public appendAnimationProperties(changeList: Object, properties: Object) {
        for (var i in changeList) {
            properties[i] = changeList[i];
        }
    }

    public applyAttribute(property: string, value: string, DOMElement: JQuery) {
        var result = false;

        if (this.propertyMap.indexOf(property) != -1) {
            DOMElement.css(property, value);
            result = true;
        }

        return result;
    }
}

class MultipleCSSPropertyMapping implements AnimatablePropertyMapping {
    private propertyMap: Object;

    constructor() {
        this.propertyMap = {};
    }

    public mapProperty(property: string, transformMap: Object) {
        this.propertyMap[property] = transformMap;
    }

    public applyAttributes(attributes: Object, DOMElement: JQuery) {
        for (var property in this.propertyMap) {
            if (attributes[property]) {
                this.expandProperty(property, attributes[property],
                    (targetProperty: string, targetValue: string) => {
                        DOMElement.css(targetProperty, targetValue);
                    }
                );
            }
        }
    }

    public appendAnimationProperties(changeList: Object, properties: Object) {
        for (var i in changeList) {
            this.expandProperty(i, changeList[i],
                (targetProperty: string, targetValue: string) => {
                    properties[targetProperty] = targetValue;
                }
            );
        }
    }

    private expandProperty(property: string, value: string, callback: Function) {
        var transformMap = this.propertyMap[property];

        if (transformMap) {
            for (var targetProperty in transformMap) {
                callback(targetProperty, transformMap(value));

            }
        }
    }

    public applyAttribute(property: string, value: string, DOMElement: JQuery) {
        var result = false;

        if (this.propertyMap[property]) {
            this.expandProperty(property, value,
                (targetProperty: string, targetValue: string) => {
                    DOMElement.css(targetProperty, targetValue);
                });
            result = true;
        }

        return result;
    }
}

// Represents a mapping where the property is assigned a callback function
class CallbackPropertyMapping implements PropertyMapping {
    private propertyMap: Object;

    constructor() {
        this.propertyMap = {};
    }

    public mapProperty(property: string, callback: Function) {
        this.propertyMap[property] = callback;
    }

    public applyAttributes(attributes: Object, DOMElement: JQuery) {
        for (var property in this.propertyMap) {
            if (attributes[property]) {
                this.propertyMap[property](property, attributes[property], DOMElement);
            }
        }
    }

    public applyAttribute(property: string, value: string, DOMElement: JQuery) {
        var result = false;

        if (this.propertyMap[property]) {
            this.propertyMap[property](property, value, DOMElement);
        }

        return result;
    }
}

// Represents a mapping where the target CSS property is just renamed
class RenameCSSPropertyMapping implements AnimatablePropertyMapping {
    private propertyMap: Object;

    constructor() {
        this.propertyMap = {};
    }

    public mapProperty(property: string, targetProperty: string) {
        this.propertyMap[property] = targetProperty;
    }

    public applyAttributes(attributes: Object, DOMElement: JQuery) {
        for (var property in this.propertyMap) {
            if (attributes[property]) {
                DOMElement.css(this.propertyMap[property], attributes[property]);
            }
        }
    }

    public appendAnimationProperties(changeList: Object, properties: Object) {
        for (var i in changeList) {
            if (this.propertyMap[i]) {
                properties[this.propertyMap[i]] = changeList[i];
            }
        }
    }

    public applyAttribute(property: string, value: string, DOMElement: JQuery) {
        var result = false;

        if (this.propertyMap[property]) {
            DOMElement.css(this.propertyMap[property], value);
            result = true;
        }

        return result;
    }
}

class PropertyMapper {
    public directCSSMapping: DirectCSSPropertyMapping;
    public callbackMapping: CallbackPropertyMapping;
    public renameCSSMapping: RenameCSSPropertyMapping;
    public multipleCSSMapping: MultipleCSSPropertyMapping;

    constructor() {
        this.directCSSMapping = new DirectCSSPropertyMapping();
        this.callbackMapping = new CallbackPropertyMapping();
        this.renameCSSMapping = new RenameCSSPropertyMapping();
        this.multipleCSSMapping = new MultipleCSSPropertyMapping();
    }

    public applyAttributes(attributes: Object, DOMElement: JQuery) {
        this.directCSSMapping.applyAttributes(attributes, DOMElement);
        this.callbackMapping.applyAttributes(attributes, DOMElement);
        this.renameCSSMapping.applyAttributes(attributes, DOMElement);
        this.multipleCSSMapping.applyAttributes(attributes, DOMElement);
    }

    public applyAttribute(property: string, value: string, DOMElement: JQuery) {
        this.directCSSMapping.applyAttribute(property, value, DOMElement);
        this.callbackMapping.applyAttribute(property, value, DOMElement);
        this.renameCSSMapping.applyAttribute(property, value, DOMElement);
        this.multipleCSSMapping.applyAttribute(property, value, DOMElement);
    }

    public getAnimationProperties(changeList: Object) {
        var animationProperties = {};

        this.directCSSMapping.appendAnimationProperties(changeList, animationProperties);
        this.renameCSSMapping.appendAnimationProperties(changeList, animationProperties);
        this.multipleCSSMapping.appendAnimationProperties(changeList, animationProperties);

        return animationProperties;
    }
}