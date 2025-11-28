<?php
header('Content-Type: application/json');
session_start();

require_once 'conexion.php';

// Verificar si el usuario está logueado
if (!isset($_SESSION['usuario_id'])) {
    echo json_encode(['success' => false, 'message' => 'No hay sesión activa']);
    exit;
}

$usuario_id = $_SESSION['usuario_id'];
$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    // Obtener el carrito del usuario
    $stmt = $conn->prepare("SELECT producto_nombre as name, cantidad as qty, precio as price, imagen as image, url FROM carrito_items WHERE usuario_id = ?");
    $stmt->bind_param("i", $usuario_id);
    $stmt->execute();
    $result = $stmt->get_result();
    
    $items = [];
    while ($row = $result->fetch_assoc()) {
        // Convertir tipos si es necesario
        $row['qty'] = (int)$row['qty'];
        $row['price'] = (float)$row['price'];
        $items[] = $row;
    }
    
    echo json_encode(['success' => true, 'items' => $items]);

} elseif ($method === 'POST') {
    // Recibir datos JSON
    $input = json_decode(file_get_contents('php://input'), true);
    
    if (!isset($input['items']) || !is_array($input['items'])) {
        echo json_encode(['success' => false, 'message' => 'Datos inválidos']);
        exit;
    }
    
    $items = $input['items'];
    
    // Iniciar transacción
    $conn->begin_transaction();
    
    try {
        // 1. Borrar items actuales del usuario (Estrategia de reemplazo completo)
        $stmtDelete = $conn->prepare("DELETE FROM carrito_items WHERE usuario_id = ?");
        $stmtDelete->bind_param("i", $usuario_id);
        $stmtDelete->execute();
        
        // 2. Insertar nuevos items
        if (count($items) > 0) {
            $stmtInsert = $conn->prepare("INSERT INTO carrito_items (usuario_id, producto_nombre, cantidad, precio, imagen, url) VALUES (?, ?, ?, ?, ?, ?)");
            
            foreach ($items as $item) {
                $name = $item['name'] ?? 'Producto sin nombre';
                $qty = (int)($item['qty'] ?? 1);
                $price = (float)($item['price'] ?? 0);
                $image = $item['image'] ?? '';
                $url = $item['url'] ?? '';
                
                $stmtInsert->bind_param("isidss", $usuario_id, $name, $qty, $price, $image, $url);
                $stmtInsert->execute();
            }
        }
        
        $conn->commit();
        echo json_encode(['success' => true, 'message' => 'Carrito actualizado']);
        
    } catch (Exception $e) {
        $conn->rollback();
        echo json_encode(['success' => false, 'message' => 'Error al guardar carrito: ' . $e->getMessage()]);
    }
} else {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Método no permitido']);
}
?>
