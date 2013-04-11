//SizingTool
//This class encapulates the behavior of the GUI to change the size of elements in the canvas
//owner: jair
class SizingTool {
    private ulDot: HTMLElement; //upper-left dot
    private urDot: HTMLElement; //upper-right dot
    private blDot: HTMLElement; //bottom-left dot
    private brDot: HTMLElement; //bottom-right dot
    private target: HTMLElement; //element that will be edited
    private canvas: HTMLElement;
    private targetX: number;
    private targetY: number;
    private targetWidth: number;
    private targetHeight: number;
    private zindex: number;

    private dotSize: number;

    constructor() {
        var dotImg = new Image();
        dotImg.src = 'res/Dot.png';

        this.dotSize = dotImg.width;

        this.ulDot = document.createElement('img');
        this.ulDot.setAttribute('src', dotImg.src);
        this.ulDot.style.position = 'relative';

        this.urDot = document.createElement('img');
        this.urDot.setAttribute('src', dotImg.src);
        this.urDot.style.position = 'relative';

        this.blDot = document.createElement('img');
        this.blDot.setAttribute('src', dotImg.src);
        this.blDot.style.position = 'relative';

        this.brDot = document.createElement('img');
        this.brDot.setAttribute('src', dotImg.src);
        this.brDot.style.position = 'relative';

        this.canvas = document.getElementById('canvas');
        this.zindex = 1000000;
    }

    toPx(a: number) {
        return a + 'px';
    }

