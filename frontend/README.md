# FootMarket · Frontend

Interface web do FootMarket ("Passe"), o sistema de mercado de jogadores de uma liga de futebol fictícia. A tela consome a API REST do backend (`/api/v1`) para cadastrar, listar, editar e excluir jogadores, alterar a condição de cada um, comprar jogadores livres para um clube, cadastrar clubes, consultar o detalhe de cada clube e salvar a escalação dos titulares.

O cálculo oficial (valor de mercado, taxa, caixa, fidelidade) é feito pelo backend. A interface faz apenas validações de apoio antes de enviar (por exemplo, faixa de idade e atributos no cadastro, limite de 50% do caixa na compra e bloqueio de jogador doente na escalação) e mostra a mensagem de erro que a API devolver.

## Funcionalidades

**Jogadores (`/jogadores`)**
- Listagem com abas **Todos**, **Livres** e **Em clubes**.
- Filtros por nome, posição, condição, clube, idade e valor de mercado.
- Cadastro de jogador (posição, idade e atributos de 1 a 100). O jogador começa livre e apto.
- Menu de ações por jogador: ver detalhes, editar, alterar condição (Apto, Mal condicionado ou Doente), comprar (só para jogador livre) e excluir.
- Compra de jogador: escolha do clube e da data e hora de fidelidade. Mostra o custo (valor de mercado mais taxa) e avisa quando passa de 50% do caixa do clube. Ao concluir, exibe um modal de sucesso.

**Clubes (`/clubes`)**
- Listagem com ordenação por nome ou por patrimônio (maior ou menor).
- Cadastro de clube com nome e sigla de até 4 letras. O clube começa com 300,00 em caixa e sem jogadores.

**Detalhe do clube (`/clubes/:id`)**
- Métricas do clube (caixa, valor do elenco e patrimônio).
- Aba **Elenco** com a lista de jogadores do clube.
- Aba **Escalação** para escolher a formação e os 5 titulares (goleiro, 2 defensores, meio e ataque) e salvar. Jogador doente não pode ser escalado.
- Aba **Histórico**, ainda sem conteúdo (mostra só o contador).

**Tela inicial (`/`)**
- Apresentação do sistema. O botão **Iniciar** (ou a tecla Enter) leva à lista de jogadores. Os números exibidos nessa tela são fixos, não vêm da API.

## Tecnologias e versões

| Item | Versão | Observação |
| --- | --- | --- |
| Node.js | 22 LTS (22.13 ou superior) ou 20 LTS (20.19 ou superior) | Exigência do Vite 8 e do ESLint 10 |
| npm | 10 ou superior | Vem junto com o Node.js |
| React | 19.3.1 | Projeto criado com o template oficial `react-compiler` do Vite |
| Vite | 8.3.5 | Servidor de desenvolvimento e build |
| React Router (`react-router-dom`) | 7.18.4 | Usado no modo biblioteca (`BrowserRouter` e `Routes`) |
| Axios | 1.20.0 | Chamadas à API |
| ESLint | 10.13.0 | Lint |

As versões acima são as resolvidas no `package-lock.json`.

## Como executar

Antes de iniciar o frontend, deixe o backend no ar. Origem da API: `http://localhost:8080` (os endpoints ficam em `http://localhost:8080/api/v1`).

```bash
cd frontend
npm ci
npm run dev
```

Frontend em desenvolvimento: **http://localhost:5173**

A lista de jogadores abre em **http://localhost:5173/jogadores**.

### Build de produção

```bash
npm run build
npm run preview
```

O build gera a pasta `dist/`. O `preview` serve esse build em **http://localhost:4173**.

### Com Docker

Na raiz do repositório (onde ficam as pastas `backend/` e `frontend/` e o `docker-compose.yml`), um único comando sobe o banco, a API e o frontend:

```bash
docker compose up --build
```

| Serviço | Endereço |
| --- | --- |
| Frontend (Nginx) | http://localhost:3000 (lista de jogadores em http://localhost:3000/jogadores) |
| API (Spring Boot) | http://localhost:8080/api/v1 |
| Banco (MySQL 8.0) | localhost:3306 |

Para parar, use `docker compose down`. Para apagar também os dados do banco, use `docker compose down -v`.

O `Dockerfile` do frontend tem duas etapas: compila o app com `node:20-alpine` e serve a pasta `dist/` com `nginx:alpine` na porta 80 do contêiner.

## Integração com a API

A URL base da API fica em `src/services/api.js`: `http://localhost:8080/api/v1`. Todas as chamadas passam por esse cliente Axios.

Endpoints usados pelo frontend:

| Método | Endpoint | Uso |
| --- | --- | --- |
| GET | `/players` | Listar jogadores |
| POST | `/players` | Cadastrar jogador |
| PUT | `/players/{id}` | Editar jogador |
| PATCH | `/players/{id}/condition` | Alterar condição |
| DELETE | `/players/{id}` | Excluir jogador |
| GET | `/clubs` | Listar clubes |
| GET | `/clubs/{id}` | Detalhe do clube |
| POST | `/clubs` | Cadastrar clube |
| POST | `/clubs/{id}/buy-player` | Comprar jogador para o clube |
| PUT | `/clubs/{id}/lineup` | Salvar a escalação |

A API precisa liberar no CORS a origem de onde o frontend é aberto: `http://localhost:5173` (desenvolvimento), `http://localhost:4173` (preview) e `http://localhost:3000` (Docker).

## Variáveis de ambiente

O frontend **não usa variáveis de ambiente**. Não há arquivo `.env` nem `.env.example` nesta pasta; a URL da API é fixa em `src/services/api.js`.

## Arquivos de trava versionados

O arquivo `package-lock.json` está versionado e garante as mesmas versões das dependências em qualquer máquina. Por isso o comando de instalação local é `npm ci`, que instala exatamente o que está no arquivo de trava.

## Lint

```bash
npm run lint
```

O comando executa o ESLint em todo o projeto e termina sozinho.

## Bibliotecas e motivo de uso

**Dependências**

| Biblioteca | Para que serve |
| --- | --- |
| `react` e `react-dom` | Base da interface (stack obrigatória) |
| `react-router-dom` | Navegação entre as telas (`/`, `/jogadores`, `/clubes` e `/clubes/:id`) sem recarregar a página |
| `axios` | Chamadas HTTP à API, com a URL base configurada em um único lugar e tratamento de erro das respostas |

**Dependências de desenvolvimento**

| Biblioteca | Para que serve |
| --- | --- |
| `vite` | Servidor de desenvolvimento e build (stack obrigatória) |
| `@vitejs/plugin-react` | Plugin do Vite para React, incluído no template oficial |
| `babel-plugin-react-compiler`, `@rolldown/plugin-babel` e `@babel/core` | React Compiler do template `react-compiler`, que otimiza a renderização dos componentes no build |
| `eslint` e `@eslint/js` | Análise estática do código (`npm run lint`) |
| `eslint-plugin-react-hooks` | Regras de lint para o uso correto dos hooks do React |
| `eslint-plugin-react-refresh` | Regra de lint para o recarregamento rápido de componentes no Vite |
| `globals` | Lista de variáveis globais do navegador para o ESLint |
| `@types/react` e `@types/react-dom` | Tipos do React, usados pelo editor para autocompletar e avisar de erros |

## Estrutura de pastas

```
frontend/
├── public/                 Ícones estáticos
├── src/
│   ├── components/         Componentes reutilizáveis
│   │   ├── AbaEscalacao.jsx          Escalação dos titulares do clube
│   │   ├── MenuAcoesJogador.jsx      Menu de ações de cada jogador
│   │   ├── ModalNovoJogador.jsx      Cadastro de jogador
│   │   ├── ModalEditarJogador.jsx    Edição de jogador
│   │   ├── ModalDetalhesJogador.jsx  Detalhes do jogador
│   │   ├── ModalAlterarCondicao.jsx  Troca de condição
│   │   ├── ModalExcluirJogador.jsx   Confirmação de exclusão
│   │   ├── ModalComprarJogador.jsx   Compra de jogador por um clube
│   │   ├── ModalCompraSucesso.jsx    Resumo da compra concluída
│   │   ├── ModalJogadorCadastrado.jsx  Cadastro rápido de jogador
│   │   ├── ModalNovoClube.jsx        Cadastro de clube
│   │   └── ToastSucesso.jsx          Aviso de sucesso
│   ├── pages/              Telas: Home, Jogadores, Clubes e DetalheClube
│   ├── services/           Cliente da API (api.js)
│   ├── App.jsx             Rotas da aplicação
│   └── main.jsx            Ponto de entrada
├── Dockerfile              Build do frontend e servidor Nginx
├── eslint.config.js        Configuração do lint
├── vite.config.js          Configuração do Vite
├── package.json
└── package-lock.json       Arquivo de trava das dependências
```

## Rotas da aplicação

| Rota | Tela |
| --- | --- |
| `/` | Tela inicial |
| `/jogadores` | Lista de jogadores |
| `/clubes` | Lista de clubes |
| `/clubes/:id` | Detalhe do clube (abas Elenco, Escalação e Histórico) |

## Pendências conhecidas

- A aba **Histórico** do clube ainda não lista as movimentações.
- O botão **Vender** no elenco do clube ainda não tem ação.
- Os números da tela inicial são fixos.
- Ao recarregar uma rota como `/jogadores` na versão com Docker, o Nginx não tem regra de fallback para o `index.html` e responde 404. Navegar pelos links da aplicação funciona normalmente.