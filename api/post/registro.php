<?php
include_once __DIR__ . '/../cors.php';
header("Content-Type: application/json; charset=utf-8");

// Leer JSON de entrada
$raw = file_get_contents("php://input");
$data = $raw ? json_decode($raw, true) : null;

if (!$data || !is_array($data)) {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "Entrada inválida, JSON esperado."]);
    exit;
}

$producto = $data["producto"] ?? "";
$precio = $data["precio"] ?? 0;
$imagenBase64 = $data["imagen"] ?? "";
$categoria = $data["categoria"] ?? "";
$stock = isset($data['stock']) ? $data['stock'] : null; // puede ser 1-5

// Guardar imagen (si viene)
$imagenFileName = '';
if ($imagenBase64) {
    $imagenFileName = guardarImagen($imagenBase64);
    if (!$imagenFileName) {
        // continuar sin imagen pero avisar en message
        $imageWarning = 'No se pudo guardar la imagen.';
    }
}

// Conectar usando configuración central (no crear bases de datos desde PHP en hosting compartido)
include_once __DIR__ . '/../../Phps/db_config.php';

if (!isset($conn) || $conn->connect_errno) {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "Error conectando a la base de datos. Ver logs del servidor."]);
    exit;
}

// Verificar que la tabla `productos` exista. En InfinityFree debes crear la base y las tablas desde el panel (phpMyAdmin).
$tblCheck = $conn->query("SHOW TABLES LIKE 'productos'");
if (!$tblCheck || $tblCheck->num_rows === 0) {
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "message" => "La tabla 'productos' no existe. Crea la tabla en phpMyAdmin. SQL sugerido: CREATE TABLE productos (id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY, nombre VARCHAR(255), precio DECIMAL(10,2), stock INT, referencia VARCHAR(100), imagen VARCHAR(255), categoria VARCHAR(100), created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4",
    ]);
    exit;
}

// Determinar si la tabla tiene columna `stock`
$hasStock = false;
$colRes = $conn->query("SHOW COLUMNS FROM `productos` LIKE 'stock'");
if ($colRes && $colRes->num_rows > 0) $hasStock = true;

// Preparar e insertar (usar sentencias preparadas)
if ($hasStock) {
    $stmt = $conn->prepare("INSERT INTO `productos` (`nombre`, `precio`, `stock`, `imagen`, `categoria`) VALUES (?, ?, ?, ?, ?)");
    $stmt->bind_param('sisss', $producto, $precio, $stock_param, $imagenFileName, $categoria);
    // Asegurar tipo de stock
    $stock_param = is_null($stock) ? 0 : intval($stock);
} else {
    // Si no existe stock, usar columna `referencia` como campo de compatibilidad
    $stmt = $conn->prepare("INSERT INTO `productos` (`nombre`, `precio`, `referencia`, `imagen`, `categoria`) VALUES (?, ?, ?, ?, ?)");
    $ref_val = is_null($stock) ? '' : strval($stock);
    $stmt->bind_param('sisss', $producto, $precio, $ref_val, $imagenFileName, $categoria);
}

if (!$stmt) {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "Error preparando la sentencia: " . $conn->error]);
    exit;
}

if ($stmt->execute()) {
    $insertId = $stmt->insert_id;
    $msg = 'Producto registrado correctamente.';
    if (!empty($imageWarning)) $msg .= ' ' . $imageWarning;
    echo json_encode(["success" => true, "message" => $msg, "id" => $insertId]);
} else {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => 'Error al insertar: ' . $stmt->error]);
}

$stmt->close();
$conn->close();


function guardarImagen($imagenBase64) {
    if (!$imagenBase64) return '';
    // Extraer tipo base64
    if (preg_match('/^data:image\/(\w+);base64,/', $imagenBase64, $type)) {
        $imageType = strtolower($type[1]);
        $imagenBase64 = substr($imagenBase64, strpos($imagenBase64, ',') + 1);
        $imagenBase64 = str_replace(' ', '+', $imagenBase64);
        $imageData = base64_decode($imagenBase64);
        if ($imageData === false) return '';

        $fileName = uniqid('img_') . '.' . $imageType;
        // Ruta relativa desde este script: api/post/ -> subir a carpeta imagenes/ en la raíz del proyecto
        $filePath = __DIR__ . '/../../imagenes/' . $fileName;
        // Asegurar directorio existe
        $dir = dirname($filePath);
        if (!is_dir($dir)) @mkdir($dir, 0755, true);

        if (file_put_contents($filePath, $imageData) !== false) {
            return $fileName;
        }
    }
    return '';
}
?>