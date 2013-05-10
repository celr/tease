///<reference path="../../base/Eventable.ts" />
///<reference path="../../base/Layer.ts" />
///<reference path="../../lib/jquery.d.ts" />

class Timeline extends Eventable {
    public selectedLayer: Layer;
    public selectedFrame: Keyframe;

    // DOM Elements for GUI
    private frameListGUI: JQuery;
    private layerListGUI: JQuery;
    private framePropertiesGUI: JQuery;
    private frameContainerGUI: JQuery;
    private selectedLayerGUI: JQuery;
    private frameOptionsGUI: JQuery;
    private selectedFrameGUI: JQuery;
    private workspaceGUI: JQuery;
    private timelineNumbersGUI: JQuery;

    // Indexes
    private selectedLayerIndex: number;
    private selectedFrameIndex: number;
    private nextLayerNum: number;
    private numFrames: number; // Number of frames we are able to draw
    private startPosition: number; // First position shown on timeline

    constructor(private element: JQuery, private environment: Environment, private fps: number) {
        super();

        // Get different containers within the timeline DOM Element
        this.layerListGUI = this.element.find('#timeline-layerlist');
        this.frameListGUI = this.element.find('#timeline-framelist');
        this.framePropertiesGUI = this.element.find('#frame-properties');
        this.frameContainerGUI = this.frameListGUI.find('#timeline-frames');
        this.frameOptionsGUI = this.element.find('#frame-options');
        this.workspaceGUI = this.element.find('#timeline-workspace');
        this.timelineNumbersGUI = this.frameListGUI.find('#timeline-numbers');
        this.nextLayerNum = this.environment.layers.length + 1;
        this.numFrames = Math.floor(this.frameContainerGUI.innerWidth() / 16);
        this.startPosition = 1;

        // Add event listeners for adding / removing layers
        this.element.find('#newlayer-btn').click((e: Event) => {
            this.addNewLayer();
        });
        
        this.element.find('#trashlayer-btn').click((e: Event) => {
            this.trashCurrentLayer();
        });

        // Add event listener for play button
        this.element.find('#play-button').click((e: Event) => {
            this.fireEvent('playbuttonclick', e);
        });

        this.element.find('#stop-button').hide();

        this.element.find('#stop-button').click((e: Event) => {
            this.fireEvent('stopbuttonclick', e);
        });

        // Add event listener for timeline navigation
        this.element.find('#timelinenav-leftbutton').click((e: Event) => {
            this.moveTimelineToLeft();
        });

        this.element.find('#timelinenav-rightbutton').click((e: Event) => {
            this.moveTimelineToRight();
        });

        this.drawTimeline();

        // Select first frame
        this.selectFirstFrame();
    }

    public selectFirstFrame() {
        this.selectFrame(this.frameContainerGUI.find('div .timeline-frame').first());
    }

    public showWorkspace() {
        this.workspaceGUI.show(300);
    }

    public hideWorkspace() {
        this.workspaceGUI.hide(300);
    }

    public selectCurrentPositionInLayer(layerIndex: number) {
        this.selectLayerByIndex(layerIndex);
        this.highlightFrameByPosition(this.selectedFrameIndex + this.startPosition);
    }

    private selectLayerByIndex(layerIndex: number) {
        this.selectLayer($(this.layerListGUI.children()[layerIndex]));
    }

    private getPadding(num: number) {
        var res = num.toString();
        if (num < 10) {
            res = '0' + res;
        }
        return res;
    }

    private moveTimelineToLeft() {
        if (this.startPosition > 1) {
            this.startPosition -= this.numFrames;
            this.clearTimelineNumbers();
            this.redrawTimeline(); // Update timeline GUI
            this.selectFrameByPosition(this.startPosition);
        }
    }

    private moveTimelineToRight() {
        this.startPosition += this.numFrames;
        this.clearTimelineNumbers();
        this.redrawTimeline(); // Update timeline GUI
        this.selectFrameByPosition(this.startPosition);
    }

    private clearTimelineNumbers() {
        this.timelineNumbersGUI.empty();
    }
    
