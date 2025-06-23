class GraphNode {

    static {
        GraphNode.nodes = [];
        GraphNode.types = {};
    }

    static FromJson(data = {}) {
        return new (GraphNode.types[data.type])(data);
    }

    constructor(data = {}) {
        let object = this;
        object.id = data.id ?? guid();

        object.x = data.x ?? 0;
        object.y = data.y ?? 0;
    }

    get TriggerInputs() {
        return null;
    }

    get TriggerOutputs() {
        return null;
    }

    get DataInputs() {
        return null;
    }

    get DataOutputs() {
        return null;
    }

    toJson() {
        let object = this;
        return {
            type: object.constructor.name,
            id: object.id,
            x: object.x,
            y: object.y,
        };
    }

    get Code() {
        return ``;
    }

    get RoundRect() {
        let object = this;
        return object.roundRect ?? (object.roundRect = new RoundRect());
    }

    get Text() {
        let object = this;
        return object.text ?? (object.text = new Text({
            text: object.constructor.name,
        }));
    }

    Update(canvas, pointer) {
        let object = this;
        object.hover = object.RoundRect.Update(canvas, pointer);
        object.Text.Update(canvas, pointer);

        if (object.TriggerInputs) {
            object.TriggerInputs.forEach(function (triggerInput) {
                triggerInput.Update(canvas, pointer);
            });
        }

        if (object.TriggerOutputs) {
            object.TriggerOutputs.forEach(function (triggerOutput) {
                triggerOutput.Update(canvas, pointer);
            });
        }

        if (object.DataInputs) {
            object.DataInputs.forEach(function (dataInput) {
                dataInput.Update(canvas, pointer);
            });
        }

        if (object.DataOutputs) {
            object.DataOutputs.forEach(function (dataOutput) {
                dataOutput.Update(canvas, pointer);
            });
        }
    }

    Resize(canvas) {
        let object = this;

        object.RoundRect.x = object.x;
        object.RoundRect.y = object.y;

        let triggerInputsCount = object.TriggerInputs ? object.TriggerInputs.length : 0;
        let triggerOutputsCount = object.TriggerOutputs ? object.TriggerOutputs.length : 0;

        let dataInputsCount = object.DataInputs ? object.DataInputs.length : 0;
        let dataOutputsCount = object.DataOutputs ? object.DataOutputs.length : 0;

        object.RoundRect.w = object.Text.GetWidth(canvas) + 16;
        object.RoundRect.h = Math.max((triggerInputsCount + dataInputsCount) * 16, (triggerOutputsCount + dataOutputsCount) * 16) + 24;

        object.Text.x = object.x + 8;
        object.Text.y = object.y + 16;

        let top = 24;
        if (object.TriggerInputs) {
            object.TriggerInputs.forEach(function (graphTrigger, index) {
                graphTrigger.Resize(canvas, object, {
                    x: 8,
                    y: top,
                });
                top += 16;
            });
        }

        if (object.DataInputs) {
            object.DataInputs.forEach(function (graphVariable, index) {
                graphVariable.Resize(canvas, object, {
                    x: 8,
                    y: top,
                });
                top += 16;
            });
        }

        top = 24;
        if (object.TriggerOutputs) {
            object.TriggerOutputs.forEach(function (graphTrigger, index) {
                graphTrigger.Resize(canvas, object, {
                    x: object.RoundRect.w - 16,
                    y: top,
                });
                top += 16;
            });
        }

        if (object.DataOutputs) {
            object.DataOutputs.forEach(function (graphVariable, index) {
                graphVariable.Resize(canvas, object, {
                    x: object.RoundRect.w - 16,
                    y: top,
                });
                top += 16;
            });
        }
    }

    Draw(canvas) {
        let object = this;

        object.RoundRect.Draw(canvas);
        object.Text.Draw(canvas);

        if (object.TriggerInputs) {
            object.TriggerInputs.forEach(function (graphTrigger, index) {
                graphTrigger.Draw(canvas);
            });
        }

        if (object.DataInputs) {
            object.DataInputs.forEach(function (graphVariable, index) {
                graphVariable.Draw(canvas);
            });
        }

        if (object.TriggerOutputs) {
            object.TriggerOutputs.forEach(function (graphTrigger, index) {
                graphTrigger.Draw(canvas);
            });
        }

        if (object.DataOutputs) {
            object.DataOutputs.forEach(function (graphVariable, index) {
                graphVariable.Draw(canvas);
            });
        }
    }

}

class GraphNodeEnter extends GraphNode {

    static {
        GraphNode.nodes.push(this);
        GraphNode.types[this.name] = this;
    }

    constructor(data = {}) {
        super(data);
        let object = this;
        object.caller = data.caller ?? null;
    }

    get TriggerOutputs() {
        let object = this;
        return object.caller ? object.caller.triggerInputs : null;
    }

    get DataOutputs() {
        let object = this;
        return object.caller ? object.caller.dataInputs : null;
    }

    get Code() {
        let object = this;
        let parts = [];
        object.DataOutputs.forEach(function (dataOutput) {
            parts.push(`let ${dataOutput.name} = '${dataOutput.value}';`);
        });
        return parts.join(`\n`)
    }

}

