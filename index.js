window.addEventListener('load', function (event) {
    window.textfield = null;
    window.addEventListener('keydown', function (event) {
        if (window.textfield) {
            if (event.key == 'Backspace') {
                window.textfield.text = window.textfield.text.substr(0, window.textfield.text.length - 1);
            } else if (event.key == 'Enter') {
                window.textfield = null;
            } else {
                window.textfield.text += event.key;
            }
            event.preventDefault();
        }
    });

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