/**
 * 用于处理用户交互的细节
 */
var panelShown = true;

$(document).ready(function() {
    var availHeight = document.body.clientHeight;
    var tmp = availHeight - 240;
    $("#SearchResult").css("height", tmp);
    
    $("#SidebarButton").click(function() { //控制边栏
        var $sp = $("div#SearchPanel");
        var $map = $("div#MapView");
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
    });
    
    $("#UseCurrentPos").click(function(){//使用当前位置，即将起点设置为MYPOS，定义在routing.js
        toolbar.doLocation();
        $("#startpoint").val(MYPOS);
    });
    
    $("#LocBlue").click(function(){
        toolbar.doLocation();
    });
    
    $("#Search").click(function(){
        //这里处理搜索的动作，转到routing.js的业务逻辑
        route_search();
    });
    
    $(".inputBox").focus(function(){
        $(this).css("color","black");
        $(this).val("");
    });
    
    function toggleChoosePanel(){
        $("#CityChooseBox").slideToggle(250);
    }
    
    $("#CityChoose").click(toggleChoosePanel);
        
    $("#CityCommit").click(function(){
        var a = $("#inputCityBox").val();
        updateCity(a);
        toggleChoosePanel();
    });
    
    $("#CityChooseBox .cityname").click(function(){
        var a = $(this).html();
        console.log("choose city: " + a);
        updateCity(a);
        toggleChoosePanel();
    });
}); 