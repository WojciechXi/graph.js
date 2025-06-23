class GraphFunction {

    static FromJson(data) {
        return new GraphFunction(data);
    }

    constructor(data = {}) {
        let object = this;
        object.id = data.id ?? guid();
        object.name = data.name ?? `Function`;

        object.triggerInputs = [];
        object.triggerOutputs = [];
        object.dataInputs = [];
        object.dataOutputs = [];

        object.graphProject = data.graphProject ?? null;
        if (object.graphProject) object.graphProjectId = object.graphProject.id;

        if (data.triggerInputs) {
            data.triggerInputs.forEach(function (triggerInput) {
                triggerInput.caller = object;
                if (triggerInput instanceof GraphTrigger) object.triggerInputs.push(triggerInput);
                else object.triggerInputs.push(GraphTrigger.FromJson(triggerInput));
            });
        }

        if (data.triggerOutputs) {
            data.triggerOutputs.forEach(function (triggerOutput) {
                triggerOutput.caller = object;
                if (triggerOutput instanceof GraphTrigger) object.triggerOutputs.push(triggerOutput);
                else object.triggerOutputs.push(GraphTrigger.FromJson(triggerOutput));
            });
        }

        if (data.dataInputs) {
            data.dataInputs.forEach(function (dataInput) {
                dataInput.caller = object;
                if (dataInput instanceof GraphVariable) object.dataInputs.push(dataInput);
                else object.dataInputs.push(GraphVariable.FromJson(dataInput));
            });
        }

        if (data.dataOutputs) {
            data.dataOutputs.forEach(function (dataOutput) {
                dataOutput.caller = object;
                if (dataOutput instanceof GraphVariable) object.dataOutputs.push(dataOutput);
                else object.dataOutputs.push(GraphVariable.FromJson(dataOutput));
            });
        }

        if (data.graph) {
            data.graph.graphFunction = object;
            if (data.graph instanceof FunctionGraph) object.graph = data.graph;
            else object.graph = FunctionGraph.FromJson(data.graph);
        } else {
            object.graph = new FunctionGraph({
                graphFunction: object,
            });
        }
    }

    toJson() {
        let object = this;
        return {
            id: object.id,
            name: object.name,
            graph: object.graph,

            triggerInputs: object.triggerInputs,
            triggerOutputs: object.triggerOutputs,

            dataInputs: object.dataInputs,
            dataOutputs: object.dataOutputs,
        };
    }

    get Code() {
        let object = this;
        let parts = [];
        parts.push(`function ${this.name}(data={}) {`);
        parts.push(`\tlet object = this;`);
        parts.push(object.graph.Code);
        parts.push(`}`);
        return parts.join(`\n`);
    }

}