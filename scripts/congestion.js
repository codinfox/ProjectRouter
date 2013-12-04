function Congmsg(lng, lat, road, city) {
    this.lng = lng;
    this.lat = lat;
    this.road = road;
    this.city = city;
}
var cor = new Congmsg();

function report() {
    if (!navigator.geolocation) {
        html5error();
        return;
    }
    navigator.geolocation.getCurrentPosition(function(e) {
        console.log("inside");
        cor.lng = e.coords.longitude;
        cor.lat = e.coords.latitude;

        var geocoderOption = {
            range: 300, // 范围
            crossnum: 2, // 道路交叉口数
            roadnum: 3, // 路线记录数
            poinum: 1 // POI点数
        };
        var geocoder = new AMap.Geocoder(geocoderOption);
        geocoder.regeocode(new AMap.LngLat(cor.lng, cor.lat), geocallback);

    });
}

function ios_report(lat, lng) {
    cor.lng = lng;
    cor.lat = lat;

    var geocoderOption = {
        range: 300, // 范围
        crossnum: 2, // 道路交叉口数
        roadnum: 3, // 路线记录数
        poinum: 1 // POI点数
    };
    var geocoder = new AMap.Geocoder(geocoderOption);
    geocoder.regeocode(new AMap.LngLat(cor.lng, cor.lat), geocallback);
    alert('拥堵上报');
//    alert('ios_report');
}

function send(data) {
    console.log(data);
    var msg = JSON.stringify(data);
    $.post("../insertCong.php", {query: msg});
//    alert('send');
}

function geocallback(info) {
    cor.city = "上海"; //只是为了测试
    console.log(info);
//    console.log("IIIFFFOOO");
    cor.road = info.list[0].roadlist[0].name;

    send(cor);
//    alert('geocallback');
}

function sensorSpeed(position) { // 速度测试和上报
    console.log('sensorSpeed inside');
    var speed = position.coords.speed;
    if (speed == null || typeof (speed) === "undefined")
        $("#curr_speed").html("未知");
    else {
        $("#curr_speed").html(speed);
        if ($("#auto_report").data("checked")) {
            if (speed <= 5) { // 速度小于5m/s
                if ((new Date()).getTime() - $("#auto_report").data("last_time") > 60000) {
                    $("#auto_report").data("last_time", (new Date()).getTime());
                    report(); //上报
                }
            } else {
                $("#auto_report").data("last_time", (new Date()).getTime());
            }
        }
    }
}

function sensorSpeedErr(err) {
    console.warn('ERROR(' + err.code + '): ' + err.message);
}
;

function autoReport() {
    var flag = $('#auto_report').is(':checked');
    $('#auto_report').data("checked", flag);
    if (!flag) {
        $("#auto_report").data("last_time", (new Date()).getTime());
    }
    console.log($('#auto_report').is(':checked'));
}