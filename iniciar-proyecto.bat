@echo off
setlocal

set "ROOT=%~dp0"

echo Iniciando MySQL de XAMPP...
start "" "C:\xampp\mysql_start.bat"

timeout /t 5 /nobreak >nul

echo Iniciando backend de Patacon Pisao...
start "Patacon Backend" cmd /k "cd /d \"%ROOT%backend\" && node server.js"

echo.
echo Proyecto iniciado.
echo Si abres el frontend desde Visual Studio Code, deja esta ventana del backend abierta.
echo API esperada: http://localhost:3000/api
echo Menu directo: http://localhost:3000/menu.html

endlocal