    private drawTimelineRulerNumbers() {
        var e = this.timelineNumbersGUI;
        var currMin = 0;
        var currSec = 0;

        var totalSec = Math.floor(this.startPosition / this.fps);
        currMin = Math.floor(totalSec / 60);
        currSec = totalSec % 60;

        for (var i = 0; i < this.numFrames; i += this.fps) {
            
            if (i != 0 && i % this.fps == 0) {
                currSec++;
            }

            if ((i + 1) % (60 * this.fps) == 0) {
                currMin++;
            }

            $('<span class="timeline-number">' + this.getPadding(currMin) + ':' + this.getPadding(currSec) + '</span>').appendTo(e);
        }
    }

    private drawTimeline() {
        // Create timeline ruler
        this.drawTimelineRulerNumbers();

        for (var i in this.environment.layers) {
            var layer = this.drawLayer(this.environment.layers[i]);

            // Select first layer by default
            if (i == String(0)) {
                this.selectLayer(layer);
            }
        }
    }

    private redrawTimeline() {
        // Create timeline ruler
        this.drawTimelineRulerNumbers();

        for (var i = 0; i < this.environment.layers.length; i++) {
            this.redrawLayerFrames(this.environment.layers[i], i);
        }

        this.selectLayerByIndex(this.selectedLayerIndex);
    }

    private unselectLayer(layer: JQuery) {
        layer.removeClass('layer-selected');
    }

    private selectLayer(layer: JQuery) {
        if (this.selectedLayerGUI) {
            this.unselectLayer(this.selectedLayerGUI);
        }
        layer.addClass('layer-selected');
        this.selectedLayerGUI = layer;
        this.selectedLayerIndex = layer.index();
        this.selectedLayer = this.environment.layers[this.selectedLayerIndex];
        this.fireEvent('layerselect', this.selectedLayerIndex);
    }

    private drawLayer(layer: Layer) {
        // Insert layer into list
        var layerGUI = $('<div class="timeline-layer"><div class="timeline-layer-decor"></div><div class="timeline-layer-text">' + layer.title + '</div></div>').appendTo(this.layerListGUI);
        layerGUI.click((e: Event) => {
            var clickTarget = $(e.target);
            while (!clickTarget.hasClass('timeline-layer')) {
                clickTarget = clickTarget.parent();
            }
            this.selectLayer(clickTarget);
            this.selectFrame($(this.frameListGUI.find('#timeline-frames').children()[layerGUI.index()]).find('.timeline-frame').first()); // TODO: Break this down
        });

        // Insert new timeline frames for this layer
        this.drawLayerFrames(layer);
        return layerGUI;
    }

    private showOptionsForFrame(frame: JQuery) {
        this.frameOptionsGUI.show(600);
    }

    private unselectFrame(frame: JQuery) {
        frame.removeClass('timeline-frame-selected');
    }

    private selectFrameByPosition(position: number) {
        var frameIndex = position - this.startPosition;
        var frame = $($(this.frameListGUI.find('#timeline-frames').children()[this.selectedLayerIndex]).find('.timeline-frame')[frameIndex]);
        this.selectFrame(frame);
    }

    private highlightFrameByPosition(position: number) {
        var frameIndex = position - this.startPosition;
        var frame = $($(this.frameListGUI.find('#timeline-frames').children()[this.selectedLayerIndex]).find('.timeline-frame')[frameIndex]);
        this.highlightFrame(frame); // TODO: Break this down
    }

    private highlightFrame(frame: JQuery) {
        if (this.selectedFrameGUI) {
            this.unselectFrame(this.selectedFrameGUI);
        }
        frame.addClass('timeline-frame-selected');
        this.selectedFrameGUI = frame;
        this.selectedFrameIndex = frame.index();
        this.selectedFrame = this.selectedLayer.findKeyframeForPosition(this.selectedFrameIndex + this.startPosition);
    }

    private selectFrame(frame: JQuery) {
        this.highlightFrame(frame);
        this.fireEvent('frameselect', this.selectedFrameIndex + this.startPosition);
    }

    private insertKeyframe() {
        this.selectedFrameGUI.addClass('timeline-frame-keyframe');

        var keyframe = new Keyframe(this.selectedFrameIndex + this.startPosition);
        this.environment.layers[this.selectedLayerIndex].insertKeyframe(keyframe);
        this.selectFrame(this.selectedFrameGUI); // Reselect frame to update dependencies (ie. Canvas)
    }