class GraphNodeReturn extends GraphNode {

    static {
        GraphNode.nodes.push(this);
        GraphNode.types[this.name] = this;
    }

    constructor(data = {}) {
        super(data);
        let object = this;
        object.caller = data.caller ?? null;
    }

    get TriggerInputs() {
        let object = this;
        return object.caller ? object.caller.triggerOutputs : null;
    }

    get DataInputs() {
        let object = this;
        return object.caller ? object.caller.dataOutputs : null;
    }

    get Code() {
        let object = this;
        let parts = [];
        parts.push(`return {`);
        object.DataInputs.forEach(function (dataInput) {
            parts.push(`${dataInput.name}: '${dataInput.value}',`);
        });
        parts.push(`}`);
        return parts.join(`\n`)
    }

}

class GraphNodeBreak extends GraphNode {

    static {
        GraphNode.nodes.push(this);
        GraphNode.types[this.name] = this;
    }

    constructor(data = {}) {
        super(data);
        let object = this;
        object.triggerInputs = [new GraphTrigger({ name: 'enter' })];
    }

    get TriggerInputs() {
        let object = this;
        return object.triggerInputs;
    }

    get Code() {
        return `break;`;
    }

}

class GraphNodeIf extends GraphNode {

    static {
        GraphNode.nodes.push(this);
        GraphNode.types[this.name] = this;
    }

    constructor(data = {}) {
        super(data);
        let object = this;
        object.triggerInputs = [
            new GraphTrigger({ name: 'enter', }),
        ];
        object.triggerOutputs = [
            new GraphTrigger({ name: 'true', }),
            new GraphTrigger({ name: 'false', }),
        ];
        object.dataInputs = [
            new GraphVariable({ name: 'predicate', type: 'bool', value: false }),
        ];
    }

    get TriggerInputs() {
        let object = this;
        return object.triggerInputs;
    }

    get TriggerOutputs() {
        let object = this;
        return object.triggerOutputs;
    }

    get DataInputs() {
        let object = this;
        return object.dataInputs;
    }

}

class GraphNodeSwitch extends GraphNode {

    static {
        GraphNode.nodes.push(this);
        GraphNode.types[this.name] = this;
    }

    constructor(data = {}) {
        super(data);
        let object = this;
        object.triggerInputs = [
            new GraphTrigger({ name: 'enter', }),
        ];
    }

    get TriggerInputs() {
        let object = this;
        return object.triggerInputs;
    }

}

class GraphNodeFor extends GraphNode {

    static {
        GraphNode.nodes.push(this);
        GraphNode.types[this.name] = this;
    }

    constructor(data = {}) {
        super(data);
        let object = this;
        object.triggerInputs = [
            new GraphTrigger({ name: 'enter', }),
        ];
        object.dataInputs = [
            new GraphVariable({ name: 'first', type: 'int', value: 0 }),
            new GraphVariable({ name: 'last', type: 'int', value: 10 }),
            new GraphVariable({ name: 'step', type: 'int', value: 1 }),
        ];
        object.triggerOutputs = [
            new GraphTrigger({ name: 'exit', }),
            new GraphTrigger({ name: 'body', }),
        ];
        object.dataOutputs = [
            new GraphVariable({ name: 'index', type: 'int' }),
        ];
    }

    get TriggerInputs() {
        let object = this;
        return object.triggerInputs;
    }

    get TriggerOutputs() {
        let object = this;
        return object.triggerOutputs;
    }

    get DataInputs() {
        let object = this;
        return object.dataInputs;
    }

    get DataOutputs() {
        let object = this;
        return object.dataOutputs;
    }

    get Code() {
        let object = this;
        let parts = [];
        parts.push(`for(let i = 0; i < 10; i++) {`);
        parts.push(`}`);
        return parts.join(`\n`);
    }

}

class GraphNodeForEach extends GraphNode {

    static {
        GraphNode.nodes.push(this);
        GraphNode.types[this.name] = this;
    }

    constructor(data = {}) {
        super(data);
        let object = this;
        object.triggerInputs = [
            new GraphTrigger({ name: 'enter', }),
        ];
        object.dataInputs = [
            new GraphVariable({ name: 'target', type: 'object', value: null }),
        ];
        object.triggerOutputs = [
            new GraphTrigger({ name: 'exit', }),
            new GraphTrigger({ name: 'body', }),
        ];
        object.dataOutputs = [
            new GraphVariable({ name: 'item', }),
            new GraphVariable({ name: 'index', }),
        ];
    }

    get TriggerInputs() {
        let object = this;
        return object.triggerInputs;
    }

    get TriggerOutputs() {
        let object = this;
        return object.triggerOutputs;
    }

    get DataInputs() {
        let object = this;
        return object.dataInputs;
    }

    get DataOutputs() {
        let object = this;
        return object.dataOutputs;
    }

    get Code() {
        let object = this;
        let parts = [];
        parts.push(`target.forEach(function(item, index){`);

        parts.push(`});`);
        return parts.join(`\n`);
    }

}

