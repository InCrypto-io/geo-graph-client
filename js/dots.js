/* DOTS */

function createDot(nodeHashFrom){
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
        transparent:true,
        size: props.globeRadius / 40//120
    });

    x = randomIntegerX(0,2050);
    y = randomIntegerY(1025, 2);

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

function randomIntegerX(min, max) {
    var rand = min + Math.random() * (max + 1 - min);
    rand = Math.floor(rand);
    return rand;
}

function randomIntegerY(max, numberRandoms) {
    let result = 0;
    for (let i = 0; i < numberRandoms; ++i)
        result += Math.random() * (max / numberRandoms);
    return result;
}