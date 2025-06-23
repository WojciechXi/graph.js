window.addEventListener('load', function (event) {
    let xhr = new XMLHttpRequest();
    xhr.open('GET', 'data.json', true);
    xhr.onload = function (event) {
        let graphProject = null;
        if (xhr.responseText.trim()) {
            let data = JSON.parse(xhr.responseText);
            graphProject = GraphProject.FromJson(data);
        }

        let graphEditor = new GraphEditor({
            graphProject: graphProject,
        });

        document.body.appendChild(graphEditor.Root);
        window.graphEditor = graphEditor;
    };
    xhr.send();
});