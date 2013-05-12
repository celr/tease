///<reference path="../gui/toolbars/property-controls/StringPropertyControl.ts" />

class PropertyDisplayGroup {
    constructor(public label: string, public properties?: string[] = [], public propertyLabels?: string[] = [], public propertyControls?: PropertyControl[] = []) {
    }
}