class GraphProject {

    static FromJson(data) {
        return new GraphProject(data);
    }

    constructor(data = {}) {
        let object = this;
        object.id = data.id ?? guid();

        if (data.graphIndex instanceof GraphFunction) {
            object.graphIndex = data.graphIndex;
        } else if (data.graphIndex) {
            object.graphIndex = GraphFunction.FromJson(data.graphIndex);
        } else {
            object.graphIndex = new GraphFunction({
                name: 'index',
                graphProject: object,
                triggerInputs: [
                    new GraphTrigger({ name: 'enter' }),
                ],
            });
        }

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

    Run() {
        let object = this;
        object.graphIndex.Run(object);
    }

    toJson() {
        let object = this;
        return {
            id: object.id,
            graphIndex: object.graphIndex,
            graphClasses: object.graphClasses,
            graphFunctions: object.graphFunctions,
        };
    }

}