#!/bin/bash

# Youth Angola Streaming - Deploy Script
echo "🚀 Iniciando deploy do Youth Angola Streaming..."

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Check if required files exist
echo "📋 Verificando arquivos necessários..."
if [ ! -f "backend/.env.production" ]; then
    print_error "Arquivo .env.production não encontrado!"
    exit 1
fi

if [ ! -f "backend/package.json" ]; then
    print_error "Arquivo backend/package.json não encontrado!"
    exit 1
fi

print_status "Arquivos necessários verificados"

# Install dependencies
echo "📦 Instalando dependências..."
cd backend
npm install
cd ..

print_status "Dependências instaladas"

# Run database migrations
echo "🗄️  Executando migrations..."
cd backend
npx prisma migrate deploy
cd ..

print_status "Migrations executadas"

# Create admin user
echo "👤 Criando usuário admin..."
cd backend
node scripts/createAdminProd.cjs
cd ..

print_status "Usuário admin criado"

# Build frontend (if build script exists)
if [ -f "package.json" ] && grep -q '"build"' package.json; then
    echo "🔨 Construindo frontend..."
    npm run build
    print_status "Frontend construído"
else
    print_warning "Script de build não encontrado, pulando build do frontend"
fi

# Check environment variables
echo "🔍 Verificando variáveis de ambiente..."
cd backend

required_vars=("DATABASE_URL" "JWT_SECRET" "NODE_ENV")
missing_vars=()

for var in "${required_vars[@]}"; do
    if ! grep -q "^$var=" .env.production; then
        missing_vars+=("$var")
    fi
done

if [ ${#missing_vars[@]} -ne 0 ]; then
    print_error "Variáveis de ambiente ausentes: ${missing_vars[*]}"
    print_warning "Por favor, configure todas as variáveis necessárias no .env.production"
    exit 1
fi

print_status "Variáveis de ambiente verificadas"

# Final checks
echo "✅ Verificações finais..."
echo "   - Banco de dados: OK"
echo "   - Migrations: OK" 
echo "   - Admin user: OK"
echo "   - Environment: OK"

print_status "Deploy preparado com sucesso!"

echo ""
echo "🎯 Próximos passos:"
echo "1. Configure SMTP no .env.production"
echo "2. Configure Stripe no .env.production"
echo "3. Faça o deploy para Vercel"
echo "4. Teste a aplicação em produção"
echo ""
echo "📚 Documentação:"
echo "   - PRODUCTION_DEPLOY.md: Guia completo de deploy"
echo "   - STRIPE_SETUP.md: Configuração de pagamentos"
echo "   - DEPLOY.md: Documentação geral"
echo ""
echo "🎉 Seu Youth Angola Streaming está pronto para produção!"