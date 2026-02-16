#!/bin/bash

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
MAGENTA='\033[0;35m'
CYAN='\033[0;36m'
WHITE='\033[1;37m'
NC='\033[0m' # No Color

echo -e "${CYAN}"
echo "╔══════════════════════════════════════════════════════════════╗"
echo "║                    🚀 IRIS PLATFORM STARTUP 🚀                ║"
echo "║              AI-Powered Memecoin Hunting Platform            ║"
echo "╚══════════════════════════════════════════════════════════════╝"
echo -e "${NC}"

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js is not installed. Please install Node.js 18+ first.${NC}"
    echo "   Download from: https://nodejs.org/"
    exit 1
fi

# Check if we're in the right directory
if [ ! -d "frontend" ] || [ ! -d "elizaos-agents" ]; then
    echo -e "${RED}❌ Error: Please run this script from the root directory of the Iris project${NC}"
    echo "   Make sure you can see the 'frontend' and 'elizaos-agents' folders"
    exit 1
fi

echo -e "${GREEN}✅ Node.js found:${NC}"
node --version

echo ""
echo -e "${BLUE}🔧 Starting Iris Platform...${NC}"
echo ""

# Make the script executable
chmod +x start-iris.js

# Run the main startup script
node start-iris.js

echo ""
echo -e "${YELLOW}🛑 Iris Platform stopped.${NC}"

