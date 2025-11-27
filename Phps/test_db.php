<?php
// Phps/test_db.php - prueba simple de conexión usando Phps/db_config.php
header('Content-Type: application/json; charset=utf-8');
include_once __DIR__ . '/db_config.php';

if (!isset($conn) || ($conn instanceof mysqli && $conn->connect_errno)) {
    $err = isset($conn_error) ? $conn_error : 'Unknown connection error';
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'No se pudo conectar a la base de datos', 'error' => $err]);
    exit;
}

$res = $conn->query('SHOW TABLES');
$tables = [];
if ($res) {
    while ($row = $res->fetch_array()) {
        $tables[] = $row[0];
    }
}

echo json_encode(['success' => true, 'message' => 'Conexión OK', 'tables' => $tables]);

?>
