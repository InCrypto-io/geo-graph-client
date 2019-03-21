var ws = "ws://127.0.0.1:3030/";
function bufferToJson(buffer)
{
    var enc = new TextDecoder("utf-8");
    var str = enc.decode(buffer);
    return JSON.parse(str);
}

var wsStatus;
var wsApp = (function(){
    var wsApp = {};
    var wsUri = ws;
    var websocket;
    wsApp.init = function() {
        websocket = new WebSocket(wsUri);
        websocket.binaryType = 'arraybuffer';
        websocket.onopen = function(evt) {
            console.log("OPEN");
            wsStatus = 'open';
            setupScene();
            var timerId = setInterval(function() {
                websocket.send(0);
            }, 4000);

        };
        websocket.onclose = function(evt){
            console.log("CLOSE");
            wsStatus = 'close';
            websocket = null;
        };
        websocket.onmessage = function(evt){
            animations.lastTime = (new Date()).toLocaleDateString("en-US", {weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: "numeric", minute: "2-digit", second:"2-digit"});
            var json, view = new DataView(evt.data);
            if (view.byteLength > 8)
                json = bufferToJson(evt.data);

            if(json != undefined) {
                manageAction(json);
            }
        };
        websocket.onerror =  function(evt){
            console.log("ERROR: " + evt.data);
            wsStatus = 'Error';
        };
    };
    return wsApp;
})();