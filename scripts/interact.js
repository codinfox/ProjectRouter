/**
 * 用于处理用户交互的细节
 */
var panelShown = true;

$(document).ready(function() {
    $("img#SidebarButton").click(function() { //控制边栏
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
}); 