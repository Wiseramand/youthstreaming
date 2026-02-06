# Youth Angola Streaming - Database Setup Script
Write-Host "🗄️  Configurando banco de dados de produção..." -ForegroundColor Green

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

# Check if .env.production exists
if (-not (Test-Path "backend/.env.production")) {
    Write-ErrorMsg "Arquivo .env.production não encontrado!"
    Write-WarningMsg "Por favor, crie o arquivo .env.production com as configurações de produção"
    exit 1
}

Write-Status "Arquivo .env.production encontrado"

# Check current DATABASE_URL
Write-Host "🔍 Verificando DATABASE_URL atual..."
$envPath = "backend/.env.production"
$currentDbUrl = Get-Content $envPath | Where-Object { $_ -match "^DATABASE_URL=" }

if ($currentDbUrl) {
    Write-Host "DATABASE_URL atual: $currentDbUrl" -ForegroundColor Cyan
} else {
    Write-WarningMsg "DATABASE_URL não configurado"
}

# Check if it's using Supabase
if ($currentDbUrl -match "supabase.co") {
    Write-WarningMsg "Detectado Supabase - verificando conexão..."
    
    # Test connection
    Write-Host "📡 Testando conexão com Supabase..."
    Set-Location backend
    try {
        $result = npx prisma db pull --force-reset 2>&1
        if ($LASTEXITCODE -eq 0) {
            Write-Status "Conexão com Supabase bem-sucedida!"
        } else {
            Write-ErrorMsg "Falha na conexão com Supabase"
            Write-Host "Erro: $result" -ForegroundColor Red
        }
    } catch {
        Write-ErrorMsg "Erro ao testar conexão: $_"
    }
    Set-Location ..
} else {
    Write-WarningMsg "Banco de dados não identificado como Supabase"
}

# Create database setup guide
Write-Host ""
Write-Host "📚 Guia de configuração do banco de dados:" -ForegroundColor Cyan
Write-Host ""
Write-Host "Para configurar o banco de dados de produção, siga estes passos:"
Write-Host ""
Write-Host "1. Obtenha a URL do seu banco de dados de produção:"
Write-Host "   - Se usando Supabase: https://app.supabase.com/project/your-project/settings/database"
Write-Host "   - Se usando outro provedor: obtenha a connection string"
Write-Host ""
Write-Host "2. Atualize o DATABASE_URL no .env.production:"
Write-Host "   DATABASE_URL='postgresql://user:password@host:port/dbname?sslmode=require'"
Write-Host ""
Write-Host "3. Execute as migrations:"
Write-Host "   cd backend"
Write-Host "   npx prisma migrate deploy"
Write-Host ""
Write-Host "4. Crie o usuário admin:"
Write-Host "   node scripts/createAdminProd.cjs"
Write-Host ""

# Check if we can auto-detect Supabase URL
if ($currentDbUrl -match "supabase.co") {
    Write-WarningMsg "Supabase detectado - verificando se as migrations já foram executadas..."
    
    Set-Location backend
    try {
        $migrations = npx prisma migrate status 2>&1
        Write-Host "Status das migrations:" -ForegroundColor Cyan
        Write-Host $migrations
    } catch {
        Write-ErrorMsg "Erro ao verificar status das migrations: $_"
    }
    Set-Location ..
}

Write-Status "Configuração do banco de dados concluída!"
Write-Host ""
Write-Host "🎯 Próximos passos:"
Write-Host "1. Verifique se o DATABASE_URL está correto"
Write-Host "2. Execute: cd backend && npx prisma migrate deploy"
Write-Host "3. Execute: cd backend && node scripts/createAdminProd.cjs"
Write-Host "4. Teste a aplicação em produção"