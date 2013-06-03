/**
 * @author Ben
 */

function refreshCongPoints() {
    mapObj.clearOverlays();
    var bounds = mapObj.getBounds();
    //查询数据库
    var marker1 = new AMap.Marker({
        id : "m",
        position : new AMap.LngLat(121.49868, 31.28540),
        offset : new AMap.Pixel(-8, -34),
        icon : "images/mark.png"
    });
    var marker2 = new AMap.Marker({
        id : "n",
        position : new AMap.LngLat(121.49855, 31.28540),
        offset : new AMap.Pixel(-8, -34),
        icon : "images/mark.png"
    });
    // 自定义构造AMap.Marker对象
    mapObj.addOverlays(marker1);
    mapObj.addOverlays(marker2);
    //加载覆盖物

}
