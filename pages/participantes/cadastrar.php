
<?php

require_once __DIR__ . "/../../config/conexao.php";

// A resposta será enviada em formato JSON
header("Content-Type: application/json; charset=utf-8");

// Aceitar somente requisições POST
if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    http_response_code(405);
    echo json_encode(["erro" => "Método não permitido."]);
    exit;
}

// Receber os dados enviados pelo formulário
$nome = trim($_POST["nome"] ?? "");
$email = trim($_POST["email"] ?? "");
$cpf = preg_replace('/\D/', '', $_POST["cpf"] ?? "");
$tipo = $_POST["tipo"] ?? "";

// Validar os campos
if ($nome === "" || $email === "" || $cpf === "" || $tipo === "") {
    http_response_code(400);
    echo json_encode(["erro" => "Preencha todos os campos."]);
    exit;
}

// Validar CPF: deve possuir 11 números
if (strlen($cpf) !== 11) {
    http_response_code(400);
    echo json_encode(["erro" => "O CPF deve possuir 11 números."]);
    exit;
}

// Validar formato do e-mail
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode(["erro" => "E-mail inválido."]);
    exit;
}

// Validar o tipo de participante
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

// Preparar o comando SQL
$sql = "INSERT INTO Participante
        (cpf, nome, email_institucional, tipo)
        VALUES (?, ?, ?, ?)";

$stmt = $conexao->prepare($sql);

// Associar os valores aos parâmetros
$stmt->bind_param("ssss", $cpf, $nome, $email, $tipo);

// Executar a inserção
try {
    $stmt->execute();

    echo json_encode([
        "sucesso" => true,
        "mensagem" => "Participante cadastrado com sucesso!"
    ]);

} catch (mysqli_sql_exception $e) {

    if ($e->getCode() == 1062) {
        http_response_code(409);
        echo json_encode([
            "erro" => "Já existe um participante com esse CPF."
        ]);
    } else {
        http_response_code(500);
        echo json_encode([
            "erro" => "Não foi possível cadastrar o participante."
        ]);
    }
}

$stmt->close();

?>
