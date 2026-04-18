<?php
$conn = new mysqli("localhost", "root", "", "patacon_pisao");

$usuario = $_POST['usuario'];
$clave = $_POST['clave'];

$sql = "SELECT * FROM usuarios WHERE usuario='$usuario' AND clave='$clave'";
$result = $conn->query($sql);

if ($result->num_rows > 0) {
    header("Location: ../frontend/menu.html");
} else {
    echo "Usuario incorrecto";
}
?>
