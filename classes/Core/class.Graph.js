class Graph {

    static FromJson(data = {}) {
        return new this(data);
    }

    constructor(data = {}) {
        let object = this;
        object.id = data.id ?? guid();

        object.nodes = [];
        object.connections = [];
    }

    get TriggerInputs() {
        return [];
    }

    get TriggerOutputs() {
        return [];
    }

    get DataInputs() {
        return [];
    }

    get DataOutputs() {
        return [];
    }

    toJson() {
        let object = this;
        return {
            id: object.id,
            nodes: object.nodes,
            connections: object.connections,
        };
    }

    get Code() {
        let object = this;
        let parts = [];

        for (let node of object.nodes) {
            if (node instanceof GraphNodeEnter) {
                parts.push(node.GetCode(object));
                break;
            }
        }

        return parts.join(`\n`)
    }

    get Root() {
        let object = this;
        return object.root ?? (object.root = el({
            tag: 'canvas',
            css: {
                width: '100%',
                height: '100%',
            },
            callback: function (view) {
                object.canvas = new Canvas({
                    canvas: view
                });
            },
            event: {
                mousedown: function (event) {
                    let mousePosition = {
                        x: event.clientX,
                        y: event.clientY,
                    };

                    object.mouseOrigin = mousePosition;

                    object.origin = {
                        x: object.canvas.x,
                        y: object.canvas.y,
                    };

                    for (let node of object.nodes) {
                        if (node.hover) {
                            let dragItem = null;
                            if (node.TriggerInputs) {
                                for (let item of node.TriggerInputs) {
                                    if (item.hover) {
                                        dragItem = item;
                                        break;
                                    }
                                }
                            }

                            if (!dragItem && node.TriggerOutputs) {
                                for (let item of node.TriggerOutputs) {
                                    if (item.hover) {
                                        dragItem = item;
                                        break;
                                    }
                                }
                            }

                            if (!dragItem && node.DataInputs) {
                                for (let item of node.DataInputs) {
                                    if (item.hover) {
                                        dragItem = item;
                                        break;
                                    }
                                }
                            }

                            if (!dragItem && node.DataOutputs) {
                                for (let item of node.DataOutputs) {
                                    if (item.hover) {
                                        dragItem = item;
                                        break;
                                    }
                                }
                            }

                            if (dragItem) {
                                object.item = dragItem;
                                object.drag = true;
                                object.originItem = {
                                    x: dragItem.x,
                                    y: dragItem.y,
                                }

                                object.line = new Line({
                                    a: dragItem.x + 4,
                                    b: dragItem.y + 4,
                                    x: 100,
                                    y: 100,
                                });

                                return object.Render();
                            } else {
                                object.item = node;
                                object.drag = true;
                                object.originItem = {
                                    x: node.x,
                                    y: node.y,
                                }

                                GraphEditor.Instance.Selection = object.item;

                                return object.Render();
                            }
                        }
                    }

                    object.drag = true;
                },
                mousemove: function (event) {
                    let rect = this.getBoundingClientRect();

                    let mousePosition = {
                        x: event.clientX,
                        y: event.clientY,
                    };

                    let pointer = {
                        x: (mousePosition.x - rect.x) - object.canvas.xCenter,
                        y: (mousePosition.y - rect.y) - object.canvas.yCenter,
                    };

                    if (object.drag) {
                        let mouseDelta = {
                            x: mousePosition.x - object.mouseOrigin.x,
                            y: mousePosition.y - object.mouseOrigin.y,
                        };

                        if (object.line) {
                            object.line.x = pointer.x;
                            object.line.y = pointer.y;
                        } else if (object.item instanceof GraphNode) {
                            object.item.x = object.originItem.x + mouseDelta.x;
                            object.item.y = object.originItem.y + mouseDelta.y;
                        } else {
                            object.canvas.x = object.origin.x + mouseDelta.x;
                            object.canvas.y = object.origin.y + mouseDelta.y;
                        }
                    }

                    object.Update(pointer);
                    object.Render();
                },
                mouseup: function (event) {
                    if (object.line) {
                        for (let node of object.nodes) {
                            if (!node.hover) continue;

                            if (node.TriggerInputs) {
                                for (let triggerInput of node.TriggerInputs) {
                                    if (!triggerInput.hover) continue;

                                    let graphConnection = new GraphConnection({
                                        input: object.item,
                                        output: triggerInput,
                                    });

                                    object.connections.push(graphConnection);

                                    break;
                                }
                            }

                            if (node.TriggerOutputs) {
                                for (let triggerOutput of node.TriggerOutputs) {
                                    if (!triggerOutput.hover) continue;

                                    let graphConnection = new GraphConnection({
                                        input: object.item,
                                        output: triggerOutput,
                                    });

                                    object.connections.push(graphConnection);

                                    break;
                                }
                            }

                            if (node.DataInputs) {
                                for (let dataInput of node.DataInputs) {
                                    if (!dataInput.hover) continue;

                                    let graphConnection = new GraphConnection({
                                        input: object.item,
                                        output: dataInput,
                                    });

                                    object.connections.push(graphConnection);

                                    break;
                                }
                            }

                            if (node.DataOutputs) {
                                for (let dataOutput of node.DataOutputs) {
                                    if (!dataOutput.hover) continue;

                                    let graphConnection = new GraphConnection({
                                        input: object.item,
                                        output: dataOutput,
                                    });

                                    object.connections.push(graphConnection);

                                    break;
                                }
                            }

                            break;
                        }
                    }

                    object.item = null;
                    object.line = null;
                    object.drag = false;

                    object.Render();
                },
                contextmenu: function (event) {
                    event.preventDefault();
                    if (event.target == object.Root) {
                        for (let node of object.nodes) {
                            if (node.hover) {
                                let index = object.nodes.indexOf(node);
                                object.nodes.splice(index, 1);
                                return object.Render();
                            }
                        }

                        GraphNode.nodes.forEach(function (graphNodeType, index) {
                            let y = Math.floor(index / 9);
                            let x = index - y * 9;
                            let graphNode = new graphNodeType({
                                x: x * 200,
                                y: y * 200,
                            });
                            object.nodes.push(graphNode);
                        });

                        object.Render();
                    }
                },
            },
        }));
    }

    Update(pointer) {
        let object = this;

        object.nodes.forEach(function (node) {
            node.Update(object.canvas, pointer);
        });
    }

    Render() {
        let object = this;
        object.Root.width = object.Root.clientWidth;
        object.Root.height = object.Root.clientHeight;

        object.canvas.Clear();

        object.nodes.forEach(function (node) {
            node.Resize(object.canvas);
        });

        object.connections.forEach(function (connection) {
            connection.Resize(object.canvas);
        });

        object.nodes.forEach(function (node) {
            node.Draw(object.canvas);
        });

        object.connections.forEach(function (connection) {
            connection.Draw(object.canvas);
        });

        if (object.line) object.line.Draw(object.canvas);
    }

}

