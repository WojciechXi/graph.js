class GraphConnection {

    static FromJson(data) {
        return new GraphConnection(data);
    }

    constructor(data = {}) {
        let object = this;
        object.id = data.id ?? guid();
        object.inputId = data.inputId ?? null;
        object.outputId = data.outputId ?? null;

        object.input = data.input ?? null;
        if (object.input) object.inputId = object.input.id;
        object.output = data.output ?? null;
        if (object.output) object.outputId = object.output.id;
    }

    toJson() {
        let object = this;
        return {
            id: object.id,
            inputId: object.inputId,
            outputId: object.outputId,
        };
    }

    get Line() {
        let object = this;
        return object.line ?? (object.line = new Line());
    }

    Update(canvas, pointer) {
        let object = this;
        return false;
    }

    Resize(canvas, offset = {}) {
        let object = this;
        if (!object.input) return;
        if (!object.output) return;
        object.Line.a = object.input.x + 4;
        object.Line.b = object.input.y + 4;
        object.Line.x = object.output.x + 4;
        object.Line.y = object.output.y + 4;
    }

    Draw(canvas, offset = {}) {
        let object = this;
        object.Line.Draw(canvas, offset);
    }

}