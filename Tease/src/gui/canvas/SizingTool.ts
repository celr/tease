///<reference path="../../base/Element.ts" />
///<reference path="SelectedElementOptions.ts" />
//SizingTool
//This class encapulates the behavior of the GUI to change the size of elements in the canvas
//owner: jair
class SizingTool {
    private ulDot: HTMLElement; //upper-left dot
    private urDot: HTMLElement; //upper-right dot
    private blDot: HTMLElement; //bottom-left dot
    private brDot: HTMLElement; //bottom-right dot
    private bDot: HTMLElement; //bottom dot
    private lDot: HTMLElement; //left dot
    private rDot: HTMLElement; // right dot
    private uDot: HTMLElement; //upper dot
    private target: Tease.Element; //element that will be edited
    private canvas: HTMLElement;
    private targetLeft: number;
    private targetTop: number;
    private targetWidth: number;
    private targetHeight: number;
    private zindex: number;
    private targetMirrorX: number;
    private targetMirrorY: number;
    private dots: Object;
    private dotSize: number;
    private visible: bool;

    constructor(private SEOptions: SelectedElementOptions) {
        var dotImg = new Image();
        dotImg.src = 'res/Dot.png';

        this.dotSize = dotImg.width;
        //upper-left, upper-right, bottom-left, bottom-right, upper, bottom, left , right dots
        this.ulDot = this.createDot(dotImg.src);
        this.urDot = this.createDot(dotImg.src);
        this.blDot = this.createDot(dotImg.src);
        this.brDot = this.createDot(dotImg.src);
        this.uDot = this.createDot(dotImg.src);
        this.bDot = this.createDot(dotImg.src);
        this.lDot = this.createDot(dotImg.src);
        this.rDot = this.createDot(dotImg.src);

        this.dots = {
            north: 0,
            east: 1,
            south: 2,
            west: 3
        };


        this.canvas = document.getElementById('canvas');
        this.zindex = 2000000;
    }

    private createDot(src: string) {
        var dot = document.createElement('img');
        dot.setAttribute('src', src);
        dot.style.position = 'absolute';
        $(dot).attr('canvasTool', 'sizingTool');
        return dot;
    }

    toPx(a: number) {
        return a + 'px';
    }

    private askForAttribute(id: string) {
        var tempAtt = this.target.getAttribute(id);
        return tempAtt == null ? null : parseInt(tempAtt);
    }

    private setDotPosition(left: number, top: number, dot: HTMLElement) {
        $(dot).css({
            'top': top + 'px',
            'left': left + 'px',
            'zIndex': (this.zindex + 10).toString()
        });
    }


    handleMoveDot(movX: number, movY: number, initial: MouseEvent, final: MouseEvent, initialLeft: number, initialTop: number, that: SizingTool, dot: HTMLElement) {
        //calculate delta x and y
        var deltaX = final.clientX - initial.clientX;
        var deltaY = final.clientY - initial.clientY;

        var top = initialTop + deltaY;
        var left = initialLeft + deltaX;

        var DOMElement = <JQuery> that.target.DOMElement;

        if (movY == that.dots['north']) {

            var middle = parseInt(DOMElement.css('top')) + (parseInt(DOMElement.css('height')) >> 1);
            $(that.ulDot).css('top', top + 'px');
            $(that.uDot).css('top', top + 'px');
            $(that.urDot).css('top', top + 'px');
            $(that.lDot).css('top', middle);
            $(that.rDot).css('top', middle);
        }

        if (movY == that.dots['south']) {
            var middle = parseInt(DOMElement.css('top')) + (parseInt(DOMElement.css('height')) >> 1);
            $(that.blDot).css('top', top + 'px');
            $(that.bDot).css('top', top + 'px');
            $(that.brDot).css('top', top + 'px');
            $(that.lDot).css('top', middle);
            $(that.rDot).css('top', middle);
        }

        if (movX == that.dots['east']) {
            var middle = parseInt(DOMElement.css('left')) + (parseInt(DOMElement.css('width')) >> 1);
            $(that.urDot).css('left', left + 'px');
            $(that.rDot).css('left', left + 'px');
            $(that.brDot).css('left', left + 'px');
            $(that.bDot).css('left', middle);
            $(that.uDot).css('left', middle);
        }

        if (movX == that.dots['west']) {
            var middle = parseInt(DOMElement.css('left')) + (parseInt(DOMElement.css('width')) >> 1);
            $(that.ulDot).css('left', left + 'px');
            $(that.lDot).css('left', left + 'px');
            $(that.blDot).css('left', left + 'px');
            $(that.bDot).css('left', middle);
            $(that.uDot).css('left', middle);
        }
    }

