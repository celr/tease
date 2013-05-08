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
            var elementName: string = getElementName(element);
            var elementAnimationName: string = getElementAnimationName(element);

            out += tabulate("\$\(\"\." + elementName + "\"\)\.toggleClass\(\"" + elementAnimationName + "\"\);\n");
        }
        out += "}\n";

        // TODO(chadan): Generate code for not initial animations?.
        
        return out;
    }
}