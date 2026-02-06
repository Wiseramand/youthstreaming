# Guia Completo de Deploy - Youth Angola Streaming

## 🚀 **Visão Geral**

Este guia fornece instruções completas para deployar o projeto Youth Angola Streaming em produção.

## 📋 **Pré-requisitos**

### Ferramentas Necessárias
- [Git](https://git-scm.com/)
- [Node.js](https://nodejs.org/) (versão 18.x ou superior)
- [npm](https://www.npmjs.com/) (versão 8.x ou superior)
- Conta no [GitHub](https://github.com/)
- Conta no [Vercel](https://vercel.com/)

### Serviços de Terceiros
- [Supabase](https://supabase.com/) (banco de dados)
- [SendGrid](https://sendgrid.com/) ou [Gmail](https://gmail.com/) (email)
- [Stripe](https://stripe.com/) (pagamentos)
- [PayPal](https://paypal.com/) (pagamentos)

## 🏗️ **Arquitetura do Projeto**

```
youth-angola-streaming/
├── frontend/           # Vite + React (Porta 3000)
│   ├── App.tsx
│   ├── components/
│   └── package.json
├── backend/            # Express.js (Porta 4000)
│   ├── src/
│   ├── package.json
│   └── .env.production
└── scripts/            # Scripts de deploy
```

## 🔧 **Configuração de Ambiente de Produção**

### 1. Banco de Dados (Supabase)

1. Crie uma conta no [Supabase](https://supabase.com/)
2. Crie um novo projeto
3. Copie as credenciais:
   - **Database URL**: `postgresql://postgres:[PASSWORD]@db.xxxx.supabase.co:5432/postgres`
   - **API URL**: `https://xxxx.supabase.co`
   - **Anon Key**: `public-anon-key`

### 2. SMTP (Email)

**Opção 1: Gmail**
1. Ative verificação em duas etapas
2. Gere senha de app: [https://myaccount.google.com/apppasswords](https://myaccount.google.com/apppasswords)
3. Configure no `.env.production`:
   ```
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=seu-email@gmail.com
   SMTP_PASS=sua-app-password
   ```

**Opção 2: SendGrid**
1. Crie conta no [SendGrid](https://sendgrid.com/)
2. Gere API Key
3. Configure no `.env.production`:
   ```
   SMTP_HOST=smtp.sendgrid.net
   SMTP_PORT=587
   SMTP_USER=apikey
   SMTP_PASS=sua-sendgrid-api-key
   ```

### 3. Pagamentos

**Stripe**
1. Crie conta no [Stripe](https://stripe.com/)
2. Obtenha as chaves:
   - **Secret Key**: `sk_test_xxx`
   - **Publishable Key**: `pk_test_xxx`
   - **Webhook Secret**: `whsec_xxx`

**PayPal**
1. Crie conta no [PayPal Developer](https://developer.paypal.com/)
2. Obtenha as credenciais:
   - **Client ID**: `xxx`
   - **Client Secret**: `xxx`

## 🚀 **Deploy no Vercel**

### 1. Frontend

1. **Conecte ao GitHub**
   ```bash
   # No Vercel Dashboard
   Import Git Repository → Conecte ao seu repositório
   ```

2. **Configure Build**
   ```
   Framework Preset: Vite
   Build Command: npm run build
   Output Directory: dist
   Install Command: npm install
   ```

3. **Variáveis de Ambiente**
   ```
   VITE_API_URL=https://seu-backend.vercel.app
   ```

### 2. Backend

1. **Crie Projeto Separado**
   - No Vercel, crie um novo projeto para o backend
   - Conecte ao mesmo repositório, mas aponte para a pasta `backend/`

2. **Configure Build**
   ```
   Framework Preset: Node.js
   Build Command: npm run build
   Output Directory: dist
   Install Command: npm install
   ```

3. **Variáveis de Ambiente**
   ```
   DATABASE_URL=postgresql://USER:PASSWORD@HOST:PORT/DATABASE?schema=public
   JWT_SECRET=sua-chave-secreta-forte
   FRONTEND_URL=https://seu-frontend.vercel.app
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=seu-email@gmail.com
   SMTP_PASS=sua-app-password
   SMTP_FROM=noreply@youthangola.com
   STRIPE_SECRET_KEY=sk_test_xxx
   STRIPE_WEBHOOK_SECRET=whsec_xxx
   PAYPAL_CLIENT_ID=xxx
   PAYPAL_CLIENT_SECRET=xxx
   ```

## 🔐 **Segurança**

### 1. JWT Secret
Gere uma chave secreta forte:
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

### 2. CORS
Configure corretamente o `FRONTEND_URL` para permitir apenas domínios específicos.

### 3. Rate Limiting
O backend já inclui rate limiting (100 requisições por 15 minutos por IP).

## 🧪 **Testes de Deploy**

### 1. Teste de Saúde
```bash
curl https://seu-backend.vercel.app/health
# Deve retornar: {"status":"ok","timestamp":"...","environment":"production"}
```

### 2. Teste de API
```bash
curl https://seu-backend.vercel.app/api
# Deve retornar informações da API
```

### 3. Teste de Frontend
- Acesse o frontend no navegador
- Verifique se a conexão com a API está funcionando
- Teste login, registro e funcionalidades básicas

## 📊 **Monitoramento**

### 1. Logs
- Vercel Dashboard → Functions → Logs
- Monitorar erros e performance

### 2. Métricas
- Vercel Analytics
- Supabase Dashboard (banco de dados)
- Stripe Dashboard (pagamentos)

## 🔄 **CI/CD**

### 1. GitHub Actions
O projeto já inclui workflows básicos. Para CI/CD avançado:

1. **Testes Automáticos**
   ```yaml
   # .github/workflows/test.yml
   name: Test
   on: [push, pull_request]
   jobs:
     test:
       runs-on: ubuntu-latest
       steps:
         - uses: actions/checkout@v3
         - uses: actions/setup-node@v3
           with:
             node-version: '18'
         - run: npm install
         - run: npm run build
   ```

2. **Deploy Automático**
   - Vercel já faz deploy automático ao push no main/master

## 🚨 **Troubleshooting**

### Problemas Comuns

1. **Erro de Banco de Dados**
   - Verifique conexão com Supabase
   - Confira permissões e políticas de RLS

2. **Erro de Email**
   - Verifique credenciais SMTP
   - Teste conexão SMTP

3. **Erro de CORS**
   - Confira `FRONTEND_URL` no backend
   - Verifique domínios permitidos

4. **Erro de JWT**
   - Confira `JWT_SECRET`
   - Verifique expiração de tokens

### Comandos Úteis

```bash
# Testar conexão com banco
curl -X POST https://seu-backend.vercel.app/api/auth/test

# Verificar logs no Vercel
vercel logs seu-projeto.vercel.app

# Testar API localmente
npm run dev # frontend
cd backend && npm run dev # backend
```

## 📞 **Suporte**

- [Issues do GitHub](https://github.com/Wiseramand/youthstreaming/issues)
- [Documentação Vercel](https://vercel.com/docs)
- [Documentação Supabase](https://supabase.com/docs)

---

**⚠️ Importante**: Nunca commite arquivos `.env` no repositório. Use variáveis de ambiente no Vercel Dashboard.