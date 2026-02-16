# Wojat Platform - Supabase Configuration Guide

## 🔧 GitHub Actions Workflow Updated for Supabase

The GitHub Actions deployment workflow has been updated to use **Supabase** instead of a local PostgreSQL instance. This provides a cloud-hosted database solution with built-in authentication, real-time subscriptions, and API endpoints.

## 📋 Required GitHub Secrets

### **Docker Hub Secrets:**
```bash
DOCKER_USERNAME          # Your Docker Hub username
DOCKER_HUB_ACCESS_TOKEN  # Docker Hub access token
```

### **Server Access Secrets:**
```bash
SSH_HOST                 # Your Ubuntu server IP address
SSH_USERNAME             # SSH username (usually 'ubuntu')
SSH_PRIVATE_KEY          # Private SSH key for server access
```

### **Supabase Configuration Secrets:**
```bash
SUPABASE_URL                    # Your Supabase project URL
SUPABASE_ANON_KEY              # Supabase anonymous key
SUPABASE_SERVICE_ROLE_KEY      # Supabase service role key
SUPABASE_DB_HOST               # Supabase database host
SUPABASE_DB_NAME               # Supabase database name
SUPABASE_DB_USER               # Supabase database user
SUPABASE_DB_PASSWORD           # Supabase database password
SUPABASE_DATABASE_URL          # Complete Supabase database URL
```

### **API Keys:**
```bash
TWITTER_API_KEY                # Twitter API key
TWITTER_API_SECRET             # Twitter API secret
TWITTER_ACCESS_TOKEN           # Twitter access token
TWITTER_ACCESS_TOKEN_SECRET    # Twitter access token secret
TWITTER_BEARER_TOKEN           # Twitter bearer token
OPENAI_API_KEY                 # OpenAI API key
```

## 🚀 Deployment Process

### **1. Automatic Environment Configuration:**
The workflow automatically creates a `.env` file on the server with all necessary Supabase configuration:

```bash
# Wojat Platform Environment Variables - Supabase Configuration
NODE_ENV=production

# Supabase Configuration (Primary Database)
SUPABASE_URL=${SUPABASE_URL}
SUPABASE_ANON_KEY=${SUPABASE_ANON_KEY}
SUPABASE_SERVICE_ROLE_KEY=${SUPABASE_SERVICE_ROLE_KEY}

# Database Connection (Supabase PostgreSQL)
DB_HOST=${SUPABASE_DB_HOST}
DB_PORT=5432
DB_NAME=${SUPABASE_DB_NAME}
DB_USER=${SUPABASE_DB_USER}
DB_PASSWORD=${SUPABASE_DB_PASSWORD}
DATABASE_URL=${SUPABASE_DATABASE_URL}

# Twitter API Configuration
TWITTER_API_KEY=${TWITTER_API_KEY}
TWITTER_API_SECRET=${TWITTER_API_SECRET}
TWITTER_ACCESS_TOKEN=${TWITTER_ACCESS_TOKEN}
TWITTER_ACCESS_TOKEN_SECRET=${TWITTER_ACCESS_TOKEN_SECRET}
TWITTER_BEARER_TOKEN=${TWITTER_BEARER_TOKEN}

# OpenAI API Configuration
OPENAI_API_KEY=${OPENAI_API_KEY}

# Service Ports
FRONTEND_PORT=3000
ELIZAOS_PORT=3001
BITQUERY_PORT=3002
SCRAPER_PORT=3003

# Server Information
SERVER_PUBLIC_IP=${PUBLIC_IP}
```

### **2. Container Deployment:**
All services are deployed with Supabase configuration:
- **Frontend** - Next.js app with Supabase client
- **ElizaOS Agents** - AI agents with Supabase database access
- **Bitquery Service** - Solana data fetcher with Supabase storage
- **JS Scraper** - TikTok/Telegram scraper with Supabase data storage

### **3. Health Checks:**
The deployment includes comprehensive health checks:
- **Service endpoint testing** - Verifies all services are responding
- **Supabase API connectivity** - Tests connection to Supabase from each container
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

### **3. API Keys:**
From your Supabase dashboard:
- **Project URL** - Your Supabase project URL
- **anon key** - Public API key
- **service_role key** - Private API key (keep secure)

### **4. Database Connection:**
From Supabase Settings > Database:
- **Host** - Database host address
- **Database** - Database name
- **User** - Database user
- **Password** - Database password
- **Connection String** - Complete database URL

## 📊 Deployment Verification

### **Automatic Checks:**
The workflow performs these verification steps:

1. **Container Status** - Ensures all containers are running
2. **Service Endpoints** - Tests HTTP responses from all services
3. **Supabase Connectivity** - Verifies API access from each container
4. **Environment Configuration** - Confirms .env files are properly mounted
5. **Error Monitoring** - Checks logs for Supabase-related issues

### **Manual Verification:**
After deployment, you can verify:

```bash
# Check container status
docker ps

# Test Supabase API connectivity
curl -H "apikey: YOUR_ANON_KEY" \
     -H "Authorization: Bearer YOUR_ANON_KEY" \
     "YOUR_SUPABASE_URL/rest/v1/"

# Check service logs
docker logs wojat-frontend
docker logs wojat-elizaos-agents
docker logs wojat-bitquery
docker logs wojat-js-scraper
```

## 🌐 Service Access

After successful deployment:

- **Frontend:** `http://YOUR_SERVER_IP:3000`
- **ElizaOS Agents:** `http://YOUR_SERVER_IP:3001`
- **Bitquery Service:** `http://YOUR_SERVER_IP:3002`
- **JS Scraper:** `http://YOUR_SERVER_IP:3003`

## 🔧 Troubleshooting

### **Common Issues:**

1. **Supabase Connection Failed:**
   - Verify all Supabase secrets are set correctly
   - Check if Supabase project is active
   - Ensure API keys have correct permissions

2. **Database Schema Missing:**
   - Run the SQL schemas in Supabase SQL editor
   - Verify RLS policies are configured correctly

3. **Container Startup Issues:**
   - Check container logs for specific errors
   - Verify environment variables are properly set
   - Ensure all required secrets are configured

### **Debug Commands:**
```bash
# Check environment variables
docker exec wojat-frontend env | grep SUPABASE

# Test Supabase API from container
docker exec wojat-frontend curl -H "apikey: $SUPABASE_ANON_KEY" \
  "$SUPABASE_URL/rest/v1/"

# Check database connection
docker exec wojat-frontend node -e "
const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);
supabase.from('tiktoks').select('count').then(console.log);
"
```

## 📝 Benefits of Supabase

### **Advantages over Local PostgreSQL:**
- **Cloud-hosted** - No local database management
- **Built-in APIs** - REST and GraphQL APIs automatically generated
- **Real-time subscriptions** - Live data updates
- **Authentication** - Built-in user management
- **Dashboard** - Visual database management
- **Scalability** - Automatic scaling and backups
- **Security** - Row Level Security (RLS) policies

### **Perfect for Wojat Platform:**
- **TikTok data storage** - Efficient storage and retrieval
- **Real-time updates** - Live social media monitoring
- **User authentication** - Secure platform access
- **API integration** - Easy integration with all services
- **Analytics** - Built-in analytics and monitoring
