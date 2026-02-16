# Wojat Platform - Ubuntu Server Deployment

## 🎯 Overview

The Wojat Platform is now fully prepared for Ubuntu server deployment. This setup includes all services running from a single command with centralized environment variable management.

## 🚀 Quick Start

### Option 1: Automated Deployment (Recommended)
```bash
# Run the automated deployment script
sudo ./deploy-ubuntu.sh
```

### Option 2: Manual Deployment
```bash
# 1. Install dependencies
sudo apt update && sudo apt upgrade -y
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
sudo apt install -y nodejs yarn

# 2. Setup user and directories
sudo useradd -r -s /bin/bash -d /opt/wojat -m wojat
sudo mkdir -p /opt/wojat /var/log/wojat
sudo chown -R wojat:wojat /opt/wojat /var/log/wojat

# 3. Deploy application
sudo cp -r . /opt/wojat/
sudo chown -R wojat:wojat /opt/wojat

# 4. Install dependencies
sudo -u wojat bash -c "cd /opt/wojat && yarn install"
sudo -u wojat bash -c "cd /opt/wojat/frontend && yarn install && yarn build"
sudo -u wojat bash -c "cd /opt/wojat/elizaos-agents && npm install"
sudo -u wojat bash -c "cd /opt/wojat/bitquery && npm install"
sudo -u wojat bash -c "cd /opt/wojat/js-scraper && npm install"

# 5. Configure environment
sudo cp /opt/wojat/env.example /opt/wojat/.env
sudo nano /opt/wojat/.env  # Edit with your values

# 6. Install and start service
sudo cp /opt/wojat/wojat.service /etc/systemd/system/
sudo systemctl daemon-reload
sudo systemctl enable wojat
sudo systemctl start wojat

# 7. Configure firewall
sudo ufw allow 3000/tcp
sudo ufw --force enable
```

## 🔧 Configuration

### Environment Variables
All services use environment variables from the root `.env` file:

```bash
# Required
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
OPENAI_API_KEY=your_openai_api_key

# Optional
SOLANA_PRIVATE_KEY=your_solana_private_key
SOLANA_PUBLIC_KEY=your_solana_public_key
BITQUERY_API_KEY=your_bitquery_api_key
CONSUMER_KEY=your_twitter_consumer_key
CONSUMER_SECRET=your_twitter_consumer_secret
ZORO_ACCESS_TOKEN=your_twitter_access_token
ZORO_ACCESS_TOKEN_SECRET=your_twitter_access_token_secret
```

## 🌐 Services Included

When you run `yarn wojat`, the following services start automatically:

1. **Frontend (Next.js)** - Port 3000
   - Main web application
   - AI chat interface
   - Dashboard and analytics

2. **ElizaOS Agents** - Background service
   - Twitter automation (Phase 2)
   - AI trading system (Phase 4)
   - Content generation and analysis

3. **Bitquery Service** - Background service
   - Solana blockchain data fetching
   - Token price monitoring
   - Market data analysis

4. **JS Scraper Services** - Background services
   - TikTok scraper
   - Telegram scraper
   - Outlight scraper

## 📋 Commands

### Development (Windows/Linux)
```bash
# Start all services
yarn wojat

# Or use the batch/shell script
./start-wojat.sh    # Linux
start-wojat.bat      # Windows
```

### Production (Ubuntu Server)
```bash
# Service management
sudo systemctl start wojat
sudo systemctl stop wojat
sudo systemctl restart wojat
sudo systemctl status wojat

# View logs
sudo journalctl -u wojat -f
```

### Docker (Alternative)
```bash
# Build and start with Docker
yarn docker:build
yarn docker:up

# View logs
yarn docker:logs

# Stop services
yarn docker:down
```

## 🌐 Access Points

Once deployed, access your Wojat Platform at:

- **Main Application**: `http://YOUR_SERVER_IP:3000`
- **AI Chat**: `http://YOUR_SERVER_IP:3000/ai-chat`
- **Dashboard**: `http://YOUR_SERVER_IP:3000/dashboard`
- **Health Check**: `http://YOUR_SERVER_IP:3000/api/health`

## 🔍 Troubleshooting

### Service Won't Start
```bash
# Check service status
sudo systemctl status wojat

# View logs
sudo journalctl -u wojat -f

# Check environment
sudo cat /opt/wojat/.env
```

### Port Issues
```bash
# Check port usage
sudo lsof -i :3000

# Kill process if needed
sudo kill -9 <PID>
```

### Permission Issues
```bash
# Fix ownership
sudo chown -R wojat:wojat /opt/wojat
sudo chown -R wojat:wojat /var/log/wojat
```

## 📁 File Structure

```
wojat/
├── start-wojat-server.js      # Main server startup script
├── start-wojat.sh            # Linux startup script
├── start-wojat.bat           # Windows startup script
├── deploy-ubuntu.sh          # Ubuntu deployment script
├── wojat.service             # Systemd service file
├── docker-compose.yml        # Docker deployment
├── env.example               # Environment template
├── .env                      # Your environment variables
├── frontend/                 # Next.js frontend
├── elizaos-agents/          # AI agents and automation
├── bitquery/                # Blockchain data service
├── js-scraper/              # Scraping services
└── UBUNTU_DEPLOYMENT_GUIDE.md # Detailed guide
```

## 🔒 Security Features

- ✅ Non-root user execution
- ✅ Firewall configuration
- ✅ Environment variable protection
- ✅ Log rotation
- ✅ Process monitoring
- ✅ Graceful shutdown handling

## 📊 Monitoring

### Health Checks
```bash
# Check platform health
curl http://localhost:3000/api/health

# Check service status
sudo systemctl status wojat
```

### Log Management
- **System logs**: `sudo journalctl -u wojat -f`
- **Application logs**: `/var/log/wojat/`
- **Log rotation**: Automatically configured

## 🔄 Updates

### Updating the Platform
```bash
# Stop service
sudo systemctl stop wojat

# Backup
sudo cp -r /opt/wojat /opt/wojat.backup

# Update code
cd /opt/wojat
sudo -u wojat git pull

# Reinstall dependencies
sudo -u wojat yarn install
sudo -u wojat bash -c "cd frontend && yarn install && yarn build"

# Restart service
sudo systemctl start wojat
```

## 🎉 Success!

Your Wojat Platform is now ready for Ubuntu server deployment! 

- ✅ All services configured
- ✅ Environment variables centralized
- ✅ Production-ready setup
- ✅ Automated deployment scripts
- ✅ Service management included
- ✅ Health monitoring enabled

Run `yarn wojat` to start all services, and access your platform at `http://YOUR_SERVER_IP:3000`!
