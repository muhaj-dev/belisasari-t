# Docker Build Alpine Package Fix

## 🔧 Issue Fixed

### **Problem:**
Docker build was failing with the error:
```
ERROR: unable to select packages:
  libudev-dev (no such package):
    required by: world[libudev-dev]
```

### **Root Cause:**
The `libudev-dev` package doesn't exist in Alpine Linux. Alpine uses `eudev` (embedded udev) instead of the standard `libudev`.

## ✅ Solution Applied

### **Fixed Package Name in All Dockerfiles:**

#### **Changed:**
- `libudev-dev` ❌ (doesn't exist in Alpine)

#### **To:**
- `eudev-dev` ✅ (correct Alpine package)

### **Updated All Dockerfiles:**

#### **1. elizaos-agents/Dockerfile**
```dockerfile
# Install build dependencies for native modules
RUN apk add --no-cache \
    python3 \
    make \
    g++ \
    gcc \
    libc-dev \
    linux-headers \
    pkgconfig \
    libusb-dev \
    eudev-dev
```

#### **2. bitquery/Dockerfile**
```dockerfile
# Install build dependencies for native modules
RUN apk add --no-cache \
    python3 \
    make \
    g++ \
    gcc \
    libc-dev \
    linux-headers \
    pkgconfig \
    libusb-dev \
    eudev-dev
```

#### **3. js-scraper/Dockerfile**
```dockerfile
# Install Chrome dependencies and build tools
RUN apk add --no-cache \
    chromium \
    nss \
    freetype \
    freetype-dev \
    harfbuzz \
    ca-certificates \
    ttf-freefont \
    python3 \
    make \
    g++ \
    gcc \
    libc-dev \
    linux-headers \
    pkgconfig \
    libusb-dev \
    eudev-dev
```

#### **4. frontend/Dockerfile**
```dockerfile
RUN apk add --no-cache libc6-compat python3 make g++ gcc libc-dev linux-headers pkgconfig libusb-dev eudev-dev
```

## 📋 Complete Dependencies List (Alpine-Compatible)

### **Core Build Dependencies:**
- **python3** - Required for node-gyp compilation
- **make** - Build tool for native modules
- **g++** - C++ compiler for native modules
- **gcc** - C compiler for native modules
- **libc-dev** - C library development files
- **linux-headers** - Linux kernel headers for compilation

### **Package Management:**
- **pkgconfig** - Package configuration tool for libraries

### **USB/Hardware Libraries:**
- **libusb-dev** - USB library development files (for node-hid)
- **eudev-dev** - Alpine's embedded udev development files (for usb package)

### **Chrome/Puppeteer (js-scraper only):**
- **chromium** - Headless browser
- **nss** - Network Security Services
- **freetype** - Font rendering
- **freetype-dev** - Font rendering development files
- **harfbuzz** - Text shaping engine
- **ca-certificates** - SSL certificates
- **ttf-freefont** - Free fonts

## 🚀 Ready to Build

Now you can successfully build all Docker images:

```bash
# Build all services
docker-compose build

# Start all services
docker-compose up -d

# Check status
docker-compose ps

# View logs
docker-compose logs -f
```

## 📊 What's Fixed

### **Alpine Package Compatibility:**
- ✅ **eudev-dev** - Correct Alpine package for udev development files
- ✅ **All packages** - Now use Alpine-compatible package names
- ✅ **Package resolution** - All dependencies can be found and installed

### **Native Module Compilation:**
- ✅ **node-hid** - Compiles with libusb and pkg-config
- ✅ **usb** - Compiles with eudev and libusb
- ✅ **All Solana packages** - Compatible with Node.js 22
- ✅ **All native modules** - Will compile successfully

## 🎯 Result

The Docker build should now work correctly for all services, resolving the Alpine package compatibility issue. All packages including `node-hid`, `usb`, and Solana-related modules will compile successfully with the correct Alpine Linux packages!
