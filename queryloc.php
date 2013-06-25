<?php

//调试信息
require_once("./FirePHPCore/fb.php");
ob_start();
fb($_POST['query'], FirePHP::INFO);


$servername = "localhost:8889";
$username = "root";
$password = "root";

class Lnglat {

    public $lng;
    public $lat;

    public function __construct($_lng, $_lat) {
        $this->lng = $_lng;
        $this->lat = $_lat;
    }

}

class Result {

    public $count;
    public $list;

    public function __construct($_list) {
        $this->count = count($_list);
        $this->list = $_list;
    }

    public function toJSON() {
        return json_encode($this);
    }

}

$query = $_POST['query'];
$bounds = json_decode($query);
fb($bounds->southwest->lng);

$conn = mysql_connect($servername, $username, $password);
if (!$conn) {
    fb('DB connection', FirePHP::ERROR);
    die("ERR");
}
mysql_query("set names 'UTF8'", $conn);

mysql_select_db("ProjectRouter", $conn);

$list = array(); //记录是不是库里没有查询路段
$result = mysql_query("SELECT * FROM PR WHERE LNG >= " . $bounds->southwest->lng
        . " AND LNG <= " . $bounds->northeast->lng
        . " AND LAT >= " . $bounds->southwest->lat
        . " AND LAT <= " . $bounds->northeast->lat);

fb($result, FirePHP::WARN);

if ($result) {
    $ress = null;
    while ($ress = mysql_fetch_array($result)) {
        array_push($list, new Lnglat($ress['LNG'], $ress['LAT']));
    }
} else {
    mysql_close($conn); //异常退出
    fb("inside foreach", FirePHP::ERROR);
    die("ERR");
}

$returnVal = new Result($list);
fb($returnVal->toJSON());

echo $returnVal->toJSON();
mysql_close($conn);

?>
