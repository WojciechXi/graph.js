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

        object.graph = data.graph ?? null;

        object.triggerInputs = [];
        object.triggerOutputs = [];

        object.dataInputs = [];
        object.dataOutputs = [];

        if (data.triggerInputs) {
            data.triggerInputs.forEach(function (graphTrigger) {
                graphTrigger.graphNode = object;
                graphTrigger.direction = 'input';
                if (graphTrigger instanceof GraphTrigger) object.triggerInputs.push(graphTrigger);
                else object.triggerInputs.push(GraphTrigger.FromJson(graphTrigger));
            });
        }

        if (data.triggerOutputs) {
            data.triggerOutputs.forEach(function (graphTrigger) {
                graphTrigger.graphNode = object;
                graphTrigger.direction = 'output';
                if (graphTrigger instanceof GraphTrigger) object.triggerOutputs.push(graphTrigger);
                else object.triggerOutputs.push(GraphTrigger.FromJson(graphTrigger));
            });
        }

        if (data.dataInputs) {
            data.dataInputs.forEach(function (graphVariable) {
                graphVariable.graphNode = object;
                graphVariable.direction = 'input';
                if (graphVariable instanceof GraphVariable) object.dataInputs.push(graphVariable);
                else object.dataInputs.push(GraphVariable.FromJson(graphVariable));
            });
        }

        if (data.dataOutputs) {
            data.dataOutputs.forEach(function (graphVariable) {
                graphVariable.graphNode = object;
                graphVariable.direction = 'output';
                if (graphVariable instanceof GraphVariable) object.dataOutputs.push(graphVariable);
                else object.dataOutputs.push(GraphVariable.FromJson(graphVariable));
            });
        }
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
        object.callerId = object.caller ? object.caller.id : null;

        if (object.caller) {
            if (object.triggerOutputs.length == 0) {
                object.caller.triggerInputs.forEach(function (trigger) {
                    let graphTriggerData = trigger.toJson();
                    graphTriggerData.id = null;
                    graphTriggerData.graphNode = object;
                    graphTriggerData.direction = 'output';

                    let graphTrigger = GraphTrigger.FromJson(graphTriggerData);
                    object.triggerOutputs.push(graphTrigger);
                });
            }

            if (object.dataOutputs.length == 0) {
                object.dataOutputs = [];
                object.caller.dataInputs.forEach(function (data) {
                    let graphVariableData = data.toJson();
                    graphVariableData.id = null;
                    graphVariableData.graphNode = object;
                    graphVariableData.direction = 'output';

                    let graphVariable = GraphVariable.FromJson(graphVariableData);
                    object.dataOutputs.push(graphVariable);
                });
            }
        }
    }

    toJson() {
        let json = super.toJson();
        let object = this;
        json.callerId = object.caller ? object.caller.id : null;
        json.triggerOutputs = object.triggerOutputs;
        json.dataOutputs = object.dataOutputs;
        return json;
    }

    get TriggerOutputs() {
        let object = this;
        return object.triggerOutputs;
    }

    get DataOutputs() {
        let object = this;
        return object.dataOutputs;
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
        object.callerId = object.caller ? object.caller.id : null;

        if (object.caller) {
            if (object.triggerInputs.length == 0) {
                object.caller.triggerOutputs.forEach(function (trigger) {
                    let graphTriggerData = trigger.toJson();
                    graphTriggerData.id = null;
                    graphTriggerData.graphNode = object;
                    graphTriggerData.direction = 'input';

                    let graphTrigger = GraphTrigger.FromJson(graphTriggerData);
                    object.triggerInputs.push(graphTrigger);
                });
            }

            if (object.dataInputs.length == 0) {
                object.dataInputs = [];
                object.caller.dataOutputs.forEach(function (data) {
                    let graphVariableData = data.toJson();
                    graphVariableData.id = null;
                    graphVariableData.graphNode = object;
                    graphVariableData.direction = 'input';

                    let graphVariable = GraphVariable.FromJson(graphVariableData);
                    object.dataInputs.push(graphVariable);
                });
            }
        }
    }

    toJson() {
        let json = super.toJson();
        let object = this;
        json.callerId = object.caller ? object.caller.id : null;
        json.triggerInputs = object.triggerInputs;
        json.dataInputs = object.dataInputs;
        return json;
    }

    get TriggerInputs() {
        let object = this;
        return object.triggerInputs;
    }

    get DataInputs() {
        let object = this;
        return object.dataInputs;
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
        if (!object.triggerInputs.length) object.triggerInputs = [new GraphTrigger({ name: 'enter' })];
    }

    toJson() {
        let json = super.toJson();
        let object = this;
        json.triggerInputs = object.triggerInputs;
        return json;
    }

    get TriggerInputs() {
        let object = this;
        return object.triggerInputs;
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
        if (!object.triggerInputs.length) object.triggerInputs = [
            new GraphTrigger({ name: 'enter', }),
        ];
        if (!object.triggerOutputs.length) object.triggerOutputs = [
            new GraphTrigger({ name: 'true', direction: 'output', }),
            new GraphTrigger({ name: 'false', direction: 'output', }),
        ];
        if (!object.dataInputs.length) object.dataInputs = [
            new GraphVariable({ name: 'predicate', type: 'bool', value: false }),
        ];
    }

    toJson() {
        let json = super.toJson();
        let object = this;
        json.triggerInputs = object.triggerInputs;
        json.triggerOutputs = object.triggerOutputs;
        json.dataInputs = object.dataInputs;
        return json;
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
        if (!object.triggerInputs.length) object.triggerInputs = [
            new GraphTrigger({ name: 'enter', }),
        ];
    }

    toJson() {
        let json = super.toJson();
        let object = this;
        json.triggerInputs = object.triggerInputs;
        return json;
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
        if (!object.triggerInputs.length) object.triggerInputs = [
            new GraphTrigger({ name: 'enter', }),
        ];
        if (!object.dataInputs.length) object.dataInputs = [
            new GraphVariable({ name: 'first', type: 'int', value: 0 }),
            new GraphVariable({ name: 'last', type: 'int', value: 10 }),
            new GraphVariable({ name: 'step', type: 'int', value: 1 }),
        ];
        if (!object.triggerOutputs.length) object.triggerOutputs = [
            new GraphTrigger({ name: 'exit', direction: 'output', }),
            new GraphTrigger({ name: 'body', direction: 'output', }),
        ];
        if (!object.dataOutputs.length) object.dataOutputs = [
            new GraphVariable({ name: 'index', direction: 'output', type: 'int' }),
        ];
    }

    toJson() {
        let json = super.toJson();
        let object = this;
        json.triggerInputs = object.triggerInputs;
        json.dataInputs = object.dataInputs;
        json.triggerOutputs = object.triggerOutputs;
        json.dataOutputs = object.dataOutputs;
        return json;
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

class GraphNodeForEach extends GraphNode {

    static {
        GraphNode.nodes.push(this);
        GraphNode.types[this.name] = this;
    }

    constructor(data = {}) {
        super(data);
        let object = this;
        if (!object.triggerInputs.length) object.triggerInputs = [
            new GraphTrigger({ name: 'enter', }),
        ];
        if (!object.dataInputs.length) object.dataInputs = [
            new GraphVariable({ name: 'target', type: 'object', value: null }),
        ];
        if (!object.triggerOutputs.length) object.triggerOutputs = [
            new GraphTrigger({ name: 'exit', direction: 'output', }),
            new GraphTrigger({ name: 'body', direction: 'output', }),
        ];
        if (!object.dataOutputs.length) object.dataOutputs = [
            new GraphVariable({ name: 'item', direction: 'output', }),
            new GraphVariable({ name: 'index', direction: 'output', }),
        ];
    }

    toJson() {
        let json = super.toJson();
        let object = this;
        json.triggerInputs = object.triggerInputs;
        json.dataInputs = object.dataInputs;
        json.triggerOutputs = object.triggerOutputs;
        json.dataOutputs = object.dataOutputs;
        return json;
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

class GraphNodeWhile extends GraphNode {

    static {
        GraphNode.nodes.push(this);
        GraphNode.types[this.name] = this;
    }

    constructor(data = {}) {
        super(data);
        let object = this;
        if (!object.triggerInputs.length) object.triggerInputs = [
            new GraphTrigger({ name: 'enter', }),
        ];
        if (!object.dataInputs.length) object.dataInputs = [
            new GraphVariable({ name: 'predicate', type: 'bool', value: false }),
        ];
        if (!object.triggerOutputs.length) object.triggerOutputs = [
            new GraphTrigger({ name: 'exit', direction: 'output', }),
            new GraphTrigger({ name: 'body', direction: 'output', }),
        ];
    }

    toJson() {
        let json = super.toJson();
        let object = this;
        json.triggerInputs = object.triggerInputs;
        json.dataInputs = object.dataInputs;
        json.triggerOutputs = object.triggerOutputs;
        return json;
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

class GraphNodeThis extends GraphNode {

    static {
        GraphNode.nodes.push(this);
        GraphNode.types[this.name] = this;
    }

    constructor(data = {}) {
        super(data);
        let object = this;
        if (!object.dataOutputs.length) object.dataOutputs = [
            new GraphVariable({ name: 'this', direction: 'output', type: 'object', value: null }),
        ];
    }

    toJson() {
        let json = super.toJson();
        let object = this;
        json.dataOutputs = object.dataOutputs;
        return json;
    }

    get DataOutputs() {
        let object = this;
        return object.dataOutputs;
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
        if (!object.dataInputs.length) object.dataInputs = [
            new GraphVariable({ name: 'target', type: 'object', value: null }),
            new GraphVariable({ name: 'member', type: 'string', value: 'variable' }),
        ];
        if (!object.dataOutputs.length) object.dataOutputs = [
            new GraphVariable({ name: 'value', direction: 'output', type: 'mixed' }),
        ];
    }

    toJson() {
        let json = super.toJson();
        let object = this;
        json.dataInputs = object.dataInputs;
        json.dataOutputs = object.dataOutputs;
        return json;
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
        if (!object.triggerInputs.length) object.triggerInputs = [
            new GraphTrigger({ name: 'enter', })
        ];
        if (!object.triggerOutputs.length) object.triggerOutputs = [
            new GraphTrigger({ name: 'exit', direction: 'output', })
        ];
        if (!object.dataInputs.length) object.dataInputs = [
            new GraphVariable({ name: 'target', type: 'object', value: null }),
            new GraphVariable({ name: 'member', type: 'string', value: 'variable' }),
            new GraphVariable({ name: 'new value', type: 'mixed', value: '' }),
        ];
        if (!object.dataOutputs.length) object.dataOutputs = [
            new GraphVariable({ name: 'value', direction: 'output', type: 'mixed' }),
        ];
    }

    toJson() {
        let json = super.toJson();
        let object = this;
        json.triggerInputs = object.triggerInputs;
        json.triggerOutputs = object.triggerOutputs;
        json.dataInputs = object.dataInputs;
        json.dataOutputs = object.dataOutputs;
        return json;
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
        if (!object.dataInputs.length) object.dataInputs = [
            new GraphVariable({ name: 'function', type: 'object', value: null }),
        ];
        if (!object.dataOutputs.length) object.dataOutputs = [
            new GraphTrigger({ name: 'exit', direction: 'output', }),
        ];
    }

    toJson() {
        let json = super.toJson();
        let object = this;
        json.dataInputs = object.dataInputs;
        json.dataOutputs = object.dataOutputs;
        return json;
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

        if (!object.dataInputs.length) object.dataInputs = [
            new GraphVariable({ name: 'target', type: 'object', value: null }),
            new GraphVariable({ name: 'method', type: 'object', value: null }),
        ];

        if (!object.dataOutputs.length) object.dataOutputs = [
            new GraphTrigger({ name: 'exit', direction: 'output', }),
        ];
    }

    toJson() {
        let json = super.toJson();
        let object = this;
        json.triggerInputs = object.triggerInputs;
        json.triggerOutputs = object.triggerOutputs;
        json.dataInputs = object.dataInputs;
        json.dataOutputs = object.dataOutputs;
        return json;
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

class GraphNodeEquals extends GraphNode {

    static {
        GraphNode.nodes.push(this);
        GraphNode.types[this.name] = this;
    }

    constructor(data = {}) {
        super(data);
        let object = this;
        if (!object.dataInputs.length) object.dataInputs = [
            new GraphVariable({ name: 'a', type: 'mixed', value: null }),
            new GraphVariable({ name: 'b', type: 'mixed', value: null }),
        ];
        if (!object.dataOutputs.length) object.dataOutputs = [
            new GraphVariable({ name: 'equals', direction: 'output', type: 'bool', value: false }),
        ];
    }

    toJson() {
        let json = super.toJson();
        let object = this;
        json.dataInputs = object.dataInputs;
        json.dataOutputs = object.dataOutputs;
        return json;
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
        if (!object.dataInputs.length) object.dataInputs = [
            new GraphVariable({ name: '0', type: 'mixed', value: null }),
        ];
        if (!object.dataOutputs.length) object.dataOutputs = [
            new GraphVariable({ name: 'value', direction: 'output', type: 'mixed', value: null }),
        ];
    }

    toJson() {
        let json = super.toJson();
        let object = this;
        json.dataInputs = object.dataInputs;
        json.dataOutputs = object.dataOutputs;
        return json;
    }

}

class GraphNodeString extends GraphNode {

    static {
        GraphNode.nodes.push(this);
        GraphNode.types[this.name] = this;
    }

    constructor(data = {}) {
        super(data);
        let object = this;
        object.value = data.value ?? '';
        if (!object.dataOutputs.length) object.dataOutputs = [
            new GraphVariable({ name: 'value', direction: 'output', type: 'string', value: '' }),
        ];
    }

    get ValueText() {
        let object = this;
        return object.valueText ?? (object.valueText = new Text({ text: object.value }));
    }

    Resize(canvas) {
        super.Resize(canvas);
        let object = this;
        object.ValueText.x = object.x + 8;
        object.ValueText.y = object.y + 32;
    }

    Draw(canvas) {
        super.Draw(canvas);
        let object = this;
        object.ValueText.text = object.value;
        object.ValueText.Draw(canvas);
    }

    toJson() {
        let json = super.toJson();
        let object = this;
        json.value = object.value;
        json.dataOutputs = object.dataOutputs;
        return json;
    }

    get DataOutputs() {
        let object = this;
        return object.dataOutputs;
    }

}