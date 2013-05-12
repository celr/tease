///<reference path="../AnimationRenderer.ts" />
///<reference path="HTMLGenerator.ts" />
///<reference path="JSGenerator.ts" />
///<reference path="CSSGenerator.ts" />

// TODO(chadan): Generate logic to make files/ display on code editor.

// Generates the multi-browser code of a given Enviroment.
class CodeGenerator {

    private htmlGenerator: HTMLGenerator;
    private jsGenerator: JSGenerator;
    private cssGenerator: CSSGenerator;

    constructor() {
        this.htmlGenerator = new HTMLGenerator;
        this.jsGenerator = new JSGenerator;
        this.cssGenerator = new CSSGenerator;
    }

    // Returns a PageCode object with the codes corresponding to the given Environment.
    public generate(enviroment : RenderedEnvironment) {
        var htmlCode: string = this.htmlGenerator.generateHTML(enviroment);
        var jsCode: string = this.jsGenerator.generateScripts(enviroment);
        var cssStylesCode: string = this.cssGenerator.generateStyles(enviroment);
        var cssAnimationsCode: string = this.cssGenerator.generateAnimations(enviroment);

        return new PageCode(htmlCode, jsCode, cssStylesCode, cssAnimationsCode);
    }
}

// Contains all the code belonging a page.
class PageCode {

    public HTMLCode: string;
    public JSCode: string;
    public CSSStylesCode: string;
    public CSSAnimationsCode: string;

    constructor(htmlCode?: string = "", jsCode?: string = "", cssStylesCode?: string = "", cssAnimationsCode?: string = "") {
        this.HTMLCode = htmlCode;
        this.JSCode = jsCode;
        this.CSSStylesCode = cssStylesCode;
        this.CSSAnimationsCode = cssAnimationsCode;
    }

}