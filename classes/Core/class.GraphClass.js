class GraphClass {

    static FromJson(data) {
        return new GraphClass(data);
    }

    constructor(data = {}) {
        let object = this;
        object.id = data.id ?? guid();
        object.name = data.name ?? `Class`;
        object.parent = data.parent ?? null;

        object.graphVariables = [];
        object.graphMethods = [];

        data.graphVariables.forEach(function (graphVariable) {

        });
        data.graphMethods.forEach(function (graphMethod) {

        });
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