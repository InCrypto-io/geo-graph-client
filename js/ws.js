function wsConnection(ws){
    ws.onopen = function(evt) {

    };
    ws.onclose = function(evt) {
        console.log("CLOSE");
        ws = null;
    };
    ws.onmessage = function(evt) {

    };

    ws.onerror = function(evt) {

    }
}

function bufferToJson(buffer)
{
    var enc = new TextDecoder("utf-8");
    var str = enc.decode(buffer);
    return JSON.parse(str);
}


var wsApp = (function(){
    var wsApp = {};
    var wsUri = "ws://localhost:3000/";
    var websocket;
    wsApp.init = function() {
        websocket = new WebSocket(wsUri);
        websocket.binaryType = 'arraybuffer';
        websocket.onopen = function(evt) {
            console.log("OPEN");
            setupScene();
        };
        websocket.onclose = function(evt){
            console.log("CLOSE");
            websocket = null;
        };
        websocket.onmessage = function(evt){
            var json, view = new DataView(evt.data);
            if (view.byteLength > 8)
                json = bufferToJson(evt.data);
            if(json != undefined) {
                manageAction(json);
            }
        };
        websocket.onerror =  function(evt){
            console.log("ERROR: " + evt.data);
        };
    };

    return wsApp;
})();