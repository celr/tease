class Property {
    range: Object;
    constructor(public id: string, public displayName: string, public reverseProperty?: string = null) {
        this.reverseProperty = this.id;
    }
}

class Attribute {
    constructor(public property: Property, public value: string) { }
}

class AttributeList {
    public attributes: Object;

    constructor() {
        this.attributes = {};
    }

    setAttribute(attribute: Attribute) {
        this.attributes[attribute.property.id] = attribute;
    }

    getAttribute(property: Property) {
        return this.getAttributeByPropertyId(property.id);
    }

    getAttributeByPropertyId(propertyId: string) {
        var res = null;
        if (this.attributes[propertyId]) {
            res = this.attributes[propertyId];
        }
        return res;
    }
}