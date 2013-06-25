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

function send(data) {
console.log(data);
    var msg = JSON.stringify(data);
    $.post("../insertCong.php", {query: msg});
}

function geocallback(info) {
    cor.city = "上海"; //只是为了测试
    //console.log(info);
    cor.road = info.list[0].roadlist[0].name;

    send(cor);
}