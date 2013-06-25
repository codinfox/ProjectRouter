<?php
require_once("./FirePHPCore/fb.php");
ob_start();
fb($_POST['msg'], FirePHP::INFO);

function insertMsg() {
    $servername = "localhost:8889";
    $username = "root";
    $password = "root";

    $query = $_POST['query'];
    $point = json_decode($query);

    $conn = mysql_connect($servername, $username, $password);
    if (!$conn) {
        fb('DB connection', FirePHP::ERROR);
        die("ERR");
    }
    mysql_query("set names 'UTF8'", $conn);

    mysql_select_db("ProjectRouter", $conn);

    $sql = "INSERT INTO EMER(MSG) VALUES('" . $_POST['msg'] . "')";
    
    fb(mysql_query($sql));

    fb($sql);
    mysql_close($conn);
}

if ($_POST['msg'])    insertMsg();
?>

<!DOCTYPE html>
<html>
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
        <meta name="viewport" content="initial-scale=1.0, user-scalable=no, width=device-width" >
        <meta name="apple-mobile-web-app-capable" content="yes">
        <link rel="stylesheet" href="style.css" type="text/css" />

        <title>New Message</title>
        <style>
            body {
                margin:0;background: #444444;
            }
            form {
                height:300px;
                width:600px;
                background:white;
                position:fixed;
                top:50%;
                left:50%;
                margin-top:-150px;
                margin-left:-300px;
                text-align: center;

                -webkit-box-shadow: 1px 1px 20px #292929, -1px -1px 20px #292929;
                -moz-box-shadow: 1px 1px 20px #292929, -1px -1px 20px #292929;
                box-shadow: 1px 1px 20px #292929, -1px -1px 20px #292929;

            }
            textarea {
                margin-top: 40px;
                border:none;
                width:85%;
                height: 160px;
                background: #e8e8e8;
                font-size: 1.5em;
                padding: 10px 10px 10px 10px;
            }
            input {
                margin-top: 20px;
                border:none;
                heigth: 60px;
                width: 100px;
                font-size: 1.4em;
                background: black;
                color: white;
            }
        </style>
    </head>

    <body>

        <form action="NewMessage.php" method="POST">
            <textarea name="msg" placeholder="在这里输入需要公告的信息"></textarea><br/>
            <input type="submit" value="广  播" />
        </form>

    </body>
</html>
