/* GLOBE */

function addGlobe() {

    var textureLoader = new THREE.TextureLoader();
    textureLoader.setCrossOrigin(true);

    var radius = props.globeRadius - (props.globeRadius * 0.01);
    var segments = 64;
    var rings = 64;

    // Make gradient
    var canvasSize = 128;
    var textureCanvas = document.createElement('canvas');
    textureCanvas.width = canvasSize;
    textureCanvas.height = canvasSize;
    var canvasContext = textureCanvas.getContext('2d');
    canvasContext.rect(0, 0, canvasSize, canvasSize);
    var canvasGradient = canvasContext.createLinearGradient(0, 0, 0, canvasSize);
    canvasGradient.addColorStop(0, '#5B0BA0');
    //canvasGradient.addColorStop(0.5, '#260F76');
    canvasGradient.addColorStop(1, '#130D56');
    canvasContext.fillStyle = canvasGradient;
    canvasContext.fill();

    // Make texture
    var texture = new THREE.Texture(textureCanvas);
    texture.needsUpdate = true;

    var geometry = new THREE.SphereGeometry(radius, segments, rings);
    var material = new THREE.MeshBasicMaterial({
        map: texture,
        transparent: true,
        opacity: 0.1
    });
    globe = new THREE.Mesh(geometry, material);

    groups.globe = new THREE.Group();
    groups.globe.name = 'Globe';

    groups.globe.add(globe);
    groups.main.add(groups.globe);

    //addGlobeDots();

}

function addGlobeDots() {
    var geometry = new THREE.Geometry();

    // Make circle
    var canvasSize = 16;
    var halfSize = canvasSize / 2;
    var textureCanvas = document.createElement('canvas');
    textureCanvas.width = canvasSize;
    textureCanvas.height = canvasSize;
    var canvasContext = textureCanvas.getContext('2d');
    canvasContext.beginPath();
    canvasContext.arc(halfSize, halfSize, halfSize, 0, 2 * Math.PI);
    canvasContext.fillStyle = props.colours.globeDots;
    canvasContext.fill();

    // Make texture
    var texture = new THREE.Texture(textureCanvas);
    texture.needsUpdate = true;

    var material = new THREE.PointsMaterial({
        map: texture,
        transparent:false,
        size: props.globeRadius / 80 //120
    });

    let addDot = function(targetHash, targetX, targetY) {

        // Add the coordinates to a new array for the intro animation
        var result = returnSphericalCoordinates(
            targetX,
            targetY
        );
        let point = new THREE.Vector3(result.x, result.y, result.z);
        // Add a point with zero coordinates
        //var point = new THREE.Vector3(0, 0, 0);
        animations.dots.points[targetHash] = point;
        geometry.vertices.push(new THREE.Vector3(0, 0, 0));
        animations.dots.total++;
    };

    let x, y;
    for (var i = 0; i < data.Trustlines.length; i++) {
        if (i === 0) {
            x = randomInteger(0, 1500);
            y = randomInteger(0, 780);
        } else {
            x = randomInteger(x, x+150);
            y = randomInteger(y, y+150);
        }
        addDot(data.Trustlines[i].nodeHashFrom, x, y);
    }

    // Add the points to the scene
    groups.globeDots = new THREE.Points(geometry, material);
    groups.globe.add(groups.globeDots);

}

function createDot(nodeHashFrom, nodeHashTo){
    var geometry = new THREE.Geometry();

    // Make circle
    var canvasSize = 16;
    var halfSize = canvasSize / 2;
    var textureCanvas = document.createElement('canvas');
    textureCanvas.width = canvasSize;
    textureCanvas.height = canvasSize;
    var canvasContext = textureCanvas.getContext('2d');
    canvasContext.beginPath();
    canvasContext.arc(halfSize, halfSize, halfSize, 0, 2 * Math.PI);
    canvasContext.fillStyle = props.colours.globeDots;
    canvasContext.fill();

    // Make texture
    var texture = new THREE.Texture(textureCanvas);
    texture.needsUpdate = true;

    var material = new THREE.PointsMaterial({
        map: texture,
        transparent:false,
        size: props.globeRadius / 80 //120
    });

    if (animations.dots.points[nodeHashTo] == undefined) {
        x = randomInteger(0, 1500);
        y = randomInteger(0, 780);
    } else {
        x = randomInteger(animations.dots.points[nodeHashTo].x, animations.dots.points[nodeHashTo].x+150);
        y = randomInteger(animations.dots.points[nodeHashTo].y, animations.dots.points[nodeHashTo].y+150);
    }

    // Add the coordinates to a new array for the intro animation
    var result = returnSphericalCoordinates(
        x,
        y
    );
    var point = new THREE.Vector3(result.x, result.y, result.z);
    geometry.vertices.push(point);
    animations.dots.points[nodeHashFrom] = point;

    var obj = new THREE.Points(geometry, material);
    obj.name = nodeHashFrom;
    // Add the points to the scene
    groups.globe.add(obj);
}

function randomInteger(min, max) {
    var rand = min + Math.random() * (max + 1 - min);
    rand = Math.floor(rand);
    return rand;
}