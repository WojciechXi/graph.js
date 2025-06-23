class GraphEditorInspector {

    constructor() {
        let object = this;
        object.id = guid();
        object.Target = null;
    }

    set Target(target) {
        let object = this;
        object.target = target;
        object.Root.content = object.target;
    }

    get Root() {
        let object = this;
        return object.root ?? (object.root = el({
            contentLoop: function (value, index, property) {
                if (value instanceof Function) return null;
                if (value instanceof Array) return null;
                if (value instanceof Object) return null;
                return el({
                    class: ['row'],
                    content: [
                        el({
                            class: ['grow', 'button'],
                            content: property,
                        }),
                        el({
                            tag: 'input',
                            class: ['grow', 'input'],
                            attr: {
                                value: value,
                            },
                            event: {
                                change: function (event) {
                                    let input = this;
                                    object.target[property] = input.value;
                                },
                            },
                        }),
                    ],
                });
            }
        }));
    }

}