///<reference path="../AnimationRenderer.ts" />
///<reference path="CodeGenerationUtils.ts" />

// Generates the multi-browser Javascript code of a given enviroment.
// Generated code makes the assumption that JQuery will be used.
class JSGenerator {

    public generateScripts(enviroment: RenderedEnvironment) {
        // Initial Animations.
        var out = "function runInitialAnimations() ";
        out += "{\n";
        for (var i: number = 0; i < enviroment.renderedElements.length; i++) {
            var element: RenderedElement = enviroment.renderedElements[i];
            // TODO(chadan): Obtain real values from |element|.
            var elementName: string = 'name' + i.toString();;
            var animationName: string = 'animation1';

            var concatAnimationName: string = elementName + animationName;

            out += tabulate("\$\(\"\." + elementName + "\"\)\.toggleClass\(\"" + concatAnimationName + "\"\);\n");
        }
        out += "}\n";

        // TODO(chadan): Generate code for not initial animations?.

        return out;
    }
}