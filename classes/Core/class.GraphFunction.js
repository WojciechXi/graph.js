class GraphFunction {

    static FromJson(data) {
        if (data.graph) data.graph = FunctionGraph.FromJson(data.graph);
        return new GraphFunction(data);
    }

    constructor(data = {}) {
        let object = this;
        object.id = data.id ?? guid();
        object.name = data.name ?? `Function`;
        object.triggerInputs = data.triggerInputs ?? [];
        object.triggerOutputs = data.triggerOutputs ?? [];
        object.dataInputs = data.dataInputs ?? [];
        object.dataOutputs = data.dataOutputs ?? [];
        object.graph = data.graph ?? new FunctionGraph({
            graphFunction: object,
        });
    }

    toJson() {
        let object = this;
        return {
            id: object.id,
            name: object.name,
            graph: object.graph,
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