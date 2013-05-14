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

    constructor() {
        var dotImg = new Image();
        dotImg.src = 'Tease/src/res/Dot.png';

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
        this.visible = false;
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


    handleMoveDot(that: SizingTool) {
        var x1 = parseInt(that.target.getAttribute('left'));
        var x3 = x1 + parseInt(that.target.getAttribute('width')) - that.dotSize;
        var x2 = (x1 + x3) >> 1;
        var y1 = parseInt(that.target.getAttribute('top'));
        var y3 = y1 + parseInt(that.target.getAttribute('height')) - that.dotSize;
        var y2 = (y1 + y3) >> 1;
        that.setDotPosition(x1, y1, that.ulDot);
        that.setDotPosition(x2, y1, that.uDot);
        that.setDotPosition(x3, y1, that.urDot);
        that.setDotPosition(x1, y2, that.lDot);
        that.setDotPosition(x3, y2, that.rDot);
        that.setDotPosition(x1, y3, that.blDot);
        that.setDotPosition(x2, y3, that.bDot);
        that.setDotPosition(x3, y3, that.brDot);
    }

    handleUpdateTarget(movX: number, movY: number, deltaLeft: number, deltaTop: number, that: SizingTool) {
        var k = that.dotSize << 2; // maximum possible value of height and width

        if (movY == that.dots['north']) {
            deltaTop = Math.min(deltaTop, that.targetHeight - k);
            that.target.setAttribute('height', (that.targetHeight - deltaTop).toString());
            that.target.setAttribute('top', (that.targetTop + deltaTop).toString());
        }
        if (movY == that.dots['south']) {
            deltaTop = Math.max(deltaTop, k - that.targetHeight);
            that.target.setAttribute('height', (that.targetHeight + deltaTop).toString());
        }
        if (movX == that.dots['east']) {
            deltaLeft = Math.max(deltaLeft, k - that.targetWidth);
            that.target.setAttribute('width', (that.targetWidth + deltaLeft).toString());
        }
        if (movX == that.dots['west']) {
            deltaLeft = Math.min(deltaLeft, that.targetWidth - k);
            that.target.setAttribute('width', (that.targetWidth - deltaLeft).toString());
            that.target.setAttribute('left', (that.targetLeft + deltaLeft).toString());
        }
    }

    private registerHandlers(initial: MouseEvent, movX: number, movY: number, dot: HTMLElement) {
        $(this.canvas).trigger('elementResizing', this.target);

        //get initial position of dot
        var initialLeft = parseInt($(dot).css('left'));
        var initialTop = parseInt($(dot).css('top'));

        var that = this;

        function handleMove(final: MouseEvent) {
            that.handleUpdateTarget(movX, movY, final.clientX - initial.clientX, final.clientY - initial.clientY, that);
            that.handleMoveDot(that);
        }

        //uphandler
        function handleUp(e: MouseEvent) {
            that.handleUp(handleMove, handleUp, that); //update class members values
        }
        //register events on canvas
        this.canvas.addEventListener('mousemove', handleMove, true);
        document.addEventListener('mouseup', handleUp, true);

        initial.stopPropagation();
        initial.preventDefault();
    }

    render(target: Tease.Element) {
        if (this.visible == false) {
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
    }

    private handleUp(handleMove, handleUp, that: SizingTool) {
        that.canvas.removeEventListener('mousemove', handleMove, true);
        document.removeEventListener('mouseup', handleUp, true);
        that.updateProperties(that);
        $(this.canvas).trigger('elementResized', this.target);
    }

    private updateProperties(that: SizingTool) {
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

