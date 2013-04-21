//Constants
var MYPOS = "我的位置";
//---------

var mapObj, toolbar, overview;
var currentPos, currPosGeo;
var Trafficlay, partition;

function mapInit() {
    var opt = {
        level : 13,
        center : new AMap.LngLat(121.49854, 31.28540), //同济大学
        doubleClickZoom : true,
        scrollWheel : true
    }
    mapObj = new AMap.Map("MapView", opt);
    partition = new AMap.Partition();
    AMap.Conf.network = 1;
    mapObj.plugin(["AMap.ToolBar"], function() {
        toolbar = new AMap.ToolBar({
            offset : new AMap.Pixel(10, 60),
            autoPosition : true,
            ruler : false,
            direction : false,
        });
        mapObj.addControl(toolbar);
        mapObj.bind(toolbar, "location", function(e) {
            //$("#SearchResult").html("");
            var center = e.position.center;
            currentPos = center;
            var geocoderOption = {
                range : 300, // 范围
                crossnum : 2, // 道路交叉口数
                roadnum : 3, // 路线记录数
                poinum : 2 // POI点数
            };
            var geocoder = new AMap.Geocoder(geocoderOption);
            geocoder.regeocode(center, function(data) {
                currPosGeo = data;
                partition.byCity(data.list[0].city.citycode, function(data1) {
                    var cityname;
                    if (data1.status == "E0") {
                        cityname = data1.city.name;
                        console.log(cityname);
                    } else
                        cityname = data.list[0].city.citycode;
                    updateCity(cityname);
                });
            });
        });
    });
    //addTileLayer_TRAFFIC();
}

function addTileLayer_TRAFFIC() {
    mapObj.clearOverlays();
    Trafficlay = new AMap.TileLayer({
        tileSize : 256, //图像大小
        zIndex : 5,
        id : "realtime_traffic",
        getTileUrl : function(x, y, z) {
            return "http://tm.mapabc.com/trafficengine/mapabc/traffictile?v=1.0&;t=1&zoom=" + (17 - z) + "&x=" + x + "&y=" + y;
        }
    });
    mapObj.addLayer(Trafficlay);
}

function removeTileLayer_TRAFFIC() {
    mapObj.removeLayer("realtime_traffic");
}

function routeSearch() {
    this.routeSType = "s";
    //起始点
    this.cityname = "";
    this.start_x = "";
    this.start_y = "";
    this.start_name = "";
    this.start_address = "";
    this.start_displayname = "";
    this.start_tel = "";
    this.start_pid = "";
    this.start_citycode = "";
    this.start_cityname = "";
    this.start_detailLink = "";
    this.start_type = "";
    this.end_x = "";
    this.end_y = "";
    this.end_name = "";
    this.end_address = "";
    this.end_tel = "";
    this.end_pid = "";
    this.end_citycode = "";
    this.end_cityname = "";
    this.end_detailLink = "";
    this.end_type = "";
    this.end_displayname = "";
    this.x_array
    this.y_array
    this.x_c_array
    this.y_c_array
    this.xy_array
    this.xy_c_array
}

var routeS = new routeSearch();

function route_search() {
    routeS.cityname = document.getElementById("city").value;
    console.log("city:" + routeS.cityname);
    routeS.start_displayname = routeS.start_name = document.getElementById("startpoint").value;
    routeS.end_displayname = routeS.end_name = document.getElementById("endpoint").value;
    var i = 1;
    var che = "";
    if (routeS.cityname == "" || routeS.cityname == "城市名或区号") {
        che += i + "．请您输入城市名或区号\n";
        i = i + 1;
    }
    if (routeS.start_name == "") {
        che += i + "．请您输入起点";
        i = i + 1;
    }
    if (routeS.end_name == "") {
        che += i + "．请您输入终点";
        i = i + 1;
    }
    if (i == 1) {
        routeS.routeSType = "s";
        // start
        routeChange_search(routeS.cityname, routeS.start_name);
    } else {
        alert(che);
    }
}

function routeChange_search(city, keywords) {
    var PoiSearchOption = {
        number : 10, //每页数量
        batch : 1 //请求页数
    };
    if (keywords == MYPOS) {
        routeChange_useCurrPos();
    } else {
        var MSearch = new AMap.PoiSearch(PoiSearchOption);
        MSearch.byKeywords(keywords, city, routeChange_search_CallBack);
    }

}

function routeChange_useCurrPos() {
    routeS.start_x = currentPos.lng;
    routeS.start_y = currentPos.lat;
    routechange_EndSearch();
}

function routeChange_choose(option, index) {
    if (option == "s")
        routeS.start_displayname = query_data.list[index].name;
    else if (option == "e")
        routeS.end_displayname = query_data.list[index].name;
    routeChange_setStartEndInfo(option, query_data.list[index]);
}

