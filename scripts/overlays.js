/**
 * @author Ben
 */


function updateMarks() {
    //refreshCongPoints();
    var data = JSON.stringify(mapObj.getBounds());
    $.post("../queryloc.php", {query: data}, function(json) {
        var obj = JSON.parse(json);
        mapObj.clearOverlaysByType('marker');
        var markers = new Array();
        for (var i = 0; i < obj.count; i++) {
            var tmpmarker = new AMap.Marker({
                id: "congmarker"+i,
                position: obj.list[i],
                offset: new AMap.Pixel(-8, -34),
                icon: "images/mark.png"
            });
            markers.push(tmpmarker);
        }
        mapObj.addOverlays(markers);
    });
}