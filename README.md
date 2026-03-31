# SpotTech

Plataforma web para descoberta, curadoria e gestão de locais turísticos e culturais de Manaus.

O projeto foi construído como um MVP full stack com:
- backend em Node.js + Express + Prisma + PostgreSQL
- frontend em React + Vite + TypeScript
- autenticação com JWT
- área pública institucional
- área autenticada para usuários
- painel administrativo para gestão de locais, categorias e sugestões

## Visão Geral

O SpotTech foi pensado para organizar informações sobre pontos turísticos e locais relevantes da cidade de Manaus em uma experiência digital clara, moderna e fácil de administrar.

Hoje o sistema já permite:
- cadastro e login de usuários
- recuperação de senha por token
- visualização de locais com busca e filtros
- sugestão de novos locais por usuários autenticados
- painel administrativo para aprovar sugestões
- cadastro e edição de locais
- cadastro de categorias
- catálogo inicial com locais reais de Manaus

## Funcionalidades

### Visitante
- landing page institucional
- acesso a login, cadastro e área administrativa

### Usuário autenticado
- acesso ao portal principal
- consulta de locais cadastrados
- visualização detalhada de cada local
- link de rota para Google Maps e Waze
- envio de sugestões
- atualização de preferências do perfil

### Administrador
- login administrativo
- painel com visão geral
- aprovação e rejeição de sugestões
- criação de categorias
- criação e edição de locais
- criação automática de local ao aprovar sugestão

## Stack

### Backend
- Node.js
- Express
- TypeScript
- Prisma
- PostgreSQL
- Zod
- JWT
- Resend

### Frontend
- React
- Vite
- TypeScript
- React Router

## Estrutura do Projeto

```text
.
├── backend
│   ├── prisma
│   │   ├── migrations
│   │   └── seed.ts
│   ├── src
│   │   ├── config
│   │   ├── lib
│   │   ├── middlewares
│   │   ├── routes
│   │   ├── services
│   │   └── utils
│   └── package.json
├── frontend
│   ├── public
│   │   └── images
│   ├── src
│   │   ├── components
│   │   ├── pages
│   │   ├── services
│   │   └── types
│   └── package.json
└── README.md
```

## Pré-requisitos

Antes de rodar o projeto, tenha instalado:
- Node.js 20+
- npm
- PostgreSQL

Se você estiver usando Docker para o banco:

```bash
docker start portal-cultural-db
```

## Configuração do Backend

Entre na pasta:

```bash
cd backend
```

Instale as dependências:

```bash
npm install
```

Crie o arquivo `.env` com base neste exemplo:

```env
PORT=3333
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/portal_cultural
JWT_SECRET=sua_chave_jwt
RESEND_API_KEY=
EMAIL_FROM=
URL_FRONTEND=http://localhost:5173
```

Gere o client do Prisma:

```bash
npm run prisma:generate
```

Aplique as migrations:

```bash
npm run prisma:migrate
```

Popule o banco com os dados iniciais:

```bash
npm run prisma:seed
```

Inicie o backend:

```bash
npm run dev
```

O backend ficará disponível em:

```text
http://localhost:3333
```

Health check:

```text
GET /health
```

## Configuração do Frontend

Entre na pasta:

```bash
cd frontend
```

Instale as dependências:

```bash
npm install
```

Se quiser configurar a URL da API manualmente, crie um `.env`:

```env
VITE_API_URL=http://localhost:3333
```

Inicie o frontend:

```bash
npm run dev
```

O frontend ficará disponível em:

```text
http://localhost:5173
```

## Credenciais Iniciais

O seed cria uma conta administrativa padrão:

- e-mail: `admin@portal.com`
- senha: `123456`

Usuários comuns podem ser criados pela tela de cadastro.

## Dados Iniciais do Catálogo

O seed atual já inclui locais reais de Manaus, como:
- Teatro Amazonas
- Largo de São Sebastião
- Mercado Municipal Adolpho Lisboa
- Museu da Cidade de Manaus (Paço da Liberdade)
- Palacete Provincial
- Arena da Amazônia
- Ponta Negra
- Museu da Amazônia (MUSA)

## Scripts Disponíveis

### Backend

```bash
npm run dev
npm run build
npm run start
npm run typecheck
npm run prisma:generate
npm run prisma:migrate
npm run prisma:seed
```

### Frontend

```bash
npm run dev
npm run build
npm run preview
```

## Rotas Principais da API

### Autenticação
- `POST /auth/cadastro`
- `POST /auth/login`
- `POST /auth/esqueci-senha`
- `POST /auth/redefinir-senha`

### Perfil
- `GET /perfil/me`
- `PATCH /perfil/me/preferencias`

### Categorias
- `GET /categories`
- `POST /categories`

### Locais
- `GET /places`
- `GET /places/:id`
- `POST /places`
- `PUT /places/:id`

### Sugestões
- `POST /suggestions`
- `GET /suggestions/admin`
- `PATCH /suggestions/admin/:id/status`

## Imagens no Frontend

As imagens locais do frontend podem ser adicionadas em:

```text
frontend/public/images
```

Exemplo:

```text
frontend/public/images/places/teatro-amazonas.jpg
```

Depois basta usar no sistema algo como:

```text
/images/places/teatro-amazonas.jpg
```

## Estado Atual do Projeto

O projeto já está funcional como MVP, com backend integrado ao frontend e fluxo administrativo básico implementado.

Alguns pontos que ainda podem evoluir:
- testes automatizados
- upload real de imagens
- favoritos e histórico do usuário
- métricas administrativas mais completas
- área pública com conteúdo dinâmico vindo do backend

## Observações

- o seed atual recria os locais e limpa sugestões antes de popular a base
- o envio de e-mail depende da configuração do Resend
- as imagens da landing e da identidade visual estão em `frontend/public/images`

## Autor

Projeto desenvolvido para organização e valorização digital de locais turísticos e culturais de Manaus.
