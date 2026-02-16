@echo off
echo.
echo ╔══════════════════════════════════════════════════════════════╗
echo ║                    🚀 IRIS PLATFORM STARTUP 🚀                ║
echo ║              AI-Powered Memecoin Hunting Platform            ║
echo ╚══════════════════════════════════════════════════════════════╝
echo.

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed. Please install Node.js 18+ first.
    echo    Download from: https://nodejs.org/
    pause
    exit /b 1
)

REM Check if we're in the right directory
if not exist "frontend" (
    echo ❌ Error: Please run this script from the root directory of the Iris project
    echo    Make sure you can see the 'frontend' and 'elizaos-agents' folders
    pause
    exit /b 1
)

if not exist "elizaos-agents" (
    echo ❌ Error: Please run this script from the root directory of the Iris project
    echo    Make sure you can see the 'frontend' and 'elizaos-agents' folders
    pause
    exit /b 1
)

echo ✅ Node.js found: 
node --version

echo.
echo 🔧 Starting Iris Platform...
echo.

REM Run the main startup script
node start-iris.js

echo.
echo 🛑 Iris Platform stopped.
pause

