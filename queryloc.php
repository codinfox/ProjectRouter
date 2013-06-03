<?php

//调试信息
require_once("./FirePHPCore/fb.php");
ob_start();
fb($_POST['query'], FirePHP::INFO);

$servername = "localhost:8889";
$username = "root";
$password = "root";

$query = $_POST['query'];
$bounds = json_decode($query);
fb($bounds->southwest->lng);

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

$list = array();
array_push($list, new Lnglat(111, 222));
array_push($list, new Lnglat(333, 444));

$res = new Result($list);
fb($res->toJSON());

?>
