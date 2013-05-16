///<reference path="../../base/Element.ts" />
///<reference path="../../lib/jquery.d.ts" />
///<reference path="ElementGroup.ts" />

class SelectionTool {
    private $rectangle: JQuery;
    private initialX: number;
    private initialY: number;

    constructor(top: number, left: number, private canvas: JQuery) {
        this.$rectangle = $('<div></div>');
        this.$rectangle.css({
            'left': left,
            'top': top,
            'border': '2px dotted black',
            'position': 'absolute',
            'zIndex' : '100000000'
        });
        canvas.append(this.$rectangle);
        this.initialX = left;
        this.initialY = top;
    }

    public resize(width: number, height: number) {
        this.$rectangle.css({
            'height': height,
            'width': width
        });
    }

    public erase() {
        this.$rectangle.remove();
    }

    public getSelectedElements(currentElements: Object, finalX: number, finalY: number) {
        var selectedGroup = new ElementGroup(null, this.canvas);
        for (var i in currentElements) {
            var element = currentElements[i];
            var eleLeft = parseInt(element.getAttribute('left'));
            var eleTop = parseInt(element.getAttribute('top'));
            var temp = element.getAttribute('width');
            var width = temp == null ? 0 : parseInt(temp);
            temp = element.getAttribute('height');
            var height = temp == null ? 0 : parseInt(temp);

            var found = true;
            
            if (eleLeft + width < this.initialX || eleLeft > finalX ||
                eleTop > finalY || eleTop + height < this.initialY) {
                found = false;
            }
            if (found) {
                selectedGroup.insertElement(element.DOMElement.attr('id'), element);
            }
        }
        return selectedGroup;
    }
}