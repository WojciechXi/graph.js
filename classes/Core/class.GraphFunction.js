class GraphFunction {

    static FromJson(data) {
        data.graph = Graph.FromJson(data.graph);
        return new GraphProject(data);
    }

    constructor(data = {}) {
        let object = this;
        object.id = data.id ?? guid();
        object.name = data.name ?? `Function`;

        object.graph = data.graph ?? new Graph();
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
        return parts.join(`\n\n`);
    }

}