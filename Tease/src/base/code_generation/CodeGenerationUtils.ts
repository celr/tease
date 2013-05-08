///<reference path="../AnimationRenderer.ts" />

// Utils for code generation.

// Formatting.
var Tab: string = "  ";

function tabulate(code: string) {
    var newCode: string = Tab + code.replace(/\n/g, "\n" + Tab);
    // Don't tabulate after the last \n if it is the last character.
    if (newCode.substring(newCode.length - (1 + Tab.length)) === ("\n" + Tab)) {
        newCode = newCode.substr(0, newCode.length - Tab.length);
    }
    return newCode;
}

// Naming.
function getElementName(element: RenderedElement) {
    return element.DOMElement[0].attributes["element-name"].value;
}

// Returns the animation name corresponding to an element. Currently this function is constant.
function getAnimationName(element: RenderedElement) {
    return "animation";
}

// Returns the concatenated value of getElementName() and getAnimationName().
function getElementAnimationName(element: RenderedElement) {
    return getElementName(element) + "-" + getAnimationName(element);
}