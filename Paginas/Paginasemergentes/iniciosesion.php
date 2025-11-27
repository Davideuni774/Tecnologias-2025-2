<?php
session_start();
if(isset($_SESSION['usuario'])) {
    header("Location: ../../index.html");
    exit();
}

// Procesar el formulario de login
$mensaje = "";
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    include '../../login.php';
}
?>
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Draconis - Iniciar Sesión</title>
  <link rel="stylesheet" href="../../index.css?v=20251011">
  <script src="../../index.js?v=20251011" defer></script>
  <link href="https://fonts.googleapis.com/css2?family=UnifrakturMaguntia&display=swap" rel="stylesheet">
  <style>
    .login-container {
      display: flex;
      align-items: center;
      width: 100%;
      max-width: 800px;
      margin: 0 auto;
      padding: 40px 20px;
    }

    .text-section {
      flex: 1;
      padding-right: 50px;
    }

    .text-section h1 {
      font-family: 'UnifrakturMaguntia', serif;
      font-size: 30px;
      font-weight: normal;
      color: #000000;
      line-height: 1.2;
      margin: 0;
      white-space: nowrap;
    }

    .form-section {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 15px;
      align-items: flex-end;
    }

    .form-label {
      align-self: flex-start;
      font-size: 14px;
      color: #000000;
      margin-bottom: 5px;
      width: 332px;
      text-align: left;
      padding-left: 5px;
    }

    .input-group {
      display: flex;
      align-items: center;
      width: 100%;
      max-width: 350px;
      border: 1px solid #c0c0c0;
      border-radius: 20px;
      padding: 5px 15px;
      background-color: #ffffff;
      box-shadow: 0 0 5px rgba(0, 0, 0, 0.05);
      align-self: flex-start;
    }

    .input-group span {
      font-size: 18px;
      margin-right: 10px;
      color: #555555;
    }

    .icon-person::before {
      content: '👤';
      display: inline-block;
      transform: translateY(1px);
      color: #555;
      font-size: 18px;
    }

    .input-group input {
      border: none;
      outline: none;
      width: 100%;
      font-size: 16px;
      padding: 5px 0;
      color: #555555;
    }

    .button {
      width: 332px;
      padding: 12px 20px;
      border: none;
      border-radius: 25px;
      font-size: 16px;
      cursor: pointer;
      text-align: center;
      font-weight: bold;
      transition: background-color 0.3s;
      margin: 0 auto;
    }

    .button.primary {
      background-color: #925cff;
      color: white;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }

    .button.secondary {
      background-color: #808080;
      color: white;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }

    .mensaje {
      color: red;
      text-align: center;
      margin-bottom: 10px;
      width: 332px;
    }

    @media (max-width: 768px) {
      .login-container {
        flex-direction: column;
        text-align: center;
      }
      .text-section {
        padding-right: 0;
        padding-bottom: 30px;
      }
      .form-section {
        align-items: center;
      }
    }
  </style>
</head>
<body>

  <section class="categorias">
    <div class="login-container">
      <div class="text-section">
        <h1>Inicia sesión<br>en Draconis</h1>
      </div>

      <div class="form-section">
        <?php if($mensaje != ""): ?>
          <div class="mensaje"><?php echo $mensaje; ?></div>
        <?php endif; ?>

        <form method="POST" action="">
          <span class="form-label">Usuario</span>
          <div class="input-group">
            <span class="icon-person"></span>
            <input type="text" name="usuario" placeholder="Ingresa tu usuario" required>
          </div>

          <span class="form-label">Contraseña</span>
          <div class="input-group">
            <span>🔒</span>
            <input type="password" name="clave" placeholder="Ingresa tu contraseña" required>
          </div>

          <button type="submit" class="button primary">Iniciar sesión</button>
        </form>
        <a href="crearcuenta.php"><button type="button" class="button secondary">Crear cuenta</button></a>
      </div>
    </div>
  </section>

</body>
</html>
