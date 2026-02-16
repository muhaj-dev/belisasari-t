# Node.js Version Fix - Updated to v22

## 🔧 Issue Fixed

### **Problem:**
Docker build was failing with the error:
```
error solana-agent-kit@1.4.9: The engine "node" is incompatible with this module. Expected version ">=22.0.0". Got "20.19.5"
```

### **Root Cause:**
The `solana-agent-kit` package requires Node.js version 22.0.0 or higher, but the Docker images were using Node.js 20.

## ✅ Solution Applied

### **Updated All Dockerfiles to Use Node.js 22:**

#### **1. bitquery/Dockerfile**
```dockerfile
FROM node:22-alpine  # Changed from node:20-alpine
```

#### **2. elizaos-agents/Dockerfile**
```dockerfile
FROM node:22-alpine  # Changed from node:20-alpine
```

#### **3. js-scraper/Dockerfile**
```dockerfile
FROM node:22-alpine  # Changed from node:20-alpine
```

#### **4. frontend/Dockerfile**
```dockerfile
FROM node:22-alpine AS base  # Changed from node:20-alpine AS base
```

### **Updated Deployment Scripts:**

#### **1. deploy-ubuntu.sh**
```bash
# Install Node.js 22.x
curl -fsSL https://deb.nodesource.com/setup_22.x | bash -
apt install -y nodejs
```

#### **2. UBUNTU_DEPLOYMENT_GUIDE.md**
```bash
# Install Node.js 22.x
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
sudo apt install -y nodejs
```

#### **3. DEPLOYMENT_README.md**
```bash
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
sudo apt install -y nodejs yarn
```

## 🚀 Ready to Build

Now you can successfully build the Docker images:

```bash
# Build all services
docker-compose build

# Or build individual services
docker-compose build bitquery
docker-compose build elizaos-agents
docker-compose build js-scraper
docker-compose build frontend
```

## 📋 Node.js Version Requirements

### **Minimum Requirements:**
- **Node.js**: 22.0.0 or higher
- **npm**: 10.x or higher
- **yarn**: 1.22.x or higher

### **Compatibility:**
- ✅ **Solana packages**: Compatible with Node.js 22
- ✅ **solana-agent-kit**: Now compatible with Node.js 22
- ✅ **ElizaOS agents**: Compatible with Node.js 22
- ✅ **Next.js frontend**: Compatible with Node.js 22
- ✅ **All scraping services**: Compatible with Node.js 22

## 🎯 Result

The Docker build should now work correctly for all services with Node.js 22, resolving all package compatibility issues!