class FunctionGraph extends Graph {

    static FromJson(data = {}) {
        return new this(data);
    }

    constructor(data = {}) {
        super(data);
        let object = this;
        object.graphFunction = data.graphFunction ?? null;

        if (data.nodes) {
            data.nodes.forEach(function (node) {
                node.graph = object;
                node.caller = object.graphFunction;
                if (node instanceof GraphNode) object.nodes.push(node);
                else object.nodes.push(GraphNode.FromJson(node));
            });
        } else {
            object.nodes = data.nodes ?? [
                new GraphNodeEnter({ caller: object.graphFunction, }),
                new GraphNodeReturn({ caller: object.graphFunction, })
            ];
        }

        if (data.connections) {
            data.connections.forEach(function (connection) {
                connection.graph = object;
                object.nodes.forEach(function (node) {
                    if (node.DataInputs) node.DataInputs.forEach(function (dataInput) {
                        if (dataInput.id == connection.inputId) connection.input = dataInput;
                        if (dataInput.id == connection.outputId) connection.output = dataInput;
                    });
                    if (node.DataOutputs) node.DataOutputs.forEach(function (dataOutput) {
                        if (dataOutput.id == connection.inputId) connection.input = dataOutput;
                        if (dataOutput.id == connection.outputId) connection.output = dataOutput;
                    });
                    if (node.TriggerInputs) node.TriggerInputs.forEach(function (triggerInput) {
                        if (triggerInput.id == connection.inputId) connection.input = triggerInput;
                        if (triggerInput.id == connection.outputId) connection.output = triggerInput;
                    });
                    if (node.TriggerOutputs) node.TriggerOutputs.forEach(function (triggerOutput) {
                        if (triggerOutput.id == connection.inputId) connection.input = triggerOutput;
                        if (triggerOutput.id == connection.outputId) connection.output = triggerOutput;
                    });
                });

                if (connection instanceof GraphConnection) object.connections.push(connection);
                else object.connections.push(GraphConnection.FromJson(connection, object));
            });
        }
    }

    get TriggerInputs() {
        return object.graphFunction.triggerInputs;
    }

    get TriggerOutputs() {
        return object.graphFunction.triggerOutputs;
    }

    get DataInputs() {
        return object.graphFunction.dataInputs;
    }

    get DataOutputs() {
        return object.graphFunction.dataOutputs;
    }

}

class MethodGraph extends Graph {

    static FromJson(data = {}) {
        return new this(data);
    }

    constructor(data = {}) {
        super(data);
        let object = this;
        object.graphMethod = data.graphMethod ?? null;

        if (data.nodes) {
            data.nodes.forEach(function (node) {
                node.graph = object;
                node.caller = object.graphMethod;
                if (node instanceof GraphNode) object.nodes.push(node);
                else object.nodes.push(GraphNode.FromJson(node));
            });
        } else {
            object.nodes = data.nodes ?? [
                new GraphNodeEnter({ caller: object.graphMethod, }),
                new GraphNodeReturn({ caller: object.graphMethod, })
            ];
        }

        if (data.connections) {
            data.connections.forEach(function (connection) {
                connection.graph = object;
                object.nodes.forEach(function (node) {
                    node.dataInputs.forEach(function (dataInput) {
                        if (dataInput.id == connection.inputId) connection.input = dataInput;
                        if (dataInput.id == connection.outputId) connection.output = dataInput;
                    });
                    node.dataOutputs.forEach(function (dataOutput) {
                        if (dataOutput.id == connection.inputId) connection.input = dataOutput;
                        if (dataOutput.id == connection.outputId) connection.output = dataOutput;
                    });
                    node.triggerInputs.forEach(function (triggerInput) {
                        if (triggerInput.id == connection.inputId) connection.input = triggerInput;
                        if (triggerInput.id == connection.outputId) connection.output = triggerInput;
                    });
                    node.triggerOutputs.forEach(function (triggerOutput) {
                        if (triggerOutput.id == connection.inputId) connection.input = triggerOutput;
                        if (triggerOutput.id == connection.outputId) connection.output = triggerOutput;
                    });
                });
                if (connection instanceof GraphConnection) object.connections.push(connection);
                else object.connections.push(GraphConnection.FromJson(connection, object));
            });
        }
    }

    get TriggerInputs() {
        return object.graphMethod.triggerInputs;
    }

    get TriggerOutputs() {
        return object.graphMethod.triggerOutputs;
    }

    get DataInputs() {
        return object.graphMethod.dataInputs;
    }

    get DataOutputs() {
        return object.graphMethod.dataOutputs;
    }

}