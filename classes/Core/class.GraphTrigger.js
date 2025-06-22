class GraphTrigger {

    constructor(data = {}) {
        let object = this;
        object.id = guid();
        object.name = data.name ?? 'Trigger';
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

    get Rect() {
        let object = this;
        return object.rect ?? (object.rect = new Rect({
            x: object.x,
            y: object.y,
            w: 8,
            h: 8,
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

        object.x = object.Rect.x;
        object.y = object.Rect.y;
    }

    Draw(canvas, offset = {}) {
        let object = this;
        object.Rect.Draw(canvas, offset);
    }

    get Code() {
        let object = this;
        return [
            `get ${object.name}() { return this._${object.name}; }`,
            `set ${object.name}(value) { return this._${object.name} = value; }`,
        ].join(`\n\n`);
    }

}