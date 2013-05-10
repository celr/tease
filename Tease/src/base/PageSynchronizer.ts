///<reference path="code_generation/CodeGenerator.ts" />
///<reference path="AnimationRenderer.ts" />
///<reference path="../lib/jquery.d.ts" />
///<reference path="../lib/json2.ts" />

class PageSynchronizer {
    private codeGenerator: CodeGenerator;
    private animationRenderer: AnimationRenderer;
    private url: string; //This is the url that points to the web service
    private pageID: string;
    private interval: Object;
    private ms: number;

    constructor(private environment: Environment, private animationSettings: AnimationSettings) {
        this.animationRenderer = new AnimationRenderer();
        this.codeGenerator = new CodeGenerator();
        this.pageID = $("#pageID").val();
        this.ms = 300000;
        this.interval = setInterval(() => { this.updatePageFiles() }, this.ms);
    }


    public updatePageFiles() {
        //console.log('done');
        var renderedEnv = this.animationRenderer.getRenderedEnvironment(this.environment, this.animationSettings);
        var pageCode = <PageCode> this.codeGenerator.generate(renderedEnv);
        this.sendFile("UpdateCSSStyles", pageCode.CSSStylesCode, "css");
        this.sendFile("UpdateCSSAnimations", pageCode.CSSAnimationsCode, "css");
        this.sendFile("UpdateHTML", pageCode.HTMLCode, "html");
        this.sendFile("UpdateJavaScript", pageCode.JSCode, "javascript");
        this.updateEnvironment();
        console.log('sync');
    }

    private updateEnvironment() {
        var url = "UpdatePage/";
        //this.callAjax(url, this.environment, "environment");
        //console.log(this.environment);
    }

    private sendFile(url: string, code: string, type: string) {
        var file = { pageID: this.pageID, code: code, type: type };
        this.callAjax(url, file, "file");
    }

    private callAjax(url: string, data: Object, dataName: string) {
        var dataObject = new Object();
        dataObject[dataName] = data;
        var AjaxSettings = {
            type: "POST",
            url: "http://localhost:51237/Json/" + url,
            data: JSON2.stringify(dataObject),
            contentType: "application/json; charset=utf-8",
            dataType: "json"
        };
        $.ajax(AjaxSettings);
    }
}