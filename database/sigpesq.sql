
USE sigpesq;

-- 1. Tabela Participante
CREATE TABLE Participante (
    cpf VARCHAR(11) PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    email_institucional VARCHAR(100) NOT NULL,
    tipo VARCHAR(30) NOT NULL,

    CONSTRAINT chk_tipo_participante
    CHECK (tipo IN (
        'DOCENTE',
        'DISCENTE',
        'TECNICO_ADMINISTRATIVO'
    ))
);


-- 2. Tabela AgenciaFinanciadora
CREATE TABLE AgenciaFinanciadora (
    id_agencia INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    sigla VARCHAR(20) NOT NULL
);


-- 3. Tabela Projeto
CREATE TABLE Projeto (
    codigo VARCHAR(20) PRIMARY KEY,
    titulo VARCHAR(150) NOT NULL,
    descricao TEXT,
    data_inicio DATE NOT NULL,
    data_termino DATE,
    situacao VARCHAR(20) NOT NULL,
    cpf_coordenador VARCHAR(11) NOT NULL,

    CONSTRAINT fk_projeto_coordenador
    FOREIGN KEY (cpf_coordenador)
    REFERENCES Participante(cpf),

    CONSTRAINT chk_situacao_projeto
    CHECK (situacao IN (
        'EM_ANDAMENTO',
        'CONCLUIDO',
        'CANCELADO'
    )),

    CONSTRAINT chk_datas_projeto
    CHECK (
        data_termino IS NULL
        OR data_termino >= data_inicio
    )
);


-- 4. Tabela ParticipacaoProjeto
CREATE TABLE ParticipacaoProjeto (
    cpf_participante VARCHAR(11) NOT NULL,
    codigo_projeto VARCHAR(20) NOT NULL,
    data_entrada DATE NOT NULL,
    funcao VARCHAR(50) NOT NULL,
    data_saida DATE,

    PRIMARY KEY (
        cpf_participante,
        codigo_projeto,
        data_entrada
    ),

    FOREIGN KEY (cpf_participante)
    REFERENCES Participante(cpf),

    FOREIGN KEY (codigo_projeto)
    REFERENCES Projeto(codigo),

    CONSTRAINT chk_datas_participacao
    CHECK (
        data_saida IS NULL
        OR data_saida >= data_entrada
    )
);


-- 7. Tabela ProducaoCientifica
CREATE TABLE ProducaoCientifica (
    id_producao INT AUTO_INCREMENT PRIMARY KEY,
    titulo VARCHAR(200) NOT NULL,
    tipo VARCHAR(20) NOT NULL,
    ano_publicacao INT NOT NULL,
    meio_divulgacao VARCHAR(150),
    codigo_projeto VARCHAR(20) NOT NULL,

    FOREIGN KEY (codigo_projeto)
    REFERENCES Projeto(codigo),

    CONSTRAINT chk_tipo_producao
    CHECK (tipo IN (
        'ARTIGO',
        'CAPITULO_LIVRO',
        'SOFTWARE',
        'RELATORIO_TECNICO',
        'OUTRO'
    ))
);


-- 8. Tabela AutorProducao
CREATE TABLE AutorProducao (
    id_producao INT NOT NULL,
    cpf_autor VARCHAR(11) NOT NULL,

    PRIMARY KEY (
        id_producao,
        cpf_autor
    ),

    FOREIGN KEY (id_producao)
    REFERENCES ProducaoCientifica(id_producao),

    FOREIGN KEY (cpf_autor)
    REFERENCES Participante(cpf)
);
