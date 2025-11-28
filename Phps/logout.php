<?php
session_start();

// Destruir todas las variables de sesión
$_SESSION = array();

// Destruir la sesión
session_destroy();

// Si es una petición AJAX (detectada por header o parámetro), devolver JSON
if (isset($_GET['ajax']) || (isset($_SERVER['HTTP_X_REQUESTED_WITH']) && strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) == 'xmlhttprequest')) {
    header('Content-Type: application/json');
    echo json_encode(['success' => true, 'message' => 'Sesión cerrada']);
    exit();
}

// Redirigir al inicio (comportamiento clásico)
header("Location: ../index.html");
exit();
?>
