<?php
// api/post/obtener-producto.php - Devuelve detalle JSON de un producto por id
header('Content-Type: application/json; charset=utf-8');

include_once __DIR__ . '/../../Phps/db_config.php';

if (!isset($conn) || $conn->connect_errno) {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "Error de conexión a la base de datos."]); 
    exit;
}

$id = isset($_GET['id']) ? intval($_GET['id']) : 0;
if ($id <= 0) {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "Parámetro 'id' inválido."]); 
    exit;
}

// Verificar existencia tabla
$tblCheck = $conn->query("SHOW TABLES LIKE 'productos'");
if (!$tblCheck || $tblCheck->num_rows === 0) {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "La tabla 'productos' no existe."]); 
    exit;
}

// Intentar incluir columna descripcion si existe
$hasDescripcion = false;
$colRes = $conn->query("SHOW COLUMNS FROM productos LIKE 'descripcion'");
if ($colRes && $colRes->num_rows > 0) { $hasDescripcion = true; }

$cols = "id, nombre, precio, stock, referencia, imagen, categoria, created_at";
if ($hasDescripcion) { $cols = "id, nombre, precio, stock, referencia, imagen, categoria, descripcion, created_at"; }

$sql = "SELECT $cols FROM productos WHERE id = ? LIMIT 1";
$stmt = $conn->prepare($sql);
if (!$stmt) {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "Error al preparar consulta: " . $conn->error]);
    exit;
}
$stmt->bind_param('i', $id);
$stmt->execute();
$res = $stmt->get_result();
if (!$res || $res->num_rows === 0) {
    http_response_code(404);
    echo json_encode(["success" => false, "message" => "Producto no encontrado."]); 
    exit;
}
$row = $res->fetch_assoc();

$imagenUrl = $row['imagen'] ? ("imagenes/" . $row['imagen']) : '';

$data = [
    'id' => (int)$row['id'],
    'nombre' => $row['nombre'],
    'precio' => isset($row['precio']) ? (float)$row['precio'] : 0,
    'stock' => isset($row['stock']) ? (int)$row['stock'] : null,
    'referencia' => $row['referencia'],
    'imagen' => $imagenUrl,
    'categoria' => $row['categoria'],
    'created_at' => $row['created_at']
];
if ($hasDescripcion) { $data['descripcion'] = $row['descripcion']; }

echo json_encode(["success" => true, "data" => $data]);
$stmt->close();
$conn->close();
?>