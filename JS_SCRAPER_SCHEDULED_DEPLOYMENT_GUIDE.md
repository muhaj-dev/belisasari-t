# Wojat JS Scraper Scheduled Service - Ubuntu Deployment Guide

## 🎯 Overview

This guide shows how to deploy the Wojat JS Scraper service on Ubuntu with automatic scheduling to run TikTok, Telegram, and Outlight scrapers every 3 hours using Docker.

## 📋 Prerequisites

- Ubuntu 20.04+ server
- Docker and Docker Compose installed
- Root or sudo access
- Wojat project deployed
- Chrome/Chromium dependencies (handled by Dockerfile)

## 🚀 Quick Setup

### 1. Build and Start the Scheduled Service

```bash
# Build the JS Scraper scheduled service
docker-compose build js-scraper

# Start the scheduled service
docker-compose up -d js-scraper

# Check status
docker-compose ps js-scraper
```

### 2. Verify the Service is Running

```bash
# Check container status
docker-compose ps js-scraper

# View logs
docker-compose logs js-scraper

# Check cron schedule
docker-compose exec js-scraper crontab -l
```

## ⏰ Scheduling Details

### Cron Schedule
- **TikTok Scraper**: Every 3 hours at :00 minutes (0, 3, 6, 9, 12, 15, 18, 21)
- **Telegram Scraper**: Every 3 hours at :20 minutes (0:20, 3:20, 6:20, etc.)
- **Outlight Scraper**: Every 3 hours at :40 minutes (0:40, 3:40, 6:40, etc.)
- **Logs**: Written to `/var/log/scraper-cron.log`

### Time Zone Considerations
The service runs on UTC time. To adjust for your timezone:

```bash
# Example: Run at 3 AM local time (adjust TZ as needed)
# For EST (UTC-5): Run at 8 AM UTC
# For PST (UTC-8): Run at 11 AM UTC

# Edit the Dockerfile.scheduled and change the cron times:
# FROM: "0 */3 * * *" 
# TO: "0 8,11,14,17,20,23 * * *" (for EST) or "0 11,14,17,20,23,2 * * *" (for PST)
```

## 🛠️ Management Commands

### Using the Management Script

```bash
# Make script executable (Linux)
chmod +x manage-js-scraper.sh

# Start service
./manage-js-scraper.sh start

# Check status
./manage-js-scraper.sh status

# View logs
./manage-js-scraper.sh logs

# Run individual scrapers immediately
./manage-js-scraper.sh run-tiktok
./manage-js-scraper.sh run-telegram
./manage-js-scraper.sh run-outlight

# Run all scrapers immediately
./manage-js-scraper.sh run-all

# Stop service
./manage-js-scraper.sh stop
```

### Using Docker Compose Directly

```bash
# Start scheduled service
docker-compose up -d js-scraper

# Stop service
docker-compose stop js-scraper

# Restart service
docker-compose restart js-scraper

# View logs
docker-compose logs -f js-scraper

# Run scrapers manually
docker-compose exec js-scraper yarn scrape-tiktok
docker-compose exec js-scraper yarn scrape-telegram
docker-compose exec js-scraper yarn scrape-outlight

# Check cron logs
docker-compose exec js-scraper tail -f /var/log/scraper-cron.log
```

## 📊 Monitoring and Logs

### Log Locations
- **Container logs**: `docker-compose logs js-scraper`
- **Cron job logs**: `/var/log/scraper-cron.log` (inside container)
- **Application logs**: Standard output from each scraper

### Monitoring Commands

```bash
# View recent cron logs
docker-compose exec js-scraper tail -20 /var/log/scraper-cron.log

# Follow logs in real-time
docker-compose logs -f js-scraper

# Check if cron is running
docker-compose exec js-scraper ps aux | grep cron

# Verify cron schedule
docker-compose exec js-scraper crontab -l

# Check individual scraper status
docker-compose exec js-scraper yarn scrape-tiktok --dry-run
```

## 🔧 Configuration

### Environment Variables
Ensure your `.env` file contains:

```env
# Supabase Configuration
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_SECRET=your_supabase_key

# TikTok Scraper Configuration
TIKTOK_API_KEY=your_tiktok_api_key
TIKTOK_ACCESS_TOKEN=your_tiktok_access_token

# Telegram Scraper Configuration
TELEGRAM_BOT_TOKEN=your_telegram_bot_token
TELEGRAM_CHANNEL_ID=your_telegram_channel_id

# Outlight Scraper Configuration
OUTLIGHT_API_KEY=your_outlight_api_key
OUTLIGHT_ACCESS_TOKEN=your_outlight_access_token

# Other required variables...
```

### Customizing the Schedule

To change the schedule, edit `js-scraper/Dockerfile.scheduled`:

```dockerfile
# Change these lines to modify schedule:

# TikTok scraper (currently every 3 hours at :00)
RUN echo "0 */3 * * * cd /app && /bin/bash -c 'echo \"[$(date)] Starting TikTok scraper...\" >> /var/log/scraper-cron.log && yarn scrape-tiktok >> /var/log/scraper-cron.log 2>&1 && echo \"[$(date)] TikTok scraper completed\" >> /var/log/scraper-cron.log'" | crontab -

# Telegram scraper (currently every 3 hours at :20)
RUN echo "20 */3 * * * cd /app && /bin/bash -c 'echo \"[$(date)] Starting Telegram scraper...\" >> /var/log/scraper-cron.log && yarn scrape-telegram >> /var/log/scraper-cron.log 2>&1 && echo \"[$(date)] Telegram scraper completed\" >> /var/log/scraper-cron.log'" | crontab -

# Outlight scraper (currently every 3 hours at :40)
RUN echo "40 */3 * * * cd /app && /bin/bash -c 'echo \"[$(date)] Starting Outlight scraper...\" >> /var/log/scraper-cron.log && yarn scrape-outlight >> /var/log/scraper-cron.log 2>&1 && echo \"[$(date)] Outlight scraper completed\" >> /var/log/scraper-cron.log'" | crontab -

# Examples:
# Every 2 hours: "0 */2 * * *"
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
docker-compose logs js-scraper

# Rebuild if needed
docker-compose build js-scraper
```

