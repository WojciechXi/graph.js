class GraphVariable {

    static FromJson(data = {}) {
        return new GraphVariable(data);
    }

    constructor(data = {}) {
        let object = this;
        object.id = data.id ?? guid();
        object.name = data.name ?? 'Variable';
        object.type = data.type ?? 'mixed';
        object.value = data.value ?? '';
    }

    toJson() {
        let object = this;
        return {
            id: object.id,
            name: object.name,
            type: object.type,
            value: object.value,
        };
    }

    get Arc() {
        let object = this;
        return object.arc ?? (object.arc = new Arc({
            x: object.x,
            y: object.y,
        }));
    }

    get Text() {
        let object = this;
        return object.text ?? (object.text = new Text({
            text: object.name,
            x: object.x,
            y: object.y,
        }));
    }

    Update(canvas, pointer) {
        let object = this;
        object.hover = object.Arc.Update(canvas, pointer);
    }

    Resize(canvas, node, offset = {}) {
        let object = this;
        object.Arc.x = node.x + (offset.x ?? 0);
        object.Arc.y = node.y + (offset.y ?? 0);

        object.Text.x = object.Arc.x + 16;
        object.Text.y = object.Arc.y + 8;

        object.x = object.Arc.x;
        object.y = object.Arc.y;
    }

    Draw(canvas, offset = {}) {
        let object = this;
        object.Arc.Draw(canvas, offset);
        object.Text.Draw(canvas, offset);
    }

    get Code() {
        let object = this;
        return [
            `\tget ${object.name}() { return this._${object.name}; }`,
            `\tset ${object.name}(value) { return this._${object.name} = value; }`,
        ].join(`\n\n`);
    }

}