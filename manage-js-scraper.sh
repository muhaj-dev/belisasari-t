#!/bin/bash

# Wojat JS Scraper Service Management Script
# This script helps manage the scheduled JS Scraper service (TikTok, Telegram, Outlight)

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Function to show usage
show_usage() {
    echo "Wojat JS Scraper Service Management"
    echo ""
    echo "Usage: $0 [COMMAND]"
    echo ""
    echo "Commands:"
    echo "  start       Start the scheduled JS Scraper service"
    echo "  stop        Stop the scheduled JS Scraper service"
    echo "  restart     Restart the scheduled JS Scraper service"
    echo "  status      Show service status"
    echo "  logs        Show recent logs"
    echo "  run-tiktok  Run TikTok scraper immediately"
    echo "  run-telegram Run Telegram scraper immediately"
    echo "  run-outlight Run Outlight scraper immediately"
    echo "  run-all     Run all scrapers immediately"
    echo "  schedule    Show cron schedule"
    echo "  build       Build the JS Scraper Docker image"
    echo "  help        Show this help message"
    echo ""
    echo "Examples:"
    echo "  $0 start          # Start scheduled service"
    echo "  $0 run-tiktok     # Run TikTok scraper now"
    echo "  $0 logs           # View logs"
}

# Function to start the service
start_service() {
    print_status "Starting Wojat JS Scraper scheduled service..."
    
    if docker-compose ps js-scraper | grep -q "Up"; then
        print_warning "JS Scraper service is already running"
        return 0
    fi
    
    docker-compose up -d js-scraper
    print_success "JS Scraper scheduled service started"
    print_status "Service will run every 3 hours:"
    print_status "  - TikTok scraper: Every 3 hours at :00 minutes"
    print_status "  - Telegram scraper: Every 3 hours at :20 minutes"
    print_status "  - Outlight scraper: Every 3 hours at :40 minutes"
    print_status "Use '$0 logs' to view logs"
}

# Function to stop the service
stop_service() {
    print_status "Stopping Wojat JS Scraper scheduled service..."
    docker-compose stop js-scraper
    print_success "JS Scraper scheduled service stopped"
}

# Function to restart the service
restart_service() {
    print_status "Restarting Wojat JS Scraper scheduled service..."
    docker-compose restart js-scraper
    print_success "JS Scraper scheduled service restarted"
}

# Function to show service status
show_status() {
    print_status "Wojat JS Scraper Service Status:"
    echo ""
    
    # Check if container is running
    if docker-compose ps js-scraper | grep -q "Up"; then
        print_success "✅ Service is running"
        
        # Show container info
        echo ""
        print_status "Container Information:"
        docker-compose ps js-scraper
        
        # Show cron schedule
        echo ""
        print_status "Cron Schedule:"
        docker-compose exec js-scraper crontab -l 2>/dev/null || print_warning "Could not retrieve cron schedule"
        
    else
        print_error "❌ Service is not running"
        print_status "Use '$0 start' to start the service"
    fi
}

# Function to show logs
show_logs() {
    print_status "Showing recent JS Scraper logs..."
    echo ""
    
    if docker-compose ps js-scraper | grep -q "Up"; then
        # Show container logs
        print_status "Container Logs (last 50 lines):"
        docker-compose logs --tail=50 js-scraper
        
        echo ""
        print_status "Cron Job Logs:"
        docker-compose exec js-scraper tail -20 /var/log/scraper-cron.log 2>/dev/null || print_warning "No cron logs available yet"
    else
        print_error "Service is not running. Use '$0 start' to start it."
    fi
}

# Function to run TikTok scraper immediately
run_tiktok() {
    print_status "Running TikTok scraper immediately..."
    
    if docker-compose ps js-scraper | grep -q "Up"; then
        print_status "Executing TikTok scraper in scheduled container..."
        docker-compose exec js-scraper su -s /bin/bash scraper -c 'cd /app && yarn scrape-tiktok'
        print_success "TikTok scraper completed"
    else
        print_status "Starting manual TikTok scraper container..."
        docker-compose --profile manual run --rm js-scraper-manual yarn scrape-tiktok
        print_success "TikTok scraper completed"
    fi
}

# Function to run Telegram scraper immediately
run_telegram() {
    print_status "Running Telegram scraper immediately..."
    
    if docker-compose ps js-scraper | grep -q "Up"; then
        print_status "Executing Telegram scraper in scheduled container..."
        docker-compose exec js-scraper su -s /bin/bash scraper -c 'cd /app && yarn scrape-telegram'
        print_success "Telegram scraper completed"
    else
        print_status "Starting manual Telegram scraper container..."
        docker-compose --profile manual run --rm js-scraper-manual yarn scrape-telegram
        print_success "Telegram scraper completed"
    fi
}

# Function to run Outlight scraper immediately
run_outlight() {
    print_status "Running Outlight scraper immediately..."
    
    if docker-compose ps js-scraper | grep -q "Up"; then
        print_status "Executing Outlight scraper in scheduled container..."
        docker-compose exec js-scraper su -s /bin/bash scraper -c 'cd /app && yarn scrape-outlight'
        print_success "Outlight scraper completed"
    else
        print_status "Starting manual Outlight scraper container..."
        docker-compose --profile manual run --rm js-scraper-manual yarn scrape-outlight
        print_success "Outlight scraper completed"
    fi
}

# Function to run all scrapers immediately
run_all() {
    print_status "Running all scrapers immediately..."
    
    run_tiktok
    echo ""
    run_telegram
    echo ""
    run_outlight
    
    print_success "All scrapers completed"
}

# Function to show schedule
show_schedule() {
    print_status "JS Scraper Cron Schedule:"
    echo ""
    
    if docker-compose ps js-scraper | grep -q "Up"; then
        docker-compose exec js-scraper crontab -l
    else
        print_error "Service is not running. Use '$0 start' to start it."
    fi
}

# Function to build the image
build_image() {
    print_status "Building JS Scraper Docker image..."
    docker-compose build js-scraper
    print_success "JS Scraper Docker image built successfully"
}

# Main script logic
case "${1:-help}" in
    start)
        start_service
        ;;
    stop)
        stop_service
        ;;
    restart)
        restart_service
        ;;
    status)
        show_status
        ;;
    logs)
        show_logs
        ;;
    run-tiktok)
        run_tiktok
        ;;
    run-telegram)
        run_telegram
        ;;
    run-outlight)
        run_outlight
        ;;
    run-all)
        run_all
        ;;
    schedule)
        show_schedule
        ;;
    build)
        build_image
        ;;
    help|--help|-h)
        show_usage
        ;;
    *)
        print_error "Unknown command: $1"
        echo ""
        show_usage
        exit 1
        ;;
esac
