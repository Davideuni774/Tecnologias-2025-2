<?php
// register.php - Maneja el registro de nuevos usuarios

header("Content-Type: text/html; charset=utf-8");

$mensaje = "";

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $usuario = trim($_POST['usuario'] ?? '');
    $clave = $_POST['clave'] ?? '';
    $confirmar_clave = $_POST['confirmar_clave'] ?? '';

    // Validaciones
    if (empty($usuario) || empty($clave) || empty($confirmar_clave)) {
        $mensaje = "Todos los campos son obligatorios.";
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
                    // Crear tabla usuarios si no existe
                    $createTableSql = "CREATE TABLE IF NOT EXISTS `usuarios` (
                      `id` INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
                      `usuario` VARCHAR(100) UNIQUE NOT NULL,
                      `clave` VARCHAR(255) NOT NULL,
                      `fecha_registro` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4";
                    
                    if (!$conn->query($createTableSql)) {
                        $mensaje = "No se pudo crear la tabla usuarios: " . $conn->error;
                    } else {
                        // Verificar si el usuario ya existe
                        $stmt = $conn->prepare("SELECT id FROM usuarios WHERE usuario = ?");
                        $stmt->bind_param('s', $usuario);
                        $stmt->execute();
                        $stmt->store_result();
                        
                        if ($stmt->num_rows > 0) {
                            $mensaje = "El usuario ya existe. Por favor elige otro nombre.";
                        } else {
                            // Hash de la contraseña
                            $clave_hash = password_hash($clave, PASSWORD_DEFAULT);
                            
                            // Insertar nuevo usuario
                            $stmt_insert = $conn->prepare("INSERT INTO usuarios (usuario, clave) VALUES (?, ?)");
                            $stmt_insert->bind_param('ss', $usuario, $clave_hash);
                            
                            if ($stmt_insert->execute()) {
                                // Registro exitoso - iniciar sesión automáticamente
                                session_start();
                                $_SESSION['usuario'] = $usuario;
                                $_SESSION['usuario_id'] = $stmt_insert->insert_id;
                                header("Location: index.html");
                                exit();
                            } else {
                                $mensaje = "Error al registrar el usuario: " . $stmt_insert->error;
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
