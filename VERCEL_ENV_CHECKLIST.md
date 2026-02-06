# Checklist Rápido - Configuração Vercel

## ✅ Variáveis Obrigatórias (COPIAR E COLAR)

### Banco de Dados & Sistema
```
DATABASE_URL: postgresql://postgres:%25s3.QP%2Fm%40yL20T24AnG%26%25L%23@db.jqqduvdldrsjkvaiqxxy.supabase.co:5432/postgres?sslmode=require
JWT_SECRET: 18cd81f0a679a7e67ece510e41821db10b34896d1a6d31db12102df0a13b35cd1ee7a4fff5de90916b17f09a6bd7b613550f98af8e1df36374d1fffdbe922794
NODE_ENV: production
PORT: 4000
```

### Supabase
```
SUPABASE_URL: https://jqqduvdldrsjkvaiqxxy.supabase.co
SUPABASE_ANON_KEY: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpxcWR1dmRsZHJzamt2YWlxeHh5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAzNTc1MjMsImV4cCI6MjA4NTkzMzUyM30.1qpR7bNYOOafYJJ3x_oI2wr9MGksw2Cp3g6UhIu9wko
```

## 📧 Variáveis de Email (CONFIGURAR MANUALMENTE)

### SMTP Gmail
```
SMTP_HOST: smtp.gmail.com
SMTP_PORT: 587
SMTP_USER: [SEU EMAIL GMAIL]
SMTP_PASS: [SENHA APP GMAIL]
SMTP_FROM: noreply@youthangola.com
```

## 💳 Variáveis de Pagamento (CONFIGURAR MANUALMENTE)

### Stripe
```
STRIPE_SECRET_KEY: [sk_test_...]
STRIPE_PUBLISHABLE_KEY: [pk_test_...]
STRIPE_WEBHOOK_SECRET: [whsec_...]
```

### PayPal
```
PAYPAL_CLIENT_ID: [seu_client_id]
PAYPAL_CLIENT_SECRET: [seu_client_secret]
```

## 🎯 Passos para Configurar no Vercel

1. **Acessar Vercel Dashboard**
   - [https://vercel.com/dashboard](https://vercel.com/dashboard)
   - Selecionar projeto "youth-angola-streaming"

2. **Configurar Variáveis**
   - Settings → Environment Variables → Add
   - Tipo: **Encrypted** para senhas/chaves
   - Tipo: **Plain** para URLs e textos simples
   - Ambiente: **Production**

3. **Adicionar Variáveis (Ordem Importante)**
   - [ ] DATABASE_URL (Encrypted)
   - [ ] JWT_SECRET (Encrypted)
   - [ ] NODE_ENV (Plain)
   - [ ] PORT (Plain)
   - [ ] SUPABASE_URL (Plain)
   - [ ] SUPABASE_ANON_KEY (Encrypted)
   - [ ] SMTP_HOST (Plain)
   - [ ] SMTP_PORT (Plain)
   - [ ] SMTP_USER (Encrypted)
   - [ ] SMTP_PASS (Encrypted)
   - [ ] SMTP_FROM (Plain)
   - [ ] STRIPE_SECRET_KEY (Encrypted)
   - [ ] STRIPE_PUBLISHABLE_KEY (Plain)
   - [ ] STRIPE_WEBHOOK_SECRET (Encrypted)
   - [ ] PAYPAL_CLIENT_ID (Encrypted)
   - [ ] PAYPAL_CLIENT_SECRET (Encrypted)

4. **Salvar e Redeploy**
   - Clique em "Save"
   - Deployments → Redeploy

## 🔧 Como Obter Chaves (Passo a Passo)

### Stripe (5 minutos)
1. Acesse [stripe.com](https://dashboard.stripe.com)
2. Developers → API keys
3. Copie "Secret key" e "Publishable key"
4. Webhooks → Add endpoint → Copie "Signing secret"

### PayPal (5 minutos)
1. Acesse [developer.paypal.com](https://developer.paypal.com)
2. Apps & Credentials → Create App
3. Copie "Client ID" e "Client Secret"

### Gmail SMTP (3 minutos)
1. Acesse [myaccount.google.com/security](https://myaccount.google.com/security)
2. 2-Step Verification → App passwords
3. Gerar senha para "Mail"
4. Use seu email + senha do app

## 🚨 Verificações Finais

Antes de deploy:
- [ ] Todas as variáveis acima foram adicionadas
- [ ] Chaves do Stripe/PayPal copiadas corretamente
- [ ] Senha do Gmail App Password gerada
- [ ] DATABASE_URL está igual ao mostrado acima

Após deploy:
- [ ] Backend está respondendo
- [ ] Conexão com banco funciona
- [ ] Logs no Vercel sem erros críticos

## ⏱️ Tempo Estimado
- Configurar variáveis: **10 minutos**
- Obter chaves externas: **15 minutos**
- Deploy e testes: **10 minutos**
- **Total: 35 minutos**

---

**🎯 META: Tudo pronto para as lives HOJE!**