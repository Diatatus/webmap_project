<?php

$host = "127.0.0.1";
$user = "postgres";
$password = "geopass";
$dbname = "bee_db";

$con = pg_connect("host=$host dbname=$dbname user=$user password=$password");

if(!$con){
    die("Connection failed.");
}

?>