<?php

//调试信息
require_once("./FirePHPCore/fb.php");
ob_start();
fb($_POST['query'], FirePHP::INFO);

include("./mysqlinfo.php");

$query = $_POST['query'];
$point = json_decode($query);

$conn = mysql_connect($servername, $username, $password);
if (!$conn) {
    fb('DB connection', FirePHP::ERROR);
    die("ERR");
}
mysql_query("set names 'UTF8'", $conn);

mysql_select_db("ProjectRouter", $conn);

$sql = "INSERT INTO PR(LNG, LAT, ROAD, CITY) VALUES("
        . "'" . $point->lng . "',"
        . "'" . $point->lat . "',"
        . "'" . $point->road . "',"
        . "'" . $point->city . "')";

fb($sql);

if (!mysql_query($sql, $conn)) {
    mysql_close($conn);
    die('ERR');
}
echo "OK";
mysql_close($conn);
?>
