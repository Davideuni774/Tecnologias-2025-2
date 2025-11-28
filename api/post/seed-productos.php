<?php
// api/post/seed-productos.php - Inserta productos iniciales si la tabla 'productos' está vacía
// Ejecutar manualmente visitando este archivo en el navegador o via fetch. Devuelve JSON.
include_once __DIR__ . '/../cors.php';
header('Content-Type: application/json; charset=utf-8');

include_once __DIR__ . '/../../Phps/db_config.php';
if (!isset($conn) || $conn->connect_errno) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Error conexión DB']);
    exit;
}

$tblCheck = $conn->query("SHOW TABLES LIKE 'productos'");
if (!$tblCheck || $tblCheck->num_rows === 0) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => "Tabla 'productos' no existe"]);
    exit;
}

$res = $conn->query("SELECT COUNT(*) AS c FROM productos");
$row = $res ? $res->fetch_assoc() : ['c' => 0];
$count = (int)$row['c'];
if ($count > 0) {
    echo json_encode(['success' => true, 'message' => 'Tabla ya tiene datos', 'existing' => $count]);
    $conn->close();
    exit;
}

// Semillas iniciales (nombre, precio, categoria, stock)
$seed = [
    ['Tyler Joseph (llavero)', 12000, 'figuras_personalizadas', 25],
    ['Josh Dun (llavero)', 12000, 'figuras_personalizadas', 20],
    ['Ned TOP (llavero)', 20000, 'figuras_personalizadas', 40],
    ['Johannes Eckerstrom', 45000, 'figuras_personalizadas', 20],
    ['Johannes Eckerstrom Avatar', 25000, 'modelos_3d', 25],
    ['Joey Jordison Slipknot', 25000, 'modelos_3d', 20],
    ['Ned Twenty One Pilots Modelo 3D', 20000, 'modelos_3d', 40],
    ['Saorix Caballeros del Zodiaco', 85000, 'modelos_3d', 15],
    ['Cofres/Madera personalizados', 45000, 'pregrabado_madera', 35],
    ['Tankards (Pocillos) personalizados', 30000, 'pregrabado_madera', 20],
    ['Escudo vikingo de madera', 350000, 'pregrabado_madera', 40],
    ['Cuadros personalizados', 35000, 'pregrabado_madera', 35],
    ['Accesorios Ghost', 25000, 'props', 15],
    ['Papa Emeritus II Ghost / Cetro', 180000, 'props', 10],
    ['Manos Robot Cyberpunk', 450000, 'props', 30],
    ['Collar banda Ghost', 5000, 'accesorios', 20],
    ['Collar Linkin Park', 5000, 'accesorios', 40],
    ['Aretes Monster Draculaura', 8000, 'accesorios', 20],
    ['Aretes y Collar Banda Avatar', 10000, 'accesorios', 25]
];

$inserted = 0; $errors = [];
$stmt = $conn->prepare("INSERT INTO productos (nombre, precio, categoria, stock) VALUES (?, ?, ?, ?)");
if (!$stmt) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Error preparando statement: ' . $conn->error]);
    exit;
}
foreach ($seed as $p) {
    [$nombre, $precio, $categoria, $stock] = $p;
    $stmt->bind_param('sisi', $nombre, $precio, $categoria, $stock);
    if ($stmt->execute()) { $inserted++; } else { $errors[] = $nombre . ': ' . $stmt->error; }
}
$stmt->close();
$conn->close();

echo json_encode([
    'success' => true,
    'message' => 'Semillas insertadas',
    'inserted' => $inserted,
    'errors' => $errors
]);