function routeChange_multipleChoice(option, data) {
    var msg = "";
    for (var i = 0; i < data.record; i++) {
        msg += "<tr onclick=\"routeChange_choose('" + option + "'," + i + ");void(0);\"><td align=\"left\">" + (i + 1) + ". " + data.list[i].name + "</td></tr>";
    }
    var n;
    if (option == "s")
        n = "起点";
    else if (option == "e")
        n = "终点";
    else
        n = "error";
    var disp = "<table><td><tr><strong>" + n + "关键字对应多条结果，请选择：</strong></tr>" + msg + "</td></table>";
    document.getElementById("SearchResult").innerHTML = disp;
}

function routeChange_setStartEndInfo(option, data) {
    if (option == "s") {
        routeS.start_x = data.x;
        routeS.start_y = data.y;
        routeS.start_name = data.name;
        routeS.start_address = data.address;
        routeS.start_tel = data.tel;
        routeS.start_type = data.type;
        routeS.start_pid = data.pguid;
        routeS.start_citycode = data.citycode;
        routechange_EndSearch();
    } else if (option == "e") {
        routeS.end_x = data.x;
        routeS.end_y = data.y;
        routeS.end_name = data.name;
        routeS.end_address = data.address;
        routeS.end_tel = data.tel;
        routeS.end_type = data.type;
        routeS.end_pid = data.pguid;
        routeS.end_citycode = data.citycode;
        routeChangeSearchXY();
    }
}

var query_data;

function routeChange_search_CallBack(data) {
    query_data = data;
    if (routeS.routeSType == "s") {
        if (data.list == null) {
            document.getElementById("SearchResult").innerHTML = "起点未查找到任何结果!<br />建议：<br />1.请确保所有字词拼写正确。<br />2.尝试不同的关键字。<br />3.尝试更宽泛的关键字。";
        } else if (data.record == 1) {
            routeChange_setStartEndInfo("s", data.list[0]);
        } else {
            routeChange_multipleChoice("s", data);
        }
    } else if (routeS.routeSType == "e") {

        if (data.status == "E1") {
            document.getElementById("SearchResult").innerHTML = "终点未查找到任何结果!<br />建议：<br />1.请确保所有字词拼写正确。<br />2.尝试不同的关键字。<br />3.尝试更宽泛的关键字。";
        } else if (data.record == 1) {
            routeChange_setStartEndInfo("e", data.list[0]);
        } else {
            routeChange_multipleChoice("e", data);
        }
    }
}

function routechange_EndSearch() {
    routeS.routeSType = "e";
    routeChange_search(routeS.cityname, routeS.end_name);
}

function routeChangeSearchXY() {
    var avoidroad = document.getElementById("avoid").value;
    var startXY = new AMap.LngLat(routeS.start_x, routeS.start_y);
    var endXY = new AMap.LngLat(routeS.end_x, routeS.end_y);
    var routeSearchOption = {
        routeType : 4,
        // avoidType:2,
        // avoidName:"曹安公路"
    };
    if (avoidroad != null) {
        routeSearchOption.avoidType = 2;
        routeSearchOption.avoidName = avoidroad;
    }
    var arr = new Array();
    //经纬度坐标数组
    arr.push(startXY);
    arr.push(endXY);
    var routeSearch = new AMap.RouteSearch(routeSearchOption);
    routeSearch.getNaviPath(arr, routeChangeSearchXY_CallBack);
}

function routeChangeSearchXY_CallBack(data) {//TODO:增加与服务器交互
    // var json = JSON.stringify(data);
    // var conn = new XMLHttpRequest();
    // //conn.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
    // conn.onreadystatechange = function() {
    // console.log(conn.readyState);
    // console.log(conn.status);
    // if (conn.readyState == 4 && conn.status == 200) {
    // alert(conn.responseText);
    // }
    // }
    //
    // conn.open("GET", "../test3.html", true);
    // conn.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    // conn.send("q=a");
    // //console.log(json);

    routeChangeSearchXY_Display(data);
}

