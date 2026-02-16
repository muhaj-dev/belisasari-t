#!/bin/bash

# Docker Cache Clear and Rebuild Script
# This script clears Docker cache and rebuilds all services

echo "🧹 Clearing Docker cache and rebuilding all services..."

# Stop all running containers
echo "📦 Stopping all containers..."
docker-compose down

# Remove all containers
echo "🗑️ Removing all containers..."
docker-compose rm -f

# Remove all images
echo "🖼️ Removing all images..."
docker-compose down --rmi all

# Remove all volumes (optional - uncomment if needed)
# echo "💾 Removing all volumes..."
# docker-compose down -v

# Build with no cache
echo "🔨 Building all services with no cache..."
docker-compose build --no-cache

# Start all services
echo "🚀 Starting all services..."
docker-compose up -d

# Show status
echo "📊 Service status:"
docker-compose ps

echo "✅ Docker rebuild complete!"
echo "🌐 Access the platform at: http://localhost:3000"