    handleUpdateTarget(movX: number, movY: number, deltaLeft: number, deltaTop: number, that: SizingTool) {
        if (movY == that.dots['north']) {
            that.target.setAttribute('height', (that.targetHeight - deltaTop).toString());
            that.target.setAttribute('top', (that.targetTop + deltaTop).toString());
        }
        if (movY == that.dots['south']) {
            that.target.setAttribute('height', (that.targetHeight + deltaTop).toString());
        }
        if (movX == that.dots['east']) {
            that.target.setAttribute('width', (that.targetWidth + deltaLeft).toString());
        }
        if (movX == that.dots['west']) {
            that.target.setAttribute('width', (that.targetWidth - deltaLeft).toString());
            that.target.setAttribute('left', (that.targetLeft + deltaLeft).toString());
        }
    }

    private registerHandlers(initial: MouseEvent, movX: number, movY: number, dot: HTMLElement) {
        this.SEOptions.erase();

        //get initial position of dot
        var initialLeft = parseInt($(dot).css('left'));
        var initialTop = parseInt($(dot).css('top'));

        var that = this;

        function handleMove(final: MouseEvent) {
            that.handleUpdateTarget(movX, movY, final.clientX - initial.clientX, final.clientY - initial.clientY, that);
            that.handleMoveDot(movX, movY, initial, final, initialLeft, initialTop, that, that.ulDot);
        }

        //uphandler
        function handleUp(e: MouseEvent) {
            that.handleUp(handleMove, handleUp, that); //update class members values
        }
        //register events on canvas
        this.canvas.addEventListener('mousemove', handleMove, true);
        this.canvas.addEventListener('mouseup', handleUp, true);

        initial.stopPropagation();
        initial.preventDefault();
    }