function routeChangeSearchXY_Display(data) {

    var resultStr = "";
    var route_count = data.count;
    var road_length = 0;
    if (data.status == "E0") {

        var route_text = new Array();
        var route_length = "";
        var route_content = new Array();
        routeS.xy_array = new Array();
        var arr = new Array();
        for (var i = 0; i < route_count; i++) {

            routeS.xy_array[i] = data.list[i].coor;
            //每条线路的坐标

            if (i == 0) {
                route_text.push("<tr id=\"tr_" + i + "\" onMouseover=\"driveLineDrawFoldline('" + i + "','" + route_count + "')\"  onMouseout=\"this.style.backgroundColor='';this.style.color='#eeeeee';\" onclick=\"driveLineDrawFoldline_click('" + i + "','" + route_count + "')\"><td align=\"left\">" + (i + 1) + ". " + "<span class=\"gray\">沿</span><strong>" + data.list[i].roadName + "</strong>向<strong>" + data.list[i].direction + "</strong><span class=\"gray\">行驶</span>" + " " + data.list[i].roadLength + "</td></tr>");
            } else {
                route_text.push("<tr id=\"tr_" + i + "\" onMouseover=\"driveLineDrawFoldline('" + i + "','" + route_count + "')\"  onMouseout=\"this.style.backgroundColor='';this.style.color='#eeeeee';\" onclick=\"driveLineDrawFoldline_click('" + i + "','" + route_count + "')\"><td align=\"left\">" + (i + 1) + ". " + "<strong>" + data.list[i - 1].action + "</strong>" + "<span class=\"gray\">进入</span><strong>" + data.list[i].roadName + "</strong>向<strong>" + data.list[i].direction + "</strong><span class=\"gray\">行驶</span>" + " " + data.list[i].roadLength + " " + "</td></tr>");
            }

            var allover = new Array();

            var poi_xy_r = data.list[i].coor.split(";");

            for (var j = 0; j < poi_xy_r.length; j++) {
                var arr_lnglat = new Array();
                arr_lnglat = poi_xy_r[j].split(",");
                arr.push(new AMap.LngLat(arr_lnglat[0], arr_lnglat[1]));
            }

        }
        var route_text_str = route_text.join("");

        var polyline = new AMap.Polyline({
            id : "polyline01",
            path : arr,
            strokeColor : "#003366",
            strokeOpacity : 0.8,
            strokeWeight : 4,

            strokeDasharray : [10, 5]
        });
        allover.push(polyline);

        var start = new AMap.LngLat(routeS.start_x, routeS.start_y);

        var marker_start = new AMap.Marker({
            id : "qd",
            position : start,
            icon : "./images/qd.png",
            offset : new AMap.Pixel(-15, -36)
        });

        allover.push(marker_start);

        var end = new AMap.LngLat(routeS.end_x, routeS.end_y);

        var marker_end = new AMap.Marker({
            id : "zd",
            position : end,
            icon : "./images/zd.png",
            offset : new AMap.Pixel(-15, -36)
        });
        allover.push(marker_end);
        mapObj.addOverlays(allover);
        mapObj.setFitView(allover);
        route_content.push("<table border=\"0\" cellspacing=\"0\" cellpadding=\"0\" ><tr><td style=\"background:#e1e1e1;color:black;\">路线</td></tr>" + route_text_str + "</table>");

        resultStr = route_content.join("");

    } else if (data.status != "E0") {

        resultStr = "没有找到搜索结果,请确保关键字是否正确。";
    }
    document.getElementById("SearchResult").innerHTML = resultStr;
}

function driveLineDrawFoldline(num, count) {//画线路并控制左边列表.num为第几条线路,count全部线路数.

    var tr_id = "tr_" + num;

    document.getElementById(tr_id).style.background = '#efefef';
    document.getElementById(tr_id).style.color = 'black';

    var arr = new Array();
    var poi_xy_r = new Array();

    poi_xy_r = routeS.xy_array[num].split(";");
    for (var j = 0; j < poi_xy_r.length; j++) {
        var arr_lnglat = new Array();
        arr_lnglat = poi_xy_r[j].split(",");
        arr.push(new AMap.LngLat(arr_lnglat[0], arr_lnglat[1]));
    }
    var line = new AMap.Polyline({
        id : "polyline_click",
        path : arr,
        strokeColor : "#F00",
        strokeOpacity : 0.8,
        strokeWeight : 4,
        strokeDasharray : [10, 5]
    });
    mapObj.addOverlays(line);

}

function driveLineDrawFoldline_click(num, count) {//画线路并控制左边列表.num为第几条线路,count全部线路数.

    var tr_id = "tr_" + num;

    document.getElementById(tr_id).style.background = '#efefef';

    var arr = new Array();
    var poi_xy_r = new Array();

    poi_xy_r = routeS.xy_array[num].split(";");
    for (var j = 0; j < poi_xy_r.length; j++) {
        var arr_lnglat = new Array();
        arr_lnglat = poi_xy_r[j].split(",");
        arr.push(new AMap.LngLat(arr_lnglat[0], arr_lnglat[1]));
    }
    var line = new AMap.Polyline({
        id : "polyline_click",
        path : arr,
        strokeColor : "#F00",
        strokeOpacity : 0.8,
        strokeWeight : 4,
        strokeDasharray : [10, 5]
    });
    mapObj.addOverlays(line);
    mapObj.setCenter(arr[parseInt(arr.length / 2)]);
}

function updateCity(city_name) {
    console.log(city_name);
    $("#city").val(city_name);
    $("p#CityName").html(city_name);
}
