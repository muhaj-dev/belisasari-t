# Docker Deployment Troubleshooting Guide

## 🐳 Common Docker Build Issues

### Issue 1: `npm ci` fails with "package-lock.json not found"

**Error:**
```
npm error The `npm ci` command can only install with an existing package-lock.json
```

**Solution:**
The Dockerfiles have been updated to handle both `yarn.lock` and `package-lock.json` files. The build process now:
1. Uses `yarn install --frozen-lockfile --production` if `yarn.lock` exists
2. Uses `npm ci --omit=dev` if `package-lock.json` exists
3. Falls back to `npm install --omit=dev` if neither exists

### Issue 2: Chrome/Chromium dependencies missing

**Error:**
```
Could not find browser (chrome) at /usr/bin/chromium-browser
```

**Solution:**
The `js-scraper/Dockerfile` includes Chrome dependencies:
```dockerfile
RUN apk add --no-cache \
    chromium \
    nss \
    freetype \
    freetype-dev \
    harfbuzz \
    ca-certificates \
    ttf-freefont
```

### Issue 3: Environment variables not loaded

**Error:**
```
Environment variables not found
```

**Solution:**
Ensure your `.env` file exists in the root directory and contains all required variables. The `docker-compose.yml` file includes:
```yaml
env_file:
  - .env
```

### Issue 4: Port conflicts

**Error:**
```
Port 3000 is already in use
```

**Solution:**
1. Check what's using the port: `docker ps` or `lsof -i :3000`
2. Stop conflicting containers: `docker stop <container-name>`
3. Or change the port mapping in `docker-compose.yml`

### Issue 5: Permission denied errors

**Error:**
```
Permission denied: /app/node_modules
```

**Solution:**
The Dockerfiles create non-root users and set proper ownership:
```dockerfile
RUN addgroup -g 1001 -S nodejs
RUN adduser -S serviceuser -u 1001
RUN chown -R serviceuser:nodejs /app
USER serviceuser
```

## 🔧 Docker Commands

### Build and Start Services
```bash
# Build all services
docker-compose build

# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop all services
docker-compose down
```

### Individual Service Management
```bash
# Build specific service
docker-compose build frontend

# Start specific service
docker-compose up -d frontend

# View logs for specific service
docker-compose logs -f frontend

# Restart specific service
docker-compose restart frontend
```

### Debugging Commands
```bash
# Check running containers
docker ps

# Check container logs
docker logs <container-name>

# Execute command in running container
docker exec -it <container-name> /bin/sh

# Check container resource usage
docker stats

# Remove all containers and images
docker system prune -a
```

## 🚀 Alternative Deployment Methods

### Method 1: Direct Docker Build
```bash
# Build individual services
docker build -t wojat-frontend ./frontend
docker build -t wojat-elizaos ./elizaos-agents
docker build -t wojat-bitquery ./bitquery
docker build -t wojat-scraper ./js-scraper

# Run services individually
docker run -d --name wojat-frontend -p 3000:3000 --env-file .env wojat-frontend
docker run -d --name wojat-elizaos --env-file .env wojat-elizaos
docker run -d --name wojat-bitquery --env-file .env wojat-bitquery
docker run -d --name wojat-scraper --env-file .env wojat-scraper
```

### Method 2: Ubuntu Server Deployment (Recommended)
```bash
# Use the Ubuntu deployment script instead of Docker
sudo ./deploy-ubuntu.sh
```

### Method 3: Manual Ubuntu Setup
```bash
# Follow the UBUNTU_DEPLOYMENT_GUIDE.md
# This method doesn't require Docker
```

## 🔍 Health Checks

### Check Service Health
```bash
# Frontend health check
curl http://localhost:3000/api/health

# Check all containers
docker-compose ps

# Check container logs
docker-compose logs --tail=50
```

### Expected Health Response
```json
{
  "status": "healthy",
  "message": "Wojat Platform is running",
  "timestamp": "2025-01-15T10:00:00.000Z",
  "services": {
    "frontend": "running",
    "environment": "complete"
  },
  "version": "1.0.0"
}
```

## 📊 Monitoring

### Resource Usage
```bash
# Monitor container resources
docker stats

# Check disk usage
docker system df

# Check container sizes
docker images --format "table {{.Repository}}\t{{.Tag}}\t{{.Size}}"
```

### Log Management
```bash
# Follow all logs
docker-compose logs -f

# Follow specific service logs
docker-compose logs -f frontend

# Save logs to file
docker-compose logs > wojat-logs.txt
```

## 🛠️ Development vs Production

### Development
```bash
# Use development mode
docker-compose -f docker-compose.yml -f docker-compose.dev.yml up
```

### Production
```bash
# Use production mode (default)
docker-compose up -d
```

## 🔄 Updates and Maintenance

### Update Services
```bash
# Pull latest changes
git pull

# Rebuild and restart
docker-compose down
docker-compose build
docker-compose up -d
```

### Clean Up
```bash
# Remove unused containers
docker container prune

# Remove unused images
docker image prune

# Remove unused volumes
docker volume prune

# Full cleanup
docker system prune -a
```

## 📞 Getting Help

### Debug Steps
1. Check container logs: `docker-compose logs -f`
2. Verify environment variables: `docker exec -it <container> env`
3. Check service health: `curl http://localhost:3000/api/health`
4. Verify network connectivity: `docker network ls`

### Common Solutions
- **Build fails**: Check if all required files exist
- **Service won't start**: Check environment variables and logs
- **Port conflicts**: Change port mappings or stop conflicting services
- **Permission issues**: Ensure proper user permissions in Dockerfiles

---

## 🎉 Success Indicators

Your Wojat Platform is successfully deployed when:
- ✅ All containers are running: `docker-compose ps`
- ✅ Frontend is accessible: `http://localhost:3000`
- ✅ Health check passes: `curl http://localhost:3000/api/health`
- ✅ All services show "healthy" status
- ✅ No error messages in logs: `docker-compose logs`
