
var lastEventId = null;

function initMsg() {
    var source = new EventSource("./MessageDispatcher.php");
    console.log("mess");
    source.onmessage = function(event) {
        if (lastEventId === null){
            lastEventId = event.lastEventId;
            return;
        }
        if (lastEventId < event.lastEventId) {
            showEmer(event.data);
            lastEventId = event.lastEventId;
//            console.log(event.data);
        }
    };
}

function showEmer(data) {
    $("#zoom-anim-dialog").html(data);
    $("#zoom-anim-dialog").attr("class", 'mfp-ready');
    $("#zoom-anim-dialog").switchClass("mfp-ready","mfp-in",0).delay(6000).switchClass("mfp-in","mfp-out",0);
}