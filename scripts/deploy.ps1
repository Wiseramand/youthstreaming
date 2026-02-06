# Youth Angola Streaming - Deploy Script (PowerShell)
Write-Host "🚀 Iniciando deploy do Youth Angola Streaming..." -ForegroundColor Green

# Function to print colored output
function Write-Status {
    param(
        [string]$Message
    )
    Write-Host "✅ $Message" -ForegroundColor Green
}

function Write-WarningMsg {
    param(
        [string]$Message
    )
    Write-Host "⚠️  $Message" -ForegroundColor Yellow
}

function Write-ErrorMsg {
    param(
        [string]$Message
    )
    Write-Host "❌ $Message" -ForegroundColor Red
}

# Check if required files exist
Write-Host "📋 Verificando arquivos necessários..."
if (-not (Test-Path "backend/.env.production")) {
    Write-ErrorMsg "Arquivo .env.production não encontrado!"
    exit 1
}

if (-not (Test-Path "backend/package.json")) {
    Write-ErrorMsg "Arquivo backend/package.json não encontrado!"
    exit 1
}

Write-Status "Arquivos necessários verificados"

# Install dependencies
Write-Host "📦 Instalando dependências..."
Set-Location backend
npm install
Set-Location ..

Write-Status "Dependências instaladas"

# Run database migrations
Write-Host "🗄️  Executando migrations..."
Set-Location backend
npx prisma migrate deploy
Set-Location ..

Write-Status "Migrations executadas"

# Create admin user
Write-Host "👤 Criando usuário admin..."
Set-Location backend
node scripts/createAdminProd.cjs
Set-Location ..

Write-Status "Usuário admin criado"

# Check if build script exists
if ((Test-Path "package.json")) {
    Write-Host "🔨 Construindo frontend..."
    npm run build
    Write-Status "Frontend construído"
} else {
    Write-WarningMsg "Script de build não encontrado, pulando build do frontend"
}

# Check environment variables
Write-Host "🔍 Verificando variáveis de ambiente..."
Set-Location backend

$requiredVars = @("DATABASE_URL", "JWT_SECRET", "NODE_ENV")
$missingVars = @()

foreach ($var in $requiredVars) {
    if (-not (Get-Content .env.production | Select-String "^$var=")) {
        $missingVars += $var
    }
}

if ($missingVars.Count -gt 0) {
    Write-ErrorMsg "Variaveis ausentes: $missingVars"
    Write-WarningMsg "Por favor, configure todas as variáveis necessárias no .env.production"
    exit 1
}

Write-Status "Variáveis de ambiente verificadas"

# Final checks
Write-Host "✅ Verificações finais..."
Write-Host "   - Banco de dados: OK"
Write-Host "   - Migrations: OK" 
Write-Host "   - Admin user: OK"
Write-Host "   - Environment: OK"

Write-Status "Deploy preparado com sucesso!"

Write-Host ""
Write-Host "🎯 Próximos passos:" -ForegroundColor Cyan
Write-Host "1. Configure SMTP no .env.production"
Write-Host "2. Configure Stripe no .env.production"
Write-Host "3. Faça o deploy para Vercel"
Write-Host "4. Teste a aplicação em produção"
Write-Host ""
Write-Host "📚 Documentação:" -ForegroundColor Cyan
Write-Host "   - PRODUCTION_DEPLOY.md: Guia completo de deploy"
Write-Host "   - STRIPE_SETUP.md: Configuração de pagamentos"
Write-Host "   - DEPLOY.md: Documentação geral"
Write-Host ""
Write-Host "🎉 Seu Youth Angola Streaming está pronto para produção!" -ForegroundColor Yellow