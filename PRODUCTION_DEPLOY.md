# 🚀 Production Deployment Guide

## Últimos Passos para Deploy em Produção

### 1. Configurar Banco de Dados de Produção

**⚠️ CRÍTICO: Atualizar DATABASE_URL**

1. **Obter URL do banco de produção**
   - Se usando Supabase: `https://app.supabase.com/project/your-project/settings/database`
   - Se usando outro provedor: obtenha a connection string

2. **Atualizar .env.production**
   ```env
   DATABASE_URL="postgresql://user:password@host:port/dbname?sslmode=require"
   ```

3. **Executar migrations**
   ```bash
   cd backend
   npx prisma migrate deploy
   ```

### 2. Criar Usuário Admin de Produção

```bash
cd backend
node scripts/createAdminProd.cjs
```

**⚠️ IMPORTANTE:**
- Alterar a senha padrão após o primeiro login
- Usar uma senha forte e única
- Armazenar a senha em local seguro

### 3. Configurar SMTP para Produção

1. **Configurar Gmail (recomendado)**
   - Ativar 2FA na conta Google
   - Gerar App Password: `https://myaccount.google.com/apppasswords`
   - Atualizar variáveis no ambiente de produção:
     ```env
     SMTP_HOST=smtp.gmail.com
     SMTP_PORT=587
     SMTP_USER=seu-email@empresa.com
     SMTP_PASS=sua-app-password
     SMTP_FROM=noreply@youthangola.com
     ```

2. **Alternativas**
   - SendGrid, Mailgun, AWS SES
   - Seguir documentação de cada provedor

### 4. Configurar Stripe para Produção

1. **Obter chaves de produção**
   - Dashboard Stripe → Developers → API keys
   - Copiar chaves "Live" (não "Test")

2. **Atualizar variáveis de ambiente**
   ```env
   STRIPE_SECRET_KEY=sk_live_sua_chave_aqui
   STRIPE_PUBLIC_KEY=pk_live_sua_chave_aqui
   STRIPE_WEBHOOK_SECRET=whsec_sua_webhook_secret
   ```

3. **Configurar webhooks de produção**
   - URL: `https://seu-dominio.com/api/webhook/stripe`
   - Eventos: `payment_intent.succeeded`, `payment_intent.payment_failed`

### 5. Deploy para Vercel

#### Backend Deployment

1. **Conectar repositório**
   - Vercel Dashboard → New Project → Import Git Repository

2. **Configurar Environment Variables**
   - Adicionar todas as variáveis do `.env.production`
   - Incluir SMTP, Stripe, JWT_SECRET, DATABASE_URL

3. **Configurar Build Settings**
   - Framework: Custom
   - Build Command: `npm run build` (se houver)
   - Output Directory: `dist` (se houver)
   - Install Command: `npm install`

#### Frontend Deployment

1. **Conectar repositório**
   - Vercel Dashboard → New Project

2. **Configurar Environment Variables**
   ```env
   VITE_API_URL=https://seu-backend.vercel.app
   VITE_STRIPE_PUBLIC_KEY=pk_live_sua_chave_aqui
   ```

3. **Build Settings**
   - Framework: Vite
   - Build Command: `npm run build`
   - Output Directory: `dist`

### 6. Testes Finais de Produção

#### Testar Autenticação
```bash
# Testar login admin
POST /api/auth/login
{
  "email": "admin@youthangola.com",
  "password": "AdminYouth2024!"
}
```

#### Testar Criação de Usuário VIP
```bash
# Testar criação de usuário VIP (requer auth admin)
POST /api/vip/users
Authorization: Bearer <admin-token>
{
  "name": "Test User",
  "email": "test@example.com",
  "password": "TestPassword123!",
  "role": "VIP"
}
```

#### Testar Pagamentos
```bash
# Testar criação de pagamento
POST /api/donations
Authorization: Bearer <user-token>
{
  "amount": 1000,
  "currency": "USD",
  "method": "stripe",
  "message": "Test donation"
}
```

### 7. Monitoramento e Manutenção

#### Logs e Monitoramento
- Configurar logs no Vercel Dashboard
- Monitorar erros e performance
- Configurar alertas para falhas críticas

#### Segurança
- Atualizar dependências regularmente
- Monitorar acesso ao painel admin
- Revisar permissões de banco de dados
- Configurar backups regulares

#### Performance
- Monitorar tempo de resposta da API
- Otimizar consultas ao banco de dados
- Configurar cache quando necessário
- Monitorar uso de recursos

### 8. Checklist Final

- [ ] Banco de dados de produção configurado
- [ ] Migrations executadas
- [ ] Usuário admin criado
- [ ] SMTP configurado e testado
- [ ] Stripe configurado e testado
- [ ] Backend deployado
- [ ] Frontend deployado
- [ ] Variáveis de ambiente configuradas
- [ ] Testes de funcionalidade realizados
- [ ] Monitoramento configurado
- [ ] Documentação de suporte criada

### 9. Suporte e Troubleshooting

#### Problemas Comuns

**Erro de conexão com banco:**
- Verificar DATABASE_URL
- Confirmar acesso ao banco de dados
- Verificar firewall e permissões

**Erros de autenticação:**
- Verificar JWT_SECRET
- Confirmar formato do token
- Verificar expiração do token

**Problemas de pagamento:**
- Verificar chaves Stripe
- Confirmar webhook configurado
- Testar com cartões de teste

**Erros de email:**
- Verificar SMTP credentials
- Confirmar App Password do Gmail
- Testar configuração SMTP

#### Contatos de Suporte
- Desenvolvimento: [seu-email@empresa.com]
- Infraestrutura: [infra@empresa.com]
- Documentação: [docs.yourapp.com]

---

**🎉 Deploy concluído! Seu Youth Angola Streaming está pronto para produção!**