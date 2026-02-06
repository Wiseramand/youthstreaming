#!/usr/bin/env pwsh

# Script para atualizar Node.js de versão 22 para 18
# Este script fornece instruções passo-a-passo

Write-Host "🔄 Atualização do Node.js para versão 18" -ForegroundColor Green
Write-Host ""

Write-Host "⚠️  ATENÇÃO: Este script fornece instruções. A troca do Node.js requer ações manuais." -ForegroundColor Yellow
Write-Host ""

Write-Host "📋 Passos para atualizar o Node.js:" -ForegroundColor Cyan
Write-Host ""

Write-Host "1. Desinstalar Node.js 22:" -ForegroundColor Yellow
Write-Host "   - Abra o Painel de Controle"
Write-Host "   - Vá em 'Programas e Recursos'"
Write-Host "   - Encontre 'Node.js' na lista"
Write-Host "   - Clique em 'Desinstalar'"
Write-Host "   - Siga as instruções do instalador"
Write-Host ""

Write-Host "2. Limpar arquivos residuais:" -ForegroundColor Yellow
Write-Host "   - Abra o Explorador de Arquivos"
Write-Host "   - Navegue para: C:\Program Files\nodejs"
Write-Host "   - Exclua a pasta 'nodejs' se ainda existir"
Write-Host "   - Navegue para: C:\Users\[seu-usuario]\AppData\Roaming\npm"
Write-Host "   - Exclua arquivos npm e npm-cache"
Write-Host ""

Write-Host "3. Reiniciar o computador:" -ForegroundColor Yellow
Write-Host "   - Após a desinstalação, reinicie o computador"
Write-Host "   - Isso garante que todas as variáveis de ambiente sejam limpas"
Write-Host ""

Write-Host "4. Instalar Node.js 18:" -ForegroundColor Yellow
Write-Host "   - Acesse: https://nodejs.org/pt/download/releases/"
Write-Host "   - Baixe o instalador LTS da versão 18.x.x"
Write-Host "   - Execute o instalador como administrador"
Write-Host "   - Siga as instruções padrão"
Write-Host ""

Write-Host "5. Verificar instalação:" -ForegroundColor Yellow
Write-Host "   - Abra um novo terminal PowerShell"
Write-Host "   - Execute: node --version"
Write-Host "   - Execute: npm --version"
Write-Host "   - Ambos devem mostrar versões 18.x.x"
Write-Host ""

Write-Host "6. Reinstalar dependências:" -ForegroundColor Yellow
Write-Host "   - No terminal, navegue até o projeto"
Write-Host "   - Execute: npm install"
Write-Host "   - Isso reinstalará todas as dependências com a nova versão"
Write-Host ""

Write-Host "✅ Após concluir estes passos, retorne aqui para continuarmos!" -ForegroundColor Green
Write-Host ""

Write-Host "Deseja que eu aguarde enquanto você faz a atualização? (s/n)" -ForegroundColor Cyan
$choice = Read-Host

if ($choice -eq 's' -or $choice -eq 'S') {
    Write-Host "⏳ Aguardando a atualização do Node.js..."
    Write-Host "   Quando terminar, execute este script novamente."
    Start-Sleep -Seconds 2
} else {
    Write-Host "🚀 Ótimo! Quando terminar a atualização, execute este script novamente."
}