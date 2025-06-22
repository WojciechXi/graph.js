class RoundRect extends Rect {

    constructor(data = {}) {
        super(data);
        let object = this;
        object.r = data.r ?? 10;
    }

    Draw(canvas, offset = {}) {
        let object = this;
        canvas.context.beginPath();
        canvas.context.strokeStyle = object.hover ? 'rgb(255, 0, 0)' : 'rgb(0, 0, 0)';
        canvas.context.roundRect(object.x + (offset.x ?? 0) + canvas.xCenter, object.y + (offset.y ?? 0) + canvas.yCenter, object.w, object.h, object.r);
        canvas.context.stroke();
    }

}