///<reference path="Attribute.ts" />
///<reference path="Environment.ts" />
class AnimationSettings {
    constructor(public initialPosition: number, public fps: number) {
    }
}

class RenderedAnimation {
    constructor(public animationProperties: Object, public durationMs: number) {
    }
}

class RenderedElement {
    constructor(public DOMElement: JQuery, public renderedAnimations?: RenderedAnimation[] = []) {
    };
}

class RenderedEnvironment {
    private animationCount: number;
    private playCallback: Function;

    constructor(public renderedElements?: RenderedElement[] = []) {
        this.animationCount = 0;
    }

    public play(callback?: Function) {
        this.playCallback = callback;
        for (var i = 0; i < this.renderedElements.length; i++) {
            this.animate(this.renderedElements[i]);
        }
    }

    private animate(renderedElement: RenderedElement) {
        for (var i = 0; i < renderedElement.renderedAnimations.length; i++) {
            var animation = renderedElement.renderedAnimations[i];
            renderedElement.DOMElement.animate(animation.animationProperties, animation.durationMs, "swing", (e: Event) => {
                this.animationCallback(e);
            });
            this.animationCount++;
        }
    }

    private animationCallback(e: Event) {
        this.animationCount--;
        if (this.animationCount === 0 && this.playCallback) {
            this.playCallback();
        }
    }
}

class AnimationRenderer {
    private environment: Environment;
    private settings: AnimationSettings;
    private renderedEnv: RenderedEnvironment;

    // Renders the specified environment
    // Returns a RenderedEnvironment object that contains the generated DOM elements representing the environment
    public getRenderedEnvironment(environment: Environment, settings?: AnimationSettings = new AnimationSettings(1, 24)) {
        this.renderedEnv = new RenderedEnvironment;
        this.environment = environment;
        this.settings = settings;

        for (var i = 0; i < environment.layers.length; i++) {
            this.renderLayer(environment.layers[i]);
        }

        return this.renderedEnv;
    }

    private renderLayer(layer: Layer) {
        for (var i = layer.findFrameIndexForPosition(this.settings.initialPosition); i < layer.keyframes.length; i++) {
            this.renderKeyframe(layer.keyframes[i]);
        }
    }

    private renderKeyframe(keyframe: Keyframe) {
        for (var i = 0; i < keyframe.elements.length; i++) {
            this.renderElement(keyframe.elements[i]);
        }
    }

    private renderElement(element: Tease.Element) {
        if (!element.elementTransition.hasPreviousElement) { // Do not render transitioned elements
            var renderedElement = new RenderedElement($(element.DOMElement).clone(true));
            var currElement = element;

            while (currElement.hasTransition()) {
                renderedElement.renderedAnimations.push(new RenderedAnimation(this.getAnimatedProperties(currElement),
                                                        this.getAnimationDuration(currElement)));
                currElement = currElement.elementTransition.nextElement;
            }

            this.renderedEnv.renderedElements.push(renderedElement);
        }
    }

    private getAnimatedProperties(element: Tease.Element) {
        return element.parentTool.propertyMapper.getAnimationProperties(element.elementTransition.nextElement.attributes, element.elementTransition.nextElement.propertyUnits);
    }

    private getAnimationDuration(element: Tease.Element) {
        var initialPosition = element.keyframePosition;
        var finalPosition = element.elementTransition.nextElement.keyframePosition;
        return ((finalPosition - initialPosition) / this.settings.fps) * 1000;
    }
}