class Text {

    constructor(data = {}) {
        let object = this;
        object.x = data.x ?? 0;
        object.y = data.y ?? 0;
        object.text = data.text ?? '';
    }

    Check(canvas, pointer) {
        let object = this;
        return false;
    }

    Update(canvas, pointer) {
        let object = this;
        object.hover = object.Check(canvas, pointer);
    }

    GetWidth(canvas) {
        let object = this;
        return canvas.context.measureText(object.text).width;
    }

    Draw(canvas, offset = {}) {
        let object = this;
        canvas.context.strokeText(object.text, object.x + (offset.x ?? 0) + canvas.xCenter, object.y + (offset.y ?? 0) + canvas.yCenter);
    }

}