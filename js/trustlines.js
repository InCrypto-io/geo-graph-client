/* LINES OF DOTS */

function addNewLine(nodeStart, nodeEnd) {

    // Create the geometry
    var geometry = new THREE.Geometry();

    let group;
    if (groups.lines.getObjectByName(nodeStart) == undefined) {
        group = new THREE.Group();
        //node start name
        group.name = nodeStart+nodeEnd;
        group.nodes = [];
        group.nodes.push(nodeStart);
        group.nodes.push(nodeEnd);
    } else {
        group = groups.lines.getObjectByName(nodeStart);
    }

    // Skip if the undefined node
    if (nodeEnd != '0' && animations.dots.points[nodeEnd] !== undefined && animations.dots.points[nodeStart] !== undefined) {
        geometry.vertices.push(
            animations.dots.points[nodeStart],
            animations.dots.points[nodeEnd]
        );

        // Create mesh line using plugin and set its geometry
        var line = new MeshLine();
        line.setGeometry(geometry);

        // Create the mesh line material using the plugin
        var material = new MeshLineMaterial({
            color: props.colours.lines,
            transparent: false,
            opacity: props.alphas.lines,
            lineWidth: 0.1
        });

        // Create the final object to add to the scene
        var curveObject = new THREE.Mesh(line.geometry, material);
        curveObject._path = geometry.vertices;

        group.add(curveObject);

        group.visible = true;

        groups.lines.add(group);
    }
    else {
        console.log('Cant create line ...',nodeStart+nodeEnd);
    }
}

function animation(name, type, nodesLine) {
    // Show the dot
    nodesLine.children[0].material.lineWidth = 0.9;
    nodesLine.children[0].material.color = props.colours.lineActive;
    paymentDurations[name]--;
    // Hide the dot
    if(paymentDurations[name]<=0) {
        nodesLine.children[0].material.lineWidth = 0.2;
        nodesLine.children[0].material.color = props.colours.lines;
        deletePayment(name,type);
    }
}

function animatePayment() {
    for(let name in data.Payments){
        for(let type in data.Payments[name]){
            animation(name, type, data.Payments[name][type][0].node);
        }
    }
}

function deletePayment(name,type){
    data.Payments[name][type].shift();

    if (data.Payments[name][type].length == 0){
        delete data.Payments[name][type];
    }
    if(Object.keys(data.Payments[name]).length == 0){
        delete data.Payments[name];
    }
    if(groups.lineDots.getObjectByName(name) != undefined)
        groups.lineDots.getObjectByName(name).children[0].visible = false;
    delete groups.lineDots.getObjectByName(name);
}