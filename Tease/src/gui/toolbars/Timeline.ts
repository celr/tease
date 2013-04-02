///<reference path="../../base/Eventable.ts" />
///<reference path="../../base/Layer.ts" />
///<reference path="../../lib/jquery.d.ts" />

class Timeline extends Eventable {
    public selectedLayer: Layer;
    public selectedKeyframe: Keyframe;

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
        var layerGUI = $('<div class="timeline-item">' + layer.title + '</div>').appendTo(this.layerListGUI);
        layerGUI.click((e: Event) => {
            this.selectLayer($(e.target));
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

    private selectFrame(frame: JQuery) {
        if (this.selectedFrameGUI) {
            this.unselectFrame(this.selectedFrameGUI);
        }
        frame.addClass('timeline-frame-selected');
        this.selectedFrameGUI = frame;
        this.selectedFrameIndex = frame.parent().index();
        this.selectedKeyframe = this.selectedLayer.findKeyframeForPosition(this.selectedFrameIndex + 1);
        this.fireEvent('frameselect', this.selectedFrameIndex + 1);
    }
    
    private insertKeyframe() {
        this.selectedFrameGUI.addClass('timeline-frame-keyframe');

        var keyframe = new Keyframe(this.selectedFrameIndex + 1, []);
        this.environment.layers[this.selectedLayerIndex].insertFrame(keyframe);
        this.selectFrame(this.selectedFrameGUI); // Reselect frame to update dependencies (ie. Canvas)
    }

    private deleteFrame() {
    }

    private emptyFrame() {
    }

    private handleTimelineFrameClick(e: Event) {
        var layerIndex = $(e.target).parent().parent().index();
        if (layerIndex != this.selectedLayerIndex) {
            this.selectLayer(this.layerListGUI.find(':nth-child(' + (layerIndex + 1) + ')'));
        }
        this.selectFrame($(e.target));
    }

    private drawLayerFrames(layer: Layer) {
        // TODO: Add support for initializing frames

        // Determine limit according to resolution
        var limit = this.frameContainerGUI.innerWidth() / 16;
        var layerFramesDiv = $('<div></div>');

        for (var i = 0, k = 0; i < limit; i++) {
            var timelineFrame = $('<div class="timeline-frames-container dropup"><a class="timeline-frame" data-toggle="dropdown" href="#"></a><ul class="dropdown-menu frame-options" role="menu">\
                                    <li><a tabindex="-1" href="#" class="insert-keyframe">Insertar keyframe</a></li>\
                                    <li><a tabindex="-1" href="#" class="empty-frame">Vaciar frame</a></li>\
                                    <li class ="divider"></li>\
                                    <li><a tabindex="-1" href="#" class="delete-frame">Eliminar frame</a></li>\
                                    </ul></div>').appendTo(layerFramesDiv);

            // Check if current frame is keyframe
            if (k < layer.frames.length && layer.frames[k].position == i + 1) {
                timelineFrame.addClass('timeline-frame-keyframe');
                k++;
            }

            timelineFrame.find('.insert-keyframe').click((e: Event) => {
                this.insertKeyframe();
            });

            timelineFrame.find('.empty-frame').click((e: Event) => {
                this.emptyFrame();
            });

            timelineFrame.find('.delete-frame').click((e: Event) => {
                this.deleteFrame();
            });

            // Click event for individual frame on the Timeline
            timelineFrame.find('.timeline-frame').click((e: Event) => {
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
        var layer = new Layer('Layer ' + (this.environment.layers.length + 1), true, true);
        this.drawLayer(layer);
        this.environment.layers.push(layer);
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

    constructor(private element: HTMLElement, private environment: any, private timelineSettings: any) {
        super();

        // Get different containers within the timeline DOM Element
        this.layerListGUI = $(this.element).find('#timeline-layerlist');
        this.frameListGUI = $(this.element).find('#timeline-framelist');
        this.framePropertiesGUI = $(this.element).find('#frame-properties');
        this.frameContainerGUI = this.frameListGUI.find('#timeline-frames');
        this.frameOptionsGUI = $(this.element).find('#frame-options');

        // Set general information
        this.framePropertiesGUI.find('#framerate-value').text(timelineSettings.framerate);
        this.framePropertiesGUI.find('#totaltime-value').text(timelineSettings.defaultLength);

        // Add event listeners for adding / removing layers
        $(this.element).find('#newlayer-btn').click((e: Event) => {
            this.addNewLayer();
        });

        $(this.element).find('#trashlayer-btn').click((e: Event) => {
            this.trashLayer();
        });

        this.drawTimeline();

        // Select first frame
        this.selectFrame(this.frameListGUI.find('.timeline-frame').first());
    }
}