class GraphProject {

    constructor(data = {}) {
        let object = this;
        object.id = guid();
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