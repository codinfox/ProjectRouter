var times = 0;
var cityname;

function conn(data) {
    var xmlhttp;
    if (XMLHttpRequest) {// code for IE7+, Firefox, Chrome, Opera, Safari
        xmlhttp = new XMLHttpRequest();
    } else {// code for IE6, IE5
        xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
    }
    xmlhttp.open("POST", "../query.php", true);
    xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xmlhttp.send("query=" + data + "&city=" + cityname);

    xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
            $resp = xmlhttp.responseText;
            postMessage($resp);
        }
    }
}

onmessage = function(event) {
    if ( typeof (cityname) === "undefined") {
        cityname = event.data;
        return;
    }
    times++;
    if (times >= 5) {
        postMessage("NO");
        return;
    }
    var road = new Array();
    for (var i = 0; i < event.data.count; i++) {
        var tmp = event.data.list[i].roadName;
        if (tmp != "无名道路" && road.indexOf(tmp) == -1)//FIXME:去重，但事实上这么做会导致误伤的情况，下一版要改进
            road.push(event.data.list[i].roadName);
    }
    var json = JSON.stringify(road);
    conn(json);
    //    postMessage("OK");
}