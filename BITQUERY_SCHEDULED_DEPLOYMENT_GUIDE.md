# Wojat Bitquery Scheduled Service - Ubuntu Deployment Guide

## 🎯 Overview

This guide shows how to deploy the Wojat Bitquery service on Ubuntu with automatic scheduling to run every 24 hours using Docker.

## 📋 Prerequisites

- Ubuntu 20.04+ server
- Docker and Docker Compose installed
- Root or sudo access
- Wojat project deployed

## 🚀 Quick Setup

### 1. Build and Start the Scheduled Service

```bash
# Build the Bitquery scheduled service
docker-compose build bitquery

# Start the scheduled service
docker-compose up -d bitquery

# Check status
docker-compose ps bitquery
```

### 2. Verify the Service is Running

```bash
# Check container status
docker-compose ps bitquery

# View logs
docker-compose logs bitquery

# Check cron schedule
docker-compose exec bitquery crontab -l
```

## ⏰ Scheduling Details

### Cron Schedule
- **Frequency**: Every 12 hours
- **Times**: 2:00 AM and 2:00 PM UTC
- **Command**: `cd /app && node index.mjs`
- **Logs**: Written to `/var/log/bitquery-cron.log`

### Time Zone Considerations
The service runs on UTC time. To adjust for your timezone:

```bash
# Example: Run at 2 AM and 2 PM local time (adjust TZ as needed)
# For EST (UTC-5): Run at 7 AM and 7 PM UTC
# For PST (UTC-8): Run at 10 AM and 10 PM UTC

# Edit the Dockerfile.scheduled and change:
# FROM: "0 2,14 * * *" 
# TO: "0 7,19 * * *" (for EST) or "0 10,22 * * *" (for PST)
```

## 🛠️ Management Commands

### Using the Management Script

```bash
# Make script executable (Linux)
chmod +x manage-bitquery.sh

# Start service
./manage-bitquery.sh start

# Check status
./manage-bitquery.sh status

# View logs
./manage-bitquery.sh logs

# Run immediately (manual)
./manage-bitquery.sh run-now

# Stop service
./manage-bitquery.sh stop
```

### Using Docker Compose Directly

```bash
# Start scheduled service
docker-compose up -d bitquery

# Stop service
docker-compose stop bitquery

# Restart service
docker-compose restart bitquery

# View logs
docker-compose logs -f bitquery

# Run manually
docker-compose exec bitquery node index.mjs

# Check cron logs
docker-compose exec bitquery tail -f /var/log/bitquery-cron.log
```

## 📊 Monitoring and Logs

### Log Locations
- **Container logs**: `docker-compose logs bitquery`
- **Cron job logs**: `/var/log/bitquery-cron.log` (inside container)
- **Application logs**: Standard output from `node index.mjs`

### Monitoring Commands

```bash
# View recent cron logs
docker-compose exec bitquery tail -20 /var/log/bitquery-cron.log

# Follow logs in real-time
docker-compose logs -f bitquery

# Check if cron is running
docker-compose exec bitquery ps aux | grep cron

# Verify cron schedule
docker-compose exec bitquery crontab -l
```

## 🔧 Configuration

### Environment Variables
Ensure your `.env` file contains:

```env
# Supabase Configuration
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_SECRET=your_supabase_key

# Bitquery API Configuration
BITQUERY_API_KEY=your_bitquery_api_key
ACCESS_TOKEN=your_bitquery_access_token

# Other required variables...
```

### Customizing the Schedule

To change the schedule, edit `bitquery/Dockerfile.scheduled`:

```dockerfile
# Change this line to modify schedule:
RUN echo "0 2 * * * cd /app && /bin/bash -c 'echo \"[$(date)] Starting scheduled Bitquery run...\" >> /var/log/bitquery-cron.log && node index.mjs >> /var/log/bitquery-cron.log 2>&1 && echo \"[$(date)] Bitquery run completed\" >> /var/log/bitquery-cron.log'" | crontab -

# Examples:
# Every 12 hours: "0 */12 * * *"
# Every 6 hours: "0 */6 * * *"
# Daily at 3 AM: "0 3 * * *"
# Every Monday at 2 AM: "0 2 * * 1"
```

## 🚨 Troubleshooting

### Common Issues

**1. Service not starting**
```bash
# Check Docker status
docker-compose ps

# Check logs
docker-compose logs bitquery

# Rebuild if needed
docker-compose build bitquery
```

**2. Cron not running**
```bash
# Check if cron daemon is running
docker-compose exec bitquery ps aux | grep cron

# Restart container
docker-compose restart bitquery
```

**3. Permission issues**
```bash
# Check file permissions
docker-compose exec bitquery ls -la /app

# Check log directory permissions
docker-compose exec bitquery ls -la /var/log
```

**4. Database connection issues**
```bash
# Test database connection
docker-compose exec bitquery node -e "
const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_SECRET);
console.log('Database connection test:', supabase ? 'OK' : 'FAILED');
"
```

### Manual Testing

```bash
# Test the Bitquery script manually
docker-compose exec bitquery node index.mjs

# Test with verbose output
docker-compose exec bitquery node index.mjs --verbose

# Check environment variables
docker-compose exec bitquery env | grep -E "(SUPABASE|BITQUERY)"
```

## 📈 Performance Monitoring

### Resource Usage
```bash
# Monitor container resources
docker stats bitquery

# Check disk usage
docker-compose exec bitquery df -h

# Monitor memory usage
docker-compose exec bitquery free -h
```

### Log Analysis
```bash
# Count successful runs
docker-compose exec bitquery grep "Bitquery run completed" /var/log/bitquery-cron.log | wc -l

# Check for errors
docker-compose exec bitquery grep -i error /var/log/bitquery-cron.log

# View last run details
docker-compose exec bitquery tail -50 /var/log/bitquery-cron.log
```

## 🔄 Maintenance

### Regular Maintenance Tasks

**1. Log Rotation**
```bash
# Create log rotation script
cat > /opt/wojat/rotate-bitquery-logs.sh << 'EOF'
#!/bin/bash
# Rotate logs older than 30 days
docker-compose exec bitquery find /var/log -name "*.log" -mtime +30 -delete
EOF

chmod +x /opt/wojat/rotate-bitquery-logs.sh

# Add to crontab (run weekly)
echo "0 0 * * 0 /opt/wojat/rotate-bitquery-logs.sh" | crontab -
```

**2. Health Checks**
```bash
# Create health check script
cat > /opt/wojat/bitquery-health-check.sh << 'EOF'
#!/bin/bash
if ! docker-compose ps bitquery | grep -q "Up"; then
    echo "Bitquery service is down, restarting..."
    docker-compose restart bitquery
fi
EOF

chmod +x /opt/wojat/bitquery-health-check.sh

# Add to crontab (check every hour)
echo "0 * * * * /opt/wojat/bitquery-health-check.sh" | crontab -
```

## 🎉 Success Indicators

Your Bitquery service is working correctly when:

- ✅ Container shows "Up" status
- ✅ Cron schedule is active (`crontab -l` shows the job)
- ✅ Logs show successful data collection
- ✅ Database contains fresh token data
- ✅ No error messages in logs

## 📞 Support

If you encounter issues:

1. Check the logs: `./manage-bitquery.sh logs`
2. Verify environment variables
3. Test manual run: `./manage-bitquery.sh run-now`
4. Check Docker and Docker Compose status
5. Review this troubleshooting guide

The service is now configured to automatically collect memecoin data every 24 hours! 🚀

