///<reference path="../AnimationRenderer.ts" />
///<reference path="CodeGenerationUtils.ts" />

// Generates the multi-browser CSS code of a given enviroment.
class CSSGenerator {

    // Generates the CSS styles of the given enviroment.
    public generateStyles(enviroment: RenderedEnvironment) {
        var out = "";

        // Add style for the canvas.
        out += this.generateCanvasStyle(enviroment);

        for (var i: number = 0; i < enviroment.renderedElements.length; ++i) {
            var element: RenderedElement = enviroment.renderedElements[i];
            var elementName: string = getElementName(element);

            out += "." + elementName + " ";
            out += "\{\n";
            out += tabulate(element.DOMElement[0].style.cssText.replace(/; /g, ";\n")) + "\n";
            out += "\}\n\n";
        }

        return out;
    }

    // Generates the CSS animations of the given enviroment.
    public generateAnimations(enviroment: RenderedEnvironment) {
        var out: string = "";

        for (var i: number = 0; i < enviroment.renderedElements.length; ++i) {
            var element: RenderedElement = enviroment.renderedElements[i];
            var elementAnimationName: string = getElementAnimationName(element);

            var animationDurationMs: number = 0;
            for (var j: number = 0; j < element.renderedAnimations.length; ++j) {
                animationDurationMs += element.renderedAnimations[j].durationMs;
            }

            if (element.renderedAnimations.length > 0) {    // Generate animation code only if necessary.
                out += this.GenerateKeyframes(element, elementAnimationName, animationDurationMs, this.BrowserPrefixes.Standar);
                out += this.GenerateKeyframes(element, elementAnimationName, animationDurationMs, this.BrowserPrefixes.Firefox);
                out += this.GenerateKeyframes(element, elementAnimationName, animationDurationMs, this.BrowserPrefixes.InternetExplorer);
                out += this.GenerateKeyframes(element, elementAnimationName, animationDurationMs, this.BrowserPrefixes.Webkit);

                out += this.GenerateAnimationClass(elementAnimationName, animationDurationMs, element.delay);
            }
        }

        return out;
    }

    private BrowserPrefixes = {
        Firefox: "-moz-",
        InternetExplorer: "-ms-",
        Standar: "",
        Webkit: "-webkit-"
    }

    private generateCanvasStyle(enviroment: RenderedEnvironment) {
        var out = "#TeaseCanvas ";
        out += "\{\n";
        for (var attribute in enviroment.canvasAttributes) {
            var units = "";
            if (enviroment.canvasPropertyUnits.hasOwnProperty(attribute)) {
                units = enviroment.canvasPropertyUnits[attribute];
            }
            out += tabulate(attribute + ": " + enviroment.canvasAttributes[attribute] + units + ";\n");
        }
        out += tabulate("overflow: hidden;\n");
        out += "\}\n\n";
        return out;
    }

    private GenerateKeyframes(element: RenderedElement, animationName: string, durationMs: number, prefix: string) {
        var out = "\@" + prefix + "keyframes " + animationName + " ";
        out += "\{\n";

        var timeFromBegining: number = 0;
        var keyframes: string = "";

        keyframes += "from ";
        keyframes += "{\n";
        keyframes += tabulate("opacity: 1;") + "\n";
        keyframes += "}\n";


        // Original state.
        keyframes += "1% ";
        keyframes += "{\n";
        keyframes += tabulate(element.DOMElement[0].style.cssText.replace(/; /g, ";\n")) + "\n";
        keyframes += "}\n";

        for (var i: number = 0; i < element.renderedAnimations.length - 1; ++i) {
            var animation = element.renderedAnimations[0];

            timeFromBegining += animation.durationMs;

            var kPercentageFixedPoint = 2;
            var percentage: string = (timeFromBegining / durationMs * 100).toFixed(kPercentageFixedPoint);

            keyframes += percentage + "% ";
            keyframes += "{\n";
            for (var property in animation.animationProperties) {
                keyframes += tabulate(property + ": " + animation.animationProperties[property] + ";\n");
            }
            keyframes += "}\n";
        }

        // Last keyframe.
        var animation = element.renderedAnimations[element.renderedAnimations.length - 1];
        keyframes += "to ";
        keyframes += "{\n";
        for (var property in animation.animationProperties) {
            keyframes += tabulate(property + ": " + animation.animationProperties[property] + ";\n");
        }
        keyframes += "}\n";

        out += tabulate(keyframes);
        out += "\}\n\n";
        return out;
    }

    // Generates the style for the given element animation.
    // TODO(chadan): Support for custom animation settings?.
    private GenerateAnimationClass(animationName: string, durationMs: number, delayMs: number) {
        var out = "\." + animationName + " ";
        out += "\{\n";
        out += tabulate(this.GenerateAnimationSettings(animationName, this.BrowserPrefixes.Standar, durationMs, delayMs)) + "\n";
        out += tabulate(this.GenerateAnimationSettings(animationName, this.BrowserPrefixes.Firefox, durationMs, delayMs)) + "\n";
        out += tabulate(this.GenerateAnimationSettings(animationName, this.BrowserPrefixes.InternetExplorer, durationMs, delayMs)) + "\n";
        out += tabulate(this.GenerateAnimationSettings(animationName, this.BrowserPrefixes.Webkit, durationMs, delayMs));
        out += "\}\n\n";
        return out;
    }

    // Generates CSS code fragment for the given element animation with the given prefix.
    private GenerateAnimationSettings(animationName: string, prefix: string, durationMs: number, delayMs: number) {
        var out = prefix + "animation-name: " + animationName + ";\n";
        out += prefix + "animation-duration: " + durationMs + "ms;\n";
        out += prefix + "animation-timing-function: " + "ease" + ";\n";
        out += prefix + "animation-delay: " + delayMs + "ms" + ";\n";
        out += prefix + "animation-iteration-count: " + "1" + ";\n";
        out += prefix + "animation-direction: " + "normal" + ";\n";
        out += prefix + "animation-play-state: " + "running" + ";\n";
        return out;
    }
}