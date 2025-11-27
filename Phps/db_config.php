<?php
// db_config.php - configuración central de base de datos
// Edita estas constantes con los datos que te da InfinityFree (panel -> MySQL Databases)
// Host MySQL desde el panel InfinityFree (ej. sql100.infinityfree.com)
define('DB_HOST', 'sql100.infinityfree.com');
define('DB_USER', 'if0_40533728');
define('DB_PASS', 'Lucasymd12');
define('DB_NAME', 'if0_40533728_mibasedatos');

// Crear conexión
$conn = new mysqli(DB_HOST, DB_USER, DB_PASS, DB_NAME);
$conn_error = null;
if ($conn->connect_errno) {
    $conn_error = $conn->connect_error;
    error_log('DB connection error: ' . $conn_error);
    // No finalizar con die() para permitir al script que incluya este archivo manejar el error.
    // Los scripts deben comprobar si $conn es null o si $conn->connect_errno está presente.
}
$conn->set_charset('utf8mb4');

?>
