<?php
// Phps/config.php
// Rellena con tus valores reales del panel de hosting antes de subir al servidor.
// No compartas estas credenciales en público.
define('DB_HOST', 'sql212.infinityfree.com'); // ejemplo: revisa el panel para el host exacto
define('DB_USER', 'TU_USUARIO_MYSQL');
define('DB_PASS', 'TU_CONTRASENA_MYSQL');
define('DB_NAME', 'TU_NOMBRE_BASE_DE_DATOS');

function db_connect() {
    $mysqli = new mysqli(DB_HOST, DB_USER, DB_PASS, DB_NAME);
    if ($mysqli->connect_error) {
        // No mostrar detalles sensibles en producción; aquí para diagnóstico.
        return $mysqli; // devolvemos el objeto para inspección en tests
    }
    $mysqli->set_charset('utf8mb4');
    return $mysqli;
}

// Habilitar errores para diagnóstico local (quítalo en producción)
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

?>
<?php
// Configuración de la base de datos para InfinityFree
$servername = "sql212.infinityfree.com";
$username = "if0_40294133";
$password = "AvatarGhost666";
$dbname = "if0_40294133_usuarios_web";

// Crear conexión
$conn = new mysqli($servername, $username, $password, $dbname);

// Verificar conexión
if ($conn->connect_error) {
    die("Conexión fallida: " . $conn->connect_error);
}

// Establecer charset para evitar problemas con caracteres especiales
$conn->set_charset("utf8");
?>
