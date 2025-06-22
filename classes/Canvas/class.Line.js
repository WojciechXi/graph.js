class Line {

    constructor(data = {}) {
        let object = this;
        object.a = data.a ?? 0;
        object.b = data.b ?? 0;
        object.x = data.x ?? 0;
        object.y = data.y ?? 0;
    }

    Check(canvas, pointer) {
        let object = this;
        return false;
    }

    Update(canvas, pointer) {
        let object = this;
        object.hover = object.Check(canvas, pointer);
    }

    Draw(canvas, offset = {}) {
        let object = this;
        canvas.context.beginPath();
        canvas.context.strokeStyle = 'rgb(255, 0, 0)';
        canvas.context.moveTo(object.a + (offset.x ?? 0) + canvas.xCenter, object.b + (offset.y ?? 0) + canvas.yCenter);
        canvas.context.lineTo(object.x + (offset.x ?? 0) + canvas.xCenter, object.y + (offset.y ?? 0) + canvas.yCenter);
        canvas.context.stroke();
    }

}