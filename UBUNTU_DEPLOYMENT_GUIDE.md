# Wojat Platform - Ubuntu Server Deployment Guide

## 🚀 Quick Start

### Prerequisites
- Ubuntu 20.04+ server
- Root access or sudo privileges
- Public IP address
- Domain name (optional but recommended)

### 1. Automated Deployment (Recommended)

```bash
# Clone the repository
git clone <your-repo-url> wojat
cd wojat

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
# Create wojat user
sudo useradd -r -s /bin/bash -d /opt/wojat -m wojat

# Create directories
sudo mkdir -p /opt/wojat
sudo mkdir -p /var/log/wojat
sudo chown -R wojat:wojat /opt/wojat
sudo chown -R wojat:wojat /var/log/wojat
```

#### Step 3: Deploy Application
```bash
# Copy application files
sudo cp -r . /opt/wojat/
sudo chown -R wojat:wojat /opt/wojat

# Install dependencies
sudo -u wojat bash -c "cd /opt/wojat && yarn install"
sudo -u wojat bash -c "cd /opt/wojat/frontend && yarn install && yarn build"
sudo -u wojat bash -c "cd /opt/wojat/elizaos-agents && npm install"
sudo -u wojat bash -c "cd /opt/wojat/bitquery && npm install"
sudo -u wojat bash -c "cd /opt/wojat/js-scraper && npm install"
```

#### Step 4: Configure Environment
```bash
# Copy environment template
sudo cp /opt/wojat/env.example /opt/wojat/.env
sudo chown wojat:wojat /opt/wojat/.env

# Edit environment file
sudo nano /opt/wojat/.env
```

#### Step 5: Install Systemd Service
```bash
# Copy service file
sudo cp /opt/wojat/wojat.service /etc/systemd/system/

# Reload systemd and enable service
sudo systemctl daemon-reload
sudo systemctl enable wojat
sudo systemctl start wojat
```

#### Step 6: Configure Firewall
```bash
# Allow port 3000
sudo ufw allow 3000/tcp
sudo ufw --force enable
```

## 🔧 Configuration

### Environment Variables

Edit `/opt/wojat/.env` with your actual values:

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
sudo systemctl start wojat

# Stop service
sudo systemctl stop wojat

# Restart service
sudo systemctl restart wojat

# Check status
sudo systemctl status wojat

# View logs
sudo journalctl -u wojat -f
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
sudo systemctl status wojat

# View detailed logs
sudo journalctl -u wojat -f

# Check environment file
sudo cat /opt/wojat/.env
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
sudo chown -R wojat:wojat /opt/wojat
sudo chown -R wojat:wojat /var/log/wojat
```

#### 4. Dependencies Issues
```bash
# Reinstall dependencies
sudo -u wojat bash -c "cd /opt/wojat && yarn install"
sudo -u wojat bash -c "cd /opt/wojat/frontend && yarn install"
```

### Log Locations
- **Systemd logs**: `sudo journalctl -u wojat -f`
- **Application logs**: `/var/log/wojat/`
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
- Service runs as `wojat` user (non-root)
- Limited file system access
- No sudo privileges

## 📊 Monitoring

### Health Checks
```bash
# Check if all services are running
curl http://localhost:3000/api/health

# Check service status
sudo systemctl status wojat
```

### Log Rotation
Log rotation is automatically configured via `/etc/logrotate.d/wojat`

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
sudo systemctl stop wojat

# Backup current version
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

## 📞 Support

### Getting Help
1. Check logs: `sudo journalctl -u wojat -f`
2. Verify configuration: `sudo cat /opt/wojat/.env`
3. Check service status: `sudo systemctl status wojat`
4. Review this documentation

### Useful Commands
```bash
# Quick status check
sudo systemctl status wojat && curl -s http://localhost:3000/api/health

# Restart all services
sudo systemctl restart wojat

# View real-time logs
sudo journalctl -u wojat -f --since "1 hour ago"
```

---

## 🎉 Success!

Once deployed, your Wojat Platform will be accessible at `http://YOUR_SERVER_IP:3000` with all services running automatically. The platform will continuously monitor TikTok trends, analyze Solana blockchain data, and provide AI-powered insights for memecoin trading.
