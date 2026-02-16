#!/bin/bash

# Wojat Platform - Ubuntu Server Deployment Script
# This script sets up the Wojat platform on an Ubuntu server

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
WOJAT_USER="wojat"
WOJAT_DIR="/opt/wojat"
SERVICE_NAME="wojat"
LOG_DIR="/var/log/wojat"

echo -e "${BLUE}🚀 Wojat Platform - Ubuntu Server Deployment${NC}"
echo -e "${BLUE}===========================================${NC}"

# Check if running as root
if [[ $EUID -ne 0 ]]; then
   echo -e "${RED}❌ This script must be run as root${NC}"
   exit 1
fi

# Update system packages
echo -e "${YELLOW}📦 Updating system packages...${NC}"
apt update && apt upgrade -y

# Install required packages
echo -e "${YELLOW}📦 Installing required packages...${NC}"
apt install -y curl wget git build-essential software-properties-common

# Install Node.js 22.x
echo -e "${YELLOW}📦 Installing Node.js 22.x...${NC}"
curl -fsSL https://deb.nodesource.com/setup_22.x | bash -
apt install -y nodejs

# Install Yarn
echo -e "${YELLOW}📦 Installing Yarn...${NC}"
npm install -g yarn

# Create wojat user
echo -e "${YELLOW}👤 Creating wojat user...${NC}"
if ! id "$WOJAT_USER" &>/dev/null; then
    useradd -r -s /bin/bash -d $WOJAT_DIR -m $WOJAT_USER
    echo -e "${GREEN}✅ User $WOJAT_USER created${NC}"
else
    echo -e "${YELLOW}⚠️ User $WOJAT_USER already exists${NC}"
fi

# Create directories
echo -e "${YELLOW}📁 Creating directories...${NC}"
mkdir -p $WOJAT_DIR
mkdir -p $LOG_DIR
chown -R $WOJAT_USER:$WOJAT_USER $WOJAT_DIR
chown -R $WOJAT_USER:$WOJAT_USER $LOG_DIR

# Copy application files
echo -e "${YELLOW}📋 Copying application files...${NC}"
if [ -d "./wojat" ]; then
    cp -r ./wojat/* $WOJAT_DIR/
else
    echo -e "${RED}❌ Wojat source code not found in current directory${NC}"
    echo -e "${YELLOW}Please ensure you're running this script from the wojat directory${NC}"
    exit 1
fi

# Set proper permissions
chown -R $WOJAT_USER:$WOJAT_USER $WOJAT_DIR
chmod +x $WOJAT_DIR/start-wojat-server.js

# Install dependencies
echo -e "${YELLOW}📦 Installing application dependencies...${NC}"
sudo -u $WOJAT_USER bash -c "cd $WOJAT_DIR && yarn install --legacy-peer-deps"

# Install frontend dependencies
echo -e "${YELLOW}📦 Installing frontend dependencies...${NC}"
sudo -u $WOJAT_USER bash -c "cd $WOJAT_DIR/frontend && yarn install --legacy-peer-deps && yarn build"

# Install service dependencies
echo -e "${YELLOW}📦 Installing service dependencies...${NC}"
sudo -u $WOJAT_USER bash -c "cd $WOJAT_DIR/elizaos-agents && npm install --legacy-peer-deps"
sudo -u $WOJAT_USER bash -c "cd $WOJAT_DIR/bitquery && npm install --legacy-peer-deps"
sudo -u $WOJAT_USER bash -c "cd $WOJAT_DIR/js-scraper && npm install --legacy-peer-deps"

# Create environment file
echo -e "${YELLOW}⚙️ Setting up environment configuration...${NC}"
if [ ! -f "$WOJAT_DIR/.env" ]; then
    cp $WOJAT_DIR/env.example $WOJAT_DIR/.env
    echo -e "${YELLOW}⚠️ Please edit $WOJAT_DIR/.env with your actual configuration values${NC}"
else
    echo -e "${GREEN}✅ Environment file already exists${NC}"
fi

# Install systemd service
echo -e "${YELLOW}🔧 Installing systemd service...${NC}"
cp $WOJAT_DIR/wojat.service /etc/systemd/system/
systemctl daemon-reload
systemctl enable $SERVICE_NAME

# Configure firewall (if ufw is available)
if command -v ufw &> /dev/null; then
    echo -e "${YELLOW}🔥 Configuring firewall...${NC}"
    ufw allow 3000/tcp
    ufw --force enable
fi

# Create log rotation
echo -e "${YELLOW}📝 Setting up log rotation...${NC}"
cat > /etc/logrotate.d/wojat << EOF
$LOG_DIR/*.log {
    daily
    missingok
    rotate 30
    compress
    delaycompress
    notifempty
    create 644 $WOJAT_USER $WOJAT_USER
    postrotate
        systemctl reload $SERVICE_NAME
    endscript
}
EOF

# Start the service
echo -e "${YELLOW}🚀 Starting Wojat service...${NC}"
systemctl start $SERVICE_NAME

# Check service status
sleep 5
if systemctl is-active --quiet $SERVICE_NAME; then
    echo -e "${GREEN}✅ Wojat service started successfully${NC}"
else
    echo -e "${RED}❌ Failed to start Wojat service${NC}"
    echo -e "${YELLOW}Check logs with: journalctl -u $SERVICE_NAME -f${NC}"
    exit 1
fi

# Display status
echo -e "${BLUE}📊 Deployment Summary${NC}"
echo -e "${BLUE}===================${NC}"
echo -e "${GREEN}✅ Wojat Platform deployed successfully${NC}"
echo -e "${GREEN}✅ Service installed and started${NC}"
echo -e "${GREEN}✅ Frontend accessible on port 3000${NC}"
echo ""
echo -e "${YELLOW}📋 Next Steps:${NC}"
echo -e "1. Edit environment file: ${BLUE}nano $WOJAT_DIR/.env${NC}"
echo -e "2. Restart service: ${BLUE}systemctl restart $SERVICE_NAME${NC}"
echo -e "3. Check logs: ${BLUE}journalctl -u $SERVICE_NAME -f${NC}"
echo -e "4. Access frontend: ${BLUE}http://YOUR_SERVER_IP:3000${NC}"
echo ""
echo -e "${YELLOW}🔧 Service Management:${NC}"
echo -e "Start:   ${BLUE}systemctl start $SERVICE_NAME${NC}"
echo -e "Stop:    ${BLUE}systemctl stop $SERVICE_NAME${NC}"
echo -e "Restart: ${BLUE}systemctl restart $SERVICE_NAME${NC}"
echo -e "Status:  ${BLUE}systemctl status $SERVICE_NAME${NC}"
echo -e "Logs:    ${BLUE}journalctl -u $SERVICE_NAME -f${NC}"
echo ""
echo -e "${GREEN}🎉 Wojat Platform is now running on your Ubuntu server!${NC}"
