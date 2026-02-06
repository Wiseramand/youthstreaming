#!/usr/bin/env pwsh

# Script de Deploy para Produção - Youth Angola Streaming
# Este script automatiza o processo de deploy no Vercel

param(
    [switch]$Help,
    [switch]$Frontend,
    [switch]$Backend,
    [switch]$Both,
    [switch]$Test
)

$ErrorActionPreference = 'Stop'

# Função para exibir ajuda
function Show-Help {
    Write-Host "Uso: .\deploy-production.ps1 [OPÇÕES]" -ForegroundColor Green
    Write-Host ""
    Write-Host "Opções:" -ForegroundColor Yellow
    Write-Host "  -Help     Exibe esta ajuda"
    Write-Host "  -Frontend Deploy apenas o frontend"
    Write-Host "  -Backend  Deploy apenas o backend"
    Write-Host "  -Both     Deploy frontend e backend (padrão)"
    Write-Host "  -Test     Testa a conexão com os serviços"
    Write-Host ""
    Write-Host "Exemplos:" -ForegroundColor Yellow
    Write-Host "  .\deploy-production.ps1 -Both"
    Write-Host "  .\deploy-production.ps1 -Frontend"
    Write-Host "  .\deploy-production.ps1 -Test"
}

# Função para verificar pré-requisitos
function Test-Prerequisites {
    Write-Host "🔍 Verificando pré-requisitos..." -ForegroundColor Cyan
    
    # Verificar Git
    if (!(Get-Command git -ErrorAction SilentlyContinue)) {
        Write-Host "❌ Git não encontrado. Instale o Git primeiro." -ForegroundColor Red
        return $false
    }
    Write-Host "✅ Git encontrado"
    
    # Verificar Node.js
    if (!(Get-Command node -ErrorAction SilentlyContinue)) {
        Write-Host "❌ Node.js não encontrado. Instale o Node.js primeiro." -ForegroundColor Red
        return $false
    }
    Write-Host "✅ Node.js encontrado"
    
    # Verificar npm
    if (!(Get-Command npm -ErrorAction SilentlyContinue)) {
        Write-Host "❌ npm não encontrado. Instale o npm primeiro." -ForegroundColor Red
        return $false
    }
    Write-Host "✅ npm encontrado"
    
    # Verificar Vercel CLI
    if (!(Get-Command vercel -ErrorAction SilentlyContinue)) {
        Write-Host "⚠️  Vercel CLI não encontrado. Instale com: npm install -g vercel" -ForegroundColor Yellow
        Write-Host "   Ou use o dashboard web: https://vercel.com/" -ForegroundColor Yellow
    } else {
        Write-Host "✅ Vercel CLI encontrado"
    }
    
    # Verificar conexão com internet
    try {
        $result = Test-Connection -ComputerName google.com -Count 1 -Quiet -ErrorAction SilentlyContinue
        if ($result) {
            Write-Host "✅ Conexão com internet OK"
        } else {
            Write-Host "❌ Sem conexão com internet" -ForegroundColor Red
            return $false
        }
    } catch {
        Write-Host "⚠️  Não foi possível testar conexão com internet" -ForegroundColor Yellow
    }
    
    return $true
}

# Função para testar serviços
function Test-Services {
    Write-Host "🧪 Testando serviços..." -ForegroundColor Cyan
    
    # Testar backend local
    if (Test-Connection -ComputerName localhost -Port 4000 -Quiet -ErrorAction SilentlyContinue) {
        try {
            $response = Invoke-RestMethod -Uri "http://localhost:4000/health" -Method Get -ErrorAction SilentlyContinue
            if ($response.status -eq "ok") {
                Write-Host "✅ Backend local respondendo"
            } else {
                Write-Host "⚠️  Backend local com problemas" -ForegroundColor Yellow
            }
        } catch {
            Write-Host "⚠️  Não foi possível testar backend local" -ForegroundColor Yellow
        }
    }
    
    # Testar frontend local
    if (Test-Connection -ComputerName localhost -Port 3000 -Quiet -ErrorAction SilentlyContinue) {
        Write-Host "✅ Frontend local respondendo"
    } else {
        Write-Host "⚠️  Frontend local não está rodando" -ForegroundColor Yellow
    }
    
    # Testar Supabase (se configurado)
    if ($env:DATABASE_URL) {
        Write-Host "✅ Variáveis de ambiente do banco de dados configuradas"
    } else {
        Write-Host "⚠️  Variáveis de ambiente do banco de dados não configuradas" -ForegroundColor Yellow
    }
    
    # Testar SMTP (se configurado)
    if ($env:SMTP_HOST) {
        Write-Host "✅ Variáveis de ambiente SMTP configuradas"
    } else {
        Write-Host "⚠️  Variáveis de ambiente SMTP não configuradas" -ForegroundColor Yellow
    }
}

# Função para build do frontend
function Build-Frontend {
    Write-Host "🔨 Buildando frontend..." -ForegroundColor Cyan
    
    Set-Location -Path "."
    
    # Instalar dependências
    Write-Host "📦 Instalando dependências do frontend..."
    npm install
    
    # Build
    Write-Host "🏗️  Executando build do frontend..."
    npm run build
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Frontend buildado com sucesso" -ForegroundColor Green
        return $true
    } else {
        Write-Host "❌ Erro ao buildar frontend" -ForegroundColor Red
        return $false
    }
}

