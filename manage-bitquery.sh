#!/bin/bash

# Wojat Bitquery Service Management Script
# This script helps manage the scheduled Bitquery service

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
    echo "Wojat Bitquery Service Management"
    echo ""
    echo "Usage: $0 [COMMAND]"
    echo ""
    echo "Commands:"
    echo "  start       Start the scheduled Bitquery service"
    echo "  stop        Stop the scheduled Bitquery service"
    echo "  restart     Restart the scheduled Bitquery service"
    echo "  status      Show service status"
    echo "  logs        Show recent logs"
    echo "  run-now     Run Bitquery immediately (manual)"
    echo "  schedule    Show cron schedule"
    echo "  build       Build the Bitquery Docker image"
    echo "  help        Show this help message"
    echo ""
    echo "Examples:"
    echo "  $0 start          # Start scheduled service"
    echo "  $0 run-now        # Run immediately"
    echo "  $0 logs           # View logs"
}

# Function to start the service
start_service() {
    print_status "Starting Wojat Bitquery scheduled service..."
    
    if docker-compose ps bitquery | grep -q "Up"; then
        print_warning "Bitquery service is already running"
        return 0
    fi
    
    docker-compose up -d bitquery
    print_success "Bitquery scheduled service started"
    print_status "Service will run every 12 hours:"
    print_status "  - Bitquery: Every 12 hours at 2:00 AM and 2:00 PM UTC"
    print_status "Use '$0 logs' to view logs"
}

# Function to stop the service
stop_service() {
    print_status "Stopping Wojat Bitquery scheduled service..."
    docker-compose stop bitquery
    print_success "Bitquery scheduled service stopped"
}

# Function to restart the service
restart_service() {
    print_status "Restarting Wojat Bitquery scheduled service..."
    docker-compose restart bitquery
    print_success "Bitquery scheduled service restarted"
}

# Function to show service status
show_status() {
    print_status "Wojat Bitquery Service Status:"
    echo ""
    
    # Check if container is running
    if docker-compose ps bitquery | grep -q "Up"; then
        print_success "✅ Service is running"
        
        # Show container info
        echo ""
        print_status "Container Information:"
        docker-compose ps bitquery
        
        # Show cron schedule
        echo ""
        print_status "Cron Schedule:"
        docker-compose exec bitquery crontab -l 2>/dev/null || print_warning "Could not retrieve cron schedule"
        
    else
        print_error "❌ Service is not running"
        print_status "Use '$0 start' to start the service"
    fi
}

# Function to show logs
show_logs() {
    print_status "Showing recent Bitquery logs..."
    echo ""
    
    if docker-compose ps bitquery | grep -q "Up"; then
        # Show container logs
        print_status "Container Logs (last 50 lines):"
        docker-compose logs --tail=50 bitquery
        
        echo ""
        print_status "Cron Job Logs:"
        docker-compose exec bitquery tail -20 /var/log/bitquery-cron.log 2>/dev/null || print_warning "No cron logs available yet"
    else
        print_error "Service is not running. Use '$0 start' to start it."
    fi
}

# Function to run Bitquery immediately
run_now() {
    print_status "Running Bitquery immediately..."
    
    if docker-compose ps bitquery | grep -q "Up"; then
        print_status "Executing manual run in scheduled container..."
        docker-compose exec bitquery su -s /bin/bash bitquery -c 'cd /app && node index.mjs'
        print_success "Manual run completed"
    else
        print_status "Starting manual run container..."
        docker-compose --profile manual run --rm bitquery-manual node index.mjs
        print_success "Manual run completed"
    fi
}

# Function to show schedule
show_schedule() {
    print_status "Bitquery Cron Schedule:"
    echo ""
    
    if docker-compose ps bitquery | grep -q "Up"; then
        docker-compose exec bitquery crontab -l
    else
        print_error "Service is not running. Use '$0 start' to start it."
    fi
}

# Function to build the image
build_image() {
    print_status "Building Bitquery Docker image..."
    docker-compose build bitquery
    print_success "Bitquery Docker image built successfully"
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
    run-now)
        run_now
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

