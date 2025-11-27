<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Configuración de la base de datos para InfinityFree
$servername = "sql212.infinityfree.com";
$username = "if0_40294133";
$password = "AvatarGhost666";
$dbname = "if0_40294133_usuarios_web";

// Crear conexión
$conn = new mysqli($servername, $username, $password, $dbname);

// Verificar conexión
if ($conn->connect_error) {
    echo json_encode([
        'success' => false,
        'message' => 'Error de conexión: ' . $conn->connect_error
    ]);
    exit;
}

// Establecer charset para evitar problemas con caracteres especiales
$conn->set_charset("utf8");

// Respuesta de éxito
echo json_encode([
    'success' => true,
    'message' => 'Conexión exitosa a la base de datos'
]);
?>
