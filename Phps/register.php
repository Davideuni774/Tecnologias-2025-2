<?php
session_start();
include 'config.php';

$mensaje = "";

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $usuario = trim($_POST['usuario']);
    $clave = $_POST['clave'];
    $confirmar_clave = $_POST['confirmar_clave'];

    // Validar que las contraseñas coincidan
    if ($clave !== $confirmar_clave) {
        $mensaje = "Las contraseñas no coinciden.";
    } elseif (strlen($clave) < 6) {
        $mensaje = "La contraseña debe tener al menos 6 caracteres.";
    } elseif (empty($usuario)) {
        $mensaje = "El usuario no puede estar vacío.";
    } else {
        // Verificar si el usuario ya existe
        $stmt = $conn->prepare("SELECT id FROM usuarios WHERE usuario = ?");
        $stmt->bind_param("s", $usuario);
        $stmt->execute();
        $result = $stmt->get_result();

        if ($result->num_rows > 0) {
            $mensaje = "El usuario ya existe. Elige otro nombre de usuario.";
        } else {
            // Hash de la contraseña
            $hashed_clave = password_hash($clave, PASSWORD_DEFAULT);

            // Insertar nuevo usuario
            $stmt = $conn->prepare("INSERT INTO usuarios (usuario, clave) VALUES (?, ?)");
            $stmt->bind_param("ss", $usuario, $hashed_clave);

            if ($stmt->execute()) {
                $mensaje = "Usuario registrado exitosamente. Ahora puedes iniciar sesión.";
            } else {
                $mensaje = "Error al registrar el usuario. Inténtalo de nuevo.";
            }
        }
        $stmt->close();
    }
}
?>
