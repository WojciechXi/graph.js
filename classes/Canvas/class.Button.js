class Button extends RoundRect {

    constructor(data = {}) {
        super(data);
        let object = this;
        object.text = data.text ?? 'Button';
    }

    Update(canvas) {
        let object = this;
    }

    Draw(canvas) {
        super.Draw(canvas);
        let object = this;

    }

}