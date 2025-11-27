<?php
// Phps/login.php
// Este archivo es incluido por `iniciosesion.php` y debe establecer la variable $mensaje
require_once __DIR__ . '/config.php';

$mensaje = '';
// Asegurarse de que sea un POST válido
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    return;
}

$usuario = trim($_POST['usuario'] ?? '');
$clave = $_POST['clave'] ?? '';

if (!$usuario || !$clave) {
    $mensaje = 'Por favor completa usuario y contraseña.';
    return;
}

$mysqli = db_connect();
if (!$mysqli || $mysqli->connect_error) {
    // Si el objeto existe con error, mostrarlo para diagnóstico
    $err = $mysqli->connect_error ?? 'Desconocido';
    $mensaje = 'Error al conectar con la base de datos: ' . htmlspecialchars($err);
    return;
}

$stmt = $mysqli->prepare('SELECT id, usuario, clave FROM usuarios WHERE usuario = ? LIMIT 1');
if (!$stmt) {
    $mensaje = 'Error interno (prepare): ' . htmlspecialchars($mysqli->error);
    $mysqli->close();
    return;
}
$stmt->bind_param('s', $usuario);
if (!$stmt->execute()) {
    $mensaje = 'Error interno (execute): ' . htmlspecialchars($stmt->error);
    $stmt->close();
    $mysqli->close();
    return;
}
$res = $stmt->get_result();
if ($row = $res->fetch_assoc()) {
    $hash = $row['clave'];
    if (password_verify($clave, $hash)) {
        // Login correcto
        session_regenerate_id(true);
        $_SESSION['usuario'] = $row['usuario'];
        $_SESSION['usuario_id'] = $row['id'];
        header('Location: ../../index.html');
        exit();
    }
}

$mensaje = 'Usuario o contraseña incorrectos.';
$stmt->close();
$mysqli->close();

?>
