/* RENDERING */

function render() {
    // update the picking ray with the camera and mouse position
    raycaster.setFromCamera( mouse, camera.object );

    // calculate objects intersecting the picking ray
    var intersects = raycaster.intersectObjects( groups.globe.children );

    for ( var i = 0; i < intersects.length; i++ ) {
        if(intersects[i].object.name!=''){
            if(animations.nodes.selected != intersects[i].object.name) {
                if(animations.nodes.selected != '')
                    document.getElementById(animations.nodes.selected).classList.remove('active');
                animations.nodes.selected = intersects[i].object.name;
                animations.nodes.mouse.x = mouse.x;
                animations.nodes.mouse.y = mouse.y;

                document.getElementById(intersects[i].object.name).classList.add('active');

            }
        }
    }

    if((animations.nodes.mouse.x != mouse.x || animations.nodes.mouse.y != mouse.y) && animations.nodes.selected != ''){
        document.getElementById(animations.nodes.selected).classList.remove('active');
        animations.nodes.selected = '';
    }

    let lineAmount = 0;
    for (let key in data.Trustlines)
    {
        if (data.Trustlines[key].nodeHashFrom != data.Trustlines[key].nodeHashTo){
            lineAmount++;
        }
    }

    document.getElementById('nodeAmount').innerHTML = groups.globe.children.length;//data['Trustlines'].length;
    document.getElementById('lineAmount').innerHTML = lineAmount;
    document.getElementById('currentTime').innerHTML = animations.lastTime;

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
        blur: visible,
        focusout: visible,
        pagehide: visible
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
    //
    if (isHidden === false) {
        requestAnimationFrame(animate);
    }
    //Check is payments exist in array
    if (Object.keys(data.Payments).length>0) {
        animatePayment();
    }
    positionElements();
    camera.controls.update();
    render();
}