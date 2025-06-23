window.addEventListener('load', function (event) {
    let xhr = new XMLHttpRequest();
    xhr.open('GET', '1.json', true);
    xhr.onload = function (event) {
        let data = JSON.parse(xhr.responseText);
        let graphProject = GraphProject.FromJson(data);

        let graphEditor = new GraphEditor({
            graphProject: graphProject,
        });

        document.body.appendChild(graphEditor.Root);
        window.graphEditor = graphEditor;
    };
    xhr.send();
});