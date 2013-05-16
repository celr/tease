///<reference path="code_generation/CodeGenerator.ts" />
///<reference path="AnimationRenderer.ts" />
///<reference path="../lib/jquery.d.ts" />
///<reference path="../lib/json2.ts" />
///<reference path="../tools/BaseTool.ts" />
///<reference path="../tools/CanvasTool.ts" />

class PageSynchronizer {
    private codeGenerator: CodeGenerator;
    private animationRenderer: AnimationRenderer;
    private url: string; //This is the url that points to the web service
    private pageID: string;
    private interval: Object;
    private ms: number;
    private environment: Environment;
    private animationSettings: AnimationSettings;

    constructor() {
    }

    public updatePageFiles(environment: Environment, animationSettings: AnimationSettings) {
        this.environment = environment;
        this.animationSettings = animationSettings;
        this.animationRenderer = new AnimationRenderer();
        this.codeGenerator = new CodeGenerator();
        this.pageID = $("#pageID").val();
        this.ms = 300000;
        var renderedEnv = this.animationRenderer.getRenderedEnvironment(environment, animationSettings);
        var pageCode = <PageCode> this.codeGenerator.generate(renderedEnv);
        this.sendFile("UpdateCSSStyles", pageCode.CSSStylesCode, "css");
        this.sendFile("UpdateCSSAnimations", pageCode.CSSAnimationsCode, "css");
        this.sendFile("UpdateHTML", pageCode.HTMLCode, "html");
        this.sendFile("UpdateJavaScript", pageCode.JSCode, "javascript");
        this.updateEnvironment();
    }

    private updateEnvironment() {
        var seen = [];
        var data = JSON.stringify(this.environment, function (key, val) {
            if (typeof val == "object") {
                if (val instanceof jQuery)
                    return;
                if (val instanceof HTMLElement)
                    return;
                if (val instanceof BaseTool) {
                    return val.id;
                }
                if (val instanceof CanvasTool) {
                    return val.id;
                }
                if (seen.indexOf(val) >= 0)
                    return;
                seen.push(val);
            }
            return val;
        });
        this.callAjax('UpdatePage?pageID=' + this.pageID, data);
    }

    private sendFile(url: string, code: string, type: string) {
        var file = { pageID: this.pageID, code: code, type: type };
        this.callAjax(url, JSON.stringify({file : file}));
    }

    private callAjax(url: string, data: string) {
        var AjaxSettings = {
            type: "POST",
            url: "/Json/" + url,
            data: data,
            contentType: "application/json; charset=utf-8",
            dataType: "json"
        };
        $.ajax(AjaxSettings);
    }
}