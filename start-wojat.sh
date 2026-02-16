#!/bin/bash

# Wojat Platform - Simple Ubuntu Startup Script
# This script starts all Wojat services for Ubuntu server deployment

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🚀 Starting Wojat Platform...${NC}"

# Check if .env file exists
if [ ! -f ".env" ]; then
    echo -e "${RED}❌ .env file not found!${NC}"
    echo -e "${YELLOW}Please copy env.example to .env and configure your settings${NC}"
    exit 1
fi

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js is not installed!${NC}"
    echo -e "${YELLOW}Please install Node.js 18.x first${NC}"
    exit 1
fi

# Check if Yarn is installed
if ! command -v yarn &> /dev/null; then
    echo -e "${RED}❌ Yarn is not installed!${NC}"
    echo -e "${YELLOW}Please install Yarn first${NC}"
    exit 1
fi

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    echo -e "${YELLOW}📦 Installing root dependencies...${NC}"
    yarn install
fi

# Install frontend dependencies
if [ ! -d "frontend/node_modules" ]; then
    echo -e "${YELLOW}📦 Installing frontend dependencies...${NC}"
    cd frontend && yarn install && cd ..
fi

# Build frontend for production
echo -e "${YELLOW}🔨 Building frontend for production...${NC}"
cd frontend && yarn build && cd ..

# Install service dependencies
echo -e "${YELLOW}📦 Installing service dependencies...${NC}"

if [ ! -d "elizaos-agents/node_modules" ]; then
    cd elizaos-agents && npm install && cd ..
fi

if [ ! -d "bitquery/node_modules" ]; then
    cd bitquery && npm install && cd ..
fi

if [ ! -d "js-scraper/node_modules" ]; then
    cd js-scraper && npm install && cd ..
fi

# Start the platform
echo -e "${GREEN}✅ All dependencies installed${NC}"
echo -e "${BLUE}🚀 Starting Wojat Platform...${NC}"

# Use the server startup script
node start-wojat-server.js
