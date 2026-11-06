@echo off
setlocal
chcp 65001 >nul
cd /d "%~dp0"
where git >nul 2>&1 || (echo Falta Git & pause & exit /b 1)
git remote get-url origin >nul 2>&1 || (echo Primero ejecuta 01_SUBIR_A_GITHUB.cmd & pause & exit /b 1)
git switch -c demo/pruebas-sqa
if errorlevel 1 goto fail
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0CAMBIO_QUE_FALLA.ps1"
if errorlevel 1 goto fail
git add backend/src/validation.js
git commit -m "Prueba del control: reproducir fallo en estado de stock"
if errorlevel 1 goto fail
git push -u origin demo/pruebas-sqa
if errorlevel 1 goto fail
for /f "tokens=*" %%I in ('git remote get-url origin') do set "URL=%%I"
set "PRURL=%URL:.git=%"
start "" "%PRURL%/compare/main...demo/pruebas-sqa?expand=1"
echo.
echo LISTO. Entra a tu repositorio, pulsa Compare ^& pull request, y luego Create pull request.
echo Cuando veas un CHECK ROJO, toma la captura y SIGUE CON 03_CORREGIR_EL_FALLO.cmd
pause
exit /b 0
:fail
echo Error: fotografa el mensaje.
pause
exit /b 1
