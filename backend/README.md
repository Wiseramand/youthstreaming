# Backend - Youth Angola Streaming

## Pré-requisitos

- Node.js 18+
- PostgreSQL em execução

## Configuração

1. Copie o arquivo de ambiente:
   ```bash
   cp .env.example .env
   ```
2. Atualize `DATABASE_URL` e `JWT_SECRET` no `.env`.

## Prisma (banco de dados)

```bash
npm run prisma:generate
npm run prisma:migrate
```

## Rodar em desenvolvimento

```bash
npm run dev
```

## Endpoints principais

### Auth

- `POST /api/auth/register`
  - body: `{ "email": "", "password": "", "fullName": "" }`
- `POST /api/auth/login`
  - body: `{ "email": "", "password": "" }`

### Perfil

- `GET /api/profile/me` (Bearer token)
- `PUT /api/profile/me` (Bearer token)
  - body: `{ "fullName": "", "avatarUrl": "", "bio": "" }`

### Admin

- `GET /api/admin/users` (Bearer token com role ADMIN)

## Próximos passos sugeridos

- Criar seed para usuário ADMIN
- Ajustar CORS para o domínio do front-end
- Adicionar testes e rate limiting