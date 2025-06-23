class GraphProject {

    static FromJson(data) {
        return new GraphProject(data);
    }

    constructor(data = {}) {
        let object = this;
        object.id = data.id ?? guid();

        object.graphClasses = [];
        object.graphFunctions = [];

        if (data.graphClasses) {
            data.graphClasses.forEach(function (graphClass) {
                graphClass.graphProject = object;
                if (graphClass instanceof GraphClass) object.graphClasses.push(graphClass);
                else object.graphClasses.push(GraphClass.FromJson(graphClass));
            })
        }

        if (data.graphFunctions) {
            data.graphFunctions.forEach(function (graphFunction) {
                graphFunction.graphProject = object;
                if (graphFunction instanceof GraphFunction) object.graphFunctions.push(graphFunction);
                else object.graphFunctions.push(GraphFunction.FromJson(graphFunction));
            })
        }
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

        for (let graphFunction of object.graphFunctions) parts.push(graphFunction.Code);
        for (let graphClass of object.graphClasses) parts.push(graphClass.Code);

        return parts.join(`\n\n`);
    }

}