# 🗄️ Supabase Database Setup Guide for Wojat Platform

This guide will help you set up your Supabase database to store all TikTok, Telegram, Bitquery, and AI agent data for the Wojat memecoin hunting platform.

## 📋 Prerequisites

- Supabase account and project
- Access to Supabase SQL Editor
- Basic understanding of SQL

## 🚀 Quick Setup (Recommended for Testing)

### Step 1: Run Quick Setup Schema

1. **Open Supabase SQL Editor**
2. **Copy and paste** the contents of `quick_setup_schema.sql`
3. **Click "Run"** to execute the schema

This creates the essential tables needed to get started:
- `tokens` - Memecoin data
- `tiktoks` - TikTok video data
- `telegram_channels` - Telegram channel info
- `telegram_messages` - Telegram message data
- `prices` - Token price data
- `mentions` - Cross-platform token mentions

### Step 2: Verify Setup

Run this query to verify your tables were created:

```sql
SELECT table_name, column_name, data_type 
FROM information_schema.columns 
WHERE table_name IN ('tokens', 'tiktoks', 'telegram_channels', 'telegram_messages', 'prices', 'mentions')
ORDER BY table_name, ordinal_position;
```

## 🏗️ Complete Setup (Production Ready)

### Step 1: Run Complete Schema

1. **Open Supabase SQL Editor**
2. **Copy and paste** the contents of `complete_supabase_schema.sql`
3. **Click "Run"** to execute the complete schema

This creates all tables including:
- AI agent conversations and recommendations
- Pattern analysis and trending keywords
- Twitter integration tables
- User profiles and trading history
- System monitoring and logs

### Step 2: Verify Complete Setup

Run this query to see all created tables:

```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_type = 'BASE TABLE'
ORDER BY table_name;
```

## 📊 Database Schema Overview

### Core Tables

| Table | Purpose | Key Fields |
|-------|---------|------------|
| `tokens` | Memecoin data | `uri`, `name`, `symbol`, `address`, `market_cap` |
| `tiktoks` | TikTok videos | `id`, `username`, `url`, `views`, `comments`, `hashtags` |
| `telegram_channels` | Telegram channels | `username`, `display_name`, `enabled` |
| `telegram_messages` | Telegram messages | `channel_id`, `message_id`, `text`, `date` |
| `prices` | Token prices | `token_uri`, `price_usd`, `price_sol`, `is_latest` |
| `mentions` | Token mentions | `token_id`, `tiktok_id`, `source`, `count` |

### AI & Analysis Tables

| Table | Purpose | Key Fields |
|-------|---------|------------|
| `ai_conversations` | AI chat data | `user_id`, `content`, `agent_name`, `confidence` |
| `ai_recommendations` | AI recommendations | `recommendation_type`, `title`, `content`, `priority` |
| `pattern_analysis_results` | Analysis results | `analysis_type`, `summary`, `correlations` |
| `trending_keywords` | Trending keywords | `keyword`, `platform`, `frequency`, `trend_score` |

### User & System Tables

| Table | Purpose | Key Fields |
|-------|---------|------------|
| `user_profiles` | User data | `user_id`, `preferences`, `trading_experience` |
| `user_trading_history` | Trading history | `user_id`, `token_uri`, `action`, `amount` |
| `system_logs` | System logs | `level`, `component`, `message`, `timestamp` |

## 🔧 Configuration

### Environment Variables

Make sure your `.env` files have the correct Supabase credentials:

```env
# Supabase Configuration
SUPABASE_URL=your_supabase_project_url
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

### Row Level Security (RLS)

The schema includes RLS policies for security. You may need to adjust these based on your requirements:

```sql
-- Example: Allow public read access to tokens
CREATE POLICY "Public read access" ON tokens FOR SELECT USING (true);

-- Example: Restrict user data to specific users
CREATE POLICY "User data access" ON user_profiles 
FOR ALL USING (auth.uid()::text = user_id);
```

## 🧪 Testing Your Setup

### Test 1: Insert Sample Data

```sql
-- Insert a sample token
INSERT INTO tokens (uri, name, symbol, address) 
VALUES ('https://example.com/token1', 'Test Token', 'TEST', 'test_address_123');

