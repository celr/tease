var __extends = this.__extends || function (d, b) {
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
///<reference path="Eventable.ts" />
///<reference path="lib/jquery.d.ts" />
var Timeline = (function (_super) {
    __extends(Timeline, _super);
    function Timeline(element, environment, timelineSettings) {
        _super.call(this);
        this.element = element;
        this.environment = environment;
        this.timelineSettings = timelineSettings;
        // Get different containers within the timeline DOM Element
        this.layerList = $(this.element).find('#timeline-layers');
        this.frameList = $(this.element).find('#timeline-framelist');
        this.frameProperties = $(this.element).find('#frame-properties');
        // Set general information
        this.frameProperties.find('#framerate-value').text(timelineSettings.framerate);
        this.frameProperties.find('#totaltime-value').text(timelineSettings.defaultLength);
        this.drawTimeline();
    }
    Timeline.prototype.drawTimelineRulerNumbers = function (e) {
        // TODO: fix number margin according to number of digits.
        var limit = this.timelineSettings.framerate * this.timelineSettings.defaultLength;
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
        var timelineNumbers = this.frameList.find('#timeline-numbers');
        this.drawTimelineRulerNumbers(timelineNumbers);
        var framesContainer = this.frameList.find('#timeline-frames');
        for(var i in this.environment.layers) {
            this.drawLayer(this.environment.layers[i], framesContainer);
        }
    };
    Timeline.prototype.drawLayer = function (layer, framesContainer) {
        // Insert layer into list
        $('<div class="timeline-item">' + layer.title + '</div>').appendTo(this.layerList);
        // Insert new timeline frames for this layer
        this.drawLayerFrames(layer, framesContainer);
    };
    Timeline.prototype.drawLayerFrames = function (layer, framesContainer) {
        // TODO: Add support for initializing frames
        var limit = this.timelineSettings.framerate * this.timelineSettings.defaultLength;
        var layerFramesDiv = $('<div id="timeline-layerframes"></div>');
        for(var i = 0; i < limit; i++) {
            $('<div class="timeline-frame"></div>').appendTo(layerFramesDiv);
        }
        framesContainer.append(layerFramesDiv);
    };
    return Timeline;
})(Eventable);
//@ sourceMappingURL=Timeline.js.map
