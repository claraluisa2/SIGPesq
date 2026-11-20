
<?php

require_once __DIR__ . "/../../config/conexao.php";

header("Content-Type: application/json; charset=utf-8");

// Consultar os participantes cadastrados
$sql = "SELECT cpf, nome, email_institucional, tipo
        FROM Participante
        ORDER BY nome";

$resultado = $conexao->query($sql);

// Transformar o resultado em um array
$participantes = $resultado->fetch_all(MYSQLI_ASSOC);

// Enviar os dados em formato JSON
echo json_encode($participantes, JSON_UNESCAPED_UNICODE);

?>
