# Guia de Configuração de Variáveis de Ambiente no Vercel

## 🚀 Como Configurar as Variáveis de Ambiente no Vercel

### Passo 1: Acessar o Dashboard do Vercel
1. Acesse [https://vercel.com/dashboard](https://vercel.com/dashboard)
2. Faça login com sua conta
3. Selecione o projeto "youth-angola-streaming" ou crie um novo

### Passo 2: Configurar Variáveis de Ambiente
1. No dashboard do projeto, clique em **"Settings"** (Configurações)
2. No menu lateral, clique em **"Environment Variables"** (Variáveis de Ambiente)
3. Clique no botão **"Add"** (Adicionar)

### Passo 3: Adicionar as Variáveis do Backend

#### 🔴 **Variáveis Obrigatórias (Production)**

| Key (Chave) | Value (Valor) | Type (Tipo) | Environment (Ambiente) |
|-------------|---------------|-------------|------------------------|
| `DATABASE_URL` | `postgresql://postgres:%25s3.QP%2Fm%40yL20T24AnG%26%25L%23@db.jqqduvdldrsjkvaiqxxy.supabase.co:5432/postgres?sslmode=require` | **Encrypted** | Production |
| `JWT_SECRET` | `18cd81f0a679a7e67ece510e41821db10b34896d1a6d31db12102df0a13b35cd1ee7a4fff5de90916b17f09a6bd7b613550f98af8e1df36374d1fffdbe922794` | **Encrypted** | Production |
| `NODE_ENV` | `production` | **Plain** | Production |
| `PORT` | `4000` | **Plain** | Production |

#### 📧 **Variáveis de Email (SMTP)**

| Key (Chave) | Value (Valor) | Type (Tipo) | Environment (Ambiente) |
|-------------|---------------|-------------|------------------------|
| `SMTP_HOST` | `smtp.gmail.com` | **Plain** | Production |
| `SMTP_PORT` | `587` | **Plain** | Production |
| `SMTP_USER` | `seu-email@gmail.com` | **Encrypted** | Production |
| `SMTP_PASS` | `sua-senha-app-gmail` | **Encrypted** | Production |
| `SMTP_FROM` | `noreply@youthangola.com` | **Plain** | Production |

#### 💳 **Variáveis de Pagamento (Stripe)**

| Key (Chave) | Value (Valor) | Type (Tipo) | Environment (Ambiente) |
|-------------|---------------|-------------|------------------------|
| `STRIPE_SECRET_KEY` | `sk_test_sua_stripe_secret_key` | **Encrypted** | Production |
| `STRIPE_PUBLISHABLE_KEY` | `pk_test_sua_stripe_publishable_key` | **Plain** | Production |
| `STRIPE_WEBHOOK_SECRET` | `whsec_sua_stripe_webhook_secret` | **Encrypted** | Production |

#### 💰 **Variáveis de Pagamento (PayPal)**

| Key (Chave) | Value (Valor) | Type (Tipo) | Environment (Ambiente) |
|-------------|---------------|-------------|------------------------|
| `PAYPAL_CLIENT_ID` | `seu_paypal_client_id` | **Encrypted** | Production |
| `PAYPAL_CLIENT_SECRET` | `seu_paypal_client_secret` | **Encrypted** | Production |

#### 🗄️ **Variáveis do Supabase**

| Key (Chave) | Value (Valor) | Type (Tipo) | Environment (Ambiente) |
|-------------|---------------|-------------|------------------------|
| `SUPABASE_URL` | `https://jqqduvdldrsjkvaiqxxy.supabase.co` | **Plain** | Production |
| `SUPABASE_ANON_KEY` | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpxcWR1dmRsZHJzamt2YWlxeHh5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAzNTc1MjMsImV4cCI6MjA4NTkzMzUyM30.1qpR7bNYOOafYJJ3x_oI2wr9MGksw2Cp3g6UhIu9wko` | **Encrypted** | Production |

### Passo 4: Configurar Variáveis para o Frontend

Se estiver fazendo deploy do frontend também, adicione estas variáveis:

| Key (Chave) | Value (Valor) | Type (Tipo) | Environment (Ambiente) |
|-------------|---------------|-------------|------------------------|
| `VITE_API_URL` | `https://seu-projeto.vercel.app` | **Plain** | Production |
| `VITE_STRIPE_PUBLIC_KEY` | `pk_test_sua_stripe_publishable_key` | **Plain** | Production |

### Passo 5: Salvar e Redeploy

1. Após adicionar todas as variáveis, clique em **"Save"** (Salvar)
2. Volte para a aba **"Overview"** (Visão Geral)
3. Clique em **"Deployments"** (Implantações)
4. Selecione a implantação mais recente
5. Clique em **"Redeploy"** (Reimplantar) para aplicar as novas variáveis

## 🔧 Como Obter as Chaves Necessárias

### Stripe (Pagamentos)
1. Acesse [https://dashboard.stripe.com](https://dashboard.stripe.com)
2. Crie uma conta ou faça login
3. Em "Developers" > "API keys", copie:
   - **Secret key** (para `STRIPE_SECRET_KEY`)
   - **Publishable key** (para `STRIPE_PUBLISHABLE_KEY`)
4. Em "Webhooks", crie um endpoint e copie o **Signing secret** (para `STRIPE_WEBHOOK_SECRET`)

### PayPal (Pagamentos)
1. Acesse [https://developer.paypal.com](https://developer.paypal.com)
2. Crie uma conta sandbox ou live
3. Em "Apps & Credentials", crie um novo app
4. Copie o **Client ID** e **Client Secret**

### SMTP (Emails)
1. **Gmail App Password**:
   - Acesse [https://myaccount.google.com/security](https://myaccount.google.com/security)
   - Ative 2FA se ainda não estiver ativado
   - Em "App passwords", gere uma senha para o app
   - Use seu email e a senha do app

### Supabase
- As chaves já estão configuradas no `.env.production`
- Verifique no dashboard do Supabase se estão corretas

## ⚠️ Verificações Importantes

### Antes do Deploy
- [ ] Todas as variáveis obrigatórias foram adicionadas
- [ ] As chaves do Stripe/PayPal são válidas
- [ ] O email SMTP está configurado corretamente
- [ ] O banco de dados Supabase está acessível

### Após o Deploy
- [ ] Teste a conexão com o banco de dados
- [ ] Teste o envio de emails
- [ ] Teste os pagamentos (em modo sandbox primeiro)
- [ ] Verifique os logs no dashboard do Vercel

## 🆘 Solução de Problemas Comuns

### Erro: "Can't reach database server"
- Verifique se o `DATABASE_URL` está correto
- Confira se o Supabase project está ativo
- Teste a conexão do banco no dashboard do Supabase

### Erro: "Invalid JWT Secret"
- Verifique se o `JWT_SECRET` tem pelo menos 32 caracteres
- Não use caracteres especiais problemáticos

### Erro: "SMTP Connection Failed"
- Verifique as credenciais do email
- Confira se o App Password do Gmail está correto
- Teste o envio de email no dashboard do Vercel

### Erro: "Stripe Keys Invalid"
- Verifique se está usando as chaves corretas (test vs live)
- Confira se as chaves não foram expiradas

## 📞 Suporte

Se precisar de ajuda:
1. Verifique os logs no dashboard do Vercel
2. Teste cada serviço separadamente (Stripe, PayPal, Email)
3. Consulte a documentação dos serviços:
   - [Vercel Environment Variables](https://vercel.com/docs/concepts/projects/environment-variables)
   - [Supabase Documentation](https://supabase.com/docs)
   - [Stripe Documentation](https://stripe.com/docs)
   - [PayPal Documentation](https://developer.paypal.com/docs)

---

**🎯 Objetivo: Tudo configurado para as pessoas assistirem as lives HOJE!**