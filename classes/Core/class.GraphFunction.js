class GraphFunction {

    static FromJson(data) {
        console.log(data);
        if (data.graph) data.graph = Graph.FromJson(data.graph);
        return new GraphFunction(data);
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
        parts.push(`function ${this.name}(data={}) {`);
        parts.push(`\tlet object = this;`);
        parts.push(object.graph.Code);
        parts.push(`}`);
        return parts.join(`\n`);
    }

}