/* RENDERING */

function render() {
    renderer.render(scene, camera.object);
}

if ('hidden' in document) {
    document.addEventListener('visibilitychange', onFocusChange);
}
else if ('mozHidden' in document) {
    document.addEventListener('mozvisibilitychange', onFocusChange);
}
else if ('webkitHidden' in document) {
    document.addEventListener('webkitvisibilitychange', onFocusChange);
}
else if ('msHidden' in document) {
    document.addEventListener('msvisibilitychange', onFocusChange);
}
else if ('onfocusin' in document) {
    document.onfocusin = document.onfocusout = onFocusChange;
}
else {
    window.onpageshow = window.onpagehide = window.onfocus = window.onblur = onFocusChange;
}

function onFocusChange(event) {

    var visible = 'visible';
    var hidden = 'hidden';
    var eventMap = {
        focus: visible,
        focusin: visible,
        pageshow: visible,
        blur: hidden,
        focusout: hidden,
        pagehide: hidden
    };

    event = event || window.event;

    if (event.type in eventMap) {
        isHidden = true;
    }
    else {
        isHidden = false;
    }

}

function animate() {

    if (isHidden === false) {
        requestAnimationFrame(animate);
    }

    if (groups.globeDots) {
        introAnimate();
    }

    if (Object.keys(data.Payments).length>0) {
        animatePayment();
    }

    positionElements();

    camera.controls.update();

    render();

}