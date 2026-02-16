# Belisasari Platform - Ubuntu Server Deployment Guide

## 🚀 Quick Start

### Prerequisites
- Ubuntu 20.04+ server
- Root access or sudo privileges
- Public IP address
- Domain name (optional but recommended)

### 1. Automated Deployment (Recommended)

```bash
# Clone the repository
git clone <your-repo-url> belisasari
cd belisasari

# Make deployment script executable and run
chmod +x deploy-ubuntu.sh
sudo ./deploy-ubuntu.sh
```

### 2. Manual Deployment

#### Step 1: Install Dependencies
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js 22.x
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
sudo apt install -y nodejs

# Install Yarn
sudo npm install -g yarn

# Install additional packages
sudo apt install -y curl wget git build-essential
```

#### Step 2: Setup User and Directories
```bash
# Create belisasari user
sudo useradd -r -s /bin/bash -d /opt/belisasari -m belisasari

# Create directories
sudo mkdir -p /opt/belisasari
sudo mkdir -p /var/log/belisasari
sudo chown -R belisasari:belisasari /opt/belisasari
sudo chown -R belisasari:belisasari /var/log/belisasari
```

#### Step 3: Deploy Application
```bash
# Copy application files
sudo cp -r . /opt/belisasari/
sudo chown -R belisasari:belisasari /opt/belisasari

# Install dependencies
sudo -u belisasari bash -c "cd /opt/belisasari && yarn install"
sudo -u belisasari bash -c "cd /opt/belisasari/frontend && yarn install && yarn build"
sudo -u belisasari bash -c "cd /opt/belisasari/elizaos-agents && npm install"
sudo -u belisasari bash -c "cd /opt/belisasari/bitquery && npm install"
sudo -u belisasari bash -c "cd /opt/belisasari/js-scraper && npm install"
```

#### Step 4: Configure Environment
```bash
# Copy environment template
sudo cp /opt/belisasari/env.example /opt/belisasari/.env
sudo chown belisasari:belisasari /opt/belisasari/.env

# Edit environment file
sudo nano /opt/belisasari/.env
```

#### Step 5: Install Systemd Service
```bash
# Copy service file
sudo cp /opt/belisasari/belisasari.service /etc/systemd/system/

# Reload systemd and enable service
sudo systemctl daemon-reload
sudo systemctl enable belisasari
sudo systemctl start belisasari
```

#### Step 6: Configure Firewall
```bash
# Allow port 3000
sudo ufw allow 3000/tcp
sudo ufw --force enable
```

## 🔧 Configuration

### Environment Variables

Edit `/opt/belisasari/.env` with your actual values:

```bash
# Required Variables
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
OPENAI_API_KEY=your_openai_api_key

# Optional Variables
SOLANA_PRIVATE_KEY=your_solana_private_key
SOLANA_PUBLIC_KEY=your_solana_public_key
BITQUERY_API_KEY=your_bitquery_api_key
CONSUMER_KEY=your_twitter_consumer_key
CONSUMER_SECRET=your_twitter_consumer_secret
ZORO_ACCESS_TOKEN=your_twitter_access_token
ZORO_ACCESS_TOKEN_SECRET=your_twitter_access_token_secret
```

### Service Management

```bash
# Start service
sudo systemctl start belisasari

# Stop service
sudo systemctl stop belisasari

# Restart service
sudo systemctl restart belisasari

# Check status
sudo systemctl status belisasari

# View logs
sudo journalctl -u belisasari -f
```

## 🌐 Accessing the Application

### Frontend Access
- **URL**: `http://YOUR_SERVER_IP:3000`
- **AI Chat**: `http://YOUR_SERVER_IP:3000/ai-chat`
- **Dashboard**: `http://YOUR_SERVER_IP:3000/dashboard`

### Service Status
All services run automatically when you start the platform:
- ✅ Frontend (Next.js) - Port 3000
- ✅ ElizaOS Agents (Phase 2 & 4)
- ✅ Bitquery Service
- ✅ TikTok Scraper
- ✅ Telegram Scraper
- ✅ Outlight Scraper

## 🐳 Docker Deployment (Alternative)

### Prerequisites
- Docker and Docker Compose installed

### Deploy with Docker
```bash
# Build and start all services
yarn docker:build
yarn docker:up

# View logs
yarn docker:logs

# Stop services
yarn docker:down
```

## 🔍 Troubleshooting

### Common Issues

#### 1. Service Won't Start
```bash
# Check service status
sudo systemctl status belisasari

# View detailed logs
sudo journalctl -u belisasari -f

# Check environment file
sudo cat /opt/belisasari/.env
```

#### 2. Port Already in Use
```bash
# Check what's using port 3000
sudo lsof -i :3000

# Kill process if needed
sudo kill -9 <PID>
```

#### 3. Permission Issues
```bash
# Fix ownership
sudo chown -R belisasari:belisasari /opt/belisasari
sudo chown -R belisasari:belisasari /var/log/belisasari
```

#### 4. Dependencies Issues
```bash
# Reinstall dependencies
sudo -u belisasari bash -c "cd /opt/belisasari && yarn install"
sudo -u belisasari bash -c "cd /opt/belisasari/frontend && yarn install"
```

### Log Locations
- **Systemd logs**: `sudo journalctl -u belisasari -f`
- **Application logs**: `/var/log/belisasari/`
- **Service logs**: Available through systemd

## 🔒 Security Considerations

### Firewall Configuration
```bash
# Allow only necessary ports
sudo ufw allow ssh
sudo ufw allow 3000/tcp
sudo ufw enable
```

### SSL/HTTPS Setup (Recommended)
```bash
# Install Certbot
sudo apt install certbot

# Get SSL certificate (replace with your domain)
sudo certbot certonly --standalone -d your-domain.com

# Configure reverse proxy with nginx
sudo apt install nginx
# Configure nginx to proxy to localhost:3000
```

### User Permissions
- Service runs as `belisasari` user (non-root)
- Limited file system access
- No sudo privileges

## 📊 Monitoring

### Health Checks
```bash
# Check if all services are running
curl http://localhost:3000/api/health

# Check service status
sudo systemctl status belisasari
```

### Log Rotation
Log rotation is automatically configured via `/etc/logrotate.d/belisasari`

### Performance Monitoring
```bash
# Monitor resource usage
htop

# Check disk usage
df -h

# Monitor network
netstat -tulpn
```

## 🔄 Updates

### Updating the Application
```bash
# Stop service
sudo systemctl stop belisasari

# Backup current version
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

## 📞 Support

### Getting Help
1. Check logs: `sudo journalctl -u belisasari -f`
2. Verify configuration: `sudo cat /opt/belisasari/.env`
3. Check service status: `sudo systemctl status belisasari`
4. Review this documentation

### Useful Commands
```bash
# Quick status check
sudo systemctl status belisasari && curl -s http://localhost:3000/api/health

# Restart all services
sudo systemctl restart belisasari

# View real-time logs
sudo journalctl -u belisasari -f --since "1 hour ago"
```

---

## 🎉 Success!

Once deployed, your Belisasari Platform will be accessible at `http://YOUR_SERVER_IP:3000` with all services running automatically. The platform will continuously monitor TikTok trends, analyze Solana blockchain data, and provide AI-powered insights for memecoin trading.
