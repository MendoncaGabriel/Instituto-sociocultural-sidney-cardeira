@echo off
start /min cmd /c "cd /d %~dp0 && start npm run dev"
timeout /t 5 /nobreak > nul
start http://localhost
