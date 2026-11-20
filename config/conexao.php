
<?php

$host = "localhost";
$usuario = "root";
$senha = "";
$banco = "sigpesq";

// Criando a conexão
$conexao = new mysqli($host, $usuario, $senha, $banco);

// Verificando se houve erro
if ($conexao->connect_error) {
    die("Erro na conexão: " . $conexao->connect_error);
}

// Definindo a codificação dos caracteres
$conexao->set_charset("utf8mb4");

?>
