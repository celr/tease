///<reference path="Eventable.ts" />
///<reference path="lib/jquery.d.ts" />

class Timeline extends Eventable {
    private currentFPS: number;
    private currentFrame: number;

    // DOM Elements
    private frameList: JQuery;
    private layerList: JQuery;
    private frameProperties: JQuery;

    private drawTimelineRulerNumbers(e: JQuery) {
        // TODO: fix number margin according to number of digits.

        var limit = this.timelineSettings.framerate * this.timelineSettings.defaultLength;
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
        var timelineNumbers = this.frameList.find('#timeline-numbers');
        this.drawTimelineRulerNumbers(timelineNumbers);

        var framesContainer = this.frameList.find('#timeline-frames');
        for (var i in this.environment.layers) {
            this.drawLayer(this.environment.layers[i], framesContainer);
        }
    }

    private drawLayer(layer: any, framesContainer: JQuery) {
        // Insert layer into list
        $('<div class="timeline-item">' + layer.title + '</div>').appendTo(this.layerList);

        // Insert new timeline frames for this layer
        this.drawLayerFrames(layer, framesContainer);
    }

    private drawLayerFrames(layer: any, framesContainer: JQuery) {
        // TODO: Add support for initializing frames
        var limit = this.timelineSettings.framerate * this.timelineSettings.defaultLength;

        var layerFramesDiv = $('<div id="timeline-layerframes"></div>');

        for (var i = 0; i < limit; i++) {
            $('<div class="timeline-frame"></div>').appendTo(layerFramesDiv);
        }

        framesContainer.append(layerFramesDiv);
    }

    constructor(private element: HTMLElement, private environment: any, private timelineSettings: any) {
        super();

        // Get different containers within the timeline DOM Element
        this.layerList = $(this.element).find('#timeline-layers');
        this.frameList = $(this.element).find('#timeline-framelist');
        this.frameProperties = $(this.element).find('#frame-properties');

        // Set general information
        this.frameProperties.find('#framerate-value').text(timelineSettings.framerate);
        this.frameProperties.find('#totaltime-value').text(timelineSettings.defaultLength);

        this.drawTimeline();
    }
}