    render(target: Tease.Element) {
        this.target = target;
        this.visible = true;

        this.targetLeft = this.askForAttribute('left');
        this.targetTop = this.askForAttribute('top');
        this.targetWidth = this.askForAttribute('width');
        this.targetHeight = this.askForAttribute('height');
        this.targetMirrorX = this.askForAttribute('mirroX');
        this.targetMirrorY = this.askForAttribute('mirroY');



        //set initial positions of the dots
        this.setDotPosition(this.targetLeft, this.targetTop, this.ulDot);
        this.setDotPosition(this.targetLeft + this.targetWidth - this.dotSize, this.targetTop, this.urDot);
        this.setDotPosition(this.targetLeft, this.targetTop + this.targetHeight - this.dotSize, this.blDot);
        this.setDotPosition(this.targetLeft + this.targetWidth - this.dotSize, this.targetTop + this.targetHeight - this.dotSize, this.brDot);
        this.setDotPosition(this.targetLeft, this.targetTop + (this.targetHeight >> 1), this.lDot);
        this.setDotPosition(this.targetLeft + (this.targetWidth >> 1), this.targetTop, this.uDot);
        this.setDotPosition(this.targetLeft + this.targetWidth - this.dotSize, this.targetTop + (this.targetHeight >> 1), this.rDot);
        this.setDotPosition(this.targetLeft + (this.targetWidth >> 1), this.targetTop + this.targetHeight - this.dotSize, this.bDot);

        //adding drag events handlers for each dot
        //upper-left
        this.ulDot.addEventListener('mousedown', (initial: MouseEvent) => {
            this.registerHandlers(initial, this.dots['west'], this.dots['north'], this.ulDot);
        });

        //upper-right
        this.urDot.addEventListener('mousedown', (initial: MouseEvent) => {
            this.registerHandlers(initial, this.dots['east'], this.dots['north'], this.urDot);
        });

        //bottom-left
        this.blDot.addEventListener('mousedown', (initial: MouseEvent) => {
            this.registerHandlers(initial, this.dots['west'], this.dots['south'], this.blDot);
        });

        //bottom-right
        this.brDot.addEventListener('mousedown', (initial: MouseEvent) => {
            this.registerHandlers(initial, this.dots['east'], this.dots['south'], this.brDot);
        });



        //bottom
        this.bDot.addEventListener('mousedown', (initial: MouseEvent) => {
            this.registerHandlers(initial, null, this.dots['south'], this.bDot);
        });


        //upper
        this.uDot.addEventListener('mousedown', (initial: MouseEvent) => {
            this.registerHandlers(initial, null, this.dots['north'], this.uDot);
        });


        //left
        this.lDot.addEventListener('mousedown', (initial: MouseEvent) => {
            this.registerHandlers(initial, this.dots['west'], null, this.lDot);
        });


        //right
        this.rDot.addEventListener('mousedown', (initial: MouseEvent) => {
            this.registerHandlers(initial, this.dots['east'], null, this.rDot);
        });


        //stop propagation of click event on each dot
        function stopPropagation(e: MouseEvent) {
            e.stopPropagation();
        }

        this.ulDot.addEventListener('click', stopPropagation, false);
        this.urDot.addEventListener('click', stopPropagation, false);
        this.blDot.addEventListener('click', stopPropagation, false);
        this.brDot.addEventListener('click', stopPropagation, false);
        this.bDot.addEventListener('click', stopPropagation, false);
        this.lDot.addEventListener('click', stopPropagation, false);
        this.rDot.addEventListener('click', stopPropagation, false);
        this.uDot.addEventListener('click', stopPropagation, false);


        if (this.targetHeight && this.targetWidth) {
            this.canvas.appendChild(this.ulDot);
            this.canvas.appendChild(this.urDot);
            this.canvas.appendChild(this.blDot);
            this.canvas.appendChild(this.brDot);
        }

        if (this.targetHeight != null) {
            this.canvas.appendChild(this.uDot);
            this.canvas.appendChild(this.bDot);
        }
        if (this.targetWidth != null) {
            this.canvas.appendChild(this.lDot);
            this.canvas.appendChild(this.rDot);
        }
    }

    private handleUp(handleMove, handleUp, that) {
        that.canvas.removeEventListener('mousemove', handleMove, true);
        that.canvas.removeEventListener('mouseup', handleUp, true);

        that.SEOptions.render(that.target);

        that.updateProperties(that);
    }

    private updateProperties(that) {
        if (this.targetHeight) {
            that.targetHeight = parseInt(this.target.getAttribute('height'));
        }
        if (this.targetWidth) {
            that.targetWidth = parseInt(this.target.getAttribute('width'));
        }
        that.targetLeft = parseInt(this.target.getAttribute('left'));
        that.targetTop = parseInt(this.target.getAttribute('top'));
    }

    erase() {
        //remove dot elements from canvas
        if (this.visible) {
            if (this.targetHeight) {
                this.canvas.removeChild(this.bDot);
                this.canvas.removeChild(this.uDot);
            }
            if (this.targetWidth) {
                this.canvas.removeChild(this.lDot);
                this.canvas.removeChild(this.rDot);
            }
            if (this.targetHeight && this.targetWidth) {
                this.canvas.removeChild(this.ulDot);
                this.canvas.removeChild(this.urDot);
                this.canvas.removeChild(this.blDot);
                this.canvas.removeChild(this.brDot);
            }
            this.visible = false;

        }
    }
}

