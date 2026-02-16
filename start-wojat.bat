@echo off
REM Wojat Platform - Windows Startup Script
REM This script starts all Wojat services for Windows development/testing

echo 🚀 Starting Wojat Platform...

REM Check if .env file exists
if not exist ".env" (
    echo ❌ .env file not found!
    echo Please copy env.example to .env and configure your settings
    pause
    exit /b 1
)

REM Check if Node.js is installed
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Node.js is not installed!
    echo Please install Node.js 18.x first
    pause
    exit /b 1
)

REM Check if Yarn is installed
yarn --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Yarn is not installed!
    echo Please install Yarn first
    pause
    exit /b 1
)

REM Install dependencies if node_modules doesn't exist
if not exist "node_modules" (
    echo 📦 Installing root dependencies...
    yarn install
)

REM Install frontend dependencies
if not exist "frontend\node_modules" (
    echo 📦 Installing frontend dependencies...
    cd frontend
    yarn install
    cd ..
)

REM Build frontend for production
echo 🔨 Building frontend for production...
cd frontend
yarn build
cd ..

REM Install service dependencies
echo 📦 Installing service dependencies...

if not exist "elizaos-agents\node_modules" (
    cd elizaos-agents
    npm install
    cd ..
)

if not exist "bitquery\node_modules" (
    cd bitquery
    npm install
    cd ..
)

if not exist "js-scraper\node_modules" (
    cd js-scraper
    npm install
    cd ..
)

REM Start the platform
echo ✅ All dependencies installed
echo 🚀 Starting Wojat Platform...

REM Use the server startup script
node start-wojat-server.js

pause
