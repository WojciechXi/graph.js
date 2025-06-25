

class GraphNodeConsoleLog extends GraphNode {

    static {
        GraphNode.nodes.push(this);
        GraphNode.types[this.name] = this;
    }

    constructor(data = {}) {
        super(data);
        let object = this;
        if (!object.triggerInputs.length) object.triggerInputs = [new GraphTrigger({ name: 'enter' })];
        if (!object.dataInputs.length) object.dataInputs = [
            new GraphVariable({ name: 'value', type: 'mixed', value: null }),
        ];

        if (!object.triggerOutputs.length) object.triggerOutputs = [new GraphTrigger({ name: 'exit' })];
    }

    Run(graphProject, triggerOutput) {
        let object = this;

        let triggerEnter = null;
        let dataValue = null;

        let triggerExit = null;

        for (let trigger of object.TriggerInputs) {
            if (trigger.name == 'enter') triggerEnter = trigger;
        }

        for (let data of object.DataInputs) {
            if (data.name == 'value') dataValue = data;
        }

        for (let trigger of object.TriggerOutputs) {
            if (trigger.name == 'exit') triggerExit = trigger;
        }

        for (let connection of object.graph.FindConnections(dataValue.id)) {
            if (connection.input == dataValue) {
                dataValue.value = connection.output.graphNode.Get(graphProject, connection.output);
            } else if (connection.output == dataValue) {
                dataValue.value = connection.input.graphNode.Get(graphProject, connection.input);
            }
        }

        console.log(dataValue.value);

        for (let connection of object.graph.FindConnections(triggerExit.id)) {
            if (connection.input == triggerExit) {
                connection.output.graphNode.Run(graphProject, connection.output);
            } else if (connection.output == triggerExit) {
                connection.input.graphNode.Run(graphProject, connection.input);
            }
        }
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

    get DataInputs() {
        let object = this;
        return object.dataInputs;
    }

    get TriggerOutputs() {
        let object = this;
        return object.triggerOutputs;
    }

}