    private handleTimelineFrameClick(e: Event) {
        var layerIndex = $(e.target).parent().parent().index();
        if (layerIndex != this.selectedLayerIndex) {
            this.selectLayerByIndex(layerIndex);
        }
        this.selectFrame($(e.target).parent());
    }

    private addTransitionStyle(firstPosition: number, lastPosition: number) {
        var firstIndex = firstPosition - this.startPosition;
        var lastIndex = lastPosition - this.startPosition;

        var layerFrames = this.frameContainerGUI.children();
        var frames = $(layerFrames[this.selectedLayerIndex]).children();

        for (var currPos = firstIndex; currPos < lastIndex; currPos++) {
            $(frames[currPos]).addClass('timeline-frame-transition');
        }

        $(frames[lastIndex - 1]).addClass('timeline-frame-transition-arrow');
    }

    private removeTransitionStyle(firstPosition: number, lastPosition: number) {
        var firstIndex = firstPosition - this.startPosition;
        var lastIndex = lastPosition - this.startPosition;

        var layerFrames = this.frameContainerGUI.children();
        var frames = $(layerFrames[this.selectedLayerIndex]).children();

        for (var currPos = firstIndex; currPos < lastIndex; currPos++) {
            $(frames[currPos]).removeClass('timeline-frame-transition');
        }

        $(frames[lastIndex - 1]).removeClass('timeline-frame-transition-arrow');
    }

    private animateToFrame(e: Event) {
        var previousKeyframe = this.selectedFrame;
        this.insertKeyframe();

        this.selectedFrame.createTransitionsForElements(previousKeyframe.elements);

        this.selectFrame(this.selectedFrameGUI);
        this.addTransitionStyle(previousKeyframe.position, this.selectedFrame.position);
        this.selectedFrameGUI.find('.animar-frame').hide();
        this.selectedFrameGUI.find('.remove-animation').show();
    }

    private removeKeyframe() {
        var layer = this.environment.layers[this.selectedLayerIndex];
        this.selectedFrameGUI.removeClass('timeline-frame-keyframe');
        var keyframeIndex = layer.removeKeyframe(this.selectedFrameIndex + this.startPosition);

        if (keyframeIndex > 0) {
            var previousKeyframe = layer.keyframes[keyframeIndex - 1];
            previousKeyframe.removeFutureTransitions();

            var layerFrames = this.frameContainerGUI.children();
            var frames = $(layerFrames[this.selectedLayerIndex]).children();
            this.selectFrame($(frames[previousKeyframe.position - 1]));
        }
    }

    private removeAnimation(e: Event) {
        var previousKeyframe = this.selectedFrame;
        this.removeKeyframe();
        this.removeTransitionStyle(this.selectedFrame.position, previousKeyframe.position);
    }

    private redrawLayerFrames(layer: Layer, layerIndex: number) {
        var isTransition = false;

        var frames = $(this.frameListGUI.find('#timeline-frames').children()[layerIndex]).children();

        // Intialize k to first keyframe index beginning at this.startPosition
        var k;
        for (k = 0; k < layer.keyframes.length && layer.keyframes[k].position < this.startPosition; k++);

        // Check if there's an ongoing transition
        isTransition = layer.findKeyframeForPosition(this.startPosition).hasTransition();
        for (var i = this.startPosition - 1, p = 0; i < this.numFrames + this.startPosition; i++, p++) {
            var timelineFrame = $(frames[p]);

            // Check if current frame is keyframe
            if (k < layer.keyframes.length && layer.keyframes[k].position == i + 1) {
                timelineFrame.addClass('timeline-frame-keyframe');

                // Check if keyframe has transitions
                if (layer.keyframes[k].hasTransition()) {
                    isTransition = true;
                }

                k++;
            } else {
                timelineFrame.removeClass('timeline-frame-keyframe');
            }

            if (isTransition) {
                // Check if next frame is keyframe
                if (layer.keyframes[k].position == i + 2) {
                    timelineFrame.removeClass('timeline-frame-transition');
                    timelineFrame.addClass('timeline-frame-transition-arrow');
                    isTransition = false;
                } else {
                    timelineFrame.addClass('timeline-frame-transition');
                    timelineFrame.removeClass('timeline-frame-transition-arrow');
                }
            } else {
                timelineFrame.removeClass('timeline-frame-transition-arrow');
                timelineFrame.removeClass('timeline-frame-transition');
            }
        }
    }

