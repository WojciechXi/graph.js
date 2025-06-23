class GraphFunction {

    static FromJson(data) {
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