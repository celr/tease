///<reference path="../AnimationRenderer.ts" />
///<reference path="CodeGenerationUtils.ts" />

// Generates the multi-browser CSS code of a given enviroment.
class CSSGenerator {

    // Generates the CSS styles of the given enviroment.
    public generateStyles(enviroment: RenderedEnvironment) {
        var out = "";
        // TODO(chadan): Generate code.
        return out;
    }

    // Generates the CSS animations of the given enviroment.
    public generateAnimations(enviroment: RenderedEnvironment) {
        var out: string = "";

        for (var i: number = 0; i < enviroment.renderedElements.length; ++i) {
            var element: RenderedElement = enviroment.renderedElements[i];
            // TODO(chadan): Obtain real values from |element|.
            var elementName: string = "name" + i.toString();
            var animationName: string = "animation1";

            var animationDurationMs: number = 0;
            for (var j: number = 0; j < element.renderedAnimations.length; ++j) {
                animationDurationMs += element.renderedAnimations[j].durationMs;
            }

            var concatAnimationName: string = elementName + animationName;

            out += this.GenerateKeyframes(element, concatAnimationName, animationDurationMs, this.BrowserPrefixes.Standar);
            out += this.GenerateKeyframes(element, concatAnimationName, animationDurationMs, this.BrowserPrefixes.Firefox);
            out += this.GenerateKeyframes(element, concatAnimationName, animationDurationMs, this.BrowserPrefixes.InternetExplorer);
            out += this.GenerateKeyframes(element, concatAnimationName, animationDurationMs, this.BrowserPrefixes.Webkit);

            out += this.GenerateAnimationClass(concatAnimationName, animationDurationMs);
        }

        return out;
    }

    private BrowserPrefixes = {
        Firefox: "-moz-",
        InternetExplorer: "-ms-",
        Standar: "",
        Webkit: "-webkit-"
    }

    private GenerateKeyframes(element: RenderedElement, animationName: string, durationMs: number, prefix: string) {
        var out = "\@" + prefix + "keyframes " + animationName + " ";
        out += "\{\n";

        var timeFromBegining: number = 0;
        var keyframes: string = "";

        // Original state.
        keyframes += "from ";
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
    private GenerateAnimationClass(animationName: string, durationMs: number) {
        var out = "\." + animationName + " ";
        out += "\{\n";
        out += tabulate(this.GenerateAnimationSettings(animationName, this.BrowserPrefixes.Standar, durationMs)) + "\n";
        out += tabulate(this.GenerateAnimationSettings(animationName, this.BrowserPrefixes.Firefox, durationMs)) + "\n";
        out += tabulate(this.GenerateAnimationSettings(animationName, this.BrowserPrefixes.InternetExplorer, durationMs)) + "\n";
        out += tabulate(this.GenerateAnimationSettings(animationName, this.BrowserPrefixes.Webkit, durationMs));
        out += "\}\n\n";
        return out;
    }

    // Generates CSS code fragment for the given element animation with the given prefix.
    private GenerateAnimationSettings(animationName: string, prefix: string, durationMs: number) {
        var out = prefix + "animation-name: " + animationName + ";\n";
        out += prefix + "animation-duration: " + durationMs + "ms;\n";
        out += prefix + "animation-timing-function: " + "ease" + ";\n";
        out += prefix + "animation-delay: " + "0ms" + ";\n";
        out += prefix + "animation-iteration-count: " + "1" + ";\n";
        out += prefix + "animation-direction: " + "normal" + ";\n";
        out += prefix + "animation-play-state: " + "running" + ";\n";
        return out;
    }
}