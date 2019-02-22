var canvas, scene, renderer;
var paymentFIFO;
var data = [];
data['Trustlines'] = [];
data['Payments'] = [];

// Cache DOM selectors
var container = document.getElementsByClassName('js-globe')[0];

// Object for country HTML elements and variables
var elements = {};

// Three group objects
var groups = {
    main: null, // A group containing everything
    globe: null, // A group containing the globe sphere (and globe dots)
    globeDots: null, // A group containing the globe dots
    lines: null, // A group containing the lines between each country
    lineDots: null // A group containing the line dots
};

// Angles used for animating the camera
var camera = {
    object: null, // Three object of the camera
    controls: null, // Three object of the orbital controls
    angles: {
        // Object of the camera angles for animating
        current: {
            azimuthal: null,
            polar: null
        },
        target: {
            azimuthal: null,
            polar: null
        }
    }
};

// Map properties for creation and rendering
var props = {
    mapSize: {
        // Size of the map from the intial source image (on which the dots are positioned on)
        width: 2048 / 2,
        height: 1024 / 2
    },
    globeRadius: 200, // Radius of the globe (used for many calculations)
    dotsAmount: 1, // Amount of dots to generate and animate randomly across the lines
    colours: {
        // Cache the colours
        globeDots: 'rgb(61, 137, 164)', // No need to use the Three constructor as this value is used for the HTML canvas drawing 'fillStyle' property
        lines: new THREE.Color('#ffa10b'),
        lineActive: new THREE.Color('#ff000e'),
        lineDots: new THREE.Color('#165617')
    },
    alphas: {
        // Transparent values of materials
        globe: 0.4,
        lines: 0.5
    }
}

// Booleans and values for animations
var animations = {
    finishedIntro: false, // Boolean of when the intro animations have finished
    dots: {
        current: 0, // Animation frames of the globe dots introduction animation
        total: 0, // Total frames (duration) of the globe dots introduction animation,
        points: [] // Array to clone the globe dots coordinates to
    },
    globe: {
        current: 0, // Animation frames of the globe introduction animation
        total: 80, // Total frames (duration) of the globe introduction animation,
    },
    nodes: {
        active: false, // Boolean if the country elements have been added and made active
        animating: true, // Boolean if the countries are currently being animated
        current: 0, // Animation frames of country elements introduction animation
        total: 120, // Total frames (duration) of the country elements introduction animation
        selected: null, // Three group object of the currently selected payment lines
        typeAnimation: 'take', // The direction of animation true - forward, false - back
        index: null, // Index of the country in the data array
        timeout: null, // Timeout object for cycling to the next country
        initialDuration: 0, // Initial timeout duration before starting the country cycle
        duration: 0 // Timeout duration between cycling to the next country
    }
};

// Boolean to enable or disable rendering when window is in or out of focus
var isHidden = false;

function showFallback() {
    /*
        This function will display an alert if WebGL is not supported.
    */
    alert('WebGL not supported. Please use a browser that supports WebGL.');
}

function setupScene() {
    canvas = container.getElementsByClassName('js-canvas')[0];
    scene = new THREE.Scene();
    renderer = new THREE.WebGLRenderer({
        canvas: canvas,
        antialias: true,
        alpha: true,
        shadowMapEnabled: false
    });
    renderer.setSize(canvas.clientWidth, canvas.clientHeight);
    renderer.setPixelRatio(1);
    renderer.setClearColor(0x000000, 0);

    // Main group that contains everything
    groups.main = new THREE.Group();
    groups.main.name = 'Main';

    // Group that contains lines for each node
    groups.lines = new THREE.Group();
    groups.lines.name = 'Lines';
    groups.main.add(groups.lines);

    // Group that contains dynamically created dots
    groups.lineDots = new THREE.Group();
    groups.lineDots.name = 'Dots';
    groups.main.add(groups.lineDots);

    // Add the main group to the scene
    scene.add(groups.main);

    // Render camera and add orbital controls
    addCamera();
    addControls();

    // Render objects
    addGlobe();

    if (Object.keys(data.Trustlines).length > 0) {
        addLines();
    }

    render();
    animate();

    var canvasResizeBehaviour = function() {

        container.width = window.innerWidth;
        container.height = window.innerHeight;
        container.style.width = window.innerWidth + 'px';
        container.style.height = window.innerHeight + 'px';

        camera.object.aspect = container.offsetWidth / container.offsetHeight;
        camera.object.updateProjectionMatrix();
        renderer.setSize(container.offsetWidth, container.offsetHeight);

    };

    window.addEventListener('resize', canvasResizeBehaviour);
    window.addEventListener('orientationchange', function() {
        setTimeout(canvasResizeBehaviour, 0);
    });
    canvasResizeBehaviour();

}

/* CAMERA AND CONTROLS */

function addCamera() {
    camera.object = new THREE.PerspectiveCamera(60, canvas.clientWidth / canvas.clientHeight, 1, 10000);
    camera.object.position.z = props.globeRadius * 2.2;
}

function addControls() {

    camera.controls = new OrbitControls(camera.object, canvas);
    camera.controls.enableKeys = false;
    camera.controls.enablePan = false;
    camera.controls.enableZoom = true;
    camera.controls.enableDamping = false;
    camera.controls.enableRotate = true;

    // Set the initial camera angles to something crazy for the introduction animation
    camera.angles.current.azimuthal = -Math.PI;
    camera.angles.current.polar = 0;

}


/* INITIALISATION */

if (!window.WebGLRenderingContext) {
    showFallback();
}
else {
    //get Data by events
    window.addEventListener("load", wsApp.init, false);
}
