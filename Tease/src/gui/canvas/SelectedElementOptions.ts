///<reference path="../../lib/jquery.d.ts" />
///<reference path="../../lib/bootstrap/js/bootstrap.ts" />

class SelectedElementOptions {
    private $dropDownList: JQuery;
    private toolSize: number;
    private $currentElement: JQuery;
    private visible: bool;
    private element: Tease.Element;

    constructor(private $canvas: JQuery) {
        this.toolSize = 20;
        this.visible = false;
    }

    createHTML() {
        this.$dropDownList = $('<div class="dropdown"><a class="dropdown-toggle" data-toggle="dropdown" href="#"><span class ="caret"></span></a></div>');
        var $list = $('<ul></ul>').attr('class', 'dropdown-menu');
        $list.append($('<li></li>').append($('<a href="#">Enviar enfrente</a>').attr({ 'id': 'front', 'href': '#' })));
        $list.append($('<li></li>').append($('<a href="#">Enviar al fondo</a>').attr({ 'id': 'back', 'href': '#' })));
        $list.append($('<li></li>').append($('<a href="#">Enviar adelante</a>').attr({ 'id': 'forward', 'href': '#' })));
        $list.append($('<li></li>').append($('<a href="#">Enviar atrás</a>').attr({ 'id': 'backward', 'href': '#' })));
        $list.append($('<li></li>').attr('class', 'divider'));
        $list.append($('<li></li>').append('<a href="#">Eliminar</a>').attr('id', 'delete'));
        this.$dropDownList.append($list);
    }

    public render(element: Tease.Element) {
        if (!this.visible) {
            this.element = element;
            this.createHTML();
            //$('dropdown-toggle').dropdown();
            var left = parseInt(element.getAttribute('left')) - this.toolSize;
            var top = parseInt(element.getAttribute('top')) - this.toolSize;
            this.$dropDownList.css({
                'left': left + 'px',
                'top': top + 'px',
                'position': 'absolute',
                'zIndex': '2000020'
            });
            this.$canvas.append(this.$dropDownList);
            this.$currentElement = element.DOMElement;
            this.$dropDownList.mousedown(function (e) { e.stopPropagation(); });
            this.$dropDownList.find('#front').click((e: JQueryEventObject) => { this.sendFront(e) });
            this.$dropDownList.find('#back').click((e: JQueryEventObject) => { this.sendBack(e) });
            this.$dropDownList.find('#forward').click((e: JQueryEventObject) => { this.sendForward(e) });
            this.$dropDownList.find('#backward').click((e: JQueryEventObject) => { this.sendBackward(e) });
            this.$dropDownList.find('#backward').click((e: JQueryEventObject) => { this.sendBackward(e) });
            this.$dropDownList.find('#delete').click((e: JQueryEventObject) => { this.deleteElement(e) });
            this.visible = true;
        }

    }

    private sendFront(event: JQueryEventObject) {
        var $elements = this.$currentElement.siblings().not('[canvasTool="sizingTool"], [canvasTool="sizingTool"], .dropdown');
        var zIndex = parseInt(this.$currentElement.css('zIndex'));
        this.$currentElement.css('zIndex', -1);
        $elements.each(function () {
            var temp = parseInt($(this).css('zIndex'));
            if (temp > zIndex) {
                $(this).css('zIndex', temp - 1);
            }
            return 0;
        });
        this.$currentElement.css('zIndex', $elements.length);
    }

    private sendBack(event: JQueryEventObject) {
        var $elements = this.$currentElement.siblings().not('[canvasTool="sizingTool"], [canvasTool="sizingTool"], .dropdown');
        var zIndex = parseInt(this.$currentElement.css('zIndex'));
        this.$currentElement.css('zIndex', -1);
        $elements.each(function () {
            var temp = parseInt($(this).css('zIndex'));
            if (temp < zIndex) {
                $(this).css('zIndex', temp + 1);
            }
            return 0;
        });
        this.$currentElement.css('zIndex', 0);
    }

    private sendForward(event: JQueryEventObject) {
        var zIndex = parseInt(this.$currentElement.css('zIndex'));
        var $elements = this.$currentElement.siblings().not('[canvasTool="sizingTool"], [canvasTool="sizingTool"], .dropdown');
        if ($elements.length == 0 || zIndex == $elements.length) {
            return;
        }
        this.$currentElement.css('zIndex', '-1');
        var element = this.$currentElement;
        $elements.each(function () {
            var temp = parseInt($(this).css('zIndex'));
            if (temp === (zIndex+1)) {
                $(this).css('zIndex', zIndex);
                element.css('zIndex', zIndex+1);
            }
            return 0;
        });
    }

    private sendBackward(event: JQueryEventObject) {
        var zIndex = parseInt(this.$currentElement.css('zIndex'));
        var $elements = this.$currentElement.siblings().not('[canvasTool="sizingTool"], [canvasTool="sizingTool"], .dropdown');
        if ($elements.length == 0 || zIndex == 0) {
            return;
        }
        this.$currentElement.css('zIndex', '-1');
        var element = this.$currentElement;
        $elements.each(function () {
            var temp = parseInt($(this).css('zIndex'));
            if (temp == zIndex - 1) {
                $(this).css('zIndex', zIndex);
                element.css('zIndex', zIndex - 1);
            }
            return 0;
        });
    }

    private deleteElement(event: JQueryEventObject) {
        var $elements = this.$currentElement.siblings().not('[canvasTool="sizingTool"], [canvasTool="sizingTool"], .dropdown');
        var zIndex = parseInt(this.$currentElement.css('zIndex'));
        this.$currentElement.css('zIndex', -1);
        $elements.each(function () {
            var temp = parseInt($(this).css('zIndex'));
            if (temp > zIndex) {
                $(this).css('zIndex', temp - 1);
            }
            return 0;
        });

        //fire deletion event in canvas
        this.$canvas.trigger('elementDeleted', this.element);
    }

    public erase() {
        if (this.visible) {
            this.$dropDownList.remove();
            this.visible = false;
        }
    }

    
}

