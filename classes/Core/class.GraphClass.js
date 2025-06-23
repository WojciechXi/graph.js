class GraphClass {

    static FromJson(data) {
        data.graphVariables.forEach(function (graphClass, index) {
            data.graphVariables[index] = GraphClass.FromJson(graphClass);
        });
        data.graphMethods.forEach(function (graphFunction, index) {
            data.graphMethods[index] = GraphFunction.FromJson(graphFunction);
        });
        return new GraphProject(data);
    }

    constructor(data = {}) {
        let object = this;
        object.id = data.id ?? guid();
        object.name = data.name ?? `Class`;
        object.parent = data.parent ?? null;

        object.graphVariables = data.graphVariables ?? [];
        object.graphMethods = data.graphMethods ?? [];
    }

    toJson() {
        let object = this;
        return {
            id: object.id,
            name: object.name,
            graphVariables: object.graphVariables,
            graphMethods: object.graphMethods,
        };
    }

    AddGraphVariable(name) {
        let graphVariable = new GraphVariable({
            graphClass: this,
            name: name,
        });

        object.graphMethods.push(graphVariable);

        return graphVariable;
    }

    AddGraphMethod(name) {
        let graphMethod = new GraphMethod({
            graphClass: this,
            name: name,
        });

        object.graphMethods.push(graphMethod);

        return graphMethod;
    }

    get Code() {
        let object = this;
        let parts = [`class ${object.name} {`];
        for (let graphVariable of object.graphVariables) parts.push(graphVariable.Code);
        for (let graphMethod of object.graphMethods) parts.push(graphMethod.Code);
        parts.push(`}`);
        return parts.join(`\n\n`);
    }

}