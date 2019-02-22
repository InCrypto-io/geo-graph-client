/* COUNTRY LINES AND DOTS */

function addLines() {

    // Create the geometry
    var geometry = new THREE.Geometry();

    for (var key in data.Trustlines) {

        var nodeStart = data.Trustlines[key]['nodeHashFrom'];
        var nodeEnd = data.Trustlines[key]['nodeHashTo'];

        var group = new THREE.Group();
        //node start name
        group.name = nodeStart;

        // Skip if the country is the same
        if (nodeEnd == '0' || animations.dots.points[nodeEnd] == undefined || animations.dots.points[nodeStart] == undefined) {
            continue;
        }

        // Get the spatial coordinates
        var result = returnCurveCoordinates(
            animations.dots.points[nodeStart],
            animations.dots.points[nodeEnd]
        );

        // Calcualte the curve in order to get points from
        var curve = new THREE.QuadraticBezierCurve3(
            new THREE.Vector3(result.start.x, result.start.y, result.start.z),
            new THREE.Vector3(result.mid.x, result.mid.y, result.mid.z),
            new THREE.Vector3(result.end.x, result.end.y, result.end.z)
        );

        // Get verticies from curve
        geometry.vertices = curve.getPoints(100);

        // Create mesh line using plugin and set its geometry
        var line = new MeshLine();
        line.setGeometry(geometry);

        // Create the mesh line material using the plugin
        var material = new MeshLineMaterial({
            color: props.colours.lines,
            transparent: false,
            opacity: props.alphas.lines,
            lineWidth: 1
        });

        // Create the final object to add to the scene
        var curveObject = new THREE.Mesh(line.geometry, material);
        curveObject._path = geometry.vertices;

        group.add(curveObject);

        group.visible = true;

        groups.lines.add(group);

    }

}

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

        // Get the spatial coordinates
        var result = returnCurveCoordinates(
            animations.dots.points[nodeStart],
            animations.dots.points[nodeEnd]
        );

        // Calcualte the curve in order to get points from
        var curve = new THREE.QuadraticBezierCurve3(
            new THREE.Vector3(result.start.x, result.start.y, result.start.z),
            new THREE.Vector3(result.mid.x, result.mid.y, result.mid.z),
            new THREE.Vector3(result.end.x, result.end.y, result.end.z)
        );

        // Get verticies from curve
        geometry.vertices = curve.getPoints(100);

        // Create mesh line using plugin and set its geometry
        var line = new MeshLine();
        line.setGeometry(geometry);

        // Create the mesh line material using the plugin
        var material = new MeshLineMaterial({
            color: props.colours.lines,
            transparent: false,
            opacity: props.alphas.lines,
            lineWidth: 0.2
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

function addLineDots(name, dotsAmount) {

    /*
        This function will create a number of dots (props.dotsAmount) which will then later be
        animated along the lines. The dots are set to not be visible as they are later
        assigned a position after the introduction animation.
    */
    var group = new THREE.Group();
    group.name = name;
    var radius = props.globeRadius / 120;
    var segments = 32;
    var rings = 32;

    var geometry = new THREE.SphereGeometry(radius, segments, rings);
    var material = new THREE.MeshBasicMaterial({
        color: props.colours.lineDots
    });

    // Returns a sphere geometry positioned at coordinates
    var returnLineDot = function() {
        var sphere = new THREE.Mesh(geometry, material);
        return sphere;
    };

    //for (var key in animations.dots.points) {
    for (var i = 0; i < 5; i++) {
        // Get the country path geometry vertices and create the dot at the first vertex
        var targetDot = returnLineDot();
        targetDot.visible = false;

        // Add custom variables for custom path coordinates and index
        targetDot._pathIndex = null;
        targetDot._path = null;

        // Add the dot to the dots group
        group.add(targetDot);
        group.visible = true;
        groups.lineDots.add(group);

    }

}

function assignDotsToRandomLine(target, node) {
    // Get a random line from the current country
    var randomLine = Math.random() * (node.children.length - 1);
    randomLine = node.children[randomLine.toFixed(0)];

    // Assign the random country path to the dot and set the index at 0
    target._path = randomLine._path;
}

function animateDots(name, direction, node) {
    switch(direction) {
        case 'take':
            forwardAnimation(name, direction, node);
            break;
        case 'pay':
            backwardAnimation(name, direction, node);
            break;
        default:
            break;
    }


}

function forwardAnimation(name, type, nodesLine) {
    for (let i = 0; i < groups.lineDots.getObjectByName(name).children.length; i++) {
        let dot = groups.lineDots.getObjectByName(name).children[i];
        if (dot._path === null) {
            assignDotsToRandomLine(dot, nodesLine);
            dot._pathIndex = 0;
        }
        else if (dot._path !== null && dot._pathIndex < dot._path.length - 1) {

            // Show the dot
            if (dot.visible === false) {
                dot.visible = true;
                nodesLine.children[0].material.lineWidth = 0.5;
                nodesLine.children[0].material.color = props.colours.lineActive;
            }

            // Move the dot along the path vertice coordinates
            dot.position.x = dot._path[dot._pathIndex].x;
            dot.position.y = dot._path[dot._pathIndex].y;
            dot.position.z = dot._path[dot._pathIndex].z;

            // Advance the path index by 1
            dot._pathIndex++;

        } else {

            // Hide the dot
            dot.visible = false;
            nodesLine.children[0].material.lineWidth = 0.2;
            nodesLine.children[0].material.color = props.colours.lines;

            // Remove the path assingment
            dot._path = null;

            if(i == groups.lineDots.getObjectByName(name).children.length-1)
                deletePayment(name,type);
        }
    }
}

function backwardAnimation(name, type, nodesLine) {
    for (let i = 0; i < groups.lineDots.getObjectByName(name).children.length; i++) {
        let dot = groups.lineDots.getObjectByName(name).children[i];
        if (dot._path === null) {
            assignDotsToRandomLine(dot, nodesLine);
            dot._pathIndex = 99;
        }
        else if (dot._path !== null && dot._pathIndex > 0) {

            // Show the dot
            if (dot.visible === false) {
                dot.visible = true;
                nodesLine.children[0].material.lineWidth = 0.5;
                nodesLine.children[0].material.color = props.colours.lineActive;
            }

            // Move the dot along the path vertice coordinates
            dot.position.x = dot._path[dot._pathIndex].x;
            dot.position.y = dot._path[dot._pathIndex].y;
            dot.position.z = dot._path[dot._pathIndex].z;
            // Advance the path index by 1
            dot._pathIndex--;

        }
        else {

            // Hide the dot
            dot.visible = false;
            nodesLine.children[0].material.lineWidth = 0.2;
            nodesLine.children[0].material.color = props.colours.lines;

            // Remove the path assingment
            dot._path = null;
            if(i == groups.lineDots.getObjectByName(name).children.length-1)
                deletePayment(name,type);
        }
    }
}

function animatePayment() {
    for(let name in data.Payments){
        for(let type in data.Payments[name]){
            animateDots(name, type, data.Payments[name][type][0].node);
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
    groups.lineDots.getObjectByName(name).children[0].visible = false;
    delete groups.lineDots.getObjectByName(name);

}