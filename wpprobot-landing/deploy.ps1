#!/usr/bin/env pwsh
# Script de Deploy Automático para Vercel
# Wpprobot Landing Page

Write-Host "🚀 Iniciando Deploy do Wpprobot Landing..." -ForegroundColor Cyan
Write-Host ""

# Navegar para o diretório
Set-Location "e:\ANTHIGRAVITY\wpprobot-landing"

# Verificar se há mudanças
Write-Host "📝 Verificando alterações..." -ForegroundColor Yellow
git status --short

Write-Host ""
Write-Host "✅ Mudanças locais detectadas:" -ForegroundColor Green
Write-Host "   - Preço atualizado para R$ 79,90" -ForegroundColor White
Write-Host "   - Layout mobile: mockup após texto" -ForegroundColor White
Write-Host ""

# Perguntar se quer continuar
$continue = Read-Host "Deseja fazer o deploy? (S/N)"
if ($continue -ne "S" -and $continue -ne "s") {
    Write-Host "❌ Deploy cancelado." -ForegroundColor Red
    exit
}

Write-Host ""
Write-Host "🔐 Fazendo login na Vercel..." -ForegroundColor Cyan
vercel login

Write-Host ""
Write-Host "📤 Iniciando deploy em produção..." -ForegroundColor Cyan
vercel --prod

Write-Host ""
Write-Host "✅ Deploy concluído!" -ForegroundColor Green
Write-Host ""
Write-Host "🌐 Acesse: https://wpprobot-landing.vercel.app/" -ForegroundColor Cyan
Write-Host ""
Write-Host "📱 Teste no mobile para ver:" -ForegroundColor Yellow
Write-Host "   1. Mockup aparecendo DEPOIS do texto" -ForegroundColor White
Write-Host "   2. Preço R$ 79,90 na conversa" -ForegroundColor White
Write-Host ""
