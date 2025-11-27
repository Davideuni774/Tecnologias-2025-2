<?php
// api/post/registro-cuenta.php - Endpoint JSON para registro de cuentas
session_start();
header("Content-Type: application/json; charset=utf-8");

// Leer JSON de entrada
$raw = file_get_contents("php://input");
$data = $raw ? json_decode($raw, true) : null;

if (!$data || !is_array($data)) {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "Entrada inválida, JSON esperado."]);
    exit;
}

$nombre = trim($data['nombre'] ?? '');
$correo = trim($data['correo'] ?? '');
$telefono = trim($data['telefono'] ?? '');
$clave = $data['clave'] ?? '';
$confirmar_clave = $data['confirmar_clave'] ?? '';

// Validaciones
if (empty($nombre) || empty($correo) || empty($clave) || empty($confirmar_clave)) {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "Todos los campos son obligatorios (excepto teléfono)."]);
    exit;
}

if (!filter_var($correo, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "El correo electrónico no es válido."]);
    exit;
}

if ($clave !== $confirmar_clave) {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "Las contraseñas no coinciden."]);
    exit;
}

if (strlen($clave) < 6) {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "La contraseña debe tener al menos 6 caracteres."]);
    exit;
}

// Conectar usando configuración central (en hosting compartido no crees bases desde PHP)
include_once __DIR__ . '/../../Phps/db_config.php';

if (!isset($conn) || $conn->connect_errno) {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "Error al conectar con la base de datos."]);
    exit;
}

// Verificar que la tabla `cuentas` exista. En InfinityFree crea la DB y tablas desde phpMyAdmin.
$tblCheck = $conn->query("SHOW TABLES LIKE 'cuentas'");
if (!$tblCheck || $tblCheck->num_rows === 0) {
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "message" => "La tabla 'cuentas' no existe. Crea la tabla en phpMyAdmin. SQL sugerido: CREATE TABLE cuentas (...)",
    ]);
    exit;
}

// Verificar si el correo ya existe
$stmt = $conn->prepare("SELECT id FROM cuentas WHERE correo = ?");
$stmt->bind_param('s', $correo);
$stmt->execute();
$stmt->store_result();

if ($stmt->num_rows > 0) {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "El correo ya está registrado. Por favor usa otro correo."]);
    $stmt->close();
    $conn->close();
    exit;
}
$stmt->close();

// Hash de la contraseña
$clave_hash = password_hash($clave, PASSWORD_DEFAULT);

// Insertar nueva cuenta
$stmt_insert = $conn->prepare("INSERT INTO cuentas (nombre, correo, telefono, clave) VALUES (?, ?, ?, ?)");
$stmt_insert->bind_param('ssss', $nombre, $correo, $telefono, $clave_hash);

if ($stmt_insert->execute()) {
    // Registro exitoso - iniciar sesión automáticamente
    $_SESSION['usuario'] = $nombre;
    $_SESSION['correo'] = $correo;
    $_SESSION['usuario_id'] = $stmt_insert->insert_id;
    
    echo json_encode([
        "success" => true,
        "message" => "Cuenta creada.",
        "data" => [
            "nombre" => $nombre,
            "correo" => $correo,
            "id" => $stmt_insert->insert_id
        ]
    ]);
} else {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "Error al registrar la cuenta."]);
}

$stmt_insert->close();
$conn->close();
?>
