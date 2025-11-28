<?php
// api/post/listar-productos.php - Devuelve lista JSON de productos
include_once __DIR__ . '/../cors.php';
header('Content-Type: application/json; charset=utf-8');

include_once __DIR__ . '/../../Phps/db_config.php';

if (!isset($conn) || $conn->connect_errno) {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "Error de conexión a la base de datos."]); 
    exit;
}

// Verificar existencia tabla
$tblCheck = $conn->query("SHOW TABLES LIKE 'productos'");
if (!$tblCheck || $tblCheck->num_rows === 0) {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "La tabla 'productos' no existe."]); 
    exit;
}

$sql = "SELECT id, nombre, precio, stock, referencia, imagen, categoria, created_at FROM productos ORDER BY id DESC";
$res = $conn->query($sql);
if (!$res) {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "Error al consultar productos: " . $conn->error]);
    exit;
}

$productos = [];
while ($row = $res->fetch_assoc()) {
    // Construir URL de imagen si existe archivo
    $img = $row['imagen'] ? ("imagenes/" . $row['imagen']) : '';
    $productos[] = [
        'id' => (int)$row['id'],
        'nombre' => $row['nombre'],
        'precio' => (float)$row['precio'],
        'stock' => isset($row['stock']) ? (int)$row['stock'] : null,
        'referencia' => $row['referencia'],
        'imagen' => $img,
        'categoria' => $row['categoria'],
        'created_at' => $row['created_at']
    ];
}

echo json_encode(["success" => true, "count" => count($productos), "data" => $productos]);
$res->free();
$conn->close();
?>
