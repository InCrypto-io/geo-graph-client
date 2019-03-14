/* ELEMENTS */

var list;

function createLastElement() {

    if(list === undefined){
        list = document.getElementsByClassName('js-list')[0];
    }

    var pushObject = function(coordinates, target) {

        var targetNode = data.Trustlines[target];
        if (document.getElementById(targetNode['nodeHashFrom']) == undefined){
            // Create the element
            var element = document.createElement('li');

            element.setAttribute("id",targetNode['nodeHashFrom']);
            element.innerHTML = '<span class="text">' + targetNode['nodeHashFrom'] + '</span>';

            var object = {
                position: coordinates,
                element: element
            };

            // Add the element to the DOM and add the object to the array
            list.appendChild(element);
            elements[target] = object;
        }
    };

    var key = data.Trustlines.length - 1;

    let hash = data.Trustlines[key]['nodeHashFrom']+data.Trustlines[key]['nodeHashTo'];

    let group = groups.lines.getObjectByName(hash);

    if (group != undefined){
        let coordinates = group.children[0]._path[0];
        pushObject(coordinates, key);
    }
    list.classList.add('active');

}

function positionElements() {

    var widthHalf = canvas.clientWidth / 2;
    var heightHalf = canvas.clientHeight / 2;

    // Loop through the elements array and reposition the elements
    for (var key in elements) {

        var targetElement = elements[key];

        var position = getProjectedPosition(widthHalf, heightHalf, targetElement.position);

        // Construct the X and Y position strings
        var positionX = position.x + 'px';
        var positionY = position.y + 'px';

        // Construct the 3D translate string
        var elementStyle = targetElement.element.style;
        elementStyle.webkitTransform = 'translate3D(' + positionX + ', ' + positionY + ', 0)';
        elementStyle.WebkitTransform = 'translate3D(' + positionX + ', ' + positionY + ', 0)'; // Just Safari things (capitalised property name prefix)...
        elementStyle.mozTransform = 'translate3D(' + positionX + ', ' + positionY + ', 0)';
        elementStyle.msTransform = 'translate3D(' + positionX + ', ' + positionY + ', 0)';
        elementStyle.oTransform = 'translate3D(' + positionX + ', ' + positionY + ', 0)';
        elementStyle.transform = 'translate3D(' + positionX + ', ' + positionY + ', 0)';

    }

}