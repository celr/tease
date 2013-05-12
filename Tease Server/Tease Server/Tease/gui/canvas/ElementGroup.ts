///<reference path="../../base/Element.ts" />

class ElementGroup {
    public elements: Object;
    private visible: bool;
    private dots: JQuery[];
    private dotSize: number;
    private initialY: Object;
    private initialX: Object;

    constructor(elems: Tease.Element[], private canvas: JQuery) {
        this.elements = {};
        this.initialX = {};
        this.initialY = {};
        this.dots = [];
        var img = <HTMLImageElement> document.createElement('img');
        img.src = 'Tease/res/Dot.png';
        this.dotSize = img.width;
        this.visible = false;
    }


    public insertElement(id: string, element: Tease.Element) {
        this.elements[id] = element;
        this.initialX[id] = parseInt(element.getAttribute('left'));
        this.initialY[id] = parseInt(element.getAttribute('top'));
    }

    public deleteElement(id: string) {
        delete this.elements[id];
        delete this.initialX[id];
        delete this.initialY[id];
    }

    public isInGroup(id: string) {
        if (this.elements[id] == null) {
            return false;
        }
        return true;
    }

    private createDot(top, left) {
        var $img = $('<img></img>');
        $img.attr({'src': 'Tease/res/Dot.png', 'canvasTool' : 'selectedGroupTool'});
        $img.css({
            'top': top + 'px',
            'left': left + 'px',
            'position': 'absolute',
            'z-index': '10000000',
        });

        return $img;
    }

    public eraseDots() {
        if (this.visible) {
            for (var i = 0; i < this.dots.length; i++) {
                this.dots[i].remove();
            }
            this.visible = false;
            this.dots = [];
        }
    }

    public renderDots() {
        if (!this.visible) {
            for (var i = 0; i < this.dots.length; i++) {
                this.canvas.append(this.dots[i]);
            }
            this.visible = true;
        }
    }

    public markElements() {
        for (var i in this.elements) {
            var element = <Tease.Element>this.elements[i];
            var left = parseInt(element.getAttribute('left'));
            var top = parseInt(element.getAttribute('top'));
            var width = parseInt(element.getAttribute('width'));
            var height = parseInt(element.getAttribute('height'));

            var img0 = this.createDot(top, left);
            var img1 = this.createDot(top, left + width - this.dotSize);
            var img2 = this.createDot(top + height - this.dotSize, left);
            var img3 = this.createDot(top + height - this.dotSize, left + width - this.dotSize);
            this.canvas.append(img0);
            this.canvas.append(img1);
            this.canvas.append(img2);
            this.canvas.append(img3);
            this.dots.push(img0);
            this.dots.push(img1);
            this.dots.push(img2);
            this.dots.push(img3);
        }
        this.visible = true;
    }

    public clear() {
        if (this.visible) {
            for (var i = 0; i < this.dots.length; i++) {
                this.dots[i].remove();
            }
            this.dots = [];
            this.elements = {};
            this.initialX = {};
            this.initialY = {};
            this.visible = false;
        }
    }

    public move(deltaX: number, deltaY: number) {
        for (var i in this.elements) {
            this.elements[i].setAttribute('top', (this.initialY[i] + deltaY).toString());
            this.elements[i].setAttribute('left', (this.initialX[i] + deltaX).toString());
        }
    }

    public updateInitialPositions() {
        for (var i in this.elements) {
            this.initialX[i] = parseInt(this.elements[i].getAttribute('left'));
            this.initialY[i] = parseInt(this.elements[i].getAttribute('top'));
        }
    }

    public isVisible() {
        return this.visible;
    }

    public hasMultipleElements() {
        if (Object.keys(this.elements).length <= 1) {
            return false;
        }
        return true;
    }

    public isEmpty() {
        if (Object.keys(this.elements).length == 0) {
            return true;
        }
        return false;
    }

    public getElement() {
        for (var i in this.elements) {
            return this.elements[i];
        }
    }

}