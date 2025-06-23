class GraphTrigger {

    static FromJson(data = {}) {
        return new GraphTrigger(data);
    }

    constructor(data = {}) {
        let object = this;
        object.id = data.id ?? guid();
        object.name = data.name ?? 'Trigger';
        object.direction = data.direction ?? 'input';
        object.type = data.type ?? 'mixed';
        object.value = data.value ?? '';

        object.graphNode = data.graphNode ?? null;
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

    get Rect() {
        let object = this;
        return object.rect ?? (object.rect = new Rect({
            x: object.x,
            y: object.y,
            w: 8,
            h: 8,
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
        object.hover = object.Rect.Update(canvas, pointer);
    }

    Resize(canvas, node, offset = {}) {
        let object = this;
        object.Rect.x = node.x + (offset.x ?? 0);
        object.Rect.y = node.y + (offset.y ?? 0);

        object.Text.x = object.Rect.x + 16;
        object.Text.y = object.Rect.y + 8;

        object.x = object.Rect.x;
        object.y = object.Rect.y;
    }

    Draw(canvas, offset = {}) {
        let object = this;
        object.Rect.Draw(canvas, offset);
        object.Text.Draw(canvas, offset);
    }

    get Code() {
        let object = this;
        return [
            `get ${object.name}() { return this._${object.name}; }`,
            `set ${object.name}(value) { return this._${object.name} = value; }`,
        ].join(`\n\n`);
    }

}