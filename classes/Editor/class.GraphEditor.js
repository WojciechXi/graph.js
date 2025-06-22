class GraphEditor {

    constructor(data = {}) {
        let object = this;
        object.id = guid();
        object.graphProject = data.graphProject ?? new GraphProject();

        object.dragItem = null;

        object.graphFunction = null;
        object.graphClass = null;
        object.graphMethod = null;
        object.graphVariable = null;
        object.graph = null;

        object.Selection = null;
    }

    Save() {
        let object = this;
        console.log(JSON.stringify(object.graphProject, function (key, value) {
            if (value instanceof Object && value.toJson) return value.toJson();
            return value;
        }));
    }

    set Selection(selection) {
        let object = this;
        object.selection = selection;
        object.GraphEditorInspector.Target = object.selection;

        if (object.selection instanceof GraphFunction) {
            object.graph = object.selection.graph;
            object.graphFunction = object.selection;
            object.graphClass = null;
            object.graphMethod = null;
            object.graphVariable = null;
        } else if (object.selection instanceof GraphClass) {
            object.graph = null;
            object.graphFunction = null;
            object.graphClass = object.selection;
            object.graphMethod = null;
            object.graphVariable = null;
        } else if (object.selection instanceof GraphMethod) {
            object.graph = object.selection.graph;
            object.graphMethod = object.selection;
            object.graphVariable = null;
        } else if (object.selection instanceof GraphVariable) {
            object.graph = null;
            object.graphMethod = null;
            object.graphVariable = object.selection;
        }

        object.Refresh();
    }

    Refresh() {
        let object = this;
        object.GraphFunctionList.content = object.graphProject.graphFunctions;
        object.GraphClassList.content = object.graphProject.graphClasses;
        object.GraphMethodList.content = object.graphClass ? object.graphClass.graphMethods : null;
        object.GraphVariableList.content = object.graphClass ? object.graphClass.graphVariables : null;

        object.Main.content = object.graph ? object.graph.Root : null;
    }

    get Root() {
        let object = this;
        return object.root ?? (object.root = el({
            css: {
                display: 'flex',
                width: '100%',
                height: '100%',
            },
            content: [
                el({
                    css: {
                        display: 'flex',
                        flexDirection: 'column',
                        width: '270px',
                        height: '100%',
                        overflow: 'auto',
                    },
                    content: [
                        el({
                            tag: 'a',
                            class: ['button'],
                            content: 'Nowa funkcja',
                            event: {
                                click: function (event) {
                                    let graphFunction = new GraphFunction();
                                    object.graphProject.graphFunctions.push(graphFunction);
                                    object.Selection = graphFunction;
                                },
                            },
                        }),
                        object.GraphFunctionList,
                        el({
                            tag: 'a',
                            class: ['button'],
                            content: 'Nowa klasa',
                            event: {
                                click: function (event) {
                                    let graphClass = new GraphClass();
                                    object.graphProject.graphClasses.push(graphClass);
                                    object.Selection = graphClass;
                                },
                            },
                        }),
                        object.GraphClassList,
                        el({
                            tag: 'a',
                            class: ['button'],
                            content: 'Nowa metoda',
                            event: {
                                click: function (event) {
                                    if (!object.graphClass) return;
                                    let graphMethod = new GraphMethod();
                                    object.graphClass.graphMethods.push(graphMethod);
                                    object.Selection = graphMethod;
                                },
                            },
                        }),
                        object.GraphMethodList,
                        el({
                            tag: 'a',
                            class: ['button'],
                            content: 'Nowa zmienna',
                            event: {
                                click: function (event) {
                                    if (!object.graphClass) return;
                                    let graphVariable = new GraphVariable();
                                    object.graphClass.graphVariables.push(graphVariable);
                                    object.Selection = graphVariable;
                                },
                            },
                        }),
                        object.GraphVariableList,
                    ],
                }),
                el({
                    css: {
                        flexGrow: 1,
                        width: '0%',
                        height: '100%',
                        position: 'relative',
                        overflow: 'hidden',
                    },
                    content: [
                        object.Main,
                    ],
                }),
                el({
                    css: {
                        display: 'flex',
                        flexDirection: 'column',
                        width: '270px',
                        height: '100%',
                    },
                    content: [
                        object.GraphEditorInspector.Root,
                    ],
                }),
            ],
        }));
    }

    get GraphFunctionList() {
        let object = this;
        return object.graphFunctionList ?? (object.graphFunctionList = el({
            contentLoop: function (graphFunction, index) {
                return el({
                    tag: 'a',
                    class: ['button'],
                    content: graphFunction.name,
                    event: {
                        click: function (event) {
                            object.graphFunction = graphFunction;
                            object.Refresh();

                            object.Selection = graphFunction;
                        },
                    },
                });
            },
        }));
    }

    get GraphClassList() {
        let object = this;
        return object.graphClassList ?? (object.graphClassList = el({
            contentLoop: function (graphClass, index) {
                return el({
                    tag: 'a',
                    class: ['button'],
                    content: graphClass.name,
                    event: {
                        click: function (event) {
                            object.graphClass = graphClass;
                            object.Refresh();

                            object.Selection = graphClass;
                        },
                    },
                });
            },
        }));
    }

    get GraphMethodList() {
        let object = this;
        return object.graphMethodList ?? (object.graphMethodList = el({
            contentLoop: function (graphMethod, index) {
                return el({
                    tag: 'a',
                    class: ['button'],
                    content: graphMethod.name,
                    event: {
                        click: function (event) {
                            object.Selection = graphMethod;
                        },
                    },
                });
            },
        }));
    }

    get GraphVariableList() {
        let object = this;
        return object.graphVariableList ?? (object.graphVariableList = el({
            contentLoop: function (graphVariable, index) {
                return el({
                    tag: 'a',
                    class: ['button'],
                    content: graphVariable.name,
                    event: {
                        click: function (event) {
                            object.Selection = graphVariable;
                        },
                    },
                });
            },
        }));
    }

    get Main() {
        let object = this;
        return object.main ?? (object.main = el({
            css: {
                position: 'relative',
                width: '100%',
                height: '100%',
            },
        }));
    }

    get GraphEditorInspector() {
        let object = this;
        return object.graphEditorInspector ?? (object.graphEditorInspector = new GraphEditorInspector());
    }

}