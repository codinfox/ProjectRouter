<?php
    require_once("./FirePHPCore/fb.php");
    ob_start();
    fb($_POST['hello'], FirePHP::WARN);
?>