class GraphNodeWhile extends GraphNode {

    static {
        GraphNode.nodes.push(this);
        GraphNode.types[this.name] = this;
    }

    constructor(data = {}) {
        super(data);
        let object = this;
        object.triggerInputs = [
            new GraphTrigger({ name: 'enter', }),
        ];
        object.dataInputs = [
            new GraphVariable({ name: 'predicate', type: 'bool', value: false }),
        ];
        object.triggerOutputs = [
            new GraphTrigger({ name: 'exit', }),
            new GraphTrigger({ name: 'body', }),
        ];
    }

    get TriggerInputs() {
        let object = this;
        return object.triggerInputs;
    }

    get TriggerOutputs() {
        let object = this;
        return object.triggerOutputs;
    }

    get DataInputs() {
        let object = this;
        return object.dataInputs;
    }

    get Code() {
        let object = this;
        let parts = [];
        parts.push(`while( false ) {`);

        parts.push(`}`);
        return parts.join(`\n`);
    }

}

class GraphNodeThis extends GraphNode {

    static {
        GraphNode.nodes.push(this);
        GraphNode.types[this.name] = this;
    }

    constructor(data = {}) {
        super(data);
        let object = this;
        object.dataOutputs = [
            new GraphVariable({ name: 'this', type: 'object', value: null }),
        ];
    }

    get DataOutputs() {
        let object = this;
        return object.dataOutputs;
    }

    get Code() {
        let object = this;
        let parts = [];
        parts.push(`this`);
        return parts.join(`\n`);
    }

}

class GraphNodeGet extends GraphNode {

    static {
        GraphNode.nodes.push(this);
        GraphNode.types[this.name] = this;
    }

    constructor(data = {}) {
        super(data);
        let object = this;
        object.dataInputs = [
            new GraphVariable({ name: 'target', type: 'object', value: null }),
            new GraphVariable({ name: 'member', type: 'string', value: 'variable' }),
        ];
        object.dataOutputs = [
            new GraphVariable({ name: 'value', type: 'mixed' }),
        ];
    }

    get DataInputs() {
        let object = this;
        return object.dataInputs;
    }

    get DataOutputs() {
        let object = this;
        return object.dataOutputs;
    }

}

class GraphNodeSet extends GraphNode {

    static {
        GraphNode.nodes.push(this);
        GraphNode.types[this.name] = this;
    }

    constructor(data = {}) {
        super(data);
        let object = this;
        object.triggerInputs = [
            new GraphTrigger({ name: 'enter' })
        ];
        object.triggerOutputs = [
            new GraphTrigger({ name: 'exit' })
        ];
        object.dataInputs = [
            new GraphVariable({ name: 'target', type: 'object', value: null }),
            new GraphVariable({ name: 'member', type: 'string', value: 'variable' }),
            new GraphVariable({ name: 'new value', type: 'mixed', value: '' }),
        ];
        object.dataOutputs = [
            new GraphVariable({ name: 'value', type: 'mixed' }),
        ];
    }

    get TriggerInputs() {
        let object = this;
        return object.triggerInputs;
    }

    get TriggerOutputs() {
        let object = this;
        return object.triggerOutputs;
    }

    get DataInputs() {
        let object = this;
        return object.dataInputs;
    }

    get DataOutputs() {
        let object = this;
        return object.dataOutputs;
    }

}

class GraphNodeFunction extends GraphNode {

    static {
        GraphNode.nodes.push(this);
        GraphNode.types[this.name] = this;
    }

    constructor(data = {}) {
        super(data);
        let object = this;
        object.dataInputs = [
            new GraphVariable({ name: 'function', type: 'object', value: null }),
        ];
        object.dataOutputs = [
            new GraphTrigger({ name: 'exit', }),
        ];
    }

    get DataInputs() {
        let object = this;
        return object.dataInputs;
    }

    get DataOutputs() {
        let object = this;
        return object.dataOutputs;
    }

}

class GraphNodeMethod extends GraphNode {

    static {
        GraphNode.nodes.push(this);
        GraphNode.types[this.name] = this;
    }

    constructor(data = {}) {
        super(data);
        let object = this;
        object.dataInputs = [
            new GraphVariable({ name: 'target', type: 'object', value: null }),
            new GraphVariable({ name: 'method', type: 'object', value: null }),
        ];
        object.dataOutputs = [
            new GraphTrigger({ name: 'exit', }),
        ];
    }

    get TriggerInputs() {
        let object = this;
        return object.triggerInputs;
    }

    get TriggerOutputs() {
        let object = this;
        return object.triggerOutputs;
    }

    get DataInputs() {
        let object = this;
        return object.dataInputs;
    }

    get DataOutputs() {
        let object = this;
        return object.dataOutputs;
    }

}

class GraphNodeMath extends GraphNode {

    constructor(data = {}) {
        super(data);
        let object = this;
        object.dataInputs = [
            new GraphVariable({ name: '0', type: 'mixed', value: null }),
        ];
        object.dataOutputs = [
            new GraphVariable({ name: 'value', type: 'mixed', value: null }),
        ];
    }

}