class Rect {

    constructor(data = {}) {
        let object = this;
        object.x = data.x ?? 0;
        object.y = data.y ?? 0;
        object.w = data.w ?? 100;
        object.h = data.h ?? 100;
    }

    Check(canvas, pointer) {
        let object = this;
        if (pointer.x < object.x) return false;
        if (pointer.y < object.y) return false;
        if (pointer.x > object.x + object.w) return false;
        if (pointer.y > object.y + object.h) return false;
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
        canvas.context.rect(object.x + (offset.x ?? 0) + canvas.xCenter, object.y + (offset.y ?? 0) + canvas.yCenter, object.w, object.h);
        canvas.context.stroke();
    }

}