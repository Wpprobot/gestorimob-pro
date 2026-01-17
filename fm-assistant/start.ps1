#!/usr/bin/env pwsh
# FM Assistant - Script de Inicialização
# Este script inicia o servidor Backend (Voice), Frontend (Static) e abre o navegador

Write-Host "🚀 Iniciando FM Tactical Assistant..." -ForegroundColor Green
Write-Host ""

# 1. Iniciar Backend (Porta 3001)
$backendPort = 3001
$backendInUse = Get-NetTCPConnection -LocalPort $backendPort -ErrorAction SilentlyContinue

if ($backendInUse) {
    Write-Host "⚠️  Backend já está rodando na porta $backendPort" -ForegroundColor Yellow
} else {
    Write-Host "🎙️ Iniciando servidor Backend na porta $backendPort..." -ForegroundColor Cyan
    # Iniciar o backend em background
    Start-Process pwsh -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot'; node server.js" -WindowStyle Minimized
    Start-Sleep -Seconds 2
}

# 2. Iniciar Frontend (Porta 3000)
$frontendPort = 3000
$frontendInUse = Get-NetTCPConnection -LocalPort $frontendPort -ErrorAction SilentlyContinue

if ($frontendInUse) {
    Write-Host "⚠️  Frontend já está rodando na porta $frontendPort" -ForegroundColor Yellow
} else {
    Write-Host "📦 Iniciando servidor Frontend (Vite) na porta $frontendPort..." -ForegroundColor Cyan
    # Iniciar o frontend em background
    Start-Process pwsh -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot'; npm run dev" -WindowStyle Minimized
    
    Write-Host "⏳ Aguardando servidores inicializarem..." -ForegroundColor Yellow
    Start-Sleep -Seconds 5
}

# 3. Abrir Navegador
Write-Host "🌐 Abrindo Firefox em http://localhost:$frontendPort..." -ForegroundColor Green
Start-Process firefox "http://localhost:$frontendPort"

Write-Host ""
Write-Host "✅ FM Assistant iniciado com sucesso!" -ForegroundColor Green
Write-Host ""
Write-Host "ℹ️  Para parar os servidores, feche as janelas do terminal que foram abertas." -ForegroundColor Cyan
Write-Host ""
