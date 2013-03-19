///<reference path="Eventable.ts" />

class Timeline extends Eventable {
    private environment: Object;
    private currentFPS: number;
    private currentFrame: number;
    private layers: any[];

    private drawTimeline() {
       
    }

    constructor (private DOMElement: HTMLElement) {
        super();
        this.drawTimeline();
    }
}