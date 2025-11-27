<?php
// register.php - Maneja el registro de nuevos usuarios
session_start();
header("Content-Type: text/html; charset=utf-8");

$mensaje = "";

// Log para debugging
error_log("[REGISTER] POST recibido: " . print_r($_POST, true));

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $nombre = trim($_POST['nombre'] ?? '');
    $correo = trim($_POST['correo'] ?? '');
    $telefono = trim($_POST['telefono'] ?? '');
    $clave = $_POST['clave'] ?? '';
    $confirmar_clave = $_POST['confirmar_clave'] ?? '';

    // Validaciones
    if (empty($nombre) || empty($correo) || empty($clave) || empty($confirmar_clave)) {
        $mensaje = "Todos los campos son obligatorios (excepto teléfono).";
    } elseif (!filter_var($correo, FILTER_VALIDATE_EMAIL)) {
        $mensaje = "El correo electrónico no es válido.";
    } elseif ($clave !== $confirmar_clave) {
        $mensaje = "Las contraseñas no coinciden.";
    } elseif (strlen($clave) < 6) {
        $mensaje = "La contraseña debe tener al menos 6 caracteres.";
    } else {
        // Conectar a la base de datos
        $host = "localhost";
        $user = "root";
        $pass = "";
        $dbname = "Draconis";

        $conn = new mysqli($host, $user, $pass);
        if ($conn->connect_errno) {
            $mensaje = "Error conectando al servidor MySQL: " . $conn->connect_error;
        } else {
            // Crear base de datos si no existe
            $createDbSql = "CREATE DATABASE IF NOT EXISTS `" . $conn->real_escape_string($dbname) . "` CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci";
            if (!$conn->query($createDbSql)) {
                $mensaje = "No se pudo crear la base de datos: " . $conn->error;
            } else {
                // Seleccionar la base
                if (!$conn->select_db($dbname)) {
                    $mensaje = "No se pudo seleccionar la base de datos: " . $conn->error;
                } else {
                    // Crear tabla cuentas si no existe
                    $createTableSql = "CREATE TABLE IF NOT EXISTS `cuentas` (
                      `id` INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
                      `nombre` VARCHAR(255) NOT NULL,
                      `correo` VARCHAR(255) UNIQUE NOT NULL,
                      `telefono` VARCHAR(50) DEFAULT NULL,
                      `clave` VARCHAR(255) NOT NULL,
                      `fecha_registro` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4";
                    
                    if (!$conn->query($createTableSql)) {
                        $mensaje = "No se pudo crear la tabla cuentas: " . $conn->error;
                    } else {
                        // Verificar si el correo ya existe
                        $stmt = $conn->prepare("SELECT id FROM cuentas WHERE correo = ?");
                        $stmt->bind_param('s', $correo);
                        $stmt->execute();
                        $stmt->store_result();
                        
                        if ($stmt->num_rows > 0) {
                            $mensaje = "El correo ya está registrado. Por favor usa otro correo.";
                        } else {
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
                                echo '<script>console.log("Registro exitoso:", {nombre: "' . addslashes($nombre) . '", correo: "' . addslashes($correo) . '", telefono: "' . addslashes($telefono) . '"}); window.location.href="index.html";</script>';
                                exit();
                            } else {
                                $mensaje = "Error al registrar la cuenta: " . $stmt_insert->error;
                            }
                            $stmt_insert->close();
                        }
                        $stmt->close();
                    }
                }
            }
            $conn->close();
        }
    }
}
?>
