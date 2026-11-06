@echo off
cd /d "%~dp0"
where code >nul 2>&1 && (code .) || (echo Abre VS Code y usa Archivo > Abrir carpeta con esta carpeta. & pause)
