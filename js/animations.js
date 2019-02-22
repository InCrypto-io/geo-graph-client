/* INTRO ANIMATIONS */

// Easing reference: https://gist.github.com/gre/1650294

var easeInOutCubic = function(t) {
    return t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
};

var easeOutCubic = function(t) {
    return (--t) * t * t + 1;
};

var easeInOutQuad = function(t) {
    return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
};

function introAnimate() {

    if (animations.dots.current <= animations.dots.total) {
        var points = groups.globeDots.geometry.vertices;
        var totalLength = points.length;
        var i = 0;

        for (var key in animations.dots.points) {

            // Get ease value
            var dotProgress = easeInOutCubic(animations.dots.current / animations.dots.total);

            // Add delay based on loop iteration
            dotProgress = dotProgress + (dotProgress * (i / totalLength));

            if (dotProgress > 1) {
                dotProgress = 1;
            }
            // Move the point
            if(points[i] != undefined) {
                points[i].x = animations.dots.points[key].x * dotProgress;
                points[i].y = animations.dots.points[key].y * dotProgress;
                points[i].z = animations.dots.points[key].z * dotProgress;
            }
            i++;
        }
        animations.dots.current++;

        // Update verticies
        groups.globeDots.geometry.verticesNeedUpdate = true;
    }


    if (animations.dots.current >= (animations.dots.total * 0.65) && animations.globe.current <= animations.globe.total) {
        var globeProgress = easeOutCubic(animations.globe.current / animations.globe.total);
        globe.material.opacity = props.alphas.globe * globeProgress;

        // Fade-in the country lines
        var lines = groups.lines.children;

        for (var ii = 0; ii < lines.length; ii++) {
            lines[ii].children[0].material.uniforms.opacity.value = props.alphas.lines * globeProgress;
        }

        animations.globe.current++;
    }
}

/* COORDINATE CALCULATIONS */

// Returns an object of 3D spherical coordinates
function returnSphericalCoordinates(latitude, longitude) {

    /*
        This function will take a latitude and longitude and calcualte the
        projected 3D coordiantes using Mercator projection relative to the
        radius of the globe.

        Reference: https://stackoverflow.com/a/12734509
    */

    // Convert latitude and longitude on the 90/180 degree axis
    latitude = ((latitude - props.mapSize.width) / props.mapSize.width) * -180; //180
    longitude = ((longitude - props.mapSize.height) / props.mapSize.height) * -90; //90

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

// Reference: https://codepen.io/ya7gisa0/pen/pisrm?editors=0010
function returnCurveCoordinates(start, end) {

    // Calculate the starting point
    //var start = returnSphericalCoordinates(latitudeA, longitudeA);

    // Calculate the end point
    //var end = returnSphericalCoordinates(latitudeB, longitudeB);

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