<?php
$conn = new mysqli("localhost", "root", "", "patacon_pisao");

if ($conn->connect_error) {
    die("Error de conexión");
}
?>