-- Insert a sample TikTok video
INSERT INTO tiktoks (id, username, url, views, comments) 
VALUES ('1234567890', 'test_user', 'https://tiktok.com/@test_user/video/1234567890', 1000, 50);

-- Insert a sample mention
INSERT INTO mentions (tiktok_id, token_id, count, source) 
VALUES ('1234567890', 1, 1, 'tiktok');
```

### Test 2: Query Data

```sql
-- Get all tokens with their mention counts
SELECT t.name, t.symbol, COUNT(m.id) as mention_count
FROM tokens t
LEFT JOIN mentions m ON t.id = m.token_id
GROUP BY t.id, t.name, t.symbol;

-- Get trending TikTok videos
SELECT username, url, views, comments, created_at
FROM tiktoks
ORDER BY views DESC
LIMIT 10;
```

## 🔄 Data Flow

### TikTok Scraper → Database
```
TikTok Scraper → tiktoks table → mentions table
```

### Telegram Scraper → Database
```
Telegram Scraper → telegram_channels table → telegram_messages table → mentions table
```

### Bitquery → Database
```
Bitquery API → tokens table → prices table
```

### AI Agents → Database
```
AI Agents → ai_conversations table → ai_recommendations table
```

## 🛠️ Maintenance

### Regular Cleanup

The schema includes a cleanup function:

```sql
-- Run cleanup to remove old data
SELECT cleanup_old_data();
```

### Update Latest Prices

```sql
-- Update is_latest flags for prices
SELECT update_latest_prices();
```

### Update Token Mention Counts

```sql
-- Update mention counts for tokens
SELECT update_token_mention_counts();
```

## 🚨 Troubleshooting

### Common Issues

1. **Permission Denied**: Check RLS policies
2. **Foreign Key Violations**: Ensure referenced records exist
3. **Duplicate Key Errors**: Use UPSERT operations
4. **Performance Issues**: Check indexes are created

### Debug Queries

```sql
-- Check table sizes
SELECT schemaname, tablename, attname, n_distinct, correlation 
FROM pg_stats 
WHERE schemaname = 'public';

-- Check index usage
SELECT schemaname, tablename, indexname, idx_scan, idx_tup_read, idx_tup_fetch
FROM pg_stat_user_indexes 
WHERE schemaname = 'public';
```

## 📈 Performance Optimization

### Recommended Indexes

The schema includes comprehensive indexing, but you may want to add more based on your query patterns:

```sql
-- Example: Add composite index for common queries
CREATE INDEX idx_mentions_token_source_date 
ON mentions(token_id, source, mention_at);

-- Example: Add partial index for active records
CREATE INDEX idx_tokens_active 
ON tokens(created_at) 
WHERE market_cap > 0;
```

### Query Optimization

- Use `EXPLAIN ANALYZE` to analyze query performance
- Consider partitioning for large tables
- Use materialized views for complex aggregations

## 🔐 Security Best Practices

1. **Use RLS**: Enable Row Level Security on all tables
2. **Limit Permissions**: Grant minimal required permissions
3. **Use Service Role**: Use service role key for server-side operations
4. **Audit Logs**: Monitor system_logs table for suspicious activity
5. **Data Encryption**: Consider encrypting sensitive data

## 📞 Support

If you encounter issues:

1. Check the system_logs table for error messages
2. Verify your environment variables are correct
3. Ensure all required tables exist
4. Check foreign key relationships
5. Review RLS policies

## 🎉 Next Steps

Once your database is set up:

1. **Configure your scrapers** to use the database
2. **Set up monitoring** using the system_logs table
3. **Test data flow** from all components
4. **Configure AI agents** to store conversations
5. **Set up alerts** for important events

Your Wojat platform database is now ready to store and analyze memecoin data from TikTok, Telegram, Bitquery, and AI agents! 🚀

