# Belisasari Platform - Ubuntu Server Deployment

## 🎯 Overview

The Belisasari Platform is now fully prepared for Ubuntu server deployment. This setup includes all services running from a single command with centralized environment variable management.

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
sudo useradd -r -s /bin/bash -d /opt/belisasari -m belisasari
sudo mkdir -p /opt/belisasari /var/log/belisasari
sudo chown -R belisasari:belisasari /opt/belisasari /var/log/belisasari

# 3. Deploy application
sudo cp -r . /opt/belisasari/
sudo chown -R belisasari:belisasari /opt/belisasari

# 4. Install dependencies
sudo -u belisasari bash -c "cd /opt/belisasari && yarn install"
sudo -u belisasari bash -c "cd /opt/belisasari/frontend && yarn install && yarn build"
sudo -u belisasari bash -c "cd /opt/belisasari/elizaos-agents && npm install"
sudo -u belisasari bash -c "cd /opt/belisasari/bitquery && npm install"
sudo -u belisasari bash -c "cd /opt/belisasari/js-scraper && npm install"

# 5. Configure environment
sudo cp /opt/belisasari/env.example /opt/belisasari/.env
sudo nano /opt/belisasari/.env  # Edit with your values

# 6. Install and start service
sudo cp /opt/belisasari/belisasari.service /etc/systemd/system/
sudo systemctl daemon-reload
sudo systemctl enable belisasari
sudo systemctl start belisasari

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

When you run `yarn belisasari`, the following services start automatically:

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
yarn belisasari

# Or use the batch/shell script
./start-belisasari.sh    # Linux
start-belisasari.bat      # Windows
```

### Production (Ubuntu Server)
```bash
# Service management
sudo systemctl start belisasari
sudo systemctl stop belisasari
sudo systemctl restart belisasari
sudo systemctl status belisasari

# View logs
sudo journalctl -u belisasari -f
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

Once deployed, access your Belisasari Platform at:

- **Main Application**: `http://YOUR_SERVER_IP:3000`
- **AI Chat**: `http://YOUR_SERVER_IP:3000/ai-chat`
- **Dashboard**: `http://YOUR_SERVER_IP:3000/dashboard`
- **Health Check**: `http://YOUR_SERVER_IP:3000/api/health`

## 🔍 Troubleshooting

### Service Won't Start
```bash
# Check service status
sudo systemctl status belisasari

# View logs
sudo journalctl -u belisasari -f

# Check environment
sudo cat /opt/belisasari/.env
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
sudo chown -R belisasari:belisasari /opt/belisasari
sudo chown -R belisasari:belisasari /var/log/belisasari
```

## 📁 File Structure

```
belisasari/
├── start-belisasari-server.js      # Main server startup script
├── start-belisasari.sh            # Linux startup script
├── start-belisasari.bat           # Windows startup script
├── deploy-ubuntu.sh          # Ubuntu deployment script
├── belisasari.service             # Systemd service file
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
sudo systemctl status belisasari
```

### Log Management
- **System logs**: `sudo journalctl -u belisasari -f`
- **Application logs**: `/var/log/belisasari/`
- **Log rotation**: Automatically configured

## 🔄 Updates

### Updating the Platform
```bash
# Stop service
sudo systemctl stop belisasari

# Backup
sudo cp -r /opt/belisasari /opt/belisasari.backup

# Update code
cd /opt/belisasari
sudo -u belisasari git pull

# Reinstall dependencies
sudo -u belisasari yarn install
sudo -u belisasari bash -c "cd frontend && yarn install && yarn build"

# Restart service
sudo systemctl start belisasari
```

## 🎉 Success!

Your Belisasari Platform is now ready for Ubuntu server deployment! 

- ✅ All services configured
- ✅ Environment variables centralized
- ✅ Production-ready setup
- ✅ Automated deployment scripts
- ✅ Service management included
- ✅ Health monitoring enabled

Run `yarn belisasari` to start all services, and access your platform at `http://YOUR_SERVER_IP:3000`!
