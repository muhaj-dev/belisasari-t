# 🚀 Wojat Platform - Quick Start Guide

## Single Command to Run All Phases

The Wojat platform now supports running all phases with a single command! This includes:
- **Phase 1**: Data Collection & Display (Frontend)
- **Phase 2**: Social Media Automation (ElizaOS Agents)  
- **Phase 3**: AI-Powered Frontend (Frontend)
- **Phase 4**: Advanced AI Trading (ElizaOS Agents)

## 🎯 **One Command Setup**

### **Option 1: Using npm/yarn (Recommended)**
```bash
# Install all dependencies and start everything
npm run wojat
# or
yarn wojat
# or
npm run start:all
# or
npm run run:all
```

### **Option 2: Direct Node.js execution**
```bash
node start-iris.js
```

### **Option 3: Platform-specific scripts**

**Windows:**
```cmd
start-iris.bat
```

**Linux/macOS:**
```bash
chmod +x start-iris.sh
./start-iris.sh
```

## 📋 **What Happens When You Run It**

1. **🔍 Pre-flight Checks**
   - Verifies Node.js is installed
   - Checks if you're in the correct directory
   - Validates required folders exist

2. **📦 Dependency Installation**
   - Automatically installs missing dependencies
   - Checks for package.json and node_modules
   - Installs packages for each service

3. **🚀 Service Startup (in order)**
   - **Frontend** (http://localhost:3000) - Web interface
   - **Phase 2** - Social media automation
   - **Phase 4** - AI trading system
   - **Data Collection** - TikTok scraper

4. **📊 Real-time Monitoring**
   - Monitors all services
   - Auto-restarts crashed services
   - Provides colored console output
   - Shows service status

## 🌐 **Access Points**

Once running, you can access:

- **🏠 Main App**: http://localhost:3000
- **💬 AI Chat**: http://localhost:3000/ai-chat
- **📊 Dashboard**: http://localhost:3000/dashboard
- **📈 Trending Coins**: http://localhost:3000/trending-coins
- **🧪 Testing**: http://localhost:3000/testing

## ⌨️ **Controls**

- **Ctrl+C** - Stop all services gracefully
- **Ctrl+Z** - Pause all services (Unix)
- **Ctrl+\\** - Force stop all services

## 🔧 **Configuration**

### **Environment Variables**

Create these files with your credentials:

**`elizaos-agents/.env`:**
```env
# Required
OPENAI_API_KEY=your_openai_api_key
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
BITQUERY_API_KEY=your_bitquery_api_key
ACCESS_TOKEN=your_bitquery_access_token

# Optional - for trading
SOLANA_PRIVATE_KEY=your_base58_private_key
SOLANA_PUBLIC_KEY=your_public_key
SOLANA_RPC_URL=https://api.mainnet-beta.solana.com

# Optional - for social media
CONSUMER_KEY=your_twitter_consumer_key
CONSUMER_SECRET=your_twitter_consumer_secret
ZORO_ACCESS_TOKEN=your_twitter_access_token
ZORO_ACCESS_TOKEN_SECRET=your_twitter_access_token_secret
```

**`frontend/.env.local`:**
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_WS_URL=ws://localhost:8080/ws
```

## 🎯 **Service Overview**

### **Frontend (Phase 1 & 3)**
- **Port**: 3000
- **Features**: Web interface, AI chat, dashboard
- **Technology**: Next.js, React, TypeScript

### **ElizaOS Agents (Phase 2)**
- **Features**: Social media automation
- **Platforms**: Twitter, Telegram, Discord
- **Technology**: ElizaOS, Node.js

### **ElizaOS Agents (Phase 4)**
- **Features**: AI trading, portfolio management
- **Capabilities**: Autonomous trading, risk management
- **Technology**: ElizaOS, Solana Web3.js

### **Data Collection**
- **Features**: TikTok scraping, trend detection
- **Sources**: TikTok, Bitquery, social media
- **Technology**: Node.js, Puppeteer

## 🚨 **Troubleshooting**

### **Common Issues:**

1. **"Port already in use"**
   ```bash
   # Kill process on port 3000
   npx kill-port 3000
   ```

2. **"Missing dependencies"**
   ```bash
   # The script will auto-install, but you can manually run:
   npm install
   cd frontend && npm install
   cd ../elizaos-agents && npm install
   ```

3. **"Permission denied" (Unix)**
   ```bash
   chmod +x start-iris.sh
   chmod +x start-iris.js
   ```

4. **"Node.js not found"**
   - Install Node.js 18+ from https://nodejs.org/
   - Restart your terminal

### **Service-Specific Issues:**

**Frontend won't start:**
- Check if port 3000 is available
- Verify frontend dependencies are installed
- Check for TypeScript errors

**ElizaOS agents won't start:**
- Verify environment variables are set
- Check if OpenAI API key is valid
- Ensure Supabase credentials are correct

**Data collection not working:**
- Check if TikTok scraper dependencies are installed
- Verify network connectivity
- Check for rate limiting

## 📊 **Monitoring & Logs**

The startup script provides:
- **Colored output** for each service
- **Real-time logs** from all components
- **Service status** monitoring
- **Auto-restart** on crashes
- **Graceful shutdown** on Ctrl+C

## 🎉 **Success Indicators**

You'll know everything is working when you see:

- ✅ All services show "started successfully"
- ✅ Frontend loads at http://localhost:3000
- ✅ AI chat responds to messages
- ✅ No red error messages in console
- ✅ Services show "🟢 Running" status

## 🔄 **Development Mode**

For development, you can also run individual components:

```bash
# Frontend only
cd frontend && npm run dev

# ElizaOS agents only
cd elizaos-agents && node phase4-orchestrator.js

# Data collection only
cd js-scraper && node index.mjs
```

## 🚀 **Production Deployment**

For production, use the individual build commands:

```bash
# Build frontend
cd frontend && npm run build && npm run start

# Run agents
cd elizaos-agents && node phase4-orchestrator.js
```

## 📞 **Support**

If you encounter issues:
1. Check the console logs for specific error messages
2. Verify all environment variables are set correctly
3. Ensure all dependencies are installed
4. Check that ports are available
5. Review the troubleshooting section above

---

**🎯 Ready to hunt for memecoins? Run `npm run wojat` and let the AI do the work!** 🚀

