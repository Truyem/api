@echo off
echo 🚀 Setting up Windows Task Scheduler for API Data Fetcher...
echo.

REM Check if running as Administrator
net session >nul 2>&1
if %errorlevel% == 0 (
    echo ✅ Running as Administrator - proceeding...
) else (
    echo ❌ This script requires Administrator privileges!
    echo 🔄 Please right-click and "Run as administrator"
    pause
    exit /b 1
)

REM Run PowerShell script
echo 📝 Running PowerShell setup script...
powershell -ExecutionPolicy Bypass -File "%~dp0setup-scheduler.ps1"

echo.
echo ✅ Setup completed!
echo.
echo 📋 Next steps:
echo 1. Check Task Scheduler to verify the task was created
echo 2. Monitor the JSON files for updates
echo 3. Check logs if there are any issues
echo.
pause

