var i = 0;

function timedCount(data) {
    var xmlhttp;
    if (XMLHttpRequest) {// code for IE7+, Firefox, Chrome, Opera, Safari
        xmlhttp = new XMLHttpRequest();
    } else {// code for IE6, IE5
        xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
    }
    xmlhttp.open("POST", "../test.php", true);
    xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xmlhttp.send("hello="+i);
}

onmessage = function(event) {
    timedCount(event.data);
    if (i == 0) postMessage("曹安公路");
    else if (i == 1) postMessage("黄渡大道");
    else postMessage("OK");
    i++;
}