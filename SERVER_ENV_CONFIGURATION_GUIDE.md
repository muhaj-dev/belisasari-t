# Wojat Platform - Server Environment Configuration Guide

## 🔧 Updated GitHub Actions Workflow

The GitHub Actions deployment workflow has been updated to use a **hybrid approach**:
- **GitHub Secrets** - For server access and Docker credentials only
- **Server .env File** - For all application environment variables

## 📋 GitHub Secrets Required

### **Docker Hub Credentials:**
```bash
DOCKER_USERNAME          # Your Docker Hub username
DOCKER_HUB_ACCESS_TOKEN  # Docker Hub access token
```

### **Server Access Credentials:**
```bash
SSH_HOST                 # Your Ubuntu server IP address
SSH_USERNAME             # SSH username (usually 'ubuntu')
SSH_PRIVATE_KEY          # Private SSH key for server access
```

## 🖥️ Server Environment File Setup

### **Create .env File on Server:**

SSH into your server and create the environment file:

```bash
# SSH into your server
ssh ubuntu@YOUR_SERVER_IP

# Navigate to wojat directory
cd ~/wojat

# Create .env file
nano .env
```

### **Complete .env File Template:**

```bash
# Wojat Platform Environment Variables
NODE_ENV=production

# Supabase Configuration
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_ANON_KEY=your_supabase_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key_here

# Database Connection (Supabase PostgreSQL)
DB_HOST=db.your-project-id.supabase.co
DB_PORT=5432
DB_NAME=postgres
DB_USER=postgres
DB_PASSWORD=your_supabase_db_password
DATABASE_URL=postgresql://postgres:your_password@db.your-project-id.supabase.co:5432/postgres

# Twitter API Configuration
TWITTER_API_KEY=your_twitter_api_key
TWITTER_API_SECRET=your_twitter_api_secret
TWITTER_ACCESS_TOKEN=your_twitter_access_token
TWITTER_ACCESS_TOKEN_SECRET=your_twitter_access_token_secret
TWITTER_BEARER_TOKEN=your_twitter_bearer_token

# OpenAI API Configuration
OPENAI_API_KEY=your_openai_api_key

# Service Ports
FRONTEND_PORT=3000
ELIZAOS_PORT=3001
BITQUERY_PORT=3002
SCRAPER_PORT=3003

# Server Information
SERVER_PUBLIC_IP=YOUR_SERVER_PUBLIC_IP
```

## 🚀 Deployment Process

### **1. Automatic Environment Verification:**
The workflow automatically:
- ✅ **Checks for existing .env file** on the server
- ✅ **Backs up existing .env** before deployment
- ✅ **Shows configured variables** (masked for security)
- ✅ **Creates empty .env** if none exists
- ✅ **Tests Supabase connectivity** using server .env values

### **2. Container Deployment:**
All services are deployed with the server's `.env` file:
- **Frontend** - Next.js app with Supabase client
- **ElizaOS Agents** - AI agents with Supabase database access
- **Bitquery Service** - Solana data fetcher with Supabase storage
- **JS Scraper** - TikTok/Telegram scraper with Supabase data storage

### **3. Health Checks:**
The deployment includes comprehensive health checks:
- **Service endpoint testing** - Verifies all services are responding
- **Supabase API connectivity** - Tests connection using server .env values
- **Database connection verification** - Ensures all services can access Supabase
- **Error log monitoring** - Checks for Supabase-related errors

## 🔍 Supabase Setup Requirements

### **1. Create Supabase Project:**
1. Go to [supabase.com](https://supabase.com)
2. Create a new project
3. Note down your project URL and API keys

### **2. Database Schema:**
Run the provided SQL schemas in your Supabase SQL editor:
- `complete_supabase_schema.sql` - Full schema with all tables
- `quick_setup_schema.sql` - Simplified schema for testing
- `fix_rls_policies.sql` - Row Level Security policies

### **3. Get Supabase Credentials:**
From your Supabase dashboard:

#### **API Settings:**
- **Project URL** - `https://your-project-id.supabase.co`
- **anon key** - Public API key
- **service_role key** - Private API key (keep secure)

#### **Database Settings:**
- **Host** - `db.your-project-id.supabase.co`
- **Database** - `postgres`
- **User** - `postgres`
- **Password** - Your database password
- **Connection String** - Complete database URL

## 📊 Deployment Verification

### **Automatic Checks:**
The workflow performs these verification steps:

1. **Environment File Check** - Ensures .env file exists and is configured
2. **Container Status** - Ensures all containers are running
3. **Service Endpoints** - Tests HTTP responses from all services
4. **Supabase Connectivity** - Verifies API access using server .env values
5. **Environment Configuration** - Confirms .env files are properly mounted
6. **Error Monitoring** - Checks logs for Supabase-related issues

### **Manual Verification:**
After deployment, you can verify:

```bash
# SSH into server
ssh ubuntu@YOUR_SERVER_IP

# Check container status
sudo docker ps

# Check environment file
cat ~/wojat/.env

# Test Supabase API connectivity
curl -H "apikey: YOUR_ANON_KEY" \
     -H "Authorization: Bearer YOUR_ANON_KEY" \
     "YOUR_SUPABASE_URL/rest/v1/"

# Check service logs
sudo docker logs wojat-frontend
sudo docker logs wojat-elizaos-agents
sudo docker logs wojat-bitquery
sudo docker logs wojat-js-scraper
```

## 🌐 Service Access

After successful deployment:

- **Frontend:** `http://YOUR_SERVER_IP:3000`
- **ElizaOS Agents:** `http://YOUR_SERVER_IP:3001`
- **Bitquery Service:** `http://YOUR_SERVER_IP:3002`
- **JS Scraper:** `http://YOUR_SERVER_IP:3003`

## 🔧 Troubleshooting

### **Common Issues:**

1. **No .env File Found:**
   - Create the .env file on the server manually
   - Use the template provided above
   - Ensure all required variables are set

2. **Supabase Connection Failed:**
   - Verify Supabase credentials in .env file
   - Check if Supabase project is active
   - Ensure API keys have correct permissions

3. **Container Startup Issues:**
   - Check container logs for specific errors
   - Verify environment variables are properly set in .env file
   - Ensure .env file has correct format (no spaces around =)

### **Debug Commands:**
```bash
# Check environment variables in container
sudo docker exec wojat-frontend env | grep SUPABASE

# Test Supabase API from container
sudo docker exec wojat-frontend curl -H "apikey: $SUPABASE_ANON_KEY" \
  "$SUPABASE_URL/rest/v1/"

# Check .env file format
cat ~/wojat/.env | grep -v "^#" | grep -v "^$"

# Test database connection
sudo docker exec wojat-frontend node -e "
const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);
supabase.from('tiktoks').select('count').then(console.log);
"
```

## 📝 Benefits of This Approach

### **Security Advantages:**
- **Separation of Concerns** - Server credentials vs application config
- **No Sensitive Data in GitHub** - Application secrets stay on server
- **Easy Updates** - Change app config without touching GitHub secrets
- **Server Control** - Full control over environment variables

### **Operational Benefits:**
- **Flexible Configuration** - Easy to modify app settings
- **Environment Isolation** - Different configs for different environments
- **Backup Friendly** - .env file can be backed up separately
- **Debug Friendly** - Easy to check and modify configuration

### **Perfect for Wojat Platform:**
- **Supabase Integration** - Seamless cloud database connection
- **API Management** - Easy Twitter and OpenAI API configuration
- **Service Orchestration** - All services use same configuration
- **Scalability** - Easy to scale with consistent configuration
