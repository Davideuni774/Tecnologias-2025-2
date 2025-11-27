<?php
// Configuración de la base de datos para InfinityFree
$servername = "sql212.infinityfree.com";
$username = "if0_40294133";
$password = "AvatarGhost666";
$dbname = "if0_40294133_usuarios_web";

// Crear conexión
$conn = new mysqli($servername, $username, $password, $dbname);

// Verificar conexión
if ($conn->connect_error) {
    die("Conexión fallida: " . $conn->connect_error);
}

// Establecer charset para evitar problemas con caracteres especiales
$conn->set_charset("utf8");
?>
