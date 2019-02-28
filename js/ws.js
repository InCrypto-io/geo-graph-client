var ws = "ws://172.17.0.1:3030/";
function bufferToJson(buffer)
{
    var enc = new TextDecoder("utf-8");
    var str = enc.decode(buffer);
    return JSON.parse(str);
}


var wsApp = (function(){
    var wsApp = {};
    var wsUri = ws;
    var websocket;
    wsApp.init = function() {
        websocket = new WebSocket(wsUri);
        websocket.binaryType = 'arraybuffer';
        websocket.onopen = function(evt) {
            console.log("OPEN");
            setupScene();
            var timerId = setInterval(function() {
                websocket.send(0);
            }, 8000);

        };
        websocket.onclose = function(evt){
            console.log("CLOSE");
            websocket = null;
        };
        websocket.onmessage = function(evt){

            var json, view = new DataView(evt.data);
            if (view.byteLength == 8 && new Int32Array(evt.data)[1] == 0){
               websocket.send(0);
            }
            else if (view.byteLength > 8)
                json = bufferToJson(evt.data);

            if(json != undefined) {
                manageAction(json);
            }
        };
        websocket.onerror =  function(evt){
            console.log("ERROR: " + evt.data);
            // console.log("ERROR: " + evt.e);
        };
    };
    return wsApp;
})();