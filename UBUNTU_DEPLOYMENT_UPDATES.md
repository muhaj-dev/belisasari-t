# Wojat Platform - Ubuntu Server Deployment Updates

## 🚀 **Latest Updates for Production Deployment**

This document outlines all the recent updates made to prepare the Wojat platform for Ubuntu server deployment, including fixes for dependency conflicts, TikTok scraper improvements, and enhanced Docker configurations.

---

## 📋 **Updated Components**

### 1. **Dockerfiles Updated** ✅

All Dockerfiles have been updated with the latest fixes:

#### **Frontend Dockerfile**
- ✅ Added `--legacy-peer-deps` flag to handle dependency conflicts
- ✅ Uses Node.js 22-alpine base image
- ✅ Includes all necessary build dependencies

#### **ElizaOS Agents Dockerfile**
- ✅ Added `--legacy-peer-deps` flag for dependency resolution
- ✅ Enhanced build dependencies for native modules
- ✅ Proper user permissions and security

#### **Bitquery Dockerfile**
- ✅ Added `--legacy-peer-deps` flag
- ✅ Updated to Node.js 22-alpine
- ✅ Enhanced build dependencies

#### **JS Scraper Dockerfile**
- ✅ Added `--legacy-peer-deps` flag
- ✅ Enhanced Chrome/Puppeteer dependencies
- ✅ Anti-bot detection measures included

#### **Scheduled Dockerfiles**
- ✅ **Bitquery Scheduled**: Runs every 12 hours (2 AM & 2 PM UTC)
- ✅ **JS Scraper Scheduled**: Runs every 3 hours (TikTok, Telegram, Outlight)
- ✅ Proper cron configuration and logging

### 2. **GitHub Actions Workflow** ✅

The `.github/workflows/deploy.yml` file includes:

- ✅ **Multi-image Build**: Frontend, ElizaOS Agents, Bitquery, JS Scraper
- ✅ **Scheduled Services**: Both scheduled and manual versions
- ✅ **Environment Management**: Server-side `.env` file configuration
- ✅ **Health Checks**: Comprehensive deployment verification
- ✅ **Service Monitoring**: Log checking and status verification
- ✅ **Management Commands**: Ready-to-use Docker commands

### 3. **Docker Compose Configuration** ✅

Updated `docker-compose.yml` with:

- ✅ **Service Profiles**: Manual and scheduled service profiles
- ✅ **Volume Management**: Persistent logs for scheduled services
- ✅ **Network Configuration**: Isolated wojat-network
- ✅ **Environment Integration**: Proper `.env` file mounting
- ✅ **Service Dependencies**: Correct startup order

### 4. **Deployment Scripts** ✅

Updated `deploy-ubuntu.sh` with:

- ✅ **Legacy Peer Deps**: Added `--legacy-peer-deps` flags
- ✅ **Node.js 22**: Updated to latest Node.js version
- ✅ **Dependency Resolution**: Handles all dependency conflicts
- ✅ **Service Management**: Complete systemd integration

---

## 🔧 **Key Fixes Implemented**

### **1. Dependency Conflicts Resolution**
```bash
# All install commands now use:
yarn install --legacy-peer-deps
npm install --legacy-peer-deps
```

**Fixed Issues:**
- ✅ ESLint version conflicts (root vs frontend)
- ✅ bs58 version conflicts (Solana wallet adapters)
- ✅ Peer dependency warnings
- ✅ Optional dependency failures

### **2. TikTok Scraper Improvements**
```javascript
// Enhanced video element detection
const selectors = [
  'div[class*="DivItemContainerForSearch"]',
  'div[class*="DivItemContainerV2"]',
  '[data-e2e="search-video-item"]',
  'div[class*="ItemContainer"]',
  'div[class*="DivVideoFeedItem"]',
  'div[class*="VideoItem"]',
  'a[href*="/video/"]'
];
```

**Improvements:**
- ✅ Multiple selector fallbacks
- ✅ Anti-bot detection countermeasures
- ✅ Robust timeout handling (15 retries max)
- ✅ URL fallback mechanism (hashtag → search)
- ✅ Graceful error recovery

### **3. Enhanced Browser Configuration**
```javascript
// Anti-detection measures
args: [
  '--disable-blink-features=AutomationControlled',
  '--disable-features=VizDisplayCompositor',
  '--disable-web-security',
  '--user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64)...'
]
```

**Features:**
- ✅ Realistic user agent
- ✅ Webdriver detection removal
- ✅ Proper HTTP headers
- ✅ Enhanced viewport settings

---

## 📊 **Service Schedules**

### **Bitquery Service**
- **Frequency**: Every 12 hours
- **Times**: 2:00 AM and 2:00 PM UTC
- **Command**: `node index.mjs`
- **Logs**: `/var/log/bitquery-cron.log`

### **JS Scraper Service**
- **TikTok Scraper**: Every 3 hours at :00 minutes
- **Telegram Scraper**: Every 3 hours at :20 minutes  
- **Outlight Scraper**: Every 3 hours at :40 minutes
- **Logs**: `/var/log/scraper-cron.log`

---

## 🚀 **Deployment Process**

### **1. GitHub Actions Workflow**
```yaml
# Automatic deployment on push to main branch
- Builds all Docker images
- Pushes to Docker Hub
- Deploys to Ubuntu server
- Verifies deployment health
```

