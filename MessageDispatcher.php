<?php
require_once("./FirePHPCore/fb.php");
ob_start();

    
include("./mysqlinfo.php");

$conn = mysql_connect($servername, $username, $password);
if (!$conn) {
    fb('DB connection', FirePHP::ERROR);
    die("ERR");
}
mysql_query("set names 'UTF8'", $conn);

mysql_select_db("ProjectRouter", $conn);

$result = mysql_query("select * from EMER order by ID desc limit 1");
$msg = null;
$msgid = 0;
if ($result) {
    $ress = null;
    while ($ress = mysql_fetch_array($result)) {
        $msg = $ress['MSG'];
        $msgid = $ress['ID'];
    }
}
//mysql_close($conn);

header('Content-Type: text/event-stream');
header('Cache-Control: no-cache');

echo "id: {$msgid}\n";
echo "data: {$msg}\n\n";
flush();
?>