///<reference path="../lib/ace/ace.d.ts" />

// Provide functionality to manage the code editors.
class CodeEditor {
    private editor: AceAjax.Editor;

    constructor(editorId: string, mode: string) {
        this.editor = ace.edit(editorId);
        this.editor.setTheme("ace/theme/textmate");
        this.editor.getSession().setMode("ace/mode/" + mode);
    }

    public setMode(mode: string) {
        this.editor.getSession().setMode("ace/mode/" + mode);
    }

    public setText(text: string) {
        this.editor.setValue(text);
    }
}

// Supported modes.
var CodeEditorModes = {
    HTML: "html",
    JS: "javascript",
    CSS: "css"
}