### **2. Server Configuration**
```bash
# Environment setup
- Creates .env file with all required variables
- Mounts environment files to containers
- Sets up proper permissions and logging
```

### **3. Service Management**
```bash
# Container management
docker ps                    # Check running containers
docker logs <container>      # View container logs
docker exec <container> ...  # Execute commands in containers
```

---

## 📝 **Environment Variables**

### **Required Server Environment Variables**
```bash
# Supabase Configuration
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# OpenAI Configuration  
OPENAI_API_KEY=your_openai_api_key

# Solana Configuration
SOLANA_PRIVATE_KEY=your_base58_private_key
SOLANA_PUBLIC_KEY=your_public_key
SOLANA_RPC_URL=https://api.mainnet-beta.solana.com

# Bitquery Configuration
BITQUERY_API_KEY=your_bitquery_api_key
ACCESS_TOKEN=your_bitquery_access_token

# Twitter Configuration
CONSUMER_KEY=your_twitter_consumer_key
CONSUMER_SECRET=your_twitter_consumer_secret
ZORO_ACCESS_TOKEN=your_twitter_access_token
ZORO_ACCESS_TOKEN_SECRET=your_twitter_access_token_secret

# Telegram Configuration
TELEGRAM_BOT_TOKEN=your_telegram_bot_token
TELEGRAM_CHANNEL_ID=your_telegram_channel_id
TELEGRAM_GROUP_ID=your_telegram_group_id
```

---

## 🔍 **Verification Commands**

### **Check Service Status**
```bash
# View all containers
sudo docker ps

# Check specific service logs
sudo docker logs wojat-frontend
sudo docker logs wojat-elizaos-agents
sudo docker logs wojat-bitquery
sudo docker logs wojat-js-scraper
```

### **Check Scheduled Services**
```bash
# Bitquery cron schedule
sudo docker exec wojat-bitquery crontab -l

# JS Scraper cron schedule  
sudo docker exec wojat-js-scraper crontab -l

# View cron logs
sudo docker exec wojat-bitquery tail -f /var/log/bitquery-cron.log
sudo docker exec wojat-js-scraper tail -f /var/log/scraper-cron.log
```

### **Manual Service Execution**
```bash
# Run Bitquery manually
sudo docker exec wojat-bitquery su -s /bin/bash bitquery -c 'cd /app && node index.mjs'

# Run TikTok scraper manually
sudo docker exec wojat-js-scraper su -s /bin/bash scraper -c 'cd /app && yarn scrape-tiktok'

# Run Telegram scraper manually
sudo docker exec wojat-js-scraper su -s /bin/bash scraper -c 'cd /app && yarn scrape-telegram'

# Run Outlight scraper manually
sudo docker exec wojat-js-scraper su -s /bin/bash scraper -c 'cd /app && yarn scrape-outlight'
```

---

## 🌐 **Access URLs**

After successful deployment:

- **Frontend**: `http://YOUR_SERVER_IP:3000`
- **ElizaOS Agents**: `http://YOUR_SERVER_IP:3001`
- **Bitquery Service**: `http://YOUR_SERVER_IP:3002`
- **JS Scraper Service**: `http://YOUR_SERVER_IP:3003`

---

## 🎯 **Deployment Checklist**

### **Pre-Deployment**
- [ ] GitHub Secrets configured (Docker Hub, SSH keys)
- [ ] Server environment variables set in `.env` file
- [ ] Server has Docker and Docker Compose installed
- [ ] Server has sufficient resources (RAM, CPU, disk)

### **During Deployment**
- [ ] GitHub Actions workflow runs successfully
- [ ] All Docker images build without errors
- [ ] Containers start and remain running
- [ ] Environment files are properly mounted
- [ ] Scheduled services are configured

### **Post-Deployment**
- [ ] All services respond to health checks
- [ ] Frontend is accessible via browser
- [ ] Database connections are working
- [ ] Scheduled services are running on schedule
- [ ] Logs are being generated properly

---

## 🚨 **Troubleshooting**

### **Common Issues**

1. **Container Won't Start**
   ```bash
   # Check logs
   docker logs <container_name>
   
   # Check environment file
   docker exec <container> cat /app/.env
   ```

2. **Dependency Installation Fails**
   ```bash
   # Use legacy peer deps
   npm install --legacy-peer-deps
   yarn install --legacy-peer-deps
   ```

3. **TikTok Scraper Stuck**
   ```bash
   # Check scraper logs
   docker exec wojat-js-scraper tail -f /var/log/scraper-cron.log
   
   # Run manually to test
   docker exec wojat-js-scraper su -s /bin/bash scraper -c 'cd /app && yarn scrape-tiktok'
   ```

4. **Database Connection Issues**
   ```bash
   # Test Supabase connectivity
   docker exec <container> curl -s $SUPABASE_URL/rest/v1/
   ```

---

## 🎉 **Ready for Production**

The Wojat platform is now fully prepared for Ubuntu server deployment with:

- ✅ **Robust Dependency Management**: All conflicts resolved
- ✅ **Enhanced TikTok Scraping**: Anti-bot measures and fallbacks
- ✅ **Scheduled Services**: Automated data collection
- ✅ **Comprehensive Monitoring**: Health checks and logging
- ✅ **Easy Management**: Simple Docker commands
- ✅ **Production Ready**: Error handling and recovery

**Deploy with confidence!** 🚀
