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

        this.canvas = document.getElementById('canvas');
        this.zindex = 2000000;
    }

    private createDot(src: string) {
        var dot = document.createElement('img');
        //dot.setAttribute('src', src);
        //dot.style.position = 'absolute';
        //$(dot).attr('canvasTool', 'sizingTool');
        return dot;
    }

    toPx(a: number) {
        return a + 'px';
    }

    private askForAttribute(id: string) {
        //var tempAtt = this.target.getAttribute(id);
        //return tempAtt ? parseInt(tempAtt.value) : null;
    }

    render(target: Tease.Element) {
        //this.target = target;
        //this.visible = true;

        //this.targetLeft = this.askForAttribute('left');
        //this.targetTop = this.askForAttribute('top');
        //this.targetWidth = this.askForAttribute('width');
        //this.targetHeight = this.askForAttribute('height');
        //this.targetMirrorX = this.askForAttribute('mirroX');
        //this.targetMirrorY = this.askForAttribute('mirroY');

        ////upper-left
        //this.ulDot.style.left = this.toPx(this.targetLeft);
        //this.ulDot.style.top = this.toPx(this.targetTop);
        //this.ulDot.style.zIndex = this.zindex.toString();


        ////upper-right
        //this.urDot.style.left = this.toPx(this.targetLeft + this.targetWidth - this.dotSize);
        //this.urDot.style.top = this.toPx(this.targetTop);
        //this.urDot.style.zIndex = this.zindex.toString();

        ////bottom-left
        //this.blDot.style.left = this.toPx(this.targetLeft);
        //this.blDot.style.top = this.toPx(this.targetTop + this.targetHeight - this.dotSize);
        //this.blDot.style.zIndex = this.zindex.toString();

        ////bottom-right
        //this.brDot.style.left = this.toPx(this.targetLeft + this.targetWidth - this.dotSize);
        //this.brDot.style.top = this.toPx(this.targetTop + this.targetHeight - this.dotSize);
        //this.brDot.style.zIndex = (this.zindex + 10).toString();

        ////left
        //this.lDot.style.left = this.toPx(this.targetLeft);
        //this.lDot.style.top = this.toPx(this.targetTop + (this.targetHeight >> 1));
        //this.lDot.style.zIndex = (this.zindex + 10).toString();

        ////upper
        //this.uDot.style.left = this.toPx(this.targetLeft + (this.targetWidth >> 1));
        //this.uDot.style.top = this.toPx(this.targetTop);
        //this.uDot.style.zIndex = (this.zindex + 10).toString();

        ////right
        //this.rDot.style.left = this.toPx(this.targetLeft + this.targetWidth - this.dotSize);
        //this.rDot.style.top = this.toPx(this.targetTop + (this.targetHeight >> 1));
        //this.rDot.style.zIndex = (this.zindex + 10).toString();


        ////bottom
        //this.bDot.style.left = this.toPx(this.targetLeft + (this.targetWidth >> 1));
        //this.bDot.style.top = this.toPx(this.targetTop + this.targetHeight - this.dotSize);
        //this.bDot.style.zIndex = (this.zindex + 10).toString();

        ////adding drag events handlers for each dot

        ////upper-left
        //this.ulDot.addEventListener('mousedown', (e: MouseEvent) => {
        //    this.SEOptions.erase();

        //    //initial position of mouse
        //    var initialX = e.clientX;
        //    var initialY = e.clientY;

            

        //    //initial position of dot
        //    var initialDotX = parseInt(window.getComputedStyle(this.ulDot).left);
        //    var initialDotY = parseInt(window.getComputedStyle(this.ulDot).top);

        //    //create new attributes attributes for storing new values
        //    var width = '0';
        //    var height = '0';
        //    var top = '0';
        //    var left = '0';

        //    var that = this;

        //    function handleMove(e: MouseEvent) {
        //        //calculate delta x and y
        //        var deltaX = e.clientX - initialX;
        //        var deltaY = e.clientY - initialY;

        //        //calculate new positon values of dot and target
        //        left = (initialDotX + deltaX).toString();
        //        top = (initialDotY + deltaY).toString();


        //        //update position values of the dot
        //        that.ulDot.style.left = left + 'px';
        //        that.ulDot.style.top = top + 'px';

        //        //update position values of the target
        //        that.target.setAttribute('top', top);
        //        that.target.setAttribute('left', left);

        //        //calculate new width and height values
        //        width = (that.targetWidth - deltaX).toString();
        //        height = (that.targetHeight - deltaY).toString();

        //        //update size values of the target
        //        that.target.setAttribute('width', width);
        //        that.target.setAttribute('height', height);

        //        that.updateHeightWidthDot(null, top, that, that.urDot);
        //        that.updateHeightWidthDot(left, null, that, that.blDot);
        //        that.updateWidthDot(left, parseInt(top) + (parseInt(height) >> 1), that, that.lDot);
        //        that.updateHeightDot(parseInt(left) + (parseInt(width) >> 1), top, that, that.uDot);
        //        that.updateWidthDot(null, parseInt(top) + (parseInt(height) >> 1), that, that.rDot);
        //        that.updateHeightDot(parseInt(left) + (parseInt(width) >> 1), null, that, that.bDot);
        //    }

        //    //uphandler
        //    function handleUp(e: MouseEvent) {
        //        //update class members values
        //        that.handleUp(handleMove, handleUp, that);
        //    }
        //    //register events on canvas
        //    this.canvas.addEventListener('mousemove', handleMove, true);
        //    this.canvas.addEventListener('mouseup', handleUp, true);
        //    //e.preventDefault();
        //    e.stopPropagation();
        //    e.preventDefault();
        //});

        ////upper-right
        //this.urDot.addEventListener('mousedown', (e: MouseEvent) => {
        //    this.SEOptions.erase();
        //    //initial position of mouse
        //    var initialX = e.clientX;
        //    var initialY = e.clientY;

        //    //initial position of dot
        //    var initialDotX = parseInt(window.getComputedStyle(this.urDot).left);
        //    var initialDotY = parseInt(window.getComputedStyle(this.urDot).top);

        //    //create new attributes attributes for storing new values
        //    var width = '0';
        //    var height = '0';
        //    var top= '0';
        //    var left = '0';

        //    var that = this;

        //    function handleMove(e: MouseEvent) {
        //        //calculate delta x and y
        //        var deltaX = e.clientX - initialX;
        //        var deltaY = e.clientY - initialY;

        //        //calculate new positon values of dot and target
        //        left = (initialDotX + deltaX).toString();
        //        top = (initialDotY + deltaY).toString();


        //        //update position values of the dot
        //        that.urDot.style.left = left + 'px';
        //        that.urDot.style.top = top + 'px';

        //        //update position values of the target
        //        that.target.setAttribute('top', top);

        //        //calculate new width and height values
        //        width = (that.targetWidth + deltaX).toString();
        //        height = (that.targetHeight - deltaY).toString();

        //        //update size values of the target
        //        that.target.setAttribute('width', width);
        //        that.target.setAttribute('height', height);

        //        //update position values of the affected dots
        //        that.updateHeightWidthDot(null, top, that, that.ulDot);
        //        that.updateHeightWidthDot(left, null, that, that.brDot);
        //        that.updateHeightDot(that.targetLeft + (parseInt(width) >> 1), top, that, that.uDot);
        //        that.updateWidthDot(left, parseInt(top) + (parseInt(height) >> 1), that, that.rDot);
        //        that.updateHeightDot(that.targetLeft + (parseInt(width) >> 1), null, that, that.bDot);
        //        that.updateWidthDot(null, parseInt(top) + (parseInt(height) >> 1), that, that.lDot);
        //    }

        //    //uphandler
        //    function handleUp(e: MouseEvent) {
        //        //update class members values
        //        that.handleUp(handleMove, handleUp, that);
        //    }
        //    //register events on canvas
        //    this.canvas.addEventListener('mousemove', handleMove, true);
        //    this.canvas.addEventListener('mouseup', handleUp, true);
        //    //e.preventDefault();
        //    e.stopPropagation();
        //    e.preventDefault();
        //});

        ////bottom-left
        //this.blDot.addEventListener('mousedown', (e: MouseEvent) => {
        //    this.SEOptions.erase();
        //    //initial position of mouse
        //    var initialX = e.clientX;
        //    var initialY = e.clientY;

        //    //initial position of dot
        //    var initialDotX = parseInt(window.getComputedStyle(this.blDot).left);
        //    var initialDotY = parseInt(window.getComputedStyle(this.blDot).top);

        //    //create new attributes attributes for storing new values
        //    var width = '0';
        //    var height = '0';
        //    var top = '0';
        //    var left = '0';

        //    var that = this;

        //    function handleMove(e: MouseEvent) {
        //        //calculate delta x and y
        //        var deltaX = e.clientX - initialX;
        //        var deltaY = e.clientY - initialY;

        //        //calculate new positon values of dot and target
        //        left= (initialDotX + deltaX).toString();
        //        top= (initialDotY + deltaY).toString();


        //        //update position values of the dot
        //        that.blDot.style.left = left+ 'px';
        //        that.blDot.style.top = top+ 'px';

        //        //update position values of the target
        //        that.target.setAttribute('left', left);

        //        //calculate new width and height values
        //        width= (that.targetWidth - deltaX).toString();
        //        height= (that.targetHeight + deltaY).toString();

        //        //update size values of the target
        //        that.target.setAttribute('width', width);
        //        that.target.setAttribute('height', height);

        //        //update position values of the affected dots
        //        that.updateHeightWidthDot(null, top, that, that.brDot);
        //        that.updateHeightWidthDot(left, null, that, that.ulDot);
        //        that.updateWidthDot(left, that.targetTop + (parseInt(height) >> 1), that, that.lDot);
        //        that.updateWidthDot(null, that.targetTop + (parseInt(height) >> 1), that, that.rDot);
        //        that.updateHeightDot(parseInt(left) + (parseInt(width) >> 1), top, that, that.bDot);
        //        that.updateHeightDot(parseInt(left) + (parseInt(width) >> 1), null, that, that.uDot);
        //    }

        //    //uphandler
        //    function handleUp(e: MouseEvent) {
        //        //update class members values
        //        that.handleUp(handleMove, handleUp, that);
        //    }
        //    //register events on canvas
        //    this.canvas.addEventListener('mousemove', handleMove, true);
        //    this.canvas.addEventListener('mouseup', handleUp, true);
        //    //e.preventDefault();
        //    e.stopPropagation();
        //    e.preventDefault();
        //});

        ////bottom-right
        //this.brDot.addEventListener('mousedown', (e: MouseEvent) => {
        //    this.SEOptions.erase();
        //    //initial position of mouse
        //    var initialX = e.clientX;
        //    var initialY = e.clientY;

        //    //initial position of dot
        //    var initialDotX = parseInt(window.getComputedStyle(this.brDot).left);
        //    var initialDotY = parseInt(window.getComputedStyle(this.brDot).top);

        //    //create new attributes attributes for storing new values
        //    var width = '0';
        //    var height = '0';
        //    var top = '0';
        //    var left = '0';

        //    var that = this;

        //    function handleMove(e: MouseEvent) {
        //        //calculate delta x and y
        //        var deltaX = e.clientX - initialX;
        //        var deltaY = e.clientY - initialY;

        //        //calculate new positon values of dot and target
        //        left= (initialDotX + deltaX).toString();
        //        top= (initialDotY + deltaY).toString();


        //        //update position values of the dot
        //        that.brDot.style.left = left+ 'px';
        //        that.brDot.style.top = top+ 'px';

        //        //calculate new width and height values
        //        width= (that.targetWidth + deltaX).toString();
        //        height= (that.targetHeight + deltaY).toString();

        //        //update size values of the target
        //        that.target.setAttribute('width', width);
        //        that.target.setAttribute('height', height);

        //        //update position values of the affected dots
        //        that.updateHeightWidthDot(null, top, that, that.blDot);
        //        that.updateHeightWidthDot(left, null, that, that.urDot);
        //        that.updateWidthDot(left, that.targetTop + (parseInt(height) >> 1), that, that.rDot);
        //        that.updateWidthDot(null, that.targetTop + (parseInt(height) >> 1), that, that.lDot);
        //        that.updateHeightDot(that.targetLeft + (parseInt(width) >> 1), top, that, that.bDot);
        //        that.updateHeightDot(that.targetLeft + (parseInt(width) >> 1), null, that, that.uDot);
        //    }

        //    //uphandler
        //    function handleUp(e: MouseEvent) {
        //        //update class members values
        //        that.handleUp(handleMove, handleUp, that);
        //    }
        //    //register events on canvas
        //    this.canvas.addEventListener('mousemove', handleMove, true);
        //    this.canvas.addEventListener('mouseup', handleUp, true);
        //    //e.preventDefault();
        //    e.stopPropagation();
        //    e.preventDefault();
        //});



        ////bottom
        //this.bDot.addEventListener('mousedown', (e: MouseEvent) => {
        //    this.SEOptions.erase();
        //    //initial position of mouse
        //    var initialX = e.clientX;
        //    var initialY = e.clientY;

        //    //initial position of dot
        //    var initialDotX = parseInt(window.getComputedStyle(this.bDot).left);
        //    var initialDotY = parseInt(window.getComputedStyle(this.bDot).top);

        //    //create new attributes attributes for storing new values
        //    var height = '0';
        //    var top = '0';

        //    var that = this;

        //    function handleMove(e: MouseEvent) {
        //        //calculate delta x and y
        //        var deltaX = e.clientX - initialX;
        //        var deltaY = e.clientY - initialY;

        //        //calculate new positon values of dot and target
        //        top= (initialDotY + deltaY).toString();


        //        //update position values of the dot
        //        that.bDot.style.top = top + 'px';

        //        //calculate new width and height values
        //        height = (that.targetHeight + deltaY).toString();

        //        //update size values of the target
        //        that.target.setAttribute('height', height);

        //        //update position values of the affected dots
        //        that.updateHeightWidthDot(null, top, that, that.blDot);
        //        that.updateHeightWidthDot(null, top, that, that.brDot);
        //        that.updateWidthDot(null, that.targetTop + (parseInt(height) >> 1), that, that.lDot);
        //        that.updateWidthDot(null, that.targetTop + (parseInt(height) >> 1), that, that.rDot);
        //    }

        //    //uphandler
        //    function handleUp(e: MouseEvent) {
        //        //update class members values
        //        that.handleUp(handleMove, handleUp, that);
        //    }
        //    //register events on canvas
        //    this.canvas.addEventListener('mousemove', handleMove, true);
        //    this.canvas.addEventListener('mouseup', handleUp, true);
        //    //e.preventDefault();
        //    e.stopPropagation();
        //    e.preventDefault();
        //});


        ////upper
        //this.uDot.addEventListener('mousedown', (e: MouseEvent) => {
        //    this.SEOptions.erase();
        //    //initial position of mouse
        //    var initialX = e.clientX;
        //    var initialY = e.clientY;

        //    //initial position of dot
        //    var initialDotX = parseInt(window.getComputedStyle(this.uDot).left);
        //    var initialDotY = parseInt(window.getComputedStyle(this.uDot).top);

        //    //create new attributes attributes for storing new values
        //    var height = '0';
        //    var top = '0';

        //    var that = this;

        //    function handleMove(e: MouseEvent) {
        //        //calculate delta x and y
        //        var deltaX = e.clientX - initialX;
        //        var deltaY = e.clientY - initialY;

        //        //calculate new positon values of dot and target
        //        top = (initialDotY + deltaY).toString();


        //        //update position values of the dot
        //        that.uDot.style.top = top + 'px';

        //        //update position of target
        //        that.target.setAttribute('top', top);

        //        //calculate new width and height values
        //        height = (that.targetHeight - deltaY).toString();

        //        //update size values of the target
        //        that.target.setAttribute('height', height);

        //        //update position values of the affected dots
        //        that.updateHeightWidthDot(null, top, that, that.ulDot);
        //        that.updateHeightWidthDot(null, top, that, that.urDot);
        //        that.updateWidthDot(null, parseInt(top) + (parseInt(height) >> 1), that, that.lDot);
        //        that.updateWidthDot(null, parseInt(top) + (parseInt(height) >> 1), that, that.rDot);
        //    }

        //    //uphandler
        //    function handleUp(e: MouseEvent) {
        //        //update class members values
        //        that.handleUp(handleMove, handleUp, that);
        //    }
        //    //register events on canvas
        //    this.canvas.addEventListener('mousemove', handleMove, true);
        //    this.canvas.addEventListener('mouseup', handleUp, true);
        //    //e.preventDefault();
        //    e.stopPropagation();
        //    e.preventDefault();
        //});


        ////left
        //this.lDot.addEventListener('mousedown', (e: MouseEvent) => {
        //    this.SEOptions.erase();
        //    //initial position of mouse
        //    var initialX = e.clientX;
        //    var initialY = e.clientY;

        //    //initial position of dot
        //    var initialDotX = parseInt(window.getComputedStyle(this.lDot).left);
        //    var initialDotY = parseInt(window.getComputedStyle(this.lDot).top);

        //    //create new attributes attributes for storing new values
        //    var width = '0';
        //    var left = '0';

        //    var that = this;

        //    function handleMove(e: MouseEvent) {
        //        //calculate delta x and y
        //        var deltaX = e.clientX - initialX;
        //        var deltaY = e.clientY - initialY;

        //        //calculate new positon values of dot and target
        //        left = (initialDotX + deltaX).toString();

        //        //update position values of the dot
        //        that.lDot.style.left = left + 'px';

        //        //update position of target
        //        that.target.setAttribute('left', left);

        //        //calculate new width and height values
        //        width = (that.targetWidth - deltaX).toString();

        //        //update size values of the target
        //        that.target.setAttribute('width', width);

        //        //update position values of the affected dots
        //        that.updateHeightWidthDot(left, null, that, that.ulDot);
        //        that.updateHeightWidthDot(left, null, that, that.blDot);
        //        that.updateHeightDot(parseInt(left) + (parseInt(width) >> 1), null, that, that.uDot);
        //        that.updateHeightDot(parseInt(left) + (parseInt(width) >> 1), null, that, that.bDot);
        //    }

        //    //uphandler
        //    function handleUp(e: MouseEvent) {
        //        //update class members values
        //        that.handleUp(handleMove, handleUp, that);
        //    }
        //    //register events on canvas
        //    this.canvas.addEventListener('mousemove', handleMove, true);
        //    this.canvas.addEventListener('mouseup', handleUp, true);
        //    //e.preventDefault();
        //    e.stopPropagation();
        //    e.preventDefault();
        //});


        ////right
        //this.rDot.addEventListener('mousedown', (e: MouseEvent) => {
        //    this.SEOptions.erase();
        //    //initial position of mouse
        //    var initialX = e.clientX;
        //    var initialY = e.clientY;

        //    //initial position of dot
        //    var initialDotX = parseInt(window.getComputedStyle(this.rDot).left);
        //    var initialDotY = parseInt(window.getComputedStyle(this.rDot).top);

        //    //create new attributes attributes for storing new values
        //    var width = '0';
        //    var left = '0';

        //    var that = this;

        //    function handleMove(e: MouseEvent) {
        //        //calculate delta x and y
        //        var deltaX = e.clientX - initialX;
        //        var deltaY = e.clientY - initialY;

        //        //calculate new positon values of dot and target
        //        left = (initialDotX + deltaX).toString();

        //        //update position values of the dot
        //        that.rDot.style.left = left + 'px';

        //        //calculate new width and height values
        //        width = (that.targetWidth + deltaX).toString();

        //        //update size values of the target
        //        that.target.setAttribute('width', width);

        //        //update position values of the affected dots
        //        that.updateHeightWidthDot(left, null, that, that.brDot);
        //        that.updateHeightWidthDot(left, null, that, that.urDot);
        //        that.updateHeightDot(that.targetLeft + (parseInt(width) >> 1), null, that, that.uDot);
        //        that.updateHeightDot(that.targetLeft + (parseInt(width) >> 1), null, that, that.bDot);
        //    }

        //    //uphandler
        //    function handleUp(e: MouseEvent) {
        //        //update class members values
        //        that.handleUp(handleMove, handleUp, that);
        //    }
        //    //register events on canvas
        //    this.canvas.addEventListener('mousemove', handleMove, true);
        //    this.canvas.addEventListener('mouseup', handleUp, true);
        //    //e.preventDefault();
        //    e.stopPropagation();
        //    e.preventDefault();
        //});


        ////stop propagation of click event on each dot
        //function stopPropagation(e: MouseEvent) {
        //    e.stopPropagation();
        //}

        //this.ulDot.addEventListener('click', stopPropagation, false);
        //this.urDot.addEventListener('click', stopPropagation, false);
        //this.blDot.addEventListener('click', stopPropagation, false);
        //this.brDot.addEventListener('click', stopPropagation, false);
        //this.bDot.addEventListener('click', stopPropagation, false);
        //this.lDot.addEventListener('click', stopPropagation, false);
        //this.rDot.addEventListener('click', stopPropagation, false);
        //this.uDot.addEventListener('click', stopPropagation, false);


        //if (this.targetHeight && this.targetWidth) {
        //    this.canvas.appendChild(this.ulDot);
        //    this.canvas.appendChild(this.urDot);
        //    this.canvas.appendChild(this.blDot);
        //    this.canvas.appendChild(this.brDot);
        //}
        
        //if (this.targetHeight != null) {
        //    this.canvas.appendChild(this.uDot);
        //    this.canvas.appendChild(this.bDot);
        //}
        //if (this.targetWidth != null) {
        //    this.canvas.appendChild(this.lDot);
        //    this.canvas.appendChild(this.rDot);
        //}
    }

    private handleUp(handleMove, handleUp, that) {
        //that.canvas.removeEventListener('mousemove', handleMove, true);
        //that.canvas.removeEventListener('mouseup', handleUp, true);

        //that.SEOptions.render(that.target);

        //that.updateProperties(that);
    }

    private updateProperties(that) {
        //if (this.targetHeight) {
        //    that.targetHeight = parseInt(this.target.getAttribute('height').value);
        //}
        //if (this.targetWidth) {
        //    that.targetWidth = parseInt(this.target.getAttribute('width').value);
        //}
        //that.targetLeft = parseInt(this.target.getAttribute('left').value);
        //that.targetTop = parseInt(this.target.getAttribute('top').value);
    }

    erase() {
        //remove dot elements from canvas
        //if (this.visible) {
        //    if (this.targetHeight) {
        //        this.canvas.removeChild(this.bDot);
        //        this.canvas.removeChild(this.uDot);
        //    }
        //    if (this.targetWidth) {
        //        this.canvas.removeChild(this.lDot);
        //        this.canvas.removeChild(this.rDot);
        //    }
        //    if (this.targetHeight && this.targetWidth) {
        //        this.canvas.removeChild(this.ulDot);
        //        this.canvas.removeChild(this.urDot);
        //        this.canvas.removeChild(this.blDot);
        //        this.canvas.removeChild(this.brDot);
        //    }
        //    this.visible = false;

        //}
    }

    private updateHeightDot(left, top, that: SizingTool, dot: HTMLElement) {
        //if (that.targetHeight) {
        //    if (top) {
        //        dot.style.top = top + 'px';
        //    }
        //    if (left) {
        //        dot.style.left = left + 'px';
        //    }
        //}
    }

    private updateWidthDot(left, top, that: SizingTool, dot: HTMLElement) {
        //if (that.targetWidth) {
        //    if (top) {
        //        dot.style.top = top + 'px';
        //    }
        //    if (left) {
        //        dot.style.left = left + 'px';
        //    }
        //}
    }

    private updateHeightWidthDot(left, top, that: SizingTool, dot: HTMLElement) {
        //if (that.targetHeight && that.targetWidth) {
        //    if (top) {
        //        dot.style.top = top + 'px';
        //    }
        //    if (left) {
        //        dot.style.left = left + 'px';
        //    }
        //}
    }
}

