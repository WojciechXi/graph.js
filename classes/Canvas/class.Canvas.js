class Canvas {

    constructor(data = {}) {
        let object = this;
        object.canvas = data.canvas ?? null;
        object.context = object.canvas ? object.canvas.getContext('2d') : null;
        object.context.lineWidth = 1;

        object.x = data.x ?? 0;
        object.y = data.y ?? 0;

        object.xCenter = object.x + object.canvas.width / 2;
        object.yCenter = object.y + object.canvas.height / 2;
    }

    Clear() {
        let object = this;
        object.context.clearRect(0, 0, object.canvas.width, object.canvas.height);
        object.context.font = "12px Arial";

        object.xCenter = object.x + object.canvas.width / 2;
        object.yCenter = object.y + object.canvas.height / 2;
    }

}