@echo off
echo 🚀 Starting API Data Fetcher...
echo 📍 Base URL: http://103.161.119.206:25087
echo.

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed! Please install Node.js first.
    pause
    exit /b 1
)

REM Check if dependencies are installed
if not exist "node_modules" (
    echo 📦 Installing dependencies...
    npm install
    if %errorlevel% neq 0 (
        echo ❌ Failed to install dependencies!
        pause
        exit /b 1
    )
)

echo 🔄 Running data fetcher...
node fetchData.js

echo.
echo ✅ Data fetching completed!
echo 📁 Check the JSON files: health.json, leaderboards.json, players.json, skills.json
echo.
pause

