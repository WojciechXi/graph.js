class GraphNode {

    static {
        GraphNode.nodes = [];
        GraphNode.types = {};
    }

    static FromJson(data = {}) {
        data.triggerInputs.forEach(function (triggerInput, index) {
            data.triggerInputs[index] = GraphTrigger.FromJson(triggerInput);
        });

        data.triggerOutputs.forEach(function (triggerOutput, index) {
            data.triggerOutputs[index] = GraphTrigger.FromJson(triggerOutput);
        });

        data.dataInputs.forEach(function (dataInput, index) {
            data.dataInputs[index] = GraphVariable.FromJson(dataInput);
        });

        data.dataOutputs.forEach(function (dataOutput, index) {
            data.dataOutputs[index] = GraphVariable.FromJson(dataOutput);
        });

        return new (GraphNode.types[data.type])(data);
    }

    constructor(data = {}) {
        let object = this;
        object.id = data.id ?? guid();
        object.x = data.x ?? 0;
        object.y = data.y ?? 0;

        object.triggerInputs = data.triggerInputs ?? [];
        object.triggerOutputs = data.triggerOutputs ?? [];

        object.dataInputs = data.dataInputs ?? [];
        object.dataOutputs = data.dataOutputs ?? [];
    }

    toJson() {
        let object = this;
        return {
            type: object.constructor.name,
            id: object.id,
            x: object.x,
            y: object.y,
            triggerInputs: object.triggerInputs,
            triggerOutputs: object.triggerOutputs,
            dataInputs: object.dataInputs,
            dataOutputs: object.dataOutputs,
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

        object.triggerInputs.forEach(function (triggerInput) {
            triggerInput.Update(canvas, pointer);
        });

        object.triggerOutputs.forEach(function (triggerOutput) {
            triggerOutput.Update(canvas, pointer);
        });

        object.dataInputs.forEach(function (dataInput) {
            dataInput.Update(canvas, pointer);
        });

        object.dataOutputs.forEach(function (dataOutput) {
            dataOutput.Update(canvas, pointer);
        });
    }

    Resize(canvas) {
        let object = this;

        object.RoundRect.x = object.x;
        object.RoundRect.y = object.y;

        object.RoundRect.w = object.Text.GetWidth(canvas) + 16;
        object.RoundRect.h = Math.max((object.triggerInputs.length + object.dataInputs.length) * 16, (object.triggerOutputs.length + object.dataOutputs.length) * 16) + 24;

        object.Text.x = object.x + 8;
        object.Text.y = object.y + 16;

        let top = 24;
        object.triggerInputs.forEach(function (graphTrigger, index) {
            graphTrigger.Resize(canvas, object, {
                x: 8,
                y: top,
            });
            top += 16;
        });

        object.dataInputs.forEach(function (graphVariable, index) {
            graphVariable.Resize(canvas, object, {
                x: 8,
                y: top,
            });
            top += 16;
        });

        top = 24;
        object.triggerOutputs.forEach(function (graphTrigger, index) {
            graphTrigger.Resize(canvas, object, {
                x: object.RoundRect.w - 16,
                y: top,
            });
            top += 16;
        });

        object.dataOutputs.forEach(function (graphVariable, index) {
            graphVariable.Resize(canvas, object, {
                x: object.RoundRect.w - 16,
                y: top,
            });
            top += 16;
        });
    }

    Draw(canvas) {
        let object = this;

        object.RoundRect.Draw(canvas);
        object.Text.Draw(canvas);

        object.triggerInputs.forEach(function (graphTrigger, index) {
            graphTrigger.Draw(canvas);
        });

        object.dataInputs.forEach(function (graphVariable, index) {
            graphVariable.Draw(canvas);
        });

        object.triggerOutputs.forEach(function (graphTrigger, index) {
            graphTrigger.Draw(canvas);
        });

        object.dataOutputs.forEach(function (graphVariable, index) {
            graphVariable.Draw(canvas);
        });
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
        object.triggerInputs = [
            new GraphTrigger({ name: 'enter', })
        ];
    }

    get Code() {
        return `break;`;
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
    }

}

class GraphNodeExit extends GraphNode {

    static {
        GraphNode.nodes.push(this);
        GraphNode.types[this.name] = this;
    }

    constructor(data = {}) {
        super(data);
        let object = this;
    }

    get Code() {
        return `return;`;
    }

}

class GraphNodeIf extends GraphNode {

    static {
        GraphNode.nodes.push(this);
        GraphNode.types[this.name] = this;
    }

    constructor(data = {}) {
        data.triggerInputs = [
            new GraphTrigger({ name: 'enter', }),
        ];
        data.triggerOutputs = [
            new GraphTrigger({ name: 'true', }),
            new GraphTrigger({ name: 'false', }),
        ];
        data.dataInputs = [
            new GraphVariable({ name: 'predicate', type: 'bool', value: false }),
        ];
        super(data);
        let object = this;
    }

}

class GraphNodeSwitch extends GraphNode {

    static {
        GraphNode.nodes.push(this);
        GraphNode.types[this.name] = this;
    }

    constructor(data = {}) {
        data.triggerInputs = [
            new GraphTrigger({ name: 'enter', }),
        ];
        super(data);
        let object = this;
    }

}

class GraphNodeFor extends GraphNode {

    static {
        GraphNode.nodes.push(this);
        GraphNode.types[this.name] = this;
    }

    constructor(data = {}) {
        data.triggerInputs = [
            new GraphTrigger({ name: 'enter', }),
        ];
        data.dataInputs = [
            new GraphVariable({ name: 'first', type: 'int', value: 0 }),
            new GraphVariable({ name: 'last', type: 'int', value: 10 }),
            new GraphVariable({ name: 'step', type: 'int', value: 1 }),
        ];
        data.triggerOutputs = [
            new GraphTrigger({ name: 'exit', }),
            new GraphTrigger({ name: 'body', }),
        ];
        data.dataOutputs = [
            new GraphVariable({ name: 'index', type: 'int' }),
        ];
        super(data);
        let object = this;
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
        data.triggerInputs = [
            new GraphTrigger({ name: 'enter', }),
        ];
        data.dataInputs = [
            new GraphVariable({ name: 'target', type: 'object', value: null }),
        ];
        data.triggerOutputs = [
            new GraphTrigger({ name: 'exit', }),
            new GraphTrigger({ name: 'body', }),
        ];
        data.dataOutputs = [
            new GraphVariable({ name: 'item', }),
            new GraphVariable({ name: 'index', }),
        ];
        super(data);
        let object = this;
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
        data.triggerInputs = [
            new GraphTrigger({ name: 'enter', }),
        ];
        data.dataInputs = [
            new GraphVariable({ name: 'predicate', type: 'bool', value: false }),
        ];
        data.triggerOutputs = [
            new GraphTrigger({ name: 'exit', }),
            new GraphTrigger({ name: 'body', }),
        ];
        super(data);
        let object = this;
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
        data.dataOutputs = [
            new GraphVariable({ name: 'this', type: 'object', value: null }),
        ];
        super(data);
        let object = this;
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
        data.dataInputs = [
            new GraphVariable({ name: 'target', type: 'object', value: null }),
            new GraphVariable({ name: 'member', type: 'string', value: 'variable' }),
        ];
        data.dataOutputs = [
            new GraphVariable({ name: 'value', type: 'mixed' }),
        ];
        super(data);
        let object = this;
    }

}

class GraphNodeSet extends GraphNode {

    static {
        GraphNode.nodes.push(this);
        GraphNode.types[this.name] = this;
    }

    constructor(data = {}) {
        data.triggerInputs = [
            new GraphTrigger({ name: 'enter' })
        ];
        data.triggerOutputs = [
            new GraphTrigger({ name: 'exit' })
        ];
        data.dataInputs = [
            new GraphVariable({ name: 'target', type: 'object', value: null }),
            new GraphVariable({ name: 'member', type: 'string', value: 'variable' }),
            new GraphVariable({ name: 'new value', type: 'mixed', value: '' }),
        ];
        data.dataOutputs = [
            new GraphVariable({ name: 'value', type: 'mixed' }),
        ];
        super(data);
        let object = this;
    }

}

class GraphNodeFunction extends GraphNode {

    static {
        GraphNode.nodes.push(this);
        GraphNode.types[this.name] = this;
    }

    constructor(data = {}) {
        data.dataInputs = [
            new GraphVariable({ name: 'function', type: 'object', value: null }),
        ];
        data.dataOutputs = [
            new GraphTrigger({ name: 'exit', }),
        ];
        super(data);
        let object = this;
    }

}

class GraphNodeMethod extends GraphNode {

    static {
        GraphNode.nodes.push(this);
        GraphNode.types[this.name] = this;
    }

    constructor(data = {}) {
        data.dataInputs = [
            new GraphVariable({ name: 'target', type: 'object', value: null }),
            new GraphVariable({ name: 'method', type: 'object', value: null }),
        ];
        data.dataOutputs = [
            new GraphTrigger({ name: 'exit', }),
        ];
        super(data);
        let object = this;
    }

}

class GraphNodeMath extends GraphNode {

    constructor(data = {}) {
        data.dataInputs = [
            new GraphVariable({ name: '0', type: 'mixed', value: null }),
        ];
        data.dataOutputs = [
            new GraphVariable({ name: 'value', type: 'mixed', value: null }),
        ];
        super(data);
        let object = this;
    }

}