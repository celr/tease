///<reference path="DimensionableTool.ts" />
///<reference path="Tool.ts" />

class MediaTool extends DimensionableTool implements Tool {

    constructor(id: string, DOMElement: JQuery, private pageId: number) {
        super(id, DOMElement);

        var MIMETypesByExtension = {
            ".mp3": "audio/mpeg",
            ".oga": "audio/ogg",
            ".ogg": "audio/ogg",
            ".ogv": "video/ogg",
            ".mp4": "video/mp4",
            ".m4v": "video/mp4",
            ".webm": "video/webm",
        };

        // Set default values
        // TODO(chadan): Support for multiple sources?.
        this.properties['media-src'] = 'none';
        this.properties['controls'] = 'true';
        this.properties['autoplay'] = 'false';
        this.properties['loop'] = 'false';

        this.propertyMapper.callbackMapping.mapProperty('media-src',
            (property: string, value: string, DOMElement: JQuery) => {
                if (property === 'media-src') {
                    DOMElement[0].innerHTML = DOMElement[0].innerText + "\n";
                    var source = $('<source src="' + value + '"></source>');
                    source.attr('type', MIMETypesByExtension[value.substring(value.lastIndexOf('.'))]);
                    DOMElement.append(source);
                    if (DOMElement.get().load)
                        DOMElement.get().load();
                }
            }
        );

        this.propertyMapper.callbackMapping.mapProperty('controls',
            (property: string, value: string, DOMElement: JQuery) => {
                if (property === 'controls') {
                    if (value === "true") {
                        DOMElement.attr("controls", "controls");
                    }
                }
            }
        );

        this.propertyMapper.callbackMapping.mapProperty('autoplay',
            (property: string, value: string, DOMElement: JQuery) => {
                if (property === 'autoplay') {
                    if (value === "true") {
                        DOMElement.attr("autoplay", "autoplay");
                    }
                }
            }
        );

        this.propertyMapper.callbackMapping.mapProperty('loop',
            (property: string, value: string, DOMElement: JQuery) => {
                if (property === 'loop') {
                    if (value === "true") {
                        DOMElement.attr("loop", "loop");
                    }
                }
            }
        );

        this.displayGroups.push(
            new PropertyDisplayGroup('Media',
                ['media-src', 'controls', 'autoplay', 'loop'],
                ['Fuente del medio:', 'Mostrar controles', 'Reproducir automaticamente', 'Repetir'],
                [new ResourcePropertyControl('media-src', this.pageId),
                    new SelectPropertyControl('controls', ['true', 'false'], ['Mostrar', 'Ocultar']),
                    new SelectPropertyControl('autoplay', ['true', 'false'], ['Activado', 'Desactivado']),
                    new SelectPropertyControl('loop', ['true', 'false'], ['Activar', 'Desactivar'])]
            )
        );
    }

}