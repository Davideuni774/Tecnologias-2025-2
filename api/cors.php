<?php
// api/cors.php - Encabezados CORS para permitir consumo desde GitHub Pages u orígenes externos

// Detectar origen
$origin = isset($_SERVER['HTTP_ORIGIN']) ? $_SERVER['HTTP_ORIGIN'] : '';

// Permitir cualquier origen por defecto. Para mayor seguridad, limita a tu dominio de Pages.
if ($origin) {
    $host = parse_url($origin, PHP_URL_HOST);
    if ($host && preg_match('/\\.github\\.io$/i', $host)) {
        header("Access-Control-Allow-Origin: $origin");
        header('Vary: Origin');
    } else {
        header('Access-Control-Allow-Origin: *');
    }
} else {
    header('Access-Control-Allow-Origin: *');
}

header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Access-Control-Max-Age: 86400');

// Si especificamos un origen concreto (no *), permitir credenciales para cookies/sesiones
if (!empty($origin) && $origin !== '*') {
    header('Access-Control-Allow-Credentials: true');
}

// Si es preflight, responder y salir antes de procesar lógica
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}
