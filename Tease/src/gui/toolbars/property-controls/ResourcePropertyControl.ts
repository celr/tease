///<reference path="../../../base/Attribute.ts" />
///<reference path="../../../base/Eventable.ts" />
///<reference path="PropertyControl.ts" />

class ResourcePropertyControl implements PropertyControl extends Eventable {
    public DOMElement: JQuery;
    private frameDOMElement: JQuery;
    private listDOMElement: JQuery;
    private value: string;
    private data: Object[];

    constructor(public property: string, public pageId: number) {
        super();
        this.DOMElement = $('<div></div>');
        this.listDOMElement = $('<ul></ul>');
        this.frameDOMElement = $('<iframe src="Resource/UploadView?pageID=' + this.pageId + '"></iframe>');
        this.frameDOMElement.blur((e: Event) => {
            this.requestUpdateList();
        });
        this.requestUpdateList();
        this.DOMElement.append(this.frameDOMElement);
        this.DOMElement.append(this.listDOMElement);
    }

    private requestUpdateList() {
        var AjaxSettings = {
            type: "POST",
            url: "Json/GetResourcesList?pageID=" + this.pageId,
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: (data: Object[], textStatus: string) => {
                if (data) {
                    this.updateList(data);
                }
            }
        };
        $.ajax(AjaxSettings);
    }

    private updateList(data: Object[]) {
        this.data = data;
        this.listDOMElement.empty();

        for (var i = 0; i < data.length; i++) {
            var newLi = $('<li id="' + i + '">' + data[i]['Name'] + data[i]['Type'] + '</li>');
            newLi.click((e: Event) => {
                this.applyFile(parseInt($(e.target).attr('id')));
            });
            this.listDOMElement.append(newLi);
        }
    }

    private applyFile(index: number) {
        this.value = this.data[index]['Url'];
        this.triggerEvent();
    }

    public getCopy() {
        var copy = new ResourcePropertyControl(this.property, this.pageId);
        return copy;
    }

    public getValue() {
        return this.value;
    }

    public setGUIValue(value: string, propertyUnit: string) {
    }

    private handleChange(e: Event) {
    }

    private triggerEvent() {
        var attributes = {};
        attributes[this.property] = this.value;

        var propertyUnits = {};
        propertyUnits[this.property] = null;

        this.fireEvent('valuechange', { attributes: attributes, propertyUnits: propertyUnits });
    }
}