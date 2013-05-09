///<reference path="../base/Element.ts" />

// Represents a way to map abstract properties to translated properties (CSS and DOM)
interface PropertyMapping {
    // Maps a property
    mapProperty(property: string, details: any): void;

    // Applies an attribute object to a DOM Element
    applyAttributes(attributes: Object, propertyUnits: Object, DOMElement: JQuery): void;
}

interface AnimatablePropertyMapping extends PropertyMapping {
    // Generates the animation properties and appends them to the specified properties object.
    appendAnimationProperties(changeList: Object, propertyUnits: Object, properties: Object): void;
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

    public applyAttributes(attributes: Object, propertyUnits: Object, DOMElement: JQuery) {
        for (var i in attributes) {
            this.applyAttribute(i, attributes[i], propertyUnits[i], DOMElement);
        }
    }

    public appendAnimationProperties(changeList: Object, propertyUnits: Object, properties: Object) {
        for (var i in changeList) {
            var unit = propertyUnits[i] || '';
            properties[i] = changeList[i] + unit;
        }
    }

    public applyAttribute(property: string, value: string, propertyUnit: string, DOMElement: JQuery) {
        var result = false;

        if (this.propertyMap.indexOf(property) != -1) {
            var unit = propertyUnit || ''; 
            DOMElement.css(property, value + unit);
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

    public applyAttributes(attributes: Object, propertyUnits: Object, DOMElement: JQuery) {
        for (var i in attributes) {
            this.applyAttribute(i, attributes[i], propertyUnits[i], DOMElement);
        }
    }

    public appendAnimationProperties(changeList: Object, propertyUnits: Object, properties: Object) {
        for (var i in changeList) {
            this.expandProperty(i, changeList[i], propertyUnits[i],
                (targetProperty: string, targetValue: string, targetUnit: string) => {
                    var unit = targetUnit || '';
                    properties[targetProperty] = targetValue + unit;
                }
            );
        }
    }

    private expandProperty(property: string, value: string, propertyUnit: string, callback: Function) {
        var transformMap = this.propertyMap[property];

        if (transformMap) {
            for (var targetProperty in transformMap) {
                callback(targetProperty, transformMap(value), propertyUnit);

            }
        }
    }

    public applyAttribute(property: string, value: string, propertyUnit: string, DOMElement: JQuery) {
        var result = false;

        if (this.propertyMap[property]) {
            this.expandProperty(property, value, propertyUnit,
                (targetProperty: string, targetValue: string, targetUnit: string) => {
                    var unit = targetUnit || '';
                    DOMElement.css(targetProperty, targetValue + unit);
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

    public applyAttributes(attributes: Object, propertyUnits: Object, DOMElement: JQuery) {
        for (var i in attributes) {
            this.applyAttribute(i, attributes[i], propertyUnits[i], DOMElement);
        }
    }

    public applyAttribute(property: string, value: string, propertyUnit: string, DOMElement: JQuery) {
        var result = false;
        
        if (this.propertyMap[property]) {
            var unit = propertyUnit || '';
            this.propertyMap[property](property, value + unit, DOMElement);
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

    public applyAttributes(attributes: Object, propertyUnits: Object, DOMElement: JQuery) {
        for (var i in attributes) {
            this.applyAttribute(i, attributes[i], propertyUnits[i], DOMElement);
        }
    }

    public appendAnimationProperties(changeList: Object, propertyUnits: Object, properties: Object) {
        for (var i in changeList) {
            if (this.propertyMap[i]) {
                var unit = propertyUnits[i] || '';
                properties[this.propertyMap[i]] = changeList[i] + unit;
            }
        }
    }
    
    public applyAttribute(property: string, value: string, propertyUnit: string, DOMElement: JQuery) {
        var result = false;

        if (this.propertyMap[property]) {
            var unit = propertyUnit || '';
            DOMElement.css(this.propertyMap[property], value + propertyUnit);
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

    public applyAttributes(attributes: Object, propertyUnits: Object, DOMElement: JQuery) {
        this.directCSSMapping.applyAttributes(attributes, propertyUnits, DOMElement);
        this.callbackMapping.applyAttributes(attributes, propertyUnits, DOMElement);
        this.renameCSSMapping.applyAttributes(attributes, propertyUnits, DOMElement);
        this.multipleCSSMapping.applyAttributes(attributes, propertyUnits, DOMElement);
    }

    public applyAttribute(property: string, value: string, propertyUnit: string, DOMElement: JQuery) {
        this.directCSSMapping.applyAttribute(property, value, propertyUnit, DOMElement);
        this.callbackMapping.applyAttribute(property, value, propertyUnit, DOMElement);
        this.renameCSSMapping.applyAttribute(property, value, propertyUnit, DOMElement);
        this.multipleCSSMapping.applyAttribute(property, value, propertyUnit, DOMElement);
    }

    public getAnimationProperties(changeList: Object, propertyUnits: Object) {
        var animationProperties = {};

        this.directCSSMapping.appendAnimationProperties(changeList, propertyUnits, animationProperties);
        this.renameCSSMapping.appendAnimationProperties(changeList, propertyUnits, animationProperties);
        this.multipleCSSMapping.appendAnimationProperties(changeList, propertyUnits, animationProperties);

        return animationProperties;
    }
}