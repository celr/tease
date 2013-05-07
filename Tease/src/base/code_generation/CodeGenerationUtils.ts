// Utils for code generation.

var Tab: string = "  ";

function tabulate(code: string) {
    var newCode: string = Tab + code.replace(/\n/g, "\n" + Tab);
    // Don't tabulate after the last \n if it is the last character.
    if (newCode.substring(newCode.length - (1 + Tab.length)) === ("\n" + Tab)) {
        newCode = newCode.substr(0, newCode.length - Tab.length);
    }
    return newCode;
}