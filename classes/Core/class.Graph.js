class Graph {

    constructor(data = {}) {
        let object = this;
        object.id = guid();

        object.triggerInputs = data.triggerInputs ?? [];
        object.triggerOutputs = data.triggerOutputs ?? [];

        object.dataInputs = data.dataInputs ?? [];
        object.dataOutputs = data.dataOutputs ?? [];

        object.nodes = data.nodes ?? [];
        object.connections = data.connections ?? [];

        object.line = null;
    }

    toJson() {
        let object = this;
        return {
            id: object.id,
            triggerInputs: object.triggerInputs,
            triggerOutputs: object.triggerOutputs,
            dataInputs: object.dataInputs,
            dataOutputs: object.dataOutputs,
            nodes: object.nodes,
            connections: object.connections,
        };
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
                            for (let item of node.triggerInputs) {
                                if (item.hover) {
                                    dragItem = item;
                                    break;
                                }
                            }

                            if (!dragItem) {
                                for (let item of node.triggerOutputs) {
                                    if (item.hover) {
                                        dragItem = item;
                                        break;
                                    }
                                }
                            }

                            if (!dragItem) {
                                for (let item of node.dataInputs) {
                                    if (item.hover) {
                                        dragItem = item;
                                        break;
                                    }
                                }
                            }

                            if (!dragItem) {
                                for (let item of node.dataOutputs) {
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

                            for (let triggerInput of node.triggerInputs) {
                                if (!triggerInput.hover) continue;

                                let graphConnection = new GraphConnection({
                                    input: object.item,
                                    output: triggerInput,
                                });

                                object.connections.push(graphConnection);

                                break;
                            }

                            for (let triggerOutput of node.triggerOutputs) {
                                if (!triggerOutput.hover) continue;

                                let graphConnection = new GraphConnection({
                                    input: object.item,
                                    output: triggerOutput,
                                });

                                object.connections.push(graphConnection);

                                break;
                            }

                            for (let dataInput of node.dataInputs) {
                                if (!dataInput.hover) continue;

                                let graphConnection = new GraphConnection({
                                    input: object.item,
                                    output: dataInput,
                                });

                                object.connections.push(graphConnection);

                                break;
                            }

                            for (let dataOutput of node.dataOutputs) {
                                if (!dataOutput.hover) continue;

                                let graphConnection = new GraphConnection({
                                    input: object.item,
                                    output: dataOutput,
                                });

                                object.connections.push(graphConnection);

                                break;
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