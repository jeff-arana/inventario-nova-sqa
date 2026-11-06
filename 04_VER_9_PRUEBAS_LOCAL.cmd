@echo off
chcp 65001 >nul
cd /d "%~dp0"
where node >nul 2>&1 || (echo No tienes Node.js. GitHub ejecuta las pruebas igualmente. & pause & exit /b 1)
node --test backend\tests\validation.node.test.mjs
pause
