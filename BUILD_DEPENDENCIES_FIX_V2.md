# Docker Build Dependencies Fix - Additional Libraries

## 🔧 Issue Fixed

### **Problem:**
Docker build was failing with the error:
```
/bin/sh: pkg-config: not found
fatal error: libusb.h: No such file or directory
```

### **Root Cause:**
The `node-hid` package requires additional system libraries (`libusb` and `pkg-config`) that weren't installed in the Alpine Linux Docker images.

## ✅ Solution Applied

### **Added Additional Dependencies to All Dockerfiles:**

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
    libusb-dev
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
    libusb-dev
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
    libusb-dev
```

#### **4. frontend/Dockerfile**
```dockerfile
RUN apk add --no-cache libc6-compat python3 make g++ gcc libc-dev linux-headers pkgconfig libusb-dev
```

### **Additional Dependencies Added:**
- **pkgconfig** - Package configuration tool for libraries
- **libusb-dev** - USB library development files (required by node-hid)

### **Complete Build Dependencies List:**
- **python3** - Required for node-gyp
- **make** - Build tool
- **g++** - C++ compiler
- **gcc** - C compiler
- **libc-dev** - C library development files
- **linux-headers** - Linux kernel headers
- **pkgconfig** - Package configuration tool
- **libusb-dev** - USB library development files

## 🚀 Ready to Build

Now you can successfully build the Docker images:

```bash
# Build all services
docker-compose build

# Or build individual services
docker-compose build elizaos-agents
docker-compose build bitquery
docker-compose build js-scraper
docker-compose build frontend
```

## 📋 What's Fixed

### **Native Module Compilation:**
- ✅ **node-hid** - Can now compile with libusb and pkg-config
- ✅ **pkg-config** - Available for library configuration
- ✅ **libusb** - USB library available for hardware access
- ✅ **All native modules** - Will compile successfully

### **Build Process:**
- ✅ **Python available** - For node-gyp compilation
- ✅ **Build tools** - make, gcc, g++ for native modules
- ✅ **Development headers** - For C/C++ compilation
- ✅ **Library dependencies** - pkg-config and libusb-dev
- ✅ **All services** - Ready for production builds

## 🎯 Result

The Docker build should now work correctly for all services, resolving the libusb and pkg-config dependency issues. The `node-hid` package and other native dependencies will compile successfully with all required system libraries!
