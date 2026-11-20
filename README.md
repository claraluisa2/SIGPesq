# SIGPesq – Sistema de Gerenciamento de Projetos de Pesquisa Universitários

Sistema desenvolvido como projeto acadêmico da disciplina de Banco de Dados, com o objetivo de auxiliar no gerenciamento de projetos de pesquisa universitários.

## 1. Tecnologias utilizadas

- PHP
- MySQL
- HTML
- CSS
- JavaScript
- XAMPP
- Git e GitHub

## 2. Requisitos para executar o projeto

Antes de começar, instale:

- [XAMPP](https://www.apachefriends.org/pt_br/index.html)
- [Git](https://git-scm.com/downloads)
- Navegador de internet (Google Chrome, Firefox ou equivalente)

O XAMPP será utilizado para executar o servidor Apache e o banco de dados MySQL.

## 3. Baixando o projeto

Abra o terminal ou PowerShell e entre na pasta `htdocs` do XAMPP:

```powershell
cd C:\xampp\htdocs
```

Clone o repositório:

```powershell
git clone https://github.com/SEU-USUARIO/SIGPesq.git
```

Entre na pasta do projeto:

```powershell
cd SIGPesq
```

**Alternativa:** também é possível acessar o repositório pelo GitHub, clicar em `Code` e depois em `Download ZIP`.

Se utilizar essa alternativa, extraia a pasta do projeto dentro de `C:\xampp\htdocs`.

## 4. Configurando o XAMPP

1. Abra o XAMPP Control Panel.
2. Inicie o serviço Apache.
3. Inicie o serviço MySQL.
4. Verifique se os dois serviços estão em execução.

## 5. Criando o banco de dados

1. Abra o navegador.
2. Acesse:

   http://localhost/phpmyadmin/

3. Clique em **Novo**.
4. Crie um banco de dados chamado:

   `sigpesq`

5. Selecione o banco recém-criado.
6. Acesse a aba **Importar**.
7. Selecione o arquivo `database/sigpesq.sql`.
8. Clique em **Importar** ou **Executar**.

Após a importação, as tabelas do sistema deverão aparecer no banco `sigpesq`.

## 6. Configurando a conexão PHP com MySQL

Abra o arquivo:

`config/conexao.php`

Confira as configurações de conexão:

- Servidor: `localhost`
- Usuário: `root`
- Senha: vazia (padrão do XAMPP)
- Banco de dados: `sigpesq`

Caso seu MySQL utilize outro usuário ou senha, atualize as informações nesse arquivo.

## 7. Executando o sistema

Com Apache e MySQL ativos, abra o navegador e acesse:

http://localhost/SIGPesq/

A página inicial do SIGPesq deverá ser carregada.

## 8. Funcionalidades implementadas

### Participantes

- Cadastro de participantes.
- Listagem de participantes.
- Edição de participantes.
- Exclusão de participantes.
- Integração das operações de participantes com o MySQL.

O CPF é utilizado como chave primária e não pode ser alterado pelo formulário de edição.

**Observação:** as demais funcionalidades da interface ainda estão em desenvolvimento e não devem ser consideradas totalmente integradas ao banco de dados.

## 9. Estrutura de pastas

```text
SIGPesq/
│
├── assets/
│   ├── styles.css
│   └── script.js
│
├── config/
│   └── conexao.php
│
├── database/
│   └── sigpesq.sql
│
├── pages/
│   └── participantes/
│       ├── cadastrar.php
│       ├── listar.php
│       ├── editar.php
│       └── excluir.php
│
├── index.php
└── README.md
```

## 10. Problemas comuns

**Erro ao acessar o sistema:**

- Confira se o Apache está iniciado.
- Verifique se a pasta do projeto está dentro de `C:\xampp\htdocs`.
- Confira o endereço digitado no navegador.

**Erro de conexão com o banco de dados:**

- Confira se o MySQL está iniciado.
- Verifique se o banco `sigpesq` foi criado.
- Confira as configurações do arquivo `config/conexao.php`.

**Erro ao carregar participantes:**

- Confira se as tabelas foram importadas corretamente.
- Verifique se os arquivos PHP estão nos caminhos indicados.
- Confira a conexão com o banco de dados.

---

## 11. Desenvolvedores

Projeto acadêmico desenvolvido em grupo para a disciplina de Banco de Dados.

