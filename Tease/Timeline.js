var __extends = this.__extends || function (d, b) {
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
///<reference path="Eventable.ts" />
///<reference path="Layer.ts" />
///<reference path="lib/jquery.d.ts" />
var Timeline = (function (_super) {
    __extends(Timeline, _super);
    function Timeline(element, environment, timelineSettings) {
        var _this = this;
        _super.call(this);
        this.element = element;
        this.environment = environment;
        this.timelineSettings = timelineSettings;
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
        $(this.element).find('#newlayer-btn').click(function (e) {
            _this.addNewLayer();
        });
        $(this.element).find('#trashlayer-btn').click(function (e) {
            _this.trashLayer();
        });
        this.drawTimeline();
        // Select first frame
        this.selectFrame(this.frameListGUI.find('.timeline-frame').first());
    }
    Timeline.prototype.drawTimelineRulerNumbers = function (e) {
        // TODO: fix number margin according to number of digits.
        var limit = this.frameContainerGUI.innerWidth() / 16;
        for(var i = 0; i <= limit; i += 5) {
            var num;
            if(i == 0) {
                num = 1;
            } else {
                num = i;
            }
            $('<span class="timeline-number">' + num + '</span>').appendTo(e);
        }
    };
    Timeline.prototype.drawTimeline = function () {
        // Create timeline ruler
        var timelineNumbers = this.frameListGUI.find('#timeline-numbers');
        this.drawTimelineRulerNumbers(timelineNumbers);
        for(var i in this.environment.layers) {
            var layer = this.drawLayer(this.environment.layers[i]);
            // Select first layer by default
            if(i == String(0)) {
                this.selectLayer(layer);
            }
        }
    };
    Timeline.prototype.unselectLayer = function (layer) {
        layer.removeClass('layer-selected');
    };
    Timeline.prototype.selectLayer = function (layer) {
        if(this.selectedLayerGUI) {
            this.unselectLayer(this.selectedLayerGUI);
        }
        layer.addClass('layer-selected');
        this.selectedLayerGUI = layer;
        this.selectedLayerIndex = layer.index();
        this.selectedLayer = this.environment.layers[this.selectedLayerIndex];
        this.fireEvent('layerselect', this.selectedLayerIndex);
    };
    Timeline.prototype.drawLayer = function (layer) {
        var _this = this;
        // Insert layer into list
        var layerGUI = $('<div class="timeline-item">' + layer.title + '</div>').appendTo(this.layerListGUI);
        layerGUI.click(function (e) {
            _this.selectLayer($(e.target));
            _this.selectFrame($(_this.frameListGUI.find('#timeline-frames').children()[layerGUI.index()]).find('.timeline-frame').first())// TODO: Break this down
            ;
        });
        // Insert new timeline frames for this layer
        this.drawLayerFrames(layer);
        return layerGUI;
    };
    Timeline.prototype.showOptionsForFrame = function (frame) {
        this.frameOptionsGUI.show(600);
    };
    Timeline.prototype.unselectFrame = function (frame) {
        frame.removeClass('timeline-frame-selected');
    };
    Timeline.prototype.selectFrame = function (frame) {
        if(this.selectedFrameGUI) {
            this.unselectFrame(this.selectedFrameGUI);
        }
        frame.addClass('timeline-frame-selected');
        this.selectedFrameGUI = frame;
        this.selectedFrameIndex = frame.parent().index();
        this.selectedKeyframe = this.selectedLayer.findKeyframeForPosition(this.selectedFrameIndex + 1);
        this.fireEvent('frameselect', this.selectedFrameIndex + 1);
    };
    Timeline.prototype.insertKeyframe = function () {
        this.selectedFrameGUI.addClass('timeline-frame-keyframe');
        var keyframe = new Keyframe(this.selectedFrameIndex + 1, []);
        this.environment.layers[this.selectedLayerIndex].insertFrame(keyframe);
        this.selectFrame(this.selectedFrameGUI)// Reselect frame to update dependencies (ie. Canvas)
        ;
    };
    Timeline.prototype.deleteFrame = function () {
    };
    Timeline.prototype.emptyFrame = function () {
    };
    Timeline.prototype.handleTimelineFrameClick = function (e) {
        var layerIndex = $(e.target).parent().parent().index();
        if(layerIndex != this.selectedLayerIndex) {
            this.selectLayer(this.layerListGUI.find(':nth-child(' + (layerIndex + 1) + ')'));
        }
        this.selectFrame($(e.target));
    };
    Timeline.prototype.drawLayerFrames = function (layer) {
        var _this = this;
        // TODO: Add support for initializing frames
        // Determine limit according to resolution
        var limit = this.frameContainerGUI.innerWidth() / 16;
        var layerFramesDiv = $('<div></div>');
        for(var i = 0, k = 0; i < limit; i++) {
            var timelineFrame = $('<div class="timeline-frames-container dropup"><a class="timeline-frame" data-toggle="dropdown" href="#"></a><ul class="dropdown-menu frame-options" role="menu">\
                                    <li><a tabindex="-1" href="#" class="insert-keyframe">Insertar keyframe</a></li>\
                                    <li><a tabindex="-1" href="#" class="empty-frame">Vaciar frame</a></li>\
                                    <li class ="divider"></li>\
                                    <li><a tabindex="-1" href="#" class="delete-frame">Eliminar frame</a></li>\
                                    </ul></div>').appendTo(layerFramesDiv);
            // Check if current frame is keyframe
            if(k < layer.frames.length && layer.frames[k].position == i + 1) {
                timelineFrame.addClass('timeline-frame-keyframe');
                k++;
            }
            timelineFrame.find('.insert-keyframe').click(function (e) {
                _this.insertKeyframe();
            });
            timelineFrame.find('.empty-frame').click(function (e) {
                _this.emptyFrame();
            });
            timelineFrame.find('.delete-frame').click(function (e) {
                _this.deleteFrame();
            });
            // Click event for individual frame on the Timeline
            timelineFrame.find('.timeline-frame').click(function (e) {
                _this.handleTimelineFrameClick(e);
            });
        }
        this.frameContainerGUI.append(layerFramesDiv);
    };
    Timeline.prototype.removeLayerWithIndex = function (i) {
        this.layerListGUI.find(':nth-child(' + (i + 1) + ')').remove();
        this.frameContainerGUI.find(':nth-child(' + (i + 1) + ')').remove();
    };
    Timeline.prototype.addNewLayer = function () {
        var layer = new Layer('Layer ' + (this.environment.layers.length + 1), true, true);
        this.drawLayer(layer);
        this.environment.layers.push(layer);
    };
    Timeline.prototype.trashLayer = function () {
        var numLayers = this.layerListGUI.children().length;
        if(numLayers > 1) {
            // Never remove last element
            var layerIndex = this.selectedLayerGUI.index();
            this.unselectLayer(this.selectedLayerGUI);
            this.removeLayerWithIndex(layerIndex);
            if(layerIndex < numLayers - 1) {
                this.selectLayer(this.layerListGUI.find(':nth-child(' + (layerIndex + 1) + ')'));
            } else {
                this.selectLayer(this.layerListGUI.find(':nth-child(' + layerIndex + ')'));
            }
            this.environment.layers.splice(layerIndex - 1, 1);
        }
    };
    return Timeline;
})(Eventable);
//@ sourceMappingURL=Timeline.js.map
