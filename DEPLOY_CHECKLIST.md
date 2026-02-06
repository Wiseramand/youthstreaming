# Checklist de Deploy - Youth Angola Streaming

## 🚀 **Checklist Completo para Deploy em Produção**

### 📋 **Pré-Deploy**

#### **✅ Código e Repositório**
- [x] Código versionado no GitHub
- [x] Branch principal (main/master) estável
- [x] Último commit testado localmente
- [x] Arquivos sensíveis (.env) no .gitignore
- [x] Documentação atualizada

#### **✅ Ambiente de Desenvolvimento**
- [x] Frontend buildando sem erros
- [x] Backend buildando sem erros
- [x] Testes unitários passando (se existirem)
- [x] Conexão com banco de dados local funcionando
- [x] Integrações de pagamento testadas (sandbox)

#### **✅ Configuração de Produção**
- [x] Variáveis de ambiente de produção criadas
- [x] JWT secret gerado (64 bytes)
- [x] Configuração CORS correta
- [x] Rate limiting configurado
- [x] Logs configurados

### 🌐 **Serviços Externos**

#### **✅ Supabase (Banco de Dados)**
- [ ] Conta criada: https://supabase.com/
- [ ] Projeto criado
- [ ] Banco de dados PostgreSQL configurado
- [ ] Credenciais de produção geradas
- [ ] Políticas RLS configuradas
- [ ] Migrações aplicadas
- [ ] Conexão testada

#### **✅ SMTP (Email)**
- [ ] Conta Gmail/SendGrid configurada
- [ ] Credenciais SMTP geradas
- [ ] Teste de envio de email realizado
- [ ] Domínio verificado (se necessário)

#### **✅ Stripe (Pagamentos)**
- [ ] Conta Stripe criada: https://stripe.com/
- [ ] Modo live ativado
- [ ] Chaves API de produção obtidas
- [ ] Webhook configurado
- [ ] Webhook secret configurado
- [ ] Testes de pagamento realizados

#### **✅ PayPal (Pagamentos)**
- [ ] Conta PayPal Business criada
- [ ] API credentials obtidas
- [ ] Webhook configurado
- [ ] Testes de pagamento realizados

### 🚀 **Deploy no Vercel**

#### **✅ Frontend**
- [ ] Conectar ao repositório GitHub
- [ ] Selecionar framework: Vite
- [ ] Configurar build command: `npm run build`
- [ ] Configurar output directory: `dist`
- [ ] Configurar install command: `npm install`
- [ ] Variáveis de ambiente configuradas:
  - `VITE_API_URL=https://seu-backend.vercel.app`
- [ ] Deploy automático configurado
- [ ] Domínio customizado (opcional)

#### **✅ Backend**
- [ ] Criar novo projeto no Vercel
- [ ] Selecionar pasta: `backend`
- [ ] Selecionar framework: Node.js
- [ ] Configurar build command: `npm run build`
- [ ] Configurar output directory: `dist`
- [ ] Configurar install command: `npm install`
- [ ] Variáveis de ambiente configuradas:
  - `DATABASE_URL=postgresql://...`
  - `JWT_SECRET=sua-chave-secreta`
  - `FRONTEND_URL=https://seu-frontend.vercel.app`
  - `SMTP_HOST=smtp.gmail.com`
  - `SMTP_PORT=587`
  - `SMTP_USER=seu-email@gmail.com`
  - `SMTP_PASS=sua-app-password`
  - `SMTP_FROM=noreply@youthangola.com`
  - `STRIPE_SECRET_KEY=sk_live_...`
  - `STRIPE_WEBHOOK_SECRET=whsec_...`
  - `PAYPAL_CLIENT_ID=...`
  - `PAYPAL_CLIENT_SECRET=...`
- [ ] Deploy automático configurado
- [ ] Domínio customizado (opcional)

### 🧪 **Testes de Produção**

#### **✅ Health Checks**
- [ ] Backend respondendo: `https://seu-backend.vercel.app/health`
- [ ] API respondendo: `https://seu-backend.vercel.app/api`
- [ ] Frontend carregando: `https://seu-frontend.vercel.app`
- [ ] Conexão WebSocket funcionando

#### **✅ Funcionalidades Críticas**
- [ ] Registro de usuários
- [ ] Login/logout
- [ ] Autenticação JWT
- [ ] Acesso a streams públicos
- [ ] Acesso a streams VIP (com autenticação)
- [ ] Sistema de chat
- [ ] Doações Stripe (sandbox → produção)
- [ ] Doações PayPal (sandbox → produção)
- [ ] Painel administrativo

#### **✅ Segurança**
- [ ] CORS configurado corretamente
- [ ] Rate limiting funcionando
- [ ] JWT expirando corretamente
- [ ] Senhas criptografadas
- [ ] Headers de segurança presentes

#### **✅ Performance**
- [ ] Tempo de carregamento aceitável
- [ ] Streaming iniciando rapidamente
- [ ] Chat respondendo em tempo real
- [ ] API respondendo rapidamente

### 📊 **Monitoramento**

#### **✅ Logs e Métricas**
- [ ] Logs do Vercel configurados
- [ ] Monitoramento de erros
- [ ] Métricas de performance
- [ ] Alertas de downtime

#### **✅ Backups**
- [ ] Backup automático do banco de dados
- [ ] Backup do código fonte
- [ ] Plano de recuperação de desastres

### 🎉 **Pós-Deploy**

#### **✅ Verificação Final**
- [ ] Todos os endpoints críticos testados
- [ ] Usuários de teste criados
- [ ] Fluxo completo de pagamento testado
- [ ] Documentação de produção atualizada

#### **✅ Comunicação**
- [ ] Equipe informada sobre deploy
- [ ] Documentação de deploy compartilhada
- [ ] Contatos de suporte definidos

## 🚨 **Problemas Comuns e Soluções**

### **Erro 500 no Backend**
```bash
# Verificar logs
vercel logs seu-projeto.vercel.app

# Verificar variáveis de ambiente
vercel env ls

# Testar conexão com banco
curl -X POST https://seu-backend.vercel.app/api/auth/test
```

### **Frontend não conecta ao Backend**
```bash
# Verificar CORS
curl -I https://seu-backend.vercel.app/api

# Verificar VITE_API_URL
echo $VITE_API_URL
```

### **Pagamentos não funcionam**
```bash
# Verificar chaves API
# Testar webhooks
# Verificar sandbox vs production
```

### **Emails não são enviados**
```bash
# Verificar credenciais SMTP
# Testar conexão SMTP
# Verificar limites de envio
```

## 📞 **Contatos de Suporte**

### **Desenvolvimento**
- **GitHub Issues**: https://github.com/Wiseramand/youthstreaming/issues
- **Email**: youthangola@support.com

### **Infraestrutura**
- **Vercel Support**: https://vercel.com/support
- **Supabase Support**: https://supabase.com/support

### **Pagamentos**
- **Stripe Support**: https://support.stripe.com/
- **PayPal Support**: https://www.paypal.com/smarthelp/contact-us

---

## ✅ **Status Final**

**Data do último deploy:** [DATA]  
**Versão:** [VERSÃO]  
**Status:** [✅ PRONTO / ⚠️ EM TESTES / ❌ COM PROBLEMAS]  

**Próximos passos:**  
[ ] Configurar monitoramento avançado  
[ ] Implementar testes automatizados  
[ ] Configurar CDN para assets  
[ ] Otimizar performance

---

**⚠️ Importante:** Este checklist deve ser revisado antes de cada deploy em produção.