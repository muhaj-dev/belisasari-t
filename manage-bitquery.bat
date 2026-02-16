@echo off
REM Wojat Bitquery Service Management Script for Windows
REM This script helps manage the scheduled Bitquery service

setlocal enabledelayedexpansion

if "%1"=="" goto :help
if "%1"=="help" goto :help
if "%1"=="--help" goto :help
if "%1"=="-h" goto :help

if "%1"=="start" goto :start
if "%1"=="stop" goto :stop
if "%1"=="restart" goto :restart
if "%1"=="status" goto :status
if "%1"=="logs" goto :logs
if "%1"=="run-now" goto :run-now
if "%1"=="schedule" goto :schedule
if "%1"=="build" goto :build

echo [ERROR] Unknown command: %1
echo.
goto :help

:start
echo [INFO] Starting Wojat Bitquery scheduled service...
docker-compose ps bitquery | findstr "Up" >nul
if !errorlevel! equ 0 (
    echo [WARNING] Bitquery service is already running
    goto :end
)
docker-compose up -d bitquery
    echo [SUCCESS] Bitquery scheduled service started
    echo [INFO] Service will run every 12 hours:
    echo [INFO]   - Bitquery: Every 12 hours at 2:00 AM and 2:00 PM UTC
    echo [INFO] Use 'manage-bitquery.bat logs' to view logs
goto :end

:stop
echo [INFO] Stopping Wojat Bitquery scheduled service...
docker-compose stop bitquery
echo [SUCCESS] Bitquery scheduled service stopped
goto :end

:restart
echo [INFO] Restarting Wojat Bitquery scheduled service...
docker-compose restart bitquery
echo [SUCCESS] Bitquery scheduled service restarted
goto :end

:status
echo [INFO] Wojat Bitquery Service Status:
echo.
docker-compose ps bitquery | findstr "Up" >nul
if !errorlevel! equ 0 (
    echo [SUCCESS] ✅ Service is running
    echo.
    echo [INFO] Container Information:
    docker-compose ps bitquery
    echo.
    echo [INFO] Cron Schedule:
    docker-compose exec bitquery crontab -l 2>nul || echo [WARNING] Could not retrieve cron schedule
) else (
    echo [ERROR] ❌ Service is not running
    echo [INFO] Use 'manage-bitquery.bat start' to start the service
)
goto :end

:logs
echo [INFO] Showing recent Bitquery logs...
echo.
docker-compose ps bitquery | findstr "Up" >nul
if !errorlevel! equ 0 (
    echo [INFO] Container Logs (last 50 lines):
    docker-compose logs --tail=50 bitquery
    echo.
    echo [INFO] Cron Job Logs:
    docker-compose exec bitquery tail -20 /var/log/bitquery-cron.log 2>nul || echo [WARNING] No cron logs available yet
) else (
    echo [ERROR] Service is not running. Use 'manage-bitquery.bat start' to start it.
)
goto :end

:run-now
echo [INFO] Running Bitquery immediately...
docker-compose ps bitquery | findstr "Up" >nul
if !errorlevel! equ 0 (
    echo [INFO] Executing manual run in scheduled container...
    docker-compose exec bitquery su -s /bin/bash bitquery -c "cd /app && node index.mjs"
    echo [SUCCESS] Manual run completed
) else (
    echo [INFO] Starting manual run container...
    docker-compose --profile manual run --rm bitquery-manual node index.mjs
    echo [SUCCESS] Manual run completed
)
goto :end

:schedule
echo [INFO] Bitquery Cron Schedule:
echo.
docker-compose ps bitquery | findstr "Up" >nul
if !errorlevel! equ 0 (
    docker-compose exec bitquery crontab -l
) else (
    echo [ERROR] Service is not running. Use 'manage-bitquery.bat start' to start it.
)
goto :end

:build
echo [INFO] Building Bitquery Docker image...
docker-compose build bitquery
echo [SUCCESS] Bitquery Docker image built successfully
goto :end

:help
echo Wojat Bitquery Service Management
echo.
echo Usage: %0 [COMMAND]
echo.
echo Commands:
echo   start       Start the scheduled Bitquery service
echo   stop        Stop the scheduled Bitquery service
echo   restart     Restart the scheduled Bitquery service
echo   status      Show service status
echo   logs        Show recent logs
echo   run-now     Run Bitquery immediately (manual)
echo   schedule    Show cron schedule
echo   build       Build the Bitquery Docker image
echo   help        Show this help message
echo.
echo Examples:
echo   %0 start          # Start scheduled service
echo   %0 run-now        # Run immediately
echo   %0 logs           # View logs
goto :end

:end
endlocal