    private drawLayerFrames(layer: Layer) {
        var layerFramesDiv = $('<div></div>');
        var isTransition = false;

        // Intialize k to first keyframe index beginning at this.startPosition
        var k;
        for (k = 0; k < layer.keyframes.length && layer.keyframes[k].position < this.startPosition; k++);

        // Check if there's an ongoing transition
        isTransition = layer.findKeyframeForPosition(this.startPosition).hasTransition();

        for (var i = this.startPosition - 1; i < this.numFrames + this.startPosition; i++){ 
            var timelineFrame = $('<div class="timeline-frames-container dropup timeline-frame"><a class="timeline-frame-link" data-toggle="dropdown" href="#"></a><ul class="dropdown-menu frame-options" role="menu">\
                                <li><a tabindex="-1" href="#" class ="insert-keyframe">Insertar keyframe</a></li>\
                                <li><a tabindex="-1" href="#" class ="empty-frame">Vaciar frame</a></li>\
                                <li><a tabindex="-1" href="#" class ="animar-frame">Animar</a></li>\
                                <li><a tabindex="-1" href="#" class ="remove-animation">Eliminar animación</a></li>\
                                <li class ="divider"></li>\
                                <li><a tabindex="-1" href="#" class ="delete-frame">Eliminar frame</a></li>\
                        </ul>\
                        </div>').appendTo(layerFramesDiv);

            if (layer.index == 0) {
                timelineFrame.addClass('timeline-frame-top');
            }

            // Check if current frame is keyframe
            if (k < layer.keyframes.length && layer.keyframes[k].position == i + 1) {
                timelineFrame.addClass('timeline-frame-keyframe');
                
                // Check if keyframe has transitions
                if (layer.keyframes[k].hasTransition()) {
                    isTransition = true;
                }

                k++;
            }

            if (isTransition) {
                // Check if next frame is keyframe
                if (layer.keyframes[k].position == i + 2) {
                    timelineFrame.addClass('timeline-frame-transition-arrow');
                    isTransition = false;
                } else {
                    timelineFrame.addClass('timeline-frame-transition');
                }
            }

            timelineFrame.find('.remove-animation').hide();

            timelineFrame.find('.insert-keyframe').click((e: Event) => {
                this.insertKeyframe();
            });

            timelineFrame.find('.empty-frame').click((e: Event) => {
                //this.emptyFrame();
            });

            timelineFrame.find('.delete-frame').click((e: Event) => {
                //this.deleteFrame();
            });

            timelineFrame.find('.animar-frame').click((e: Event) => {
                this.animateToFrame(e);
            });

            timelineFrame.find('.remove-animation').click((e: Event) => {
                this.removeAnimation(e);
            });

            // Click event for individual frame on the Timeline
            timelineFrame.find('.timeline-frame-link').click((e: Event) => {
                this.handleTimelineFrameClick(e);
            });
        }

        this.frameContainerGUI.append(layerFramesDiv);
    }

    private removeLayerWithIndex(i: number) {
        $(this.layerListGUI.children()[i]).remove();
        $(this.frameContainerGUI.children()[i]).remove();
    }

    private trashCurrentLayer() {
        var numLayers = this.layerListGUI.children().length;
        if (numLayers > 1) { // Never remove last element
            var layerIndex = this.selectedLayerGUI.index();
            this.unselectLayer(this.selectedLayerGUI);
            this.removeLayerWithIndex(layerIndex);

            if (layerIndex < numLayers - 1) {
                this.selectLayer($(this.layerListGUI.children()[layerIndex]));
            } else { // Removed last layer
                this.selectLayer($(this.layerListGUI.children()[layerIndex - 1]));
            }

            this.environment.layers.splice(layerIndex - 1, 1);
        }
    }

    private addNewLayer() {
        var layer = new Layer('Layer ' + this.nextLayerNum++, true, true, this.environment.layers.length);
        this.drawLayer(layer);
        this.environment.layers.push(layer);
        this.fireEvent('layercreate', null);
    }
}