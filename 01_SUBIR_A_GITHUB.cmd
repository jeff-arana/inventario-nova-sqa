@echo off
setlocal
chcp 65001 >nul
cd /d "%~dp0"
where git >nul 2>&1 || (echo No se encontro Git. Instalalo primero. & pause & exit /b 1)
echo PRIMERO CREA EN GITHUB UN REPOSITORIO PUBLICO VACIO llamado inventario-nova-sqa.
echo NO marques Add a README, .gitignore ni License.
echo.
set /p USER=Escribe tu usuario de GitHub (sin @): 
if "%USER%"=="" (echo Usuario vacio. & pause & exit /b 1)
set /p NOMBRE=Nombre que saldra en tus commits (puede ser tu usuario): 
if "%NOMBRE%"=="" set "NOMBRE=%USER%"
set /p EMAIL=Correo de GitHub para commits: 
if "%EMAIL%"=="" (echo Necesitas escribir tu correo. & pause & exit /b 1)
git rev-parse --is-inside-work-tree >nul 2>&1 || git init -b main
if errorlevel 1 goto fail
git config user.name "%NOMBRE%"
git config user.email "%EMAIL%"
git add .
git commit -m "Inventario Nova - base y CI SQA"
if errorlevel 1 (echo Si dice nothing to commit, continua; puede estar subido.)
git branch -M main
git remote remove origin >nul 2>&1
git remote add origin https://github.com/%USER%/inventario-nova-sqa.git
if errorlevel 1 goto fail
echo.
echo Se abrira el inicio de sesion de GitHub si hace falta.
git push -u origin main
if errorlevel 1 goto fail
echo.
echo LISTO. Abriendo tu repositorio GitHub...
start "" "https://github.com/%USER%/inventario-nova-sqa"
pause
exit /b 0
:fail
echo.
echo NO SE COMPLETO. Fotografia el error en esta ventana.
pause
exit /b 1
