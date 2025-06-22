window.addEventListener('load', function (event) {
    let graphFunction = new GraphFunction({
        name: 'Test',
    });

    let graphProject = new GraphProject({
        graphFunctions: [
            graphFunction
        ],
    });

    let graphEditor = new GraphEditor({
        graphProject: graphProject,
    });

    document.body.appendChild(graphEditor.Root);
    window.graphEditor = graphEditor;
});