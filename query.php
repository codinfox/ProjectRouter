<?php

//调试信息
require_once("./FirePHPCore/fb.php");
ob_start();
fb($_POST['query'], FirePHP::INFO);

$servername = "localhost:8889";
$username = "root";
$password = "root";

$query = $_POST['query'];
$roads = json_decode($query);

$conn = mysql_connect($servername, $username, $password);
if (!$conn) {
    fb('DB connection', FirePHP::ERROR);
    die("ERR");
}
mysql_query("set names 'UTF8'", $conn);

mysql_select_db("ProjectRouter", $conn);

$avoid = array(); //记录是不是库里没有查询路段
foreach ($roads as $road) {
    $result = mysql_query("SELECT * FROM PR WHERE CITY='" . $_POST['city'] . "' AND ROAD='" . $road . "'");
    if ($result) {
        if (mysql_fetch_array($result, MYSQL_ASSOC)) {
            array_push($avoid, $road);
        }
    } else {
        mysql_close($conn); //异常退出
        fb("inside foreach", FirePHP::ERROR);
        die("ERR");
        break;
    }
}
//array_push($avoid, "曹安公路");//for test
//array_push($avoid, "绿苑路");
if (count($avoid) == 0) {
    echo 'OK';
    fb("OK", FirePHP::INFO);
} else {
    $json_arr = json_encode($avoid);
    fb($json_arr, FirePHP::WARN);
    echo $json_arr;
}

mysql_close($conn);
?>