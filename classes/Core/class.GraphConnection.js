class GraphConnection {

    static FromJson(data) {
        return new GraphConnection(data);
    }

    constructor(data = {}) {
        let object = this;
        object.id = data.id ?? guid();
        object.input = data.input ?? null;
        object.inputId = object.input ? object.input.id : null;

        object.output = data.output ?? null;
        object.outputId = object.output ? object.output.id : null;
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