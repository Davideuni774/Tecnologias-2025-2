<?php
// Phps/test_connection.php
// Uso: sube este archivo al servidor, edita `config.php` con tus credenciales,
// y accede a este archivo desde el navegador para ver el resultado de la conexión.
require_once __DIR__ . '/config.php';

$mysqli = db_connect();
if (!$mysqli) {
    echo "Error: no se pudo crear el objeto de conexión.";
    exit;
}

if ($mysqli->connect_error) {
    echo '<h3>Conexión fallida</h3>';
    echo '<p>Mensaje: ' . htmlspecialchars($mysqli->connect_error) . '</p>';
    exit;
}

echo '<h3>Conexión correcta a MySQL</h3>';
echo '<p>Servidor: ' . htmlspecialchars(DB_HOST) . '</p>';
echo '<p>Base de datos: ' . htmlspecialchars(DB_NAME) . '</p>';

// Listar tablas para confirmar que la importación funcionó
$res = $mysqli->query('SHOW TABLES');
if (!$res) {
    echo '<p>Error al listar tablas: ' . htmlspecialchars($mysqli->error) . '</p>';
} else {
    echo '<h4>Tablas encontradas:</h4>';
    echo '<ul>';
    while ($row = $res->fetch_array()) {
        echo '<li>' . htmlspecialchars($row[0]) . '</li>';
    }
    echo '</ul>';
}

$mysqli->close();

?>
