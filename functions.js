Node.prototype.__defineSetter__('content', function (content) {
    let node = this;
    node.innerHTML = null;
    if (content instanceof Node) {
        node.appendChild(content);
    } else if (content instanceof Array) {
        content.forEach(function (child, index) {
            if (node.contentLoop) child = node.contentLoop(child, index);
            if (child instanceof Node) node.appendChild(child);
        })
    } else if (content instanceof Object) {
        if (node.contentLoop) {
            Object.keys(content).forEach(function (key, index) {
                let value = content[key];
                let child = node.contentLoop(value, index, key);
                if (child instanceof Node) node.appendChild(child);
            });
            node.contentLoop();
        } else {
            node.innerText = JSON.stringify(content, null, 5);
        }
    } else {
        node.innerText = content;
    }
});

Node.prototype.Class = function (classes = []) {
    let node = this;
    if (classes instanceof Array) {
        classes.forEach(function (className) {
            node.classList.add(className);
        });
    } else if (classes instanceof String) {
        node.classList.add(classes);
    }
};

Node.prototype.Css = function (properties = {}) {
    let node = this;
    Object.keys(properties).forEach(function (property) {
        let propertyName = property.split(/(?=[A-Z])/).join('-').toLowerCase();
        if (properties[property] != null) node.style.setProperty(propertyName, properties[property]);
        else node.style.removeProperty(propertyName);
    });
};

Node.prototype.Attr = function (attrs = {}) {
    let node = this;
    Object.keys(attrs).forEach(function (attribute) {
        let attributeName = attribute.split(/(?=[A-Z])/).join('-').toLowerCase();
        if (attrs[attribute] != null) node.setAttribute(attributeName, attrs[attribute]);
        else node.removeAttribute(attributeName);
    });
};

Node.prototype.Prop = function (properties = {}) {
    let node = this;
    Object.keys(properties).forEach(function (property) {
        node[property] = properties[property];
    });
};

Node.prototype.Event = function (events = {}) {
    let node = this;
    Object.keys(events).forEach(function (event) {
        node.addEventListener(event, events[event]);
    });
};

function guid() {
    return "10000000-1000-4000-8000-100000000000".replace(/[018]/g, c =>
        (+c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> +c / 4).toString(16)
    );
}

function el(data = {}) {
    let node = document.createElement(data.tag ?? 'div');
    if (data.class) node.Class(data.class);
    if (data.css) node.Css(data.css);
    if (data.attr) node.Attr(data.attr);
    if (data.prop) node.Prop(data.prop);
    if (data.event) node.Event(data.event);
    if (data.contentLoop) node.contentLoop = data.contentLoop;
    if (data.content) node.content = data.content;
    if (data.callback) data.callback(node);
    return node;
}