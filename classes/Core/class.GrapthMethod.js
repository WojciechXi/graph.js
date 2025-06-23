class GraphMethod {

    static FromJson(data = {}) {
        if (data.graph) data.graph = MethodGraph.FromJson(data.graph);
        return new GraphMethod(data);
    }

    constructor(data = {}) {
        let object = this;
        object.id = data.id ?? guid();
        object.name = data.name ?? 'Method';

        object.triggerInputs = data.triggerInputs ?? [];
        object.triggerOutputs = data.triggerOutputs ?? [];
        object.dataInputs = data.dataInputs ?? [];
        object.dataOutputs = data.dataOutputs ?? [];

        if (data.graph) {
            data.graph.graphMethod = object;
            if (data.graph instanceof MethodGraph) object.graph = data.graph;
            else object.graph = MethodGraph.FromJson(data.graph);
        } else {
            object.graph = new MethodGraph({
                graphMethod: object,
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
        let parts = [`\t${object.name}(data = {}) {`];
        parts.push(`\t\tlet object = this;`);
        parts.push(object.graph.Code);
        parts.push(`\t}`);
        return parts.join(`\n\n`);
    }

}