    render(target: HTMLElement) {
        this.target = target;

        var styles = <CSSStyleDeclaration> window.getComputedStyle(target);
        this.targetX = parseInt(styles.left);
        this.targetY = parseInt(styles.top);
        this.targetWidth = parseInt(styles.width);
        this.targetHeight = parseInt(styles.height);

        //upper-left
        this.ulDot.style.left = this.toPx(this.targetX);
        this.ulDot.style.top = this.toPx(this.targetY);
        this.ulDot.style.position = 'absolute';
        this.ulDot.style.zIndex = this.zindex.toString();
        
        //upper-right
        this.urDot.style.left = this.toPx(this.targetX + this.targetWidth - this.dotSize);
        this.urDot.style.top = this.toPx(this.targetY);
        this.urDot.style.position = 'absolute';
        this.urDot.style.zIndex = this.zindex.toString();

        //bottom-left
        this.blDot.style.left = this.toPx(this.targetX);
        this.blDot.style.top = this.toPx(this.targetY + this.targetHeight - this.dotSize);
        this.blDot.style.position = 'absolute';
        this.blDot.style.zIndex = this.zindex.toString();
        
        //bottom-right
        this.brDot.style.left = this.toPx(this.targetX + this.targetWidth - this.dotSize);
        this.brDot.style.top = this.toPx(this.targetY + this.targetHeight - this.dotSize);
        this.brDot.style.position = 'absolute';
        this.brDot.style.zIndex = (this.zindex+10).toString();


        //append images to canvas
        this.canvas.appendChild(this.ulDot);

        
        //dragging events handlers for each dot
        
        //upper-left
        this.ulDot.addEventListener('mousedown', (e: MouseEvent) => {
            var that = this;
            
            //get initial left and top values of the dot
            var initialX = parseInt(window.getComputedStyle(this.ulDot).left);
            var initialY = parseInt(window.getComputedStyle(this.ulDot).top);

            //move handler
            function handleMove(e: MouseEvent) {
                var top = <string> that.toPx(e.clientY - that.canvas.offsetTop - (that.dotSize>>1)); //new top position
                var left = <string> that.toPx(e.clientX - that.canvas.offsetLeft - (that.dotSize>>1)); //new left position
                //update dot position
                that.ulDot.style.top = top;
                that.ulDot.style.left =  left

                //update target position
                that.target.style.top = top;
                that.target.style.left = left;

                //update position of affected dots 
                that.urDot.style.top = top;
                that.blDot.style.left = left;

                //calculate new width and height of target
                var deltaX = initialX - parseInt(left);
                var deltaY = initialY - parseInt(top);

                
                that.target.style.width = that.toPx(that.targetWidth + deltaX);
                that.target.style.height = that.toPx(that.targetHeight + deltaY);
            }
            //uphandler
            function handleUp(e: MouseEvent) {
                //update class members values
                that.targetHeight = parseInt(window.getComputedStyle(that.target).height);
                that.targetWidth = parseInt(window.getComputedStyle(that.target).width);

                that.canvas.removeEventListener('mousemove', handleMove, true);
                that.canvas.removeEventListener('mouseup', handleUp, true);
            }
            //register events on canvas
            this.canvas.addEventListener('mousemove', handleMove, true);
            this.canvas.addEventListener('mouseup', handleUp, true);
            //e.preventDefault();
            e.stopPropagation();
            e.preventDefault();
        });


        //upper-right
        this.urDot.addEventListener('mousedown', (e: MouseEvent) => {
            var that = this;

            //get initial left and top values of the dot
            var initialX = parseInt(window.getComputedStyle(this.urDot).left);
            var initialY = parseInt(window.getComputedStyle(this.urDot).top);
            //move handler
            function handleMove(e: MouseEvent) {
                var top = <string> that.toPx(e.clientY - that.canvas.offsetTop - (that.dotSize >> 1)); //new top position
                var left = <string> that.toPx(e.clientX - that.canvas.offsetLeft - (that.dotSize >> 1)); //new left position
                //update dot position
                that.urDot.style.top = top;
                that.urDot.style.left = left

                //update target position
                that.target.style.top = top;

                //update position of affected dots 
                that.ulDot.style.top = top;
                that.brDot.style.left = left;

                //calculate new width and height of target
                var deltaX = parseInt(left) - initialX;
                var deltaY = initialY - parseInt(top);

                that.target.style.width = that.toPx(that.targetWidth + deltaX);
                that.target.style.height = that.toPx(that.targetHeight + deltaY);
            }
            //uphandler
            function handleUp(e: MouseEvent) {
                //update class members values
                that.targetHeight = parseInt(window.getComputedStyle(that.target).height);
                that.targetWidth = parseInt(window.getComputedStyle(that.target).width);

                that.canvas.removeEventListener('mousemove', handleMove, true);
                that.canvas.removeEventListener('mouseup', handleUp, true);
            }
            //register events on canvas
            this.canvas.addEventListener('mousemove', handleMove, true);
            this.canvas.addEventListener('mouseup', handleUp, true);
            //e.preventDefault();
            e.stopPropagation();
            e.preventDefault();
        });

        //bottom-left
        this.blDot.addEventListener('mousedown', (e: MouseEvent) => {
            var that = this;

            //get initial left and top values of the dot
            var initialX = parseInt(window.getComputedStyle(this.blDot).left);
            var initialY = parseInt(window.getComputedStyle(this.blDot).top);
            //move handler
            function handleMove(e: MouseEvent) {
                var top = <string> that.toPx(e.clientY - that.canvas.offsetTop - (that.dotSize >> 1)); //new top position
                var left = <string> that.toPx(e.clientX - that.canvas.offsetLeft - (that.dotSize >> 1)); //new left position
                //update dot position
                that.blDot.style.top = top;
                that.blDot.style.left = left

                //update target position
                that.target.style.left = left;

                //update position of affected dots 
                that.ulDot.style.left = left;
                that.brDot.style.top = top;

                //calculate new width and height of target
                var deltaX = initialX - parseInt(left);
                var deltaY = parseInt(top) - initialY;

                that.target.style.width = that.toPx(that.targetWidth + deltaX);
                that.target.style.height = that.toPx(that.targetHeight + deltaY);
            }
            //uphandler
            function handleUp(e: MouseEvent) {
                //update class members values
                that.targetHeight = parseInt(window.getComputedStyle(that.target).height);
                that.targetWidth = parseInt(window.getComputedStyle(that.target).width);

                that.canvas.removeEventListener('mousemove', handleMove, true);
                that.canvas.removeEventListener('mouseup', handleUp, true);
            }
            //register events on canvas
            this.canvas.addEventListener('mousemove', handleMove, true);
            this.canvas.addEventListener('mouseup', handleUp, true);
            //e.preventDefault();
            e.stopPropagation();
            e.preventDefault();
        });

        //bottom-right
        this.brDot.addEventListener('mousedown', (e: MouseEvent) => {
            var that = this;

            //get initial left and top values of the dot
            var initialX = parseInt(window.getComputedStyle(this.brDot).left);
            var initialY = parseInt(window.getComputedStyle(this.brDot).top);
            //move handler
            function handleMove(e: MouseEvent) {
                var top = <string> that.toPx(e.clientY - that.canvas.offsetTop - (that.dotSize >> 1)); //new top position
                var left = <string> that.toPx(e.clientX - that.canvas.offsetLeft - (that.dotSize >> 1)); //new left position
                
                //update dot position
                that.brDot.style.top = top;
                that.brDot.style.left = left

                //update position of affected dots 
                that.urDot.style.left = left;
                that.blDot.style.top = top;

                //calculate new width and height of target
                var deltaX = parseInt(left) - initialX;
                var deltaY = parseInt(top) - initialY;

                that.target.style.width = that.toPx(that.targetWidth + deltaX);
                that.target.style.height = that.toPx(that.targetHeight + deltaY);
            }
            //uphandler
            function handleUp(e: MouseEvent) {
                //update class members values
                that.targetHeight = parseInt(window.getComputedStyle(that.target).height);
                that.targetWidth = parseInt(window.getComputedStyle(that.target).width);

                that.canvas.removeEventListener('mousemove', handleMove, true);
                that.canvas.removeEventListener('mouseup', handleUp, true);
            }
            //register events on canvas
            this.canvas.addEventListener('mousemove', handleMove, true);
            this.canvas.addEventListener('mouseup', handleUp, true);
            //e.preventDefault();
            e.stopPropagation();
            e.preventDefault();
        });


        //stop propagation of click event on each dot
        this.ulDot.addEventListener('click', function (e: MouseEvent) {
            e.stopPropagation();
        }, false);

        this.urDot.addEventListener('click', function (e: MouseEvent) {
            e.stopPropagation();
        }, false);

        this.blDot.addEventListener('click', function (e: MouseEvent) {
            e.stopPropagation();
        }, false);

        this.brDot.addEventListener('click', function (e: MouseEvent) {
            e.stopPropagation();
        }, false);



        //append dot elements to the canvas
        this.canvas.appendChild(this.urDot);
        this.canvas.appendChild(this.blDot);
        this.canvas.appendChild(this.brDot);
    }

    erase() {
        //remove dot elements from canvas
        this.canvas.removeChild(this.ulDot);
        this.canvas.removeChild(this.urDot);
        this.canvas.removeChild(this.blDot);
        this.canvas.removeChild(this.brDot);
    }

}