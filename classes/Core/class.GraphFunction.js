class GraphFunction {

    constructor(data = {}) {
        let object = this;
        object.id = guid();
        object.name = `Function`;

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