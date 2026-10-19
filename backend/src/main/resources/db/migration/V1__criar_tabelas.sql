-- FootMarket: estrutura inicial (secao "3. Estrutura de tabelas" do enunciado).
-- Escrito para rodar no MySQL 8 e no MariaDB 10.6+.
-- Nenhum valor calculado e gravado aqui (valor de mercado, overall, valor do elenco,
-- patrimonio, dias restantes, percentual de multa, pontos e posicao na classificacao).

-- ---------------------------------------------------------------------------
-- clubes
-- nome_normalizado garante a RN10 no banco: minusculas e espacos normalizados,
-- COM acentos, comparado de forma exata (utf8mb4_bin). Assim "Aguias FC" e
-- "Águias FC" sao nomes diferentes, e "águias fc" repete "Águias FC".
-- A aplicacao preenche essa coluna.
-- ---------------------------------------------------------------------------
CREATE TABLE clubes (
    id              INT            NOT NULL AUTO_INCREMENT,
    nome            VARCHAR(60)    NOT NULL,
    nome_normalizado VARCHAR(60)   CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
    sigla           CHAR(3)        NOT NULL,
    caixa           DECIMAL(10,2)  NOT NULL DEFAULT 300.00,
    formacao        VARCHAR(5)     NULL,
    criado_em       TIMESTAMP(6)   NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    PRIMARY KEY (id),
    CONSTRAINT uq_clubes_nome_normalizado UNIQUE (nome_normalizado),
    CONSTRAINT uq_clubes_sigla UNIQUE (sigla)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ---------------------------------------------------------------------------
-- jogadores
--
-- ---------------------------------------------------------------------------
CREATE TABLE jogadores (
    id              INT            NOT NULL AUTO_INCREMENT,
    nome            VARCHAR(100)   NOT NULL,
    posicao         VARCHAR(3)     NOT NULL,
    agilidade       INT            NOT NULL,
    idade           INT            NOT NULL,
    valor_base      DECIMAL(6,2)   NOT NULL,
    condicao        VARCHAR(20)    NOT NULL DEFAULT 'APTO',
    clube_id        INT            NULL,
    velocidade      INT            NOT NULL,
    finalizacao     INT            NOT NULL,
    passe           INT            NOT NULL,
    drible          INT            NOT NULL,
    defesa          INT            NOT NULL,
    fisico          INT            NOT NULL,
    potencial       INT            NOT NULL,
    excluido_em     TIMESTAMP(6)   NULL DEFAULT NULL,
    criado_em       TIMESTAMP(6)   NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    atualizado_em   TIMESTAMP(6)   NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
    PRIMARY KEY (id),
    CONSTRAINT fk_jogadores_clube FOREIGN KEY (clube_id) REFERENCES clubes (id),
    CONSTRAINT ck_jogadores_posicao CHECK (posicao IN ('GOL', 'ZAG', 'LAT', 'MEI', 'ATA')),
    CONSTRAINT ck_jogadores_condicao CHECK (condicao IN ('APTO', 'MAL_CONDICIONADO', 'DOENTE'))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE INDEX idx_jogadores_clube ON jogadores (clube_id);
CREATE INDEX idx_jogadores_excluido ON jogadores (excluido_em);

-- ---------------------------------------------------------------------------
-- contratos
-- valor_compra e o valor de mercado pago (sem a taxa), gravado no momento da compra.
-- ---------------------------------------------------------------------------
CREATE TABLE contratos (
    id              INT            NOT NULL AUTO_INCREMENT,
    jogador_id      INT            NOT NULL,
    clube_id        INT            NOT NULL,
    valor_compra    DECIMAL(6,2)   NOT NULL,
    fidelidade_ate  TIMESTAMP(6)   NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    situacao        VARCHAR(12)    NOT NULL DEFAULT 'ATIVO',
    iniciado_em     TIMESTAMP(6)   NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    encerrado_em    TIMESTAMP(6)   NULL DEFAULT NULL,
    PRIMARY KEY (id),
    CONSTRAINT fk_contratos_jogador FOREIGN KEY (jogador_id) REFERENCES jogadores (id),
    CONSTRAINT fk_contratos_clube FOREIGN KEY (clube_id) REFERENCES clubes (id),
    CONSTRAINT ck_contratos_situacao CHECK (situacao IN ('ATIVO', 'ENCERRADO', 'RESCINDIDO'))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE INDEX idx_contratos_jogador_situacao ON contratos (jogador_id, situacao);
CREATE INDEX idx_contratos_clube_situacao ON contratos (clube_id, situacao);

-- ---------------------------------------------------------------------------
-- transacoes (historico de compras e vendas, com os valores e o nome do momento)
-- ---------------------------------------------------------------------------
CREATE TABLE transacoes (
    id              INT            NOT NULL AUTO_INCREMENT,
    clube_id        INT            NOT NULL,
    jogador_id      INT            NOT NULL,
    nome_jogador    VARCHAR(100)   NOT NULL,
    tipo            VARCHAR(6)     NOT NULL,
    valor           DECIMAL(6,2)   NOT NULL,
    taxa            DECIMAL(6,2)   NOT NULL DEFAULT 0.00,
    multa           DECIMAL(6,2)   NOT NULL DEFAULT 0.00,
    lucro           DECIMAL(7,2)   NULL DEFAULT NULL,
    variacao_caixa  DECIMAL(8,2)   NOT NULL,
    criado_em       TIMESTAMP(6)   NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    PRIMARY KEY (id),
    CONSTRAINT fk_transacoes_clube FOREIGN KEY (clube_id) REFERENCES clubes (id),
    CONSTRAINT fk_transacoes_jogador FOREIGN KEY (jogador_id) REFERENCES jogadores (id),
    CONSTRAINT ck_transacoes_tipo CHECK (tipo IN ('COMPRA', 'VENDA'))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE INDEX idx_transacoes_clube_data ON transacoes (clube_id, criado_em, id);
CREATE INDEX idx_transacoes_clube_jogador_tipo ON transacoes (clube_id, jogador_id, tipo);

-- ---------------------------------------------------------------------------
-- escalacoes
-- Chave primaria composta (clube_id, jogador_id).
-- jogador_id UNIQUE: um jogador esta em no maximo uma escalacao.
-- ---------------------------------------------------------------------------
CREATE TABLE escalacoes (
    clube_id        INT            NOT NULL,
    jogador_id      INT            NOT NULL,
    criado_em       TIMESTAMP(6)   NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    PRIMARY KEY (clube_id, jogador_id),
    CONSTRAINT uq_escalacoes_jogador UNIQUE (jogador_id),
    CONSTRAINT fk_escalacoes_clube FOREIGN KEY (clube_id) REFERENCES clubes (id),
    CONSTRAINT fk_escalacoes_jogador FOREIGN KEY (jogador_id) REFERENCES jogadores (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ---------------------------------------------------------------------------
-- partidas
-- ---------------------------------------------------------------------------
CREATE TABLE partidas (
    id                  INT           NOT NULL AUTO_INCREMENT,
    mandante_id         INT           NOT NULL,
    visitante_id        INT           NOT NULL,
    gols_mandante       INT           NOT NULL,
    gols_visitante      INT           NOT NULL,
    formacao_mandante   VARCHAR(5)    NOT NULL,
    formacao_visitante  VARCHAR(5)    NOT NULL,
    jogada_em           TIMESTAMP(6)  NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    PRIMARY KEY (id),
    CONSTRAINT fk_partidas_mandante FOREIGN KEY (mandante_id) REFERENCES clubes (id),
    CONSTRAINT fk_partidas_visitante FOREIGN KEY (visitante_id) REFERENCES clubes (id),
    CONSTRAINT ck_partidas_gols CHECK (gols_mandante BETWEEN 0 AND 3 AND gols_visitante BETWEEN 0 AND 3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE INDEX idx_partidas_data ON partidas (jogada_em, id);

-- ---------------------------------------------------------------------------
-- duelos_partida (os 6 duelos de cada partida, gravados com os valores do momento)
-- ---------------------------------------------------------------------------
CREATE TABLE duelos_partida (
    id                  INT           NOT NULL AUTO_INCREMENT,
    partida_id          INT           NOT NULL,
    ordem               INT           NOT NULL,
    clube_atacante_id   INT           NOT NULL,
    atacante_id         INT           NOT NULL,
    defensor_id         INT           NOT NULL,
    nome_atacante       VARCHAR(100)  NOT NULL,
    nome_defensor       VARCHAR(100)  NOT NULL,
    posicao_atacante    VARCHAR(3)    NOT NULL,
    posicao_defensor    VARCHAR(3)    NOT NULL,
    condicao_atacante   VARCHAR(20)   NOT NULL,
    condicao_defensor   VARCHAR(20)   NOT NULL,
    atributo_ataque     VARCHAR(10)   NOT NULL,
    atributo_defesa     VARCHAR(10)   NOT NULL,
    valor_ataque        INT           NOT NULL,
    valor_defesa        INT           NOT NULL,
    gol                 BOOLEAN       NOT NULL,
    PRIMARY KEY (id),
    CONSTRAINT uq_duelos_partida_ordem UNIQUE (partida_id, ordem),
    CONSTRAINT fk_duelos_partida FOREIGN KEY (partida_id) REFERENCES partidas (id),
    CONSTRAINT fk_duelos_clube_atacante FOREIGN KEY (clube_atacante_id) REFERENCES clubes (id),
    CONSTRAINT fk_duelos_atacante FOREIGN KEY (atacante_id) REFERENCES jogadores (id),
    CONSTRAINT fk_duelos_defensor FOREIGN KEY (defensor_id) REFERENCES jogadores (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
