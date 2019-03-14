/* ANIMATIONS */

/* COORDINATE CALCULATIONS */
// Returns an object of 3D spherical coordinates
function returnSphericalCoordinates(latitude, longitude) {

    // Convert latitude and longitude on the 90/180 degree axis
    latitude = ((latitude - props.mapSize.width) / props.mapSize.width) * -180;
    longitude = ((longitude - props.mapSize.height) / props.mapSize.height) * -90;

    // Calculate the projected starting point
    var radius = Math.cos(longitude / 180 * Math.PI) * props.globeRadius;
    var targetX = Math.cos(latitude / 180 * Math.PI) * radius;
    var targetY = Math.sin(longitude / 180 * Math.PI) * props.globeRadius;
    var targetZ = Math.sin(latitude / 180 * Math.PI) * radius;

    return {
        x: targetX,
        y: targetY,
        z: targetZ
    };

}

function returnCurveCoordinates(start, end) {

    // Calculate the mid-point
    var midPointX = (start.x + end.x) / 2;
    var midPointY = (start.y + end.y) / 2;
    var midPointZ = (start.z + end.z) / 2;

    // Calculate the distance between the two coordinates
    var distance = Math.pow(end.x - start.x, 2);
    distance += Math.pow(end.y - start.y, 2);
    distance += Math.pow(end.z - start.z, 2);
    distance = Math.sqrt(distance);

    // Calculate the multiplication value
    var multipleVal = Math.pow(midPointX, 2);
    multipleVal += Math.pow(midPointY, 2);
    multipleVal += Math.pow(midPointZ, 2);
    multipleVal = Math.pow(distance, 2) / multipleVal;
    multipleVal = multipleVal * 0.3;

    // Apply the vector length to get new mid-points
    var midX = midPointX + multipleVal * midPointX;
    var midY = midPointY + multipleVal * midPointY;
    var midZ = midPointZ + multipleVal * midPointZ;

    if(Math.abs(midX) > 500){
        midX = midX/2;
    }
    if(Math.abs(midY) > 500){
        midY = midY/2;
    }
    if(Math.abs(midZ) > 500){
        midZ = midZ/2;
    }

    // Return set of coordinates
    return {
        start: {
            x: start.x,
            y: start.y,
            z: start.z
        },
        mid: {
            x: midX,
            y: midY,
            z: midZ
        },
        end: {
            x: end.x,
            y: end.y,
            z: end.z
        }
    };

}

// Returns an object of 2D coordinates for projected 3D position
function getProjectedPosition(width, height, position) {

    /*
        Using the coordinates of a country in the 3D space, this function will
        return the 2D coordinates using the camera projection method.
    */

    position = position.clone();
    var projected = position.project(camera.object);

    return {
        x: (projected.x * width) + width,
        y: -(projected.y * height) + height
    };

}