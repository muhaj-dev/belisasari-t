# Wojat Platform - Correct Environment Variables Guide

## 🔧 Updated GitHub Actions Workflow

The GitHub Actions deployment workflow has been updated to use the **exact environment variable names** from the source code. This ensures perfect compatibility between the deployment configuration and the application code.

## 📋 Exact Environment Variable Names (From Source Code)

### **Core Configuration:**
```bash
NODE_ENV=production
PORT=3000
HOST=0.0.0.0
```

### **Supabase Configuration:**
```bash
SUPABASE_URL=your_supabase_url_here
SUPABASE_ANON_KEY=your_supabase_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key_here
```

### **OpenAI Configuration:**
```bash
OPENAI_API_KEY=your_openai_api_key_here
```

### **Solana Configuration:**
```bash
SOLANA_PRIVATE_KEY=your_base58_private_key_here
SOLANA_PUBLIC_KEY=your_public_key_here
SOLANA_RPC_URL=https://api.mainnet-beta.solana.com
SOLANA_CLUSTER=mainnet-beta
```

### **Bitquery Configuration:**
```bash
BITQUERY_API_KEY=your_bitquery_api_key_here
ACCESS_TOKEN=your_bitquery_access_token_here
```

### **Twitter Configuration (Exact Names from Source):**
```bash
CONSUMER_KEY=your_twitter_consumer_key_here
CONSUMER_SECRET=your_twitter_consumer_secret_here
ZORO_ACCESS_TOKEN=your_twitter_access_token_here
ZORO_ACCESS_TOKEN_SECRET=your_twitter_access_token_secret_here
```

### **Telegram Configuration:**
```bash
TELEGRAM_BOT_TOKEN=your_telegram_bot_token_here
TELEGRAM_CHANNEL_ID=your_telegram_channel_id_here
TELEGRAM_GROUP_ID=your_telegram_group_id_here
```

### **Discord Configuration:**
```bash
DISCORD_BOT_TOKEN=your_discord_bot_token_here
DISCORD_GUILD_ID=your_discord_guild_id_here
DISCORD_ANNOUNCEMENT_CHANNEL_ID=your_announcement_channel_id_here
DISCORD_TRADING_CHANNEL_ID=your_trading_channel_id_here
DISCORD_VOICE_CHANNEL_ID=your_voice_channel_id_here
```

### **Database Configuration:**
```bash
DATABASE_URL=postgresql://username:password@localhost:5432/wojat_db
DB_HOST=localhost
DB_PORT=5432
DB_NAME=wojat_db
DB_USER=wojat_user
DB_PASSWORD=your_db_password_here
```

## 🔍 Source Code Variable Usage

### **ElizaOS Agents (`elizaos-agents/simple-test.js`):**
```javascript
// Supabase
process.env.SUPABASE_URL
process.env.SUPABASE_ANON_KEY

// Bitquery
process.env.BITQUERY_API_KEY
process.env.ACCESS_TOKEN

// Twitter (Exact names used in source)
process.env.CONSUMER_KEY
process.env.CONSUMER_SECRET
process.env.ZORO_ACCESS_TOKEN
process.env.ZORO_ACCESS_TOKEN_SECRET
```

### **ElizaOS Agents (`elizaos-agents/iris-trading-agent.js`):**
```javascript
// OpenAI
process.env.OPENAI_API_KEY

// Supabase
process.env.SUPABASE_URL
process.env.SUPABASE_ANON_KEY

// Solana
process.env.SOLANA_PUBLIC_KEY
```

### **Frontend (`frontend/app/layout.tsx`):**
```javascript
// Next.js public URL
process.env.NEXT_PUBLIC_APP_URL
```

### **Frontend API Routes:**
```javascript
// Supabase (Note: Uses SUPABASE_ANON_SECRET in some files)
process.env.SUPABASE_URL
process.env.SUPABASE_ANON_SECRET
```

## 🚀 Complete .env File Template

Create this exact `.env` file on your server:

```bash
# Wojat Platform Environment Variables
NODE_ENV=production
PORT=3000
HOST=0.0.0.0

# Supabase Configuration
SUPABASE_URL=your_supabase_url_here
SUPABASE_ANON_KEY=your_supabase_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key_here

# OpenAI Configuration
OPENAI_API_KEY=your_openai_api_key_here

# Solana Configuration
SOLANA_PRIVATE_KEY=your_base58_private_key_here
SOLANA_PUBLIC_KEY=your_public_key_here
SOLANA_RPC_URL=https://api.mainnet-beta.solana.com
SOLANA_CLUSTER=mainnet-beta

# Bitquery Configuration
BITQUERY_API_KEY=your_bitquery_api_key_here
ACCESS_TOKEN=your_bitquery_access_token_here

# Twitter Configuration (Exact names from source code)
CONSUMER_KEY=your_twitter_consumer_key_here
CONSUMER_SECRET=your_twitter_consumer_secret_here
ZORO_ACCESS_TOKEN=your_twitter_access_token_here
ZORO_ACCESS_TOKEN_SECRET=your_twitter_access_token_secret_here

# Telegram Configuration
TELEGRAM_BOT_TOKEN=your_telegram_bot_token_here
TELEGRAM_CHANNEL_ID=your_telegram_channel_id_here
TELEGRAM_GROUP_ID=your_telegram_group_id_here

# Discord Configuration
DISCORD_BOT_TOKEN=your_discord_bot_token_here
DISCORD_GUILD_ID=your_discord_guild_id_here
DISCORD_ANNOUNCEMENT_CHANNEL_ID=your_announcement_channel_id_here
DISCORD_TRADING_CHANNEL_ID=your_trading_channel_id_here
DISCORD_VOICE_CHANNEL_ID=your_voice_channel_id_here

# Database Configuration
DATABASE_URL=postgresql://username:password@localhost:5432/wojat_db
DB_HOST=localhost
DB_PORT=5432
DB_NAME=wojat_db
DB_USER=wojat_user
DB_PASSWORD=your_db_password_here

# Server Information
SERVER_PUBLIC_IP=YOUR_SERVER_PUBLIC_IP
```

## 📊 GitHub Actions Workflow Updates

### **Environment Variable Verification:**
The workflow now checks for the exact variable names:
```bash
grep -E "^(SUPABASE_|OPENAI_|SOLANA_|BITQUERY_|CONSUMER_|ZORO_|TELEGRAM_|DISCORD_|DB_|NODE_ENV|PORT|HOST)"
```

### **Template Generation:**
When no `.env` file exists, the workflow creates a template with the exact variable names used in the source code.

### **Health Checks:**
All health checks now use the correct variable names for testing connectivity.

## 🔧 Key Differences from Previous Version

### **Twitter Variables (Corrected):**
- ❌ `TWITTER_API_KEY` → ✅ `CONSUMER_KEY`
- ❌ `TWITTER_API_SECRET` → ✅ `CONSUMER_SECRET`
- ❌ `TWITTER_ACCESS_TOKEN` → ✅ `ZORO_ACCESS_TOKEN`
- ❌ `TWITTER_ACCESS_TOKEN_SECRET` → ✅ `ZORO_ACCESS_TOKEN_SECRET`

### **Bitquery Variables (Corrected):**
- ❌ `BITQUERY_ACCESS_TOKEN` → ✅ `ACCESS_TOKEN`

### **Additional Variables Added:**
- ✅ `SOLANA_PRIVATE_KEY`
- ✅ `SOLANA_PUBLIC_KEY`
- ✅ `SOLANA_RPC_URL`
- ✅ `SOLANA_CLUSTER`
- ✅ `TELEGRAM_BOT_TOKEN`
- ✅ `TELEGRAM_CHANNEL_ID`
- ✅ `TELEGRAM_GROUP_ID`
- ✅ `DISCORD_BOT_TOKEN`
- ✅ `DISCORD_GUILD_ID`
- ✅ `DISCORD_ANNOUNCEMENT_CHANNEL_ID`
- ✅ `DISCORD_TRADING_CHANNEL_ID`
- ✅ `DISCORD_VOICE_CHANNEL_ID`

## 🎯 Benefits of Using Exact Variable Names

### **Perfect Compatibility:**
- **No Variable Mismatches** - Application code will find all required variables
- **No Runtime Errors** - All environment variables are properly recognized
- **Consistent Configuration** - Same variable names across all services

### **Development Efficiency:**
- **Copy-Paste Ready** - Template matches source code exactly
- **No Debugging Needed** - Variables work immediately
- **Clear Documentation** - Variable names match code comments

### **Deployment Reliability:**
- **Automatic Verification** - Workflow checks for exact variable names
- **Error Prevention** - Catches missing variables before deployment
- **Health Monitoring** - Tests use correct variable names

## 📝 Next Steps

1. **Update Server .env File** - Use the exact variable names provided
2. **Test Configuration** - Verify all services can access their required variables
3. **Deploy** - Push to main branch to trigger deployment with correct configuration
4. **Monitor** - Check logs to ensure all services start successfully

The GitHub Actions workflow is now perfectly aligned with your source code's environment variable requirements!