**2. Cron not running**
```bash
# Check if cron daemon is running
docker-compose exec js-scraper ps aux | grep cron

# Restart container
docker-compose restart js-scraper
```

**3. Chrome/Puppeteer issues**
```bash
# Check Chrome installation
docker-compose exec js-scraper which chromium-browser

# Test Puppeteer
docker-compose exec js-scraper node -e "console.log(require('puppeteer').executablePath())"

# Check Chrome dependencies
docker-compose exec js-scraper ldd /usr/bin/chromium-browser
```

**4. Database connection issues**
```bash
# Test database connection
docker-compose exec js-scraper node -e "
const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_SECRET);
console.log('Database connection test:', supabase ? 'OK' : 'FAILED');
"
```

**5. Scraper-specific issues**
```bash
# Test TikTok scraper
docker-compose exec js-scraper yarn scrape-tiktok --test

# Test Telegram scraper
docker-compose exec js-scraper yarn scrape-telegram --test

# Test Outlight scraper
docker-compose exec js-scraper yarn scrape-outlight --test
```

### Manual Testing

```bash
# Test individual scrapers manually
docker-compose exec js-scraper yarn scrape-tiktok
docker-compose exec js-scraper yarn scrape-telegram
docker-compose exec js-scraper yarn scrape-outlight

# Test with verbose output
docker-compose exec js-scraper yarn scrape-tiktok --verbose

# Check environment variables
docker-compose exec js-scraper env | grep -E "(TIKTOK|TELEGRAM|OUTLIGHT|SUPABASE)"
```

## 📈 Performance Monitoring

### Resource Usage
```bash
# Monitor container resources
docker stats js-scraper

# Check disk usage
docker-compose exec js-scraper df -h

# Monitor memory usage
docker-compose exec js-scraper free -h
```

### Log Analysis
```bash
# Count successful runs
docker-compose exec js-scraper grep "scraper completed" /var/log/scraper-cron.log | wc -l

# Check for errors
docker-compose exec js-scraper grep -i error /var/log/scraper-cron.log

# View last run details
docker-compose exec js-scraper tail -50 /var/log/scraper-cron.log

# Check specific scraper logs
docker-compose exec js-scraper grep "TikTok scraper" /var/log/scraper-cron.log
docker-compose exec js-scraper grep "Telegram scraper" /var/log/scraper-cron.log
docker-compose exec js-scraper grep "Outlight scraper" /var/log/scraper-cron.log
```

## 🔄 Maintenance

### Regular Maintenance Tasks

**1. Log Rotation**
```bash
# Create log rotation script
cat > /opt/wojat/rotate-scraper-logs.sh << 'EOF'
#!/bin/bash
# Rotate logs older than 30 days
docker-compose exec js-scraper find /var/log -name "*.log" -mtime +30 -delete
EOF

chmod +x /opt/wojat/rotate-scraper-logs.sh

# Add to crontab (run weekly)
echo "0 0 * * 0 /opt/wojat/rotate-scraper-logs.sh" | crontab -
```

**2. Health Checks**
```bash
# Create health check script
cat > /opt/wojat/scraper-health-check.sh << 'EOF'
#!/bin/bash
if ! docker-compose ps js-scraper | grep -q "Up"; then
    echo "JS Scraper service is down, restarting..."
    docker-compose restart js-scraper
fi
EOF

chmod +x /opt/wojat/scraper-health-check.sh

# Add to crontab (check every hour)
echo "0 * * * * /opt/wojat/scraper-health-check.sh" | crontab -
```

**3. Data Quality Checks**
```bash
# Create data quality check script
cat > /opt/wojat/scraper-data-check.sh << 'EOF'
#!/bin/bash
# Check if scrapers are collecting data
TIKTOK_COUNT=$(docker-compose exec js-scraper node -e "
const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_SECRET);
supabase.from('tiktoks').select('count').then(({data}) => console.log(data?.length || 0));
" 2>/dev/null)

TELEGRAM_COUNT=$(docker-compose exec js-scraper node -e "
const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_SECRET);
supabase.from('telegram_messages').select('count').then(({data}) => console.log(data?.length || 0));
" 2>/dev/null)

echo "TikTok records: $TIKTOK_COUNT"
echo "Telegram records: $TELEGRAM_COUNT"
EOF

chmod +x /opt/wojat/scraper-data-check.sh
```

## 🎉 Success Indicators

Your JS Scraper service is working correctly when:

- ✅ Container shows "Up" status
- ✅ Cron schedule is active (`crontab -l` shows all 3 jobs)
- ✅ Logs show successful scraper runs
- ✅ Database contains fresh TikTok, Telegram, and Outlight data
- ✅ No error messages in logs
- ✅ All three scrapers run at their scheduled times

## 📞 Support

If you encounter issues:

1. Check the logs: `./manage-js-scraper.sh logs`
2. Verify environment variables
3. Test manual runs: `./manage-js-scraper.sh run-all`
4. Check Docker and Docker Compose status
5. Review this troubleshooting guide

The JS Scraper service is now configured to automatically collect data from TikTok, Telegram, and Outlight every 3 hours! 🚀
