# Setup do Banco de Dados no Supabase

## 🚀 Como criar as tabelas no Supabase

### Passo 1: Acessar o SQL Editor
1. Acesse o [Supabase Dashboard](https://supabase.com/dashboard)
2. Selecione seu projeto
3. No menu lateral, clique em **SQL Editor**
4. Clique em **New query**

### Passo 2: Executar o SQL
1. Copie todo o conteúdo do arquivo `create-tables.sql`
2. Cole no editor SQL
3. Clique em **Run** para executar todas as queries

### Passo 3: Verificar as tabelas
1. No menu lateral, clique em **Table Editor**
2. Você deverá ver as tabelas criadas:
   - `users`
   - `profiles`
   - `donations`
   - `streams`

### Passo 4: Testar a conexão
Execute este comando no terminal para testar:

```bash
cd backend
node test-supabase.js
```

## 📋 Estrutura das Tabelas

### Users
- `id` (UUID)
- `email` (UNIQUE)
- `password` (hashed)
- `role` (USER/ADMIN/VIP)
- `created_at`, `updated_at`

### Profiles
- `id` (UUID)
- `user_id` (FK para users)
- `full_name`
- `avatar_url`, `bio`
- `created_at`, `updated_at`

### Donations
- `id` (UUID)
- `amount`, `method`
- `identifier`, `name`
- `user_id` (FK para users)
- `created_at`

### Streams
- `id` (UUID)
- `title`, `description`
- `source_type` (YOUTUBE/OBS)
- `source_url`, `thumbnail`
- `category`, `access_level`
- `is_live`, `viewers`
- `user_id` (FK para users)
- `created_at`, `updated_at`

## 🔐 Admin User
Um usuário administrador já é criado automaticamente:
- **Email**: `wisebacasol@gmail.com`
- **Senha**: `Bacas1995`
- **Role**: `ADMIN`

## ✅ Próximos Passos
1. Execute o SQL no Supabase Studio
2. Teste a conexão com `node test-supabase.js`
3. Atualize o .env.production.example com suas credenciais
4. Deploy para produção no Vercel

## 🆘 Problemas Comuns
- **Conexão falhou**: Verifique se o SSL está habilitado
- **Tabelas não criadas**: Execute o SQL novamente
- **Erros de permissão**: Verifique as políticas de RLS no Supabase