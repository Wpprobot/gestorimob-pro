@echo off
REM Script de Deploy para Vercel - Wpprobot Landing
REM Execute este arquivo para fazer deploy automaticamente

echo.
echo ========================================
echo   DEPLOY WPPROBOT LANDING - VERCEL
echo ========================================
echo.

cd /d "e:\ANTHIGRAVITY\wpprobot-landing"

echo [+] Verificando alteracoes...
git status --short
echo.

echo [i] Mudancas prontas:
echo     - Preco: R$ 79,90
echo     - Layout mobile otimizado
echo.

echo [+] Fazendo login na Vercel...
call vercel login

echo.
echo [+] Iniciando deploy em producao...
call vercel --prod

echo.
echo ========================================
echo   DEPLOY CONCLUIDO!
echo ========================================
echo.
echo Acesse: https://wpprobot-landing.vercel.app/
echo.
echo Teste no mobile para ver as mudancas!
echo.

pause
