@echo off
chcp 65001 >nul
cd /d "%~dp0"
echo INVENTARIO NOVA - PROGRAMAS NECESARIOS
echo.
where git >nul 2>&1 && (echo [OK] Git instalado) || (echo [FALTA] Instala Git desde https://git-scm.com/downloads/win)
where powershell >nul 2>&1 && (echo [OK] PowerShell) || (echo [FALTA] PowerShell)
where code >nul 2>&1 && (echo [OK] VS Code) || (echo [OPCIONAL] VS Code no detectado)
where node >nul 2>&1 && (echo [OK] Node.js) || (echo [OPCIONAL] Node.js no detectado, GitHub lo usa en la nube)
echo.
pause
