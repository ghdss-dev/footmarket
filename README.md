# FootMarket · Passe

Aplicação web fullstack que simula o mercado de jogadores de uma liga de futebol fictícia: cadastro de jogadores e clubes, contratos de fidelidade, compra e venda, escalação dos titulares e partidas com placar calculado pelos atributos.

O repositório tem duas partes:

| Pasta | O que é | Tecnologia |
|---|---|---|
| `backend/` | API REST (`/api/v1`) | Java 21, Spring Boot 3.5.6, Spring Data JPA, Flyway, MySQL 8 |
| `frontend/` | Interface web (marca **Passe**) | React 19, Vite, React Router, Axios |

---

## Como rodar

### Opção 1: Docker (recomendada)

Requer Docker com Compose. Na pasta que contém `backend/`, `frontend/` e o `docker-compose.yml` com os três serviços (`db`, `api` e `frontend`):

```bash
docker compose up --build
```

| Serviço | Endereço |
|---|---|
| Interface web | http://localhost:3000 |
| API | http://localhost:8080/api/v1 |
| MySQL | localhost:3306 (banco `footmarket`, usuário `root`, senha `root`) |

O Flyway cria as tabelas na primeira subida. Os dados ficam no volume `mysql_data`; para recomeçar do zero, use `docker compose down -v`.

> O arquivo `docker-compose.yml` que sobe os três serviços usa `build: ./backend` e `build: ./frontend`, então precisa ficar na raiz, ao lado das duas pastas. Hoje ele está dentro de `frontend/`. O `backend/docker-compose.yml` sobe só o banco e a API.

### Opção 2: local, sem Docker

Requisitos: JDK 21, Node.js 20 ou 22 e um MySQL 8 rodando em `localhost:3306`.

**Backend**

```bash
cd backend
./mvnw spring-boot:run        # no Windows: mvnw.cmd spring-boot:run
```

Por padrão a API conecta em `jdbc:mysql://localhost:3306/footmarket` com usuário `root` e senha vazia, e cria o banco se ele não existir. Para usar outras credenciais, defina as variáveis de ambiente do Spring:

```bash
SPRING_DATASOURCE_URL="jdbc:mysql://localhost:3306/footmarket?useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC&createDatabaseIfNotExist=true"
SPRING_DATASOURCE_USERNAME=root
SPRING_DATASOURCE_PASSWORD=sua_senha
```

A API sobe em http://localhost:8080.

**Frontend**

```bash
cd frontend
npm install
npm run dev
```

A interface abre em http://localhost:5173. Ela espera a API em `http://localhost:8080/api/v1` (definido em `src/services/api.js`).

---

## Backend

### Estrutura

```
backend/src/main/java/br/com/gustavo/footmarket/back_end/
├── controller/   rotas REST (/api/v1)
├── service/      regras de negócio
├── repository/   Spring Data JPA
├── entity/       Jogador, Clube, Contrato, Transacao, Escalacao, Partidas, DuelosPartidas
├── dto/          request e response
├── config/       CORS (WebConfig)
├── exception/    GlobalExceptionHandler (respostas de erro em JSON)
└── utils/        OrdemElenco (ordem GOL, ZAG, LAT, MEI, ATA, depois nome e id)
backend/src/main/resources/db/migration/V1__criar_tabelas.sql
```

### Banco de dados

O esquema vem exclusivamente do Flyway (`V1__criar_tabelas.sql`); o Hibernate fica em `ddl-auto=none` e não altera o banco. São 7 tabelas: `clubes`, `jogadores`, `contratos`, `transacoes`, `escalacoes`, `partidas` e `duelos_partida`.

Jogadores usam exclusão lógica (coluna `excluido_em`). Transações e partidas guardam os valores e os nomes do momento da operação.

### Endpoints (`/api/v1`)

| Recurso | Rotas |
|---|---|
| Jogadores | `POST /players` · `GET /players` · `GET /players/{id}` · `PUT /players/{id}` · `DELETE /players/{id}` |
| Clubes | `POST /clubs` · `GET /clubs` · `GET /clubs/{id}` · `PUT /clubs/{id}` · `DELETE /clubs/{id}` |
| Contratos | `POST /contracts` · `GET /contracts` · `GET /contracts/{id}` · `GET /contracts/player/{jogadorId}/active` · `PUT /contracts/{id}` · `DELETE /contracts/{id}` |
| Transações | `POST /transactions` · `GET /transactions` (filtro por clube) · `GET /transactions/{id}` |
| Escalação | `PUT /clubs/{clubeId}/lineup` · `GET /clubs/{clubeId}/lineup` |
| Partidas | `POST /matches` · `GET /matches` (filtro `club_id`) · `GET /matches/{id}` |
| Classificação | `GET /standings` |

Convenções:

- Corpo e respostas em JSON. Jogadores, clubes, contratos e transações usam campos em português e camelCase (`valorBase`, `clubeId`); partidas e classificação usam campos em inglês e snake_case (`home_club_id`, `goal_difference`), como no enunciado.
- Toda recusa devolve um objeto com o campo `message`, sem stack trace: **400** para dado inválido, **404** para recurso inexistente, **409** para regra de negócio violada.
- A coerção de tipos do Jackson está desligada (`spring.jackson.mapper.allow-coercion-of-scalars=false`), então `"15"` (texto) não vale como número.
- Datas e horas no horário de Brasília (`America/Sao_Paulo`, -03:00). Fim da fidelidade: no máximo 1.095 dias à frente.
- Nomes de clube são normalizados (espaços aparados e repetidos juntados) e únicos sem diferenciar maiúsculas e minúsculas.
- CORS liberado para `http://localhost:5173` e `http://localhost:3000` (`config/WebConfig.java`).
- Partida sem sorteio: o placar sai dos 6 duelos entre os titulares (RN20), com titular mal condicionado jogando com 15% a menos. A partida grava formações e duelos; a classificação é calculada a cada consulta.

### Testes

```bash
cd backend
./mvnw test
```

Há testes de serviço (`ContratoServiceTest`) e de controller (`PartidasControllerTest`). O `BackEndApplicationTests` (carrega o contexto) precisa de um MySQL acessível.

### Configuração

`src/main/resources/application.properties` traz a configuração padrão (MySQL local, Flyway, logs de SQL em DEBUG). No Docker, os valores vêm das variáveis `SPRING_DATASOURCE_*` do `docker-compose.yml`. Os arquivos `dev.properties` e `local.properties` não são carregados automaticamente.

---

## Frontend

### Estrutura

```
frontend/src/
├── pages/        Home, Jogadores, Clubes, DetalheClube
├── components/   modais (novo, editar, condição, detalhes, excluir), menu de ações,
│                 toast de sucesso, aba de escalação, modal de novo clube
├── services/     api.js (instância do Axios)
├── App.jsx       rotas
└── index.css
```

Rotas: `/` (início), `/jogadores`, `/clubes` e `/clubes/:id`.

### Scripts

| Comando | O que faz |
|---|---|
| `npm run dev` | servidor de desenvolvimento (http://localhost:5173) |
| `npm run build` | gera a versão de produção em `dist/` |
| `npm run preview` | serve o build localmente |
| `npm run lint` | ESLint |

O `Dockerfile` compila o app com Node 20 e serve os arquivos estáticos com Nginx (porta 80 no contêiner, 3000 no host).

### Telas

- **Início:** apresentação da liga e o fluxo do sistema, do cadastro à classificação.
- **Jogadores:** tabela com busca por nome, filtros por posição, condição e clube, abas de livres e com clube, ordenação, cadastro de jogador (com mensagem de sucesso), edição, alteração de condição física, detalhes e exclusão com confirmação.
- **Clubes:** listagem com caixa, valor do elenco e patrimônio, ordenável por nome ou patrimônio, e criação de clube.
- **Detalhe do clube:** caixa, valor do elenco e patrimônio, elenco com colunas de contrato (fim da fidelidade, dias restantes e % de multa) e aba **Escalação** com as formações 3-1, 2-2, 2-1-1 e 1-2-1.

### Integração com a API

O frontend chama `GET/POST/PUT/DELETE /players`, `PATCH /players/{id}/condition` (com `PUT /players/{id}` como alternativa), `GET/POST /clubs` e `GET /clubs/{id}`.

---

## Situação em relação ao enunciado

O que está pronto: cadastro, edição e exclusão lógica de jogadores; clubes; contratos; escalação; partidas com duelos, histórico e classificação; telas de jogadores e clubes.

O que ainda não está completo:

**Backend**

- Compra e venda de jogadores como operações atômicas (`POST /players/{id}/buy` e `/sell`), com taxa, limite de 50% do caixa, limite de 12 no elenco, multa por fidelidade e comissão (RN12 a RN16).
- Valor de mercado e overall calculados na consulta, e valor base calculado pela API no cadastro (RN05 e RN06). Hoje o cadastro recebe `valorBase`.
- `PATCH /players/{id}/condition`.
- Listagem de jogadores paginada, com `meta` e filtros no servidor (RN07).
- Valor do elenco e patrimônio nos clubes, e elenco com contrato em `GET /clubs/{id}` (RN11).
- Histórico com `summary` e exportação em CSV (RN17 e RN18).
- Posição `LAT` no cadastro, limites de campo do enunciado e a validação de nome e sigla de clube.

**Frontend**

- Compra, venda, histórico de transações com exportação em CSV, tela de partidas e classificação ainda não estão ligados à API.
- A aba Escalação e o elenco do detalhe do clube trabalham com dados de exemplo e ainda não gravam na API.
- Estados de carregamento, vazio e erro, e validação de formulário, precisam cobrir todas as telas.