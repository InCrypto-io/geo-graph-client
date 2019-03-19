function isHashInTrustlineData(nodeHashFrom){
    if (data.Trustlines !== undefined){
        for (let key in data.Trustlines)
        {
            if (data.Trustlines[key].nodeHashFrom == nodeHashFrom)
                return true;
        }
        return false;
    }
    else {
        return false;
    }
}

function isLineExist(nodeHashFrom, nodeHashTo) {
    for(var k in groups.lines.children){
        if((groups.lines.children[k].name == (nodeHashFrom+nodeHashTo)) || (groups.lines.children[k].name == (nodeHashTo+nodeHashFrom))){
           return true;
        }
    }
    return false;
}

function deleteHashInTrustlineData(nodeHashFrom){
    if (data.Trustlines !== undefined){
        for (let key in data.Trustlines)
        {
            if (data.Trustlines[key].nodeHashFrom == nodeHashFrom){
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
        if((groups.lines.children[k].name == (json.nodeHashFrom+json.nodeHashTo)) || (groups.lines.children[k].name == (json.nodeHashTo+json.nodeHashFrom))){
            groups.lines.children.splice(k, 1);
            if(isHashInTrustlineData(json.nodeHashFrom)){
                if (!deleteHashInTrustlineData(json.nodeHashFrom))
                    console.log('Cant delete from TrustlineData');
            }
        }
    }
}

function deleteDot(json) {
    let del = true;
    console.log();
    for(var k in groups.lines.children) {
        if(groups.lines.children[k].nodes.includes(json.nodeHashFrom)
            && groups.lines.children[k].nodes[0] != groups.lines.children[k].nodes[1]) {
            del = false;
        }
    }

    if (del){
        for(var k in groups.globe.children){
            if(groups.globe.children[k].name == json.nodeHashFrom){
                groups.globe.children.splice(k, 1);
                if(isHashInTrustlineData(json.nodeHashFrom)){
                    if (!deleteHashInTrustlineData(json.nodeHashFrom))
                        console.log('Cant delete from TrustlineData');
                }
            }
        }
    }

}

function drawTrustLine(json) {
    if(!isHashInTrustlineData(json.nodeHashFrom)) {
        data.Trustlines.push(json);
        createDot(json.nodeHashFrom, json.nodeHashTo);
        if (json.nodeHashTo != undefined) {
            if (!isLineExist(json.nodeHashFrom, json.nodeHashTo)) {
                addNewLine(json.nodeHashFrom, json.nodeHashTo);
                createLastElement();
            } else {
                console.log('Warning #10 line is exist...');
            }
        } else {
            console.log('Error nodeHashTo is undefined...');
        }
    } else if(!isLineExist(json.nodeHashFrom, json.nodeHashTo)){
        addNewLine(json.nodeHashFrom, json.nodeHashTo);
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
    else if (json.nodeHashFrom != undefined) {
        if(data.Trustlines.length == 0 && animations.dots.total == 0){
            //createDot(json.nodeHashFrom, json.nodeHashTo);
            // list = document.getElementsByClassName('js-list')[0];
            // var element = document.createElement('li');
            // element.setAttribute("id",json.nodeHashFrom);
            // element.innerHTML = '<span class="text">' + json.nodeHashFrom + '</span>';
            // list.appendChild(element);
            //
            // let object = {
            //     position: animations.dots.points[json.nodeHashFrom],
            //     element: element
            // };
            // elements[0] = object;
            // positionElements();
            drawTrustLine(json);
        }
        else if(json.Delete) {
            console.log(groups.lines.children);
            console.log(groups.globe.children);
            deleteLine(json);
            deleteDot(json)
        }
        else {
            drawTrustLine(json);
        }
    }
    else {
        console.log('Error nodeHashFrom is undefined...');
    }
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