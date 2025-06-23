class GraphProject {

    static FromJson(data) {
        data.graphClasses.forEach(function (graphClass, index) {
            data.graphClasses[index] = GraphClass.FromJson(graphClass);
        });

        data.graphFunctions.forEach(function (graphFunction, index) {
            data.graphFunctions[index] = GraphFunction.FromJson(graphFunction);
        });

        return new GraphProject(data);
    }

    constructor(data = {}) {
        let object = this;
        object.id = data.id ?? guid();
        object.graphClasses = data.graphClasses ?? [];
        object.graphFunctions = data.graphFunctions ?? [];
    }

    toJson() {
        let object = this;
        return {
            id: object.id,
            graphClasses: object.graphClasses,
            graphFunctions: object.graphFunctions,
        };
    }

    get Code() {
        let object = this;
        let parts = [];

        for (let graphClass of object.graphClasses) parts.push(graphClass.Code);

        return parts.join(`\n\n`);
    }

}