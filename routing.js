//Constants
var MYPOS = "我的位置";
//---------

var mapObj, toolbar, overview;
var currentPos, currPosGeo;

function mapInit() {
    var opt = {
        level : 13,
        center : new AMap.LngLat(116.397428, 39.90923),
        doubleClickZoom : true,
        scrollWheel : true
    }
    mapObj = new AMap.Map("iCenter", opt);
    AMap.Conf.network = 1;
    mapObj.plugin(["AMap.ToolBar", "AMap.OverView"], function() {
        toolbar = new AMap.ToolBar({
            autoPosition : true,
            ruler : false,
            direction : true
        });
        mapObj.addControl(toolbar);
        overview = new AMap.OverView();
        mapObj.addControl(overview);
        mapObj.bind(toolbar, "location", function(e) {
            var center = e.position.center;
            currentPos = center;
            console.log(center);
            var geocoderOption = {
                range : 300, // 范围
                crossnum : 2, // 道路交叉口数
                roadnum : 3, // 路线记录数
                poinum : 2 // POI点数
            };
            var geocoder = new AMap.Geocoder(geocoderOption);
            geocoder.regeocode(center, function(data) {
                currPosGeo = data;
                console.log(data);
                document.getElementById("city").value = data.list[0].city.citycode;
            });
        });
    });
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
    routeS.start_displayname = routeS.start_name = document.getElementById("keyword").value;
    routeS.end_displayname = routeS.end_name = document.getElementById("keyword1").value;
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
    routeS.start_x = currPosGeo.list[0].poilist[0].x;
    routeS.start_y = currPosGeo.list[0].poilist[0].y;
    routeS.start_name = currPosGeo.list[0].poilist[0].name;
    routeS.start_address = currPosGeo.list[0].poilist[0].address;
    routeS.start_tel = currPosGeo.list[0].poilist[0].tel;
    routeS.start_type = currPosGeo.list[0].poilist[0].type;
    routeS.start_pid = currPosGeo.list[0].poilist[0].pguid;
    routeS.start_citycode = currPosGeo.list[0].poilist[0].citycode;
    routechange_EndSearch();
}

function routeChange_search_CallBack(data) {
    if (routeS.routeSType == "s") {
        if (data.list == null) {
            document.getElementById("result").innerHTML = "起点未查找到任何结果!<br />建议：<br />1.请确保所有字词拼写正确。<br />2.尝试不同的关键字。<br />3.尝试更宽泛的关键字。";
        } else {
            routeS.start_x = data.list[0].x;
            routeS.start_y = data.list[0].y;
            routeS.start_name = data.list[0].name;
            routeS.start_address = data.list[0].address;
            routeS.start_tel = data.list[0].tel;
            routeS.start_type = data.list[0].type;
            routeS.start_pid = data.list[0].pguid;
            routeS.start_citycode = data.list[0].citycode;
            routechange_EndSearch();

        }
    } else if (routeS.routeSType == "e") {

        if (data.status == "E1") {
            document.getElementById("result").innerHTML = "终点未查找到任何结果!<br />建议：<br />1.请确保所有字词拼写正确。<br />2.尝试不同的关键字。<br />3.尝试更宽泛的关键字。";
        } else {
            routeS.end_x = data.list[0].x;
            routeS.end_y = data.list[0].y;
            routeS.end_name = data.list[0].name;
            routeS.end_address = data.list[0].address;
            routeS.end_tel = data.list[0].tel;
            routeS.end_type = data.list[0].type;
            routeS.end_pid = data.list[0].pguid;
            routeS.end_citycode = data.list[0].citycode;
            routeChangeSearchXY();
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

function routeChangeSearchXY_CallBack(data) {

    var resultStr = "";
    var route_count = data.count;
    var road_length = 0;
    if (data.status == "E0") {

        var route_text = "";
        var route_length = "";
        var route_content = new Array();
        routeS.xy_array = new Array();
        var arr = new Array();
        //console.log(routeS);
        for (var i = 0; i < route_count; i++) {

            routeS.xy_array[i] = data.list[i].coor;
            //每条线路的坐标

            if (i == 0) {
                route_text += "<tr id=\"tr_" + i + "\" onMouseover=\"driveLineDrawFoldline('" + i + "','" + route_count + "')\"  onMouseout=\"this.style.backgroundColor='';\" onclick=\"driveLineDrawFoldline_click('" + i + "','" + route_count + "')\"><td align=\"left\">" + (i + 1) + ". " + "<span class=\"gray\">沿</span><strong>" + data.list[i].roadName + "</strong>向<strong>" + data.list[i].direction + "</strong><span class=\"gray\">行驶</span>" + " " + data.list[i].roadLength + "</td></tr>";
            } else {
                route_text += "<tr id=\"tr_" + i + "\" onMouseover=\"driveLineDrawFoldline('" + i + "','" + route_count + "')\"  onMouseout=\"this.style.backgroundColor='';\" onclick=\"driveLineDrawFoldline_click('" + i + "','" + route_count + "')\"><td align=\"left\">" + (i + 1) + ". " + "<strong>" + data.list[i - 1].action + "</strong>" + "<span class=\"gray\">进入</span><strong>" + data.list[i].roadName + "</strong>向<strong>" + data.list[i].direction + "</strong><span class=\"gray\">行驶</span>" + " " + data.list[i].roadLength + " " + "</td></tr>";
            }

            var allover = new Array();

            var poi_xy_r = data.list[i].coor.split(";");

            for (var j = 0; j < poi_xy_r.length; j++) {
                var arr_lnglat = new Array();
                arr_lnglat = poi_xy_r[j].split(",");
                arr.push(new AMap.LngLat(arr_lnglat[0], arr_lnglat[1]));
            }

        }

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
        route_content.push("<table border=\"0\" cellspacing=\"0\" cellpadding=\"0\" ><tr><td style=\"background:#e1e1e1;\">路线</td></tr><tr><td><img src=\"http://code.mapabc.com/images/start.gif\" />起点：" + routeS.start_displayname + "</td></tr>" + route_text + "<tr><td><img src=\"http://code.mapabc.com/images/end.gif\" />终点：" + routeS.end_displayname + "</td></tr></table>");

        resultStr = route_content.join("");

    } else if (data.status != "E0") {

        resultStr = "没有找到搜索结果,请确保关键字是否正确。";
    }
    document.getElementById("result").innerHTML = resultStr;
}

function driveLineDrawFoldline(num, count) {//画线路并控制左边列表.num为第几条线路,count全部线路数.

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

function TipContents(type, address, tel) {

    if (type == "" || type == "undefined" || type == null || type == " undefined" || typeof type == "undefined") {

        type = "暂无";
    }

    if (address == "" || address == "undefined" || address == null || address == " undefined" || typeof address == "undefined") {

        address = "暂无";
    }

    if (tel == "" || tel == "undefined" || tel == null || tel == " undefined" || typeof address == "tel") {

        tel = "暂无";

    }

    var str = "<br>地址：" + address + "<br>电话：" + tel + " <br>类型：" + type;

    return str;
}
