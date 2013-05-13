///<reference path="../../lib/jquery.d.ts" />
///<reference path="../../base/element.ts" />

class RotationTool {
    private image: JQuery;
    private toolsize: number;
    private $canvas: JQuery;
    private element: Tease.Element;
    private visible = false;
    
    constructor() {
        this.$canvas = $('#canvas');
        this.image = $('<img></img>');
        this.image.attr('src', 'res/rotationTool.png');
        this.image.css('position', 'absolute');
        this.image.css('zIndex', '10000000');
        this.toolsize = 30;
    }

    public render(element: Tease.Element) {
        if (this.visible == false) {
            this.element = element;
            this.image.on('mousedown', (e: MouseEvent) => {
                this.handleMouseDown(e);
            });
            this.image.css('top', (parseInt(element.getAttribute('top')) - this.toolsize) + 'px');
            this.image.css('left', element.getAttribute('left') + element.propertyUnits['left']);
            this.image.css('transform', "rotate(" + element.getAttribute('rotation') + "deg)");
            this.image.css('transform-origin', 'left top');
            this.image.appendTo(this.$canvas);
            this.visible = true;
        }
    }
    

    private handleMouseDown(e: MouseEvent) {
        var initialX = parseInt(this.image.css('left'));
        var initialY = parseInt(this.image.css('top'));

        var that = this;

        function updateRotation(final: MouseEvent) {
            var deltaY = (final.clientY - that.$canvas.offset().top) - initialY;
            var deltaX = (final.clientX - that.$canvas.offset().left) - initialX;
            var deg = (Math.atan2(deltaY, deltaX) * 180) / Math.PI;
            that.image.css('transform', 'rotate(' + deg + 'deg)');
            that.element.setAttribute('rotation', deg.toString());
        }

        
        function handleMove(final: MouseEvent) {
            updateRotation(final);
            final.stopPropagation();
            final.preventDefault();
        }

        function handleMouseUp(final:MouseEvent) {
            updateRotation(final);
            that.$canvas.off('mousemove', handleMove);
            $(document).off('mouseup', handleMouseUp);
            that.$canvas.trigger('elementRotated', that.element);
            final.stopPropagation();
            final.preventDefault();
        }
       
        this.$canvas.on('mousemove', handleMove);
        $(document).on('mouseup', handleMouseUp);
        e.preventDefault();
        e.stopPropagation();
    }

    public erase() {
        if (this.visible == true) {
            this.image.remove();
            this.visible = false;
        }
    }
}