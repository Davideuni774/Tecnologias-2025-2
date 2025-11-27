<?php
// Phps/config.php - Configuración local para Draconis

define('DB_HOST', 'localhost');
define('DB_USER', 'root');
define('DB_PASS', '');
define('DB_NAME', 'Draconis');

function db_connect() {
    $mysqli = new mysqli(DB_HOST, DB_USER, DB_PASS, DB_NAME);
    if ($mysqli->connect_error) {
        return $mysqli; // devolvemos el objeto para inspección
    }
    $mysqli->set_charset('utf8mb4');
    return $mysqli;
}

// Habilitar errores para diagnóstico local (desactivar en producción)
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);
?>
