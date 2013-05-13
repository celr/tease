///<reference path="../AnimationRenderer.ts" />

// Generates the multi-browser HTML code of a given enviroment.
class HTMLGenerator {

    public generateHTML(enviroment: RenderedEnvironment) {
        var out = this.generateDoctypeElement() + "\n";

        out += this.generateTag("html", this.TagTypes.Start) + "\n";

        // TODO(chadan): Get real pageName.
        var pageName: string = "page1";
        out += tabulate(this.generateHeadElement(pageName) + "\n\n");

        out += tabulate(this.generateBodyElement(enviroment) + "\n\n");

        out += this.generateTag("html", this.TagTypes.End);
        return out;
    }

    private TagTypes = {
        Start: "Start",
        End: "End",
        Void: "Void"
    };

    // attributes: Collection of [attribute_name : value].
    private generateTag(tagName: string, tagType: string, attributes?: Object = {}) {
        var out = "\<";

        if (tagType === this.TagTypes.End) {
            out += "\/";
        }

        out += tagName.toLowerCase();

        if (tagType === this.TagTypes.Start || tagType === this.TagTypes.Void) {
            for (var attribute in attributes) {
                out += " " + attribute.toLowerCase();
                out += "\=";
                out += "\"" + attributes[attribute] + "\"";
            }
        }

        if (tagType === this.TagTypes.Void) {
            out += " \/";
        }

        out += "\>";
        return out;
    }

    private generateDoctypeElement() {
        return "\<\!DOCTYPE html\>";
    }

    private generateHeadElement(pageName: string) {
        var out = this.generateTag("head", this.TagTypes.Start) + "\n";

        out += tabulate(this.generateTitleElement(pageName) + "\n");

        // TODO(chadan): Add functionality for extra stylesheets and javascript files?.
        // CSS Files.
        out += tabulate(this.generateCSSLinkElement(pageName + "-styles.css") + "\n");
        out += tabulate(this.generateCSSLinkElement(pageName + "-animations.css") + "\n");
        // Javascript files.
        out += tabulate(this.generateScriptElement("", pageName + ".js") + "\n");
        out += tabulate(this.generateScriptElement("", "jquery.js") + "\n");

        out += this.generateTag("head", this.TagTypes.End) + "\n";
        return out;
    }

    private generateBodyElement(enviroment: RenderedEnvironment) {
        var out = this.generateTag("body", this.TagTypes.Start) + "\n";

        out += tabulate(this.generateTeaseCanvasElement(enviroment) + "\n");

        // Initial animations script.
        out += tabulate(this.generateScriptElement("runInitialAnimations();\n") + "\n");

        out += this.generateTag("body", this.TagTypes.End);
        return out;
    }

    // Generates the div that will contain all the elements created in the UI Canvas.
    private generateTeaseCanvasElement(enviroment: RenderedEnvironment) {
        var out = this.generateTag("div", this.TagTypes.Start, { "id": "TeaseCanvas" }) + "\n";

        for (var i: number = 0; i < enviroment.renderedElements.length; ++i) {
            var element: RenderedElement = enviroment.renderedElements[i];
            out += tabulate(this.generateRenderedElementCode(element) + "\n");
        }

        out += this.generateTag("div", this.TagTypes.End);
        return out;
    }

    // Generates code for the given element. Includes all the tags needed.
    private generateRenderedElementCode(element: RenderedElement) {
        var out = "";

        var elementName: string = getElementName(element);
        var elementTagName: string = element.DOMElement[0].tagName;
        var attributes: Object = { "class": "" };

        for (var attribute: number = 0; attribute < element.DOMElement[0].attributes.length; ++attribute) {
            if (element.DOMElement[0].attributes[attribute].name !== "style" &&  //Ignored attributes.
                element.DOMElement[0].attributes[attribute].name !== "element-name"
                ) {
                attributes[element.DOMElement[0].attributes[attribute].name] = element.DOMElement[0].attributes[attribute].value;
            }
        }

        // Add generated class.
        if (attributes["class"].length !== 0) {
            attributes["class"] += " ";
        }
        attributes["class"] += elementName;

        out += this.generateTag(elementTagName, this.TagTypes.Start, attributes) + "\n";

        // TODO(chadan): Improve this generation.
        out += tabulate(element.DOMElement[0].innerHTML) + "\n";

        out += this.generateTag(elementTagName, this.TagTypes.End);
        return out;
    }

    private generateTitleElement(pageName: string) {
        return this.generateTag("title", this.TagTypes.Start) + pageName + this.generateTag("title", this.TagTypes.End);
    }

    private generateCSSLinkElement(fileName: string) {
        return this.generateTag("link", this.TagTypes.Void, { "rel": "stylesheet", "type": "text/css", "href": fileName })
    }

    private generateScriptElement(code: string, src?: string = "") {
        if (src.length == 0) {
            return this.generateTag("script", this.TagTypes.Start, { "type": "text/javascript" }) + "\n" + tabulate(code) +
                    this.generateTag("script", this.TagTypes.End);
        } else {
            return this.generateTag("script", this.TagTypes.Start, { "type": "text/javascript", "src": src }) + " " +
                    this.generateTag("script", this.TagTypes.End);
        }
    }

}