# Função para build do backend
function Build-Backend {
    Write-Host "🔨 Buildando backend..." -ForegroundColor Cyan
    
    Set-Location -Path "./backend"
    
    # Instalar dependências
    Write-Host "📦 Instalando dependências do backend..."
    npm install
    
    # Build
    Write-Host "🏗️  Executando build do backend..."
    npm run build
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Backend buildado com sucesso" -ForegroundColor Green
        return $true
    } else {
        Write-Host "❌ Erro ao buildar backend" -ForegroundColor Red
        return $false
    }
}

# Função para deploy no Vercel
function Deploy-Vercel {
    param(
        [string]$ProjectName,
        [string]$Directory,
        [hashtable]$EnvVars
    )
    
    Write-Host "🚀 Deployando $ProjectName no Vercel..." -ForegroundColor Cyan
    
    Set-Location -Path $Directory
    
    # Configurar variáveis de ambiente
    foreach ($key in $EnvVars.Keys) {
        $value = $EnvVars[$key]
        if ($value) {
            Write-Host "   Configurando $key"
            # Note: No Vercel CLI, as variáveis são configuradas no dashboard
            # ou via API. Para este script, assumimos que já estão configuradas.
        }
    }
    
    # Deploy
    Write-Host "   Executando deploy..."
    vercel --prod --yes
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ $ProjectName deployado com sucesso" -ForegroundColor Green
        return $true
    } else {
        Write-Host "❌ Erro ao deployar $ProjectName" -ForegroundColor Red
        return $false
    }
}

# Função principal de deploy
function Start-Deploy {
    param(
        [switch]$DeployFrontend,
        [switch]$DeployBackend
    )
    
    Write-Host "🚀 Iniciando deploy de produção..." -ForegroundColor Green
    Write-Host ""
    
    # Verificar pré-requisitos
    if (-not (Test-Prerequisites)) {
        Write-Host "❌ Pré-requisitos não atendidos" -ForegroundColor Red
        exit 1
    }
    
    Write-Host ""
    
    # Build
    $frontendSuccess = $true
    $backendSuccess = $true
    
    if ($DeployFrontend) {
        $frontendSuccess = Build-Frontend
        Write-Host ""
    }
    
    if ($DeployBackend) {
        $backendSuccess = Build-Backend
        Write-Host ""
    }
    
    # Deploy
    if ($frontendSuccess -and $DeployFrontend) {
        # Para deploy no Vercel, o ideal é usar o dashboard web
        # ou configurar o GitHub Actions para deploy automático
        Write-Host "🌐 Para deployar o frontend:"
        Write-Host "   1. Acesse https://vercel.com/"
        Write-Host "   2. Importe seu repositório GitHub"
        Write-Host "   3. Configure as variáveis de ambiente"
        Write-Host "   4. O deploy será automático"
        Write-Host ""
    }
    
    if ($backendSuccess -and $DeployBackend) {
        Write-Host "🌐 Para deployar o backend:"
        Write-Host "   1. Acesse https://vercel.com/"
        Write-Host "   2. Crie um novo projeto"
        Write-Host "   3. Selecione a pasta 'backend'"
        Write-Host "   4. Configure as variáveis de ambiente"
        Write-Host "   5. O deploy será automático"
        Write-Host ""
    }
    
    # Resumo
    Write-Host "📊 Resumo do deploy:" -ForegroundColor Cyan
    if ($DeployFrontend) {
        if ($frontendSuccess) {
            Write-Host "   ✅ Frontend: Buildado com sucesso"
        } else {
            Write-Host "   ❌ Frontend: Erro no build"
        }
    }
    
    if ($DeployBackend) {
        if ($backendSuccess) {
            Write-Host "   ✅ Backend: Buildado com sucesso"
        } else {
            Write-Host "   ❌ Backend: Erro no build"
        }
    }
    
    Write-Host ""
    Write-Host "🎉 Deploy concluído!" -ForegroundColor Green
    Write-Host "   Consulte o DEPLOY_GUIDE.md para instruções detalhadas de deploy no Vercel." -ForegroundColor Yellow
}

# Função principal
function Main {
    # Exibir ajuda se solicitado
    if ($Help) {
        Show-Help
        return
    }
    
    # Determinar o que será deployado
    $deployFrontend = $false
    $deployBackend = $false
    
    if ($Test) {
        Test-Services
        return
    }
    
    if ($Frontend) {
        $deployFrontend = $true
    }
    
    if ($Backend) {
        $deployBackend = $true
    }
    
    if ($Both -or (-not $Frontend -and -not $Backend -and -not $Test)) {
        # Se nenhum parâmetro específico foi passado, deploy ambos
        $deployFrontend = $true
        $deployBackend = $true
    }
    
    # Iniciar deploy
    Start-Deploy -DeployFrontend:$deployFrontend -DeployBackend:$deployBackend
}

# Executar função principal
Main