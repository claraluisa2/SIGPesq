
<?php
require_once __DIR__ . "/../../config/conexao.php";

header("Content-Type: application/json; charset=utf-8");

if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    http_response_code(405);
    echo json_encode(["erro" => "Método não permitido."]);
    exit;
}

// Dados recebidos do formulário
$cpfOriginal = preg_replace('/\D/', '', $_POST["cpf_original"] ?? "");
$nome = trim($_POST["nome"] ?? "");
$email = trim($_POST["email"] ?? "");
$tipo = $_POST["tipo"] ?? "";

// Validações
if ($cpfOriginal === "" || $nome === "" || $email === "" || $tipo === "") {
    http_response_code(400);
    echo json_encode(["erro" => "Preencha todos os campos obrigatórios."]);
    exit;
}

if (strlen($cpfOriginal) !== 11) {
    http_response_code(400);
    echo json_encode(["erro" => "CPF inválido."]);
    exit;
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode(["erro" => "E-mail inválido."]);
    exit;
}

$tiposPermitidos = [
    "DOCENTE",
    "DISCENTE",
    "TECNICO_ADMINISTRATIVO"
];

if (!in_array($tipo, $tiposPermitidos, true)) {
    http_response_code(400);
    echo json_encode(["erro" => "Tipo de participante inválido."]);
    exit;
}

// Atualização no banco de dados
$sql = "UPDATE Participante
        SET nome = ?, email_institucional = ?, tipo = ?
        WHERE cpf = ?";

$stmt = $conexao->prepare($sql);
$stmt->bind_param("ssss", $nome, $email, $tipo, $cpfOriginal);

try {
    $stmt->execute();

    // Verifica se o participante ainda existe.
    // affected_rows pode ser zero quando os dados não mudaram.
    if ($stmt->affected_rows === 0) {
        $verifica = $conexao->prepare(
            "SELECT cpf FROM Participante WHERE cpf = ?"
        );
        $verifica->bind_param("s", $cpfOriginal);
        $verifica->execute();
        $resultado = $verifica->get_result();

        if ($resultado->num_rows === 0) {
            http_response_code(404);
            echo json_encode(["erro" => "Participante não encontrado."]);
            $verifica->close();
            $stmt->close();
            exit;
        }

        $verifica->close();
    }

    echo json_encode([
        "sucesso" => true,
        "mensagem" => "Participante atualizado com sucesso!"
    ]);

} catch (mysqli_sql_exception $e) {
    error_log($e->getMessage());

    http_response_code(500);
    echo json_encode([
        "erro" => "Não foi possível atualizar o participante."
    ]);
}

$stmt->close();
?>
