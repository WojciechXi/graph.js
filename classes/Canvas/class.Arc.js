class Arc {

    constructor(data = {}) {
        let object = this;
        object.x = data.x ?? 0;
        object.y = data.y ?? 0;
        object.r = data.r ?? 4;
    }

    Check(canvas, pointer) {
        let object = this;
        if (pointer.x < object.x) return false;
        if (pointer.y < object.y) return false;
        if (pointer.x > object.x + object.r * 2) return false;
        if (pointer.y > object.y + object.r * 2) return false;
        return true;
    }

    Update(canvas, pointer) {
        let object = this;
        return object.hover = object.Check(canvas, pointer);
    }

    Draw(canvas, offset = {}) {
        let object = this;
        canvas.context.beginPath();
        canvas.context.strokeStyle = object.hover ? 'rgb(255, 0, 0)' : 'rgb(0, 0, 0)';
        canvas.context.arc(object.x + object.r + (offset.x ?? 0) + canvas.xCenter, object.y + object.r + (offset.y ?? 0) + canvas.yCenter, object.r, 0, 2 * Math.PI, true);
        canvas.context.stroke();
    }

}