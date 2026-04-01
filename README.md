# SpotTech

Plataforma web para descoberta, curadoria e gestão de locais turísticos e culturais de Manaus.

O projeto foi desenvolvido como um MVP full stack com:
- backend em **Node.js + Express + TypeScript + Prisma + PostgreSQL**
- frontend em **React + Vite + TypeScript**
- autenticação com **JWT**
- área pública institucional
- área autenticada para usuários
- painel administrativo para gestão de categorias, locais e sugestões

## Visão geral

O SpotTech foi pensado para centralizar informações sobre pontos turísticos e culturais de Manaus em uma experiência digital simples, moderna e fácil de administrar.

Atualmente o sistema permite:
- cadastro e login de usuários
- recuperação de senha por token
- visualização de locais com busca e filtros
- sugestão de novos locais
- painel administrativo para aprovar ou rejeitar sugestões
- cadastro, edição e inativação de locais
- cadastro, edição e exclusão de categorias
- catálogo inicial com locais reais de Manaus

## Funcionalidades

### Visitante
- acessar a landing page institucional
- acessar cadastro, login de usuário e login administrativo
- visualizar locais e detalhes dos locais
- usar busca e filtros por categoria e bairro
- enviar sugestão de local

### Usuário autenticado
- acessar o portal principal
- consultar locais cadastrados
- visualizar detalhes de cada local
- abrir rota no Google Maps e Waze
- atualizar preferências do perfil

### Administrador
- login administrativo
- painel com visão geral de sugestões, categorias e locais
- aprovar ou rejeitar sugestões
- criar, editar e inativar locais
- criar, editar e excluir categorias
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
- bcrypt

### Frontend
- React
- Vite
- TypeScript
- React Router DOM

## Estrutura do projeto

```text
.
├── backend
│   ├── prisma
│   │   ├── migrations
│   │   ├── schema.prisma
│   │   └── seed.ts
│   ├── src
│   │   ├── config
│   │   ├── lib
│   │   ├── middlewares
│   │   ├── routes
│   │   ├── services
│   │   ├── utils
│   │   ├── app.ts
│   │   └── server.ts
│   └── package.json
├── frontend
│   ├── public
│   │   └── images
│   ├── src
│   │   ├── components
│   │   ├── pages
│   │   ├── services
│   │   ├── types
│   │   ├── App.tsx
│   │   └── main.tsx
│   └── package.json
├── jest.config.ts
├── package.json
└── README.md
```

## Pré-requisitos

Antes de rodar o projeto, tenha instalado:
- Node.js 20+
- npm
- PostgreSQL

Se estiver usando Docker para o banco, um exemplo de inicialização seria:

```bash
docker start portal-cultural-db
```

## Configuração do backend

Entre na pasta do backend:

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

Inicie o backend em modo de desenvolvimento:

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

Resposta esperada:

```json
{
  "ok": "Server is running"
}
```

## Configuração do frontend

Entre na pasta do frontend:

```bash
cd frontend
```

Instale as dependências:

```bash
npm install
```

Crie um arquivo `.env` para apontar a API:

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

## Credenciais iniciais

O seed cria uma conta administrativa padrão:
- e-mail: `admin@portal.com`
- senha: `123456`

Usuários comuns podem ser criados pela tela de cadastro.

## Dados iniciais do catálogo

O seed atual inclui locais reais de Manaus, como:
- Teatro Amazonas
- Largo de São Sebastião
- Mercado Municipal Adolpho Lisboa
- Museu da Cidade de Manaus (Paço da Liberdade)
- Palacete Provincial
- Arena da Amazônia
- Ponta Negra
- Museu da Amazônia (MUSA)

## Scripts disponíveis

### Raiz do projeto

```bash
npm test
```

> Observação: existe `jest.config.ts` na raiz, mas o projeto ainda não possui uma suíte de testes automatizados consolidada.

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

## Rotas principais da API

### Health
- `GET /health`

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
- `PUT /categories/:id`
- `DELETE /categories/:id`

### Locais
- `GET /places`
- `GET /places/:id`
- `POST /places`
- `PUT /places/:id`
- `DELETE /places/:id`

### Sugestões
- `POST /suggestions`
- `GET /suggestions/admin`
- `PATCH /suggestions/admin/:id/status`

## Regras de acesso

### Rotas públicas
- `GET /health`
- `POST /auth/cadastro`
- `POST /auth/login`
- `POST /auth/esqueci-senha`
- `POST /auth/redefinir-senha`
- `GET /categories`
- `GET /places`
- `GET /places/:id`
- `POST /suggestions`

### Rotas autenticadas
- `GET /perfil/me`
- `PATCH /perfil/me/preferencias`

### Rotas administrativas
- `POST /categories`
- `PUT /categories/:id`
- `DELETE /categories/:id`
- `POST /places`
- `PUT /places/:id`
- `DELETE /places/:id`
- `GET /suggestions/admin`
- `PATCH /suggestions/admin/:id/status`

## Filtros disponíveis em `GET /places`

A listagem de locais aceita os seguintes parâmetros opcionais:
- `search`
- `category`
- `neighborhood`

Exemplo:

```text
GET /places?search=teatro&category=teatro&neighborhood=centro
```

## Imagens no frontend

As imagens locais do frontend podem ser adicionadas em:

```text
frontend/public/images
```

Exemplo:

```text
frontend/public/images/places/teatro-amazonas.jpg
```

Depois elas podem ser usadas no sistema com caminhos como:

```text
/images/places/teatro-amazonas.jpg
```

## Estado atual do projeto

O projeto está funcional como MVP, com backend integrado ao frontend e fluxo administrativo básico implementado.

Pontos que ainda podem evoluir:
- testes automatizados
- proteção e padronização mais forte de algumas regras de negócio
- upload real de imagens
- favoritos e histórico do usuário
- métricas administrativas mais completas
- área pública com conteúdo dinâmico vindo do backend
- pipeline de CI/CD

## Observações

- o seed recria os locais e limpa sugestões antes de popular a base
- o envio de e-mail depende da configuração do Resend
- as imagens da landing e da identidade visual ficam em `frontend/public/images`
- a rota `POST /suggestions` está pública no estado atual do código; se você aplicar a melhoria de autenticação para sugestões, atualize esta seção do README

## Autor

Projeto desenvolvido para organização e valorização digital de locais turísticos e culturais de Manaus.
