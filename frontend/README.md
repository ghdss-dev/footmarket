# FootMarket · Frontend

Interface web do FootMarket, o sistema de mercado de jogadores de uma liga de futebol fictícia. A tela consome a API REST do backend (`/api/v1`) para listar jogadores e clubes, excluir jogadores e consultar o detalhe de cada clube. Toda regra de negócio e todo cálculo ficam no backend; a interface só mostra o que a API devolve.

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

Na raiz do repositório, um único comando sobe o banco, a API e o frontend:

```bash
docker compose up --build
```

- Frontend: **http://localhost:3000** (lista de jogadores em http://localhost:3000/jogadores)
- API: http://localhost:8080/api/v1

Para parar, use `docker compose down`.

## Integração com a API

A URL base da API fica em `src/services/api.js`: `http://localhost:8080/api/v1`. Todas as chamadas passam por esse cliente Axios, e nenhum componente chama a API diretamente.

A API precisa liberar no CORS a origem de onde o frontend é aberto: `http://localhost:5173` (desenvolvimento), `http://localhost:4173` (preview) e `http://localhost:3000` (Docker).

## Variáveis de ambiente

O frontend **não usa variáveis de ambiente**. Não há arquivo `.env` nem `.env.example` nesta pasta; a URL da API é fixa em `src/services/api.js`.

## Arquivos de trava versionados

O arquivo `package-lock.json` está versionado e garante as mesmas versões das dependências em qualquer máquina. Por isso o comando de instalação é `npm ci`, que instala exatamente o que está no arquivo de trava.

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
| `axios` | Chamadas HTTP à API, com a URL base configurada em um único lugar e tratamento de erro padronizado das respostas |

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
├── public/               Ícones estáticos
├── src/
│   ├── components/       Componentes reutilizáveis (modais, menu de ações, aba de escalação, aviso de sucesso)
│   ├── pages/            Telas: Home, Jogadores, Clubes e DetalheClube
│   ├── services/         Cliente da API (api.js)
│   ├── App.jsx           Rotas da aplicação
│   └── main.jsx          Ponto de entrada
├── Dockerfile            Build do frontend e servidor Nginx
├── eslint.config.js      Configuração do lint
├── package.json
└── package-lock.json     Arquivo de trava das dependências
```

## Rotas da aplicação

| Rota | Tela |
| --- | --- |
| `/` | Tela inicial |
| `/jogadores` | Lista de jogadores |
| `/clubes` | Lista de clubes |
| `/clubes/:id` | Detalhe do clube |