function isHashInTrustlineData(source){
    if (data.Trustlines !== undefined){
        for (let key in data.Trustlines)
        {
            if (data.Trustlines[key].source == source)
                return true;
        }
        return false;
    }
    else {
        return false;
    }
}

function isLineExist(source, destination) {
    for(var k in groups.lines.children){
        if((groups.lines.children[k].name == (source+destination)) || (groups.lines.children[k].name == (destination+source))){
           return true;
        }
    }
    return false;
}

function deleteHashInTrustlineData(source, destination){
    if (data.Trustlines !== undefined){
        for (let key in data.Trustlines)
        {
            if (data.Trustlines[key].source == source && data.Trustlines[key].destination == destination){
                data.Trustlines.splice(key, 1);
                return true;
            }
        }
        return false;
    }
    else {
        return false;
    }
}

function deleteLine(json) {
    for(var k in groups.lines.children){
        if((groups.lines.children[k].name == (json.source+json.destination)) || (groups.lines.children[k].name == (json.destination+json.source))){
            groups.lines.children.splice(k, 1);
            if(isHashInTrustlineData(json.source)){
                console.log(data.Trustlines);
                if (!deleteHashInTrustlineData(json.source, json.destination)){
                    console.log('Cant delete from TrustlineData');
                }
            }
        }
    }
}

function deleteDot(json) {
    for(var k in groups.globe.children){
        if(groups.globe.children[k].name == json.source){
            groups.globe.children.splice(k, 1);
            if(isHashInTrustlineData(json.source)){
                console.log(data.Trustlines);
                if (!deleteHashInTrustlineData(json.source, json.destination)){
                    console.log('Cant delete from TrustlineData');
                }
            }
        }
    }
}

function drawTrustLine(json) {
    if(!isHashInTrustlineData(json.source)) {
        data.Trustlines.push(json);
        createDot(json.source, json.destination);
        if (json.destination != undefined) {
            if (!isLineExist(json.source, json.destination)) {
                addNewLine(json.source, json.destination);
                createLastElement();
            } else {
                console.log('Warning #10 line is exist...');
            }
        } else {
            console.log('Error destination is undefined...');
        }
    } else if(!isLineExist(json.source, json.destination)){
        data.Trustlines.push(json);
        addNewLine(json.source, json.destination);
        createLastElement();
    }
    else {
        console.log('Warning #20 line is exist...');
    }
}

function drawPayment(json) {
    if(json['paths'].length>0){
        for(var i=0; i<json['paths'].length; i++){
            for(var j=0;j<json["paths"][i].length;j++) {
                if(j>0) {
                    addPayment(json['paths'][i][j-1], json['paths'][i][j]);
                }
            }
        }
    }
    else {
        console.log('Error paths in payments has wrang length');
    }
}

function manageAction(json){
    if (json.paths != undefined)
    {
        drawPayment(json);
    }
    else if (json.source != undefined) {
        if(data.Trustlines.length == 0 && animations.dots.total == 0){
            //createDot(json.source, json.destination);
            // list = document.getElementsByClassName('js-list')[0];
            // var element = document.createElement('li');
            // element.setAttribute("id",json.source);
            // element.innerHTML = '<span class="text">' + json.source + '</span>';
            // list.appendChild(element);
            //
            // let object = {
            //     position: animations.dots.points[json.source],
            //     element: element
            // };
            // elements[0] = object;
            // positionElements();
            drawTrustLine(json);
        }
        else if(json.Delete) {
            if(json.source == json.destination){
                deleteDot(json);
            } else {
                deleteLine(json);
            }
        }
        else {
            drawTrustLine(json);
        }
    }
    else {
        console.log('Error source is undefined...');
    }
    console.log(data.Trustlines);
}

function createFifoPayment(name, node, direction) {
    if(data.Payments[name] != undefined) {
        if (data.Payments[name][direction] != undefined) {
            data.Payments[name][direction].push({node});
            paymentDurations[node.name] = 10;
        } else {
            data.Payments[name][direction] = [];
            data.Payments[name][direction].push({node});
            paymentDurations[node.name] = 10;
        }
        //addLineDots(name, 1);
    } else {
        data.Payments[name] = [];
        data.Payments[name][direction] = [];
        data.Payments[name][direction].push({node});
        paymentDurations[node.name] = 10;
        //addLineDots(name, 1);
    }
}

function addPayment(fromNodeHash, toNodeHash) {
    if(groups.lines.getObjectByName(fromNodeHash+toNodeHash)){
        let nodesLine = groups.lines.getObjectByName(fromNodeHash+toNodeHash);
        if(nodesLine.nodes[0] == fromNodeHash){
            createFifoPayment((fromNodeHash+toNodeHash), nodesLine, 'take');
        } else {
            createFifoPayment((fromNodeHash+toNodeHash), nodesLine, 'pay');
        }
    } else if (groups.lines.getObjectByName(toNodeHash+fromNodeHash)) {
        let nodesLine = groups.lines.getObjectByName(toNodeHash+fromNodeHash);
        if(nodesLine.nodes[0] == fromNodeHash){
            createFifoPayment((toNodeHash+fromNodeHash), nodesLine, 'take');;
        } else {
            createFifoPayment((toNodeHash+fromNodeHash), nodesLine, 'pay');
        }
    }
    else {
        console.log('No payment line ...')
    }
}