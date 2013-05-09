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

    // Indexes
    private selectedLayerIndex: number;
    private selectedFrameIndex: number;

    constructor(private element: JQuery, private environment: any, private timelineSettings: any) {
        super();

        // Get different containers within the timeline DOM Element
        this.layerListGUI = this.element.find('#timeline-layerlist');
        this.frameListGUI = this.element.find('#timeline-framelist');
        this.framePropertiesGUI = this.element.find('#frame-properties');
        this.frameContainerGUI = this.frameListGUI.find('#timeline-frames');
        this.frameOptionsGUI = this.element.find('#frame-options');

        // Set general information
        this.framePropertiesGUI.find('#framerate-value').text(timelineSettings.framerate);
        this.framePropertiesGUI.find('#totaltime-value').text(timelineSettings.defaultLength);

        // Add event listeners for adding / removing layers
        this.element.find('#newlayer-btn').click((e: Event) => {
            this.addNewLayer();
        });

        this.element.find('#trashlayer-btn').click((e: Event) => {
            this.trashLayer();
        });

        // Add event listener for play button
        this.element.find('#play-button').click((e: Event) => {
            this.fireEvent('playbuttonclick', e);
        });

        this.drawTimeline();

        // Select first frame
        this.selectFrame(this.frameContainerGUI.find('div .timeline-frame').first());
    }

    public selectCurrentPositionInLayer(layerIndex: number) {
        this.selectLayerByIndex(layerIndex);
        this.highlightFrameByPosition(this.selectedFrameIndex + 1);
    }

    private selectLayerByIndex(layerIndex: number) {
        this.selectLayer($(this.layerListGUI.children()[layerIndex]));
    }
    
    private drawTimelineRulerNumbers(e: JQuery) {
        // TODO: fix number margin according to number of digits.

        var limit = this.frameContainerGUI.innerWidth() / 16;
        for (var i = 0; i <= limit; i += 5) {
            var num;

            if (i == 0) {
                num = 1;
            } else {
                num = i;
            }

            $('<span class="timeline-number">' + num + '</span>').appendTo(e);
        }
    }

    private drawTimeline() {
        // Create timeline ruler
        var timelineNumbers = this.frameListGUI.find('#timeline-numbers');
        this.drawTimelineRulerNumbers(timelineNumbers);

        for (var i in this.environment.layers) {
            var layer = this.drawLayer(this.environment.layers[i]);

            // Select first layer by default
            if (i == String(0)) {
                this.selectLayer(layer);
            }
        }
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

    private highlightFrameByPosition(position: number) {
        var frame = $($(this.frameListGUI.find('#timeline-frames').children()[this.selectedLayerIndex]).find('.timeline-frame')[position - 1]);
        this.highlightFrame(frame); // TODO: Break this down
    }

    private highlightFrame(frame: JQuery) {
        if (this.selectedFrameGUI) {
            this.unselectFrame(this.selectedFrameGUI);
        }
        frame.addClass('timeline-frame-selected');
        this.selectedFrameGUI = frame;
        this.selectedFrameIndex = frame.index();
        this.selectedFrame = this.selectedLayer.findKeyframeForPosition(this.selectedFrameIndex + 1);
    }

    private selectFrame(frame: JQuery) {
        this.highlightFrame(frame);
        this.fireEvent('frameselect', this.selectedFrameIndex + 1);
    }

    private insertKeyframe() {
        this.selectedFrameGUI.addClass('timeline-frame-keyframe');

        var keyframe = new Keyframe(this.selectedFrameIndex + 1);
        this.environment.layers[this.selectedLayerIndex].insertKeyframe(keyframe);
        this.selectFrame(this.selectedFrameGUI); // Reselect frame to update dependencies (ie. Canvas)
    }

    private deleteFrame() {
    }

    private emptyFrame() {
    }

    private handleTimelineFrameClick(e: Event) {
        var layerIndex = $(e.target).parent().parent().index();
        if (layerIndex != this.selectedLayerIndex) {
            this.selectLayerByIndex(layerIndex);
        }
        this.selectFrame($(e.target).parent());
    }

    private addTransitionStyle(firstPosition: number, lastPosition: number) {
        var layerFrames = this.frameContainerGUI.children();
        var frames = $(layerFrames[this.selectedLayerIndex]).children();

        for (var currPos = firstPosition; currPos < lastPosition; currPos++) {
            $(frames[currPos - 1]).addClass('timeline-frame-transition');
        }

        $(frames[lastPosition - 2]).addClass('timeline-frame-transition-arrow');
    }

    private removeTransitionStyle(firstPosition: number, lastPosition: number) {
        var layerFrames = this.frameContainerGUI.children();
        var frames = $(layerFrames[this.selectedLayerIndex]).children();

        for (var currPos = firstPosition; currPos < lastPosition; currPos++) {
            $(frames[currPos - 1]).removeClass('timeline-frame-transition');
        }

        $(frames[lastPosition - 2]).removeClass('timeline-frame-transition-arrow');
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
        var keyframeIndex = layer.removeKeyframe(this.selectedFrameIndex + 1);

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

    private drawLayerFrames(layer: Layer) {
        // TODO: Add support for initializing frames

        // Determine limit according to resolution
        var limit = this.frameContainerGUI.innerWidth() / 16;
        var layerFramesDiv = $('<div></div>');

        for (var i = 0, k = 0; i < limit; i++) {
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
                k++;
            }

            timelineFrame.find('.remove-animation').hide();

            timelineFrame.find('.insert-keyframe').click((e: Event) => {
                this.insertKeyframe();
            });

            timelineFrame.find('.empty-frame').click((e: Event) => {
                this.emptyFrame();
            });

            timelineFrame.find('.delete-frame').click((e: Event) => {
                this.deleteFrame();
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
        this.layerListGUI.find(':nth-child(' + (i + 1) + ')').remove();
        this.frameContainerGUI.find(':nth-child(' + (i + 1) + ')').remove();
    }

    private addNewLayer() {
        var layer = new Layer('Layer ' + (this.environment.layers.length + 1), true, true, this.environment.layers.length);
        this.drawLayer(layer);
        this.environment.layers.push(layer);
        this.fireEvent('layercreate', null);
    }

    private trashLayer() {
        var numLayers = this.layerListGUI.children().length;
        if (numLayers > 1) { // Never remove last element
            var layerIndex = this.selectedLayerGUI.index();
            this.unselectLayer(this.selectedLayerGUI);
            this.removeLayerWithIndex(layerIndex);
            if (layerIndex < numLayers - 1) {
                this.selectLayer(this.layerListGUI.find(':nth-child(' + (layerIndex + 1) + ')'));
            } else {
                this.selectLayer(this.layerListGUI.find(':nth-child(' + layerIndex + ')'));
            }

            this.environment.layers.splice(layerIndex - 1, 1);
        }
    }
}