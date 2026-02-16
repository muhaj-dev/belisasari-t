@echo off
REM Docker Cache Clear and Rebuild Script for Windows
REM This script clears Docker cache and rebuilds all services

echo 🧹 Clearing Docker cache and rebuilding all services...

REM Stop all running containers
echo 📦 Stopping all containers...
docker-compose down

REM Remove all containers
echo 🗑️ Removing all containers...
docker-compose rm -f

REM Remove all images
echo 🖼️ Removing all images...
docker-compose down --rmi all

REM Build with no cache
echo 🔨 Building all services with no cache...
docker-compose build --no-cache

REM Start all services
echo 🚀 Starting all services...
docker-compose up -d

REM Show status
echo 📊 Service status:
docker-compose ps

echo ✅ Docker rebuild complete!
echo 🌐 Access the platform at: http://localhost:3000
pause
