# Deploy para Produção no Vercel

Guia completo para deployar o Youth Angola Streaming em produção.

## Pré-requisitos

### 1. Banco de Dados em Nuvem
Escolha um dos provedores abaixo:

#### Supabase (Recomendado)
1. Crie conta em [supabase.com](https://supabase.com)
2. Crie um novo projeto
3. No painel, vá em Settings > Database
4. Copie a string de conexão

#### Outras opções:
- **Railway**: railway.app
- **Neon**: neon.tech
- **PlanetScale**: planetscale.com

### 2. Gerar JWT Secret
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

## Configuração no Vercel

### 1. Conectar ao GitHub
1. Acesse [vercel.com](https://vercel.com)
2. Conecte sua conta GitHub
3. Importe o repositório `youthstreaming`

### 2. Configurar Variáveis de Ambiente

No painel do Vercel, vá em Settings > Environment Variables e adicione:

#### Backend Environment Variables:
```
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE?schema=public"
JWT_SECRET="SEU_JWT_SECRET_AQUI"
NODE_ENV="production"
FRONTEND_URL="https://seu-projeto.vercel.app"
```

#### Frontend Environment Variables:
```
VITE_API_URL="https://seu-backend.vercel.app"
```

### 3. Configurar Build

#### Frontend:
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`

#### Backend:
- **Build Command**: `cd backend && npm run build`
- **Output Directory**: `backend/dist`
- **Install Command**: `cd backend && npm install`

## Deploy

### 1. Deploy do Backend
```bash
cd backend
npm run build
```

### 2. Deploy do Frontend
```bash
npm run build
```

### 3. Verificar Deploy
- Frontend: `https://seu-projeto.vercel.app`
- Backend: `https://seu-backend.vercel.app`

## Pós-Deploy

### 1. Criar Admin
Acesse o backend e execute:
```bash
cd backend
node scripts/createAdmin.cjs
```

### 2. Testar API
Teste as rotas:
- `GET /health` - Verifica se o backend está online
- `POST /api/auth/login` - Testa autenticação

### 3. Monitoramento
- Verifique logs no painel do Vercel
- Monitore uso de banco de dados
- Configure alertas de erro

## Troubleshooting

### Erros Comuns:

#### 1. JWT Secret muito curto
**Erro**: "jwt malformed"
**Solução**: Use um JWT Secret com pelo menos 32 caracteres

#### 2. Conexão com banco de dados
**Erro**: "connection refused"
**Solução**: Verifique DATABASE_URL e permissões de IP

#### 3. CORS bloqueado
**Erro**: "CORS policy blocked"
**Solução**: Verifique FRONTEND_URL nas variáveis de ambiente

#### 4. Build falhando
**Erro**: "Module not found"
**Solução**: Verifique dependências no package.json

## Segurança

### 1. Rotas Protegidas
Todas as rotas sensíveis exigem autenticação JWT:
- `/api/profile/*` - Perfil do usuário
- `/api/admin/*` - Administração
- `/api/donations/*` - Doações
- `/api/streams/*` - Streams

### 2. Validação de Dados
Todas as entradas são validadas com Zod Schema.

### 3. Senhas Criptografadas
Senhas são armazenadas com bcrypt (salt rounds: 10).

## Performance

### 1. Banco de Dados
- Use conexão SSL
- Configure pool de conexões
- Monitore queries lentas

### 2. Cache
- Implementar cache para streams populares
- Considerar Redis para sessões

### 3. CDN
- Servir assets estáticos via CDN
- Comprimir imagens e vídeos

## Manutenção

### 1. Backups
Configure backups automáticos no seu provedor de banco de dados.

### 2. Updates
Mantenha dependências atualizadas:
```bash
npm update
cd backend && npm update
```

### 3. Monitoramento
- Logs de erro
- Métricas de performance
- Uso de recursos

## Suporte

Para suporte:
1. Verifique logs no Vercel
2. Teste localmente antes de deployar
3. Consulte a documentação do Prisma e Express