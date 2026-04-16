# Deploy (Pragmático)

## 1) Rodar localmente

### Backend
```bash
cd backend
npm install
cp .env.example .env
npm run prisma:migrate
npm run prisma:seed
npm run dev
```

### Frontend
```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

## 2) Variáveis de ambiente

### Backend (`backend/.env`)
- `NODE_ENV`: `production` em deploy
- `PORT`: porta do processo (plataforma pode sobrescrever)
- `DATABASE_URL`: URL do PostgreSQL
- `JWT_SECRET`: segredo de assinatura JWT
- `URL_FRONTEND`: URL pública do frontend
- `CORS_ORIGINS`: lista CSV de origens permitidas
- `RESEND_API_KEY`: opcional
- `EMAIL_FROM`: opcional

### Frontend (`frontend/.env`)
- `VITE_API_URL`: URL pública do backend

## 3) Build e start do backend

```bash
cd backend
npm install
npm run build
npm run start
```

## 4) Migração em produção (obrigatório)

Use sempre em produção:

```bash
cd backend
npm run prisma:migrate:deploy
```

Nao use `prisma migrate dev` em produção.

## 5) Deploy sugerido

- Frontend: Vercel
- Backend: Railway ou Render
- Banco: PostgreSQL gerenciado (Railway/Render/Supabase/Neon)

## 6) Ordem correta de deploy

1. Provisionar banco PostgreSQL e obter `DATABASE_URL`
2. Deploy do backend com envs + `prisma:migrate:deploy`
3. Deploy do frontend apontando `VITE_API_URL` para a API publicada

## 7) Compatibilidade

A configuração atual do backend funciona em:
- Railway
- Render
- Fly.io
- VPS com PM2 ou Docker

Requisito principal em qualquer plataforma: definir envs corretamente e executar `prisma migrate deploy`.
