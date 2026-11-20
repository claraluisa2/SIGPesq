
<?php

require_once __DIR__ . "/../../config/conexao.php";

header("Content-Type: application/json; charset=utf-8");

// Aceitar somente requisições POST
if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    http_response_code(405);
    echo json_encode(["erro" => "Método não permitido."]);
    exit;
}

// Receber e limpar o CPF
$cpf = preg_replace('/\D/', '', $_POST["cpf"] ?? "");

// Validar CPF
if (strlen($cpf) !== 11) {
    http_response_code(400);
    echo json_encode(["erro" => "CPF inválido."]);
    exit;
}

// Preparar a exclusão
$sql = "DELETE FROM Participante WHERE cpf = ?";
$stmt = $conexao->prepare($sql);
$stmt->bind_param("s", $cpf);

try {
    $stmt->execute();

    if ($stmt->affected_rows === 0) {
        http_response_code(404);
        echo json_encode([
            "erro" => "Participante não encontrado."
        ]);
        exit;
    }

    echo json_encode([
        "sucesso" => true,
        "mensagem" => "Participante excluído com sucesso!"
    ]);

} catch (mysqli_sql_exception $e) {

    // Erro 1451: registro utilizado por outra tabela
    if ($e->getCode() == 1451) {
        http_response_code(409);
        echo json_encode([
            "erro" => "Este participante possui vínculos com outros registros e não pode ser excluído."
        ]);
    } else {
        error_log($e->getMessage());

        http_response_code(500);
        echo json_encode([
            "erro" => "Não foi possível excluir o participante."
        ]);
    }
}

$stmt->close();

?>
