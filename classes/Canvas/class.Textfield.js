class Textfield extends RoundRect {

    constructor(data = {}) {
        super(data);
        let object = this;
        object.text = data.text ?? '';
    }

    Draw(canvas, offset = {}) {
        super.Draw(canvas, offset);
        let object = this;
        canvas.context.strokeText(object.text, object.x + (offset.x ?? 0) + canvas.xCenter, object.y + (offset.y ?? 0) + canvas.yCenter);
    }

}