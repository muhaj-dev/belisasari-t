@echo off
REM Wojat JS Scraper Service Management Script for Windows
REM This script helps manage the scheduled JS Scraper service (TikTok, Telegram, Outlight)

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
if "%1"=="run-tiktok" goto :run-tiktok
if "%1"=="run-telegram" goto :run-telegram
if "%1"=="run-outlight" goto :run-outlight
if "%1"=="run-all" goto :run-all
if "%1"=="schedule" goto :schedule
if "%1"=="build" goto :build

echo [ERROR] Unknown command: %1
echo.
goto :help

:start
echo [INFO] Starting Wojat JS Scraper scheduled service...
docker-compose ps js-scraper | findstr "Up" >nul
if !errorlevel! equ 0 (
    echo [WARNING] JS Scraper service is already running
    goto :end
)
docker-compose up -d js-scraper
echo [SUCCESS] JS Scraper scheduled service started
echo [INFO] Service will run every 3 hours:
echo [INFO]   - TikTok scraper: Every 3 hours at :00 minutes
echo [INFO]   - Telegram scraper: Every 3 hours at :20 minutes
echo [INFO]   - Outlight scraper: Every 3 hours at :40 minutes
echo [INFO] Use 'manage-js-scraper.bat logs' to view logs
goto :end

:stop
echo [INFO] Stopping Wojat JS Scraper scheduled service...
docker-compose stop js-scraper
echo [SUCCESS] JS Scraper scheduled service stopped
goto :end

:restart
echo [INFO] Restarting Wojat JS Scraper scheduled service...
docker-compose restart js-scraper
echo [SUCCESS] JS Scraper scheduled service restarted
goto :end

:status
echo [INFO] Wojat JS Scraper Service Status:
echo.
docker-compose ps js-scraper | findstr "Up" >nul
if !errorlevel! equ 0 (
    echo [SUCCESS] ✅ Service is running
    echo.
    echo [INFO] Container Information:
    docker-compose ps js-scraper
    echo.
    echo [INFO] Cron Schedule:
    docker-compose exec js-scraper crontab -l 2>nul || echo [WARNING] Could not retrieve cron schedule
) else (
    echo [ERROR] ❌ Service is not running
    echo [INFO] Use 'manage-js-scraper.bat start' to start the service
)
goto :end

:logs
echo [INFO] Showing recent JS Scraper logs...
echo.
docker-compose ps js-scraper | findstr "Up" >nul
if !errorlevel! equ 0 (
    echo [INFO] Container Logs (last 50 lines):
    docker-compose logs --tail=50 js-scraper
    echo.
    echo [INFO] Cron Job Logs:
    docker-compose exec js-scraper tail -20 /var/log/scraper-cron.log 2>nul || echo [WARNING] No cron logs available yet
) else (
    echo [ERROR] Service is not running. Use 'manage-js-scraper.bat start' to start it.
)
goto :end

:run-tiktok
echo [INFO] Running TikTok scraper immediately...
docker-compose ps js-scraper | findstr "Up" >nul
if !errorlevel! equ 0 (
    echo [INFO] Executing TikTok scraper in scheduled container...
    docker-compose exec js-scraper su -s /bin/bash scraper -c "cd /app && yarn scrape-tiktok"
    echo [SUCCESS] TikTok scraper completed
) else (
    echo [INFO] Starting manual TikTok scraper container...
    docker-compose --profile manual run --rm js-scraper-manual yarn scrape-tiktok
    echo [SUCCESS] TikTok scraper completed
)
goto :end

:run-telegram
echo [INFO] Running Telegram scraper immediately...
docker-compose ps js-scraper | findstr "Up" >nul
if !errorlevel! equ 0 (
    echo [INFO] Executing Telegram scraper in scheduled container...
    docker-compose exec js-scraper su -s /bin/bash scraper -c "cd /app && yarn scrape-telegram"
    echo [SUCCESS] Telegram scraper completed
) else (
    echo [INFO] Starting manual Telegram scraper container...
    docker-compose --profile manual run --rm js-scraper-manual yarn scrape-telegram
    echo [SUCCESS] Telegram scraper completed
)
goto :end

:run-outlight
echo [INFO] Running Outlight scraper immediately...
docker-compose ps js-scraper | findstr "Up" >nul
if !errorlevel! equ 0 (
    echo [INFO] Executing Outlight scraper in scheduled container...
    docker-compose exec js-scraper su -s /bin/bash scraper -c "cd /app && yarn scrape-outlight"
    echo [SUCCESS] Outlight scraper completed
) else (
    echo [INFO] Starting manual Outlight scraper container...
    docker-compose --profile manual run --rm js-scraper-manual yarn scrape-outlight
    echo [SUCCESS] Outlight scraper completed
)
goto :end

:run-all
echo [INFO] Running all scrapers immediately...
call :run-tiktok
echo.
call :run-telegram
echo.
call :run-outlight
echo [SUCCESS] All scrapers completed
goto :end

:schedule
echo [INFO] JS Scraper Cron Schedule:
echo.
docker-compose ps js-scraper | findstr "Up" >nul
if !errorlevel! equ 0 (
    docker-compose exec js-scraper crontab -l
) else (
    echo [ERROR] Service is not running. Use 'manage-js-scraper.bat start' to start it.
)
goto :end

:build
echo [INFO] Building JS Scraper Docker image...
docker-compose build js-scraper
echo [SUCCESS] JS Scraper Docker image built successfully
goto :end

:help
echo Wojat JS Scraper Service Management
echo.
echo Usage: %0 [COMMAND]
echo.
echo Commands:
echo   start         Start the scheduled JS Scraper service
echo   stop          Stop the scheduled JS Scraper service
echo   restart       Restart the scheduled JS Scraper service
echo   status        Show service status
echo   logs          Show recent logs
echo   run-tiktok    Run TikTok scraper immediately
echo   run-telegram  Run Telegram scraper immediately
echo   run-outlight  Run Outlight scraper immediately
echo   run-all       Run all scrapers immediately
echo   schedule      Show cron schedule
echo   build         Build the JS Scraper Docker image
echo   help          Show this help message
echo.
echo Examples:
echo   %0 start          # Start scheduled service
echo   %0 run-tiktok     # Run TikTok scraper now
echo   %0 logs           # View logs
goto :end

:end
endlocal
