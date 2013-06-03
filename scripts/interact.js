/**
 * 用于处理用户交互的细节
 */
var panelShown = true;

function toggleSearchPanel() {//控制边栏
    var $sp = $("div#SearchPanel");
    var $map = $("div#MapView");
    $sp.clearQueue();
    $map.clearQueue();
    if (panelShown) {
        panelShown = false;
        $sp.animate({
            left : '-255px',
        }, 250);
        $map.animate({
            left : '0px',
        }, 250);
    } else {
        panelShown = true;
        $sp.animate({
            left : '0px',
        }, 250);
        $map.animate({
            left : '255px',//原本应该是250，但是有5px的阴影
        }, 250);
    }
}

function searchResultResize() {
    var availHeight = document.body.clientHeight;
    var tmp = availHeight - 235;
    $("#SearchResult").css("height", tmp);//初始设置result栏的高度，自适应屏幕
}

$(document).ready(function() {
    searchResultResize();
    
    $(window).resize(searchResultResize);
    
    // $("#SearchResult").mouseenter(function() {
        // $(this).css('overflow-y','auto');
    // });
    // $("#SearchResult").mouseleave(function() {
        // $(this).css('overflow-y','hidden');
    // });

    $("#SidebarButton").click(toggleSearchPanel);

    $("#UseCurrentPos").click(function() {//使用当前位置，即将起点设置为MYPOS，定义在routing.js
        toolbar.doLocation();
        $("#startpoint").val(MYPOS);
    });

    $("#LocBlue").click(function() {
        toolbar.doLocation();
    });

    $("#Search").click(function() {
        //这里处理搜索的动作，转到routing.js的业务逻辑
        route_search();
    });

    $(".inputBox").focus(function() {
//        $(this).css("color", "black");
        $(this).val("");
    });

    function toggleChoosePanel() {
        $("#CityChooseBox").slideToggle(250);
    }


    $("#CityChoose").click(toggleChoosePanel);

    $("#CityCommit").click(function() {
        var a = $("#inputCityBox").val();
        if (a == "") a = "上海";
        updateCity(a);
        toggleChoosePanel();
    });

    $("#CityChooseBox .cityname").click(function() {
        var a = $(this).html();
        console.log("choose city: " + a);
        updateCity(a);
        toggleChoosePanel();
    });

    var realtimetraff = false;
    $("#RealTimeSwitch").click(function() {
        var on, off;
        if (isRetinaScreen) {
            on = "./images/rton@2x.png";
            off = "./images/rt@2x.png";
        } else {
            off = "./images/rt.png";
            on = "./images/rton.png";
        }
        if (!realtimetraff) {
            $(this).attr("src", on);
            addTileLayer_TRAFFIC();
            realtimetraff = true;
        } else {
            $(this).attr("src", off);
            removeTileLayer_TRAFFIC();
            realtimetraff = false;
        }

    });

});

function html5error() {
    alert("您的浏览器不支持一个或者多个HTML5特性……我不能正常工作啦！！要不您考虑下换个浏览器（比如最新的Chrome或Firefox）？");
}
