@echo off
echo ========================================
echo  GestorImob Pro - Servidor Local
echo ========================================
echo.
echo Iniciando servidor de desenvolvimento...
echo.
echo O app estara disponivel em:
echo   - Frontend: http://localhost:5173
echo   - Netlify Dev: http://localhost:8888 (com Functions)
echo.
echo Pressione Ctrl+C para parar o servidor
echo ========================================
echo.

REM Start Vite dev server
start /B npm run dev

REM Wait a bit for Vite to start
timeout /t 5 /nobreak > nul

REM Start Netlify dev (this will proxy to Vite)
netlify dev --offline
