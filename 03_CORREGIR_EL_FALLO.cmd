@echo off
chcp 65001 >nul
cd /d "%~dp0"
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0CAMBIO_QUE_CORRIGE.ps1"
if errorlevel 1 goto fail
git add backend/src/validation.js
git commit -m "Corregir estado agotado y recuperar pruebas"
if errorlevel 1 goto fail
git push
if errorlevel 1 goto fail
echo.
echo LISTO: actualiza el MISMO Pull Request y revisa Checks / Actions.
pause
exit /b 0
:fail
echo Error: fotografa el mensaje.
pause
exit /b 1
