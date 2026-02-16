-- =====================================================
-- IRIS MEMECOIN HUNTING PLATFORM - COMPLETE SUPABASE SCHEMA
-- =====================================================
-- This comprehensive schema supports:
-- - TikTok Scraper (videos, comments, hashtags)
-- - Telegram Scraper (channels, messages, media)
-- - Bitquery Integration (tokens, prices, market data)
-- - Pattern Analysis (correlations, trending keywords)
-- - Twitter Integration (alerts, mentions)
-- - ElizaOS AI Agents (conversations, recommendations)
-- =====================================================

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";
CREATE EXTENSION IF NOT EXISTS "btree_gin";

-- =====================================================
-- CORE TOKEN TABLES
-- =====================================================

-- Tokens table - stores all discovered memecoins
CREATE TABLE IF NOT EXISTS tokens (
    id SERIAL PRIMARY KEY,
    uri TEXT UNIQUE NOT NULL,
    name TEXT,
    symbol TEXT,
    description TEXT,
    image_url TEXT,
    address TEXT, -- Solana token address
    create_tx TEXT, -- Transaction signature that created the token
    market_cap DECIMAL(20,2),
    total_supply BIGINT,
    decimals INTEGER DEFAULT 9,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_updated TIMESTAMP WITH TIME ZONE,
    views INTEGER DEFAULT 0,
    mentions INTEGER DEFAULT 0,
    metadata JSONB DEFAULT '{}'::jsonb
);

-- Create indexes for tokens
CREATE INDEX IF NOT EXISTS idx_tokens_uri ON tokens(uri);
CREATE INDEX IF NOT EXISTS idx_tokens_symbol ON tokens(symbol);
CREATE INDEX IF NOT EXISTS idx_tokens_address ON tokens(address);
CREATE INDEX IF NOT EXISTS idx_tokens_create_tx ON tokens(create_tx);
CREATE INDEX IF NOT EXISTS idx_tokens_created_at ON tokens(created_at);
CREATE INDEX IF NOT EXISTS idx_tokens_market_cap ON tokens(market_cap);
CREATE INDEX IF NOT EXISTS idx_tokens_views ON tokens(views);
CREATE INDEX IF NOT EXISTS idx_tokens_mentions ON tokens(mentions);

-- =====================================================
-- TIKTOK SCRAPER TABLES
-- =====================================================

-- TikTok videos table
CREATE TABLE IF NOT EXISTS tiktoks (
    id TEXT PRIMARY KEY,
    username TEXT,
    url TEXT UNIQUE NOT NULL,
    thumbnail TEXT,
    created_at TIMESTAMP WITH TIME ZONE,
    fetched_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    views INTEGER DEFAULT 0,
    comments INTEGER DEFAULT 0,
    likes INTEGER DEFAULT 0,
    shares INTEGER DEFAULT 0,
    description TEXT,
    hashtags TEXT[],
    duration INTEGER, -- Video duration in seconds
    music_title TEXT,
    music_author TEXT,
    metadata JSONB DEFAULT '{}'::jsonb
);

-- Create indexes for tiktoks
CREATE INDEX IF NOT EXISTS idx_tiktoks_username ON tiktoks(username);
CREATE INDEX IF NOT EXISTS idx_tiktoks_created_at ON tiktoks(created_at);
CREATE INDEX IF NOT EXISTS idx_tiktoks_fetched_at ON tiktoks(fetched_at);
CREATE INDEX IF NOT EXISTS idx_tiktoks_views ON tiktoks(views);
CREATE INDEX IF NOT EXISTS idx_tiktoks_comments ON tiktoks(comments);
CREATE INDEX IF NOT EXISTS idx_tiktoks_hashtags ON tiktoks USING GIN(hashtags);
CREATE INDEX IF NOT EXISTS idx_tiktoks_metadata ON tiktoks USING GIN(metadata);

-- TikTok comments table (for detailed comment analysis)
CREATE TABLE IF NOT EXISTS tiktok_comments (
    id SERIAL PRIMARY KEY,
    tiktok_id TEXT REFERENCES tiktoks(id) ON DELETE CASCADE,
    comment_id TEXT UNIQUE NOT NULL,
    author TEXT,
    text TEXT,
    likes INTEGER DEFAULT 0,
    replies INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE,
    scraped_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    sentiment TEXT, -- 'positive', 'negative', 'neutral'
    confidence DECIMAL(3,2), -- 0-1
    metadata JSONB DEFAULT '{}'::jsonb
);

-- Create indexes for tiktok_comments
CREATE INDEX IF NOT EXISTS idx_tiktok_comments_tiktok_id ON tiktok_comments(tiktok_id);
CREATE INDEX IF NOT EXISTS idx_tiktok_comments_created_at ON tiktok_comments(created_at);
CREATE INDEX IF NOT EXISTS idx_tiktok_comments_sentiment ON tiktok_comments(sentiment);
CREATE INDEX IF NOT EXISTS idx_tiktok_comments_text ON tiktok_comments USING GIN(to_tsvector('english', text));

-- =====================================================
-- TELEGRAM SCRAPER TABLES
-- =====================================================

-- Telegram channels table
CREATE TABLE IF NOT EXISTS telegram_channels (
    id SERIAL PRIMARY KEY,
    username TEXT UNIQUE NOT NULL,
    display_name TEXT,
    description TEXT,
    enabled BOOLEAN DEFAULT true,
    last_message_id BIGINT DEFAULT 0,
    scrape_media BOOLEAN DEFAULT false,
    scrape_interval_minutes INTEGER DEFAULT 15,
    subscriber_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    metadata JSONB DEFAULT '{}'::jsonb
);

-- Telegram messages table
CREATE TABLE IF NOT EXISTS telegram_messages (
    id SERIAL PRIMARY KEY,
    channel_id TEXT NOT NULL,
    channel_title TEXT,
    message_id BIGINT NOT NULL,
    text TEXT,
    date BIGINT, -- Unix timestamp
    author_signature TEXT,
    forward_from_chat_id TEXT,
    forward_from_chat_title TEXT,
    forward_from_message_id BIGINT,
    forward_date BIGINT, -- Unix timestamp
    reply_to_message_id BIGINT,
    edit_date BIGINT, -- Unix timestamp
    media_group_id TEXT,
    has_photo BOOLEAN DEFAULT false,
    has_video BOOLEAN DEFAULT false,
    has_document BOOLEAN DEFAULT false,
    has_audio BOOLEAN DEFAULT false,
    has_voice BOOLEAN DEFAULT false,
    has_video_note BOOLEAN DEFAULT false,
    has_sticker BOOLEAN DEFAULT false,
    has_animation BOOLEAN DEFAULT false,
    has_contact BOOLEAN DEFAULT false,
    has_location BOOLEAN DEFAULT false,
    has_venue BOOLEAN DEFAULT false,
    has_poll BOOLEAN DEFAULT false,
    photo_urls TEXT[],
    video_url TEXT,
    document_url TEXT,
    audio_url TEXT,
    voice_url TEXT,
    views INTEGER,
    reactions_count INTEGER,
    entities JSONB,
    caption TEXT,
    scraped_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    raw_data JSONB DEFAULT '{}'::jsonb,
    UNIQUE(channel_id, message_id)
);

-- Create indexes for telegram tables
CREATE INDEX IF NOT EXISTS idx_telegram_channels_username ON telegram_channels(username);
CREATE INDEX IF NOT EXISTS idx_telegram_channels_enabled ON telegram_channels(enabled);
CREATE INDEX IF NOT EXISTS idx_telegram_messages_channel_id ON telegram_messages(channel_id);
CREATE INDEX IF NOT EXISTS idx_telegram_messages_message_id ON telegram_messages(message_id);
CREATE INDEX IF NOT EXISTS idx_telegram_messages_date ON telegram_messages(date);
CREATE INDEX IF NOT EXISTS idx_telegram_messages_scraped_at ON telegram_messages(scraped_at);
CREATE INDEX IF NOT EXISTS idx_telegram_messages_text ON telegram_messages USING GIN(to_tsvector('english', text));
CREATE INDEX IF NOT EXISTS idx_telegram_messages_entities ON telegram_messages USING GIN(entities);

-- =====================================================
-- MENTIONS TABLE (Cross-platform)
-- =====================================================

-- Mentions table - links social media content to tokens
CREATE TABLE IF NOT EXISTS mentions (
    id SERIAL PRIMARY KEY,
    tiktok_id TEXT REFERENCES tiktoks(id) ON DELETE CASCADE,
    telegram_message_id INTEGER REFERENCES telegram_messages(id) ON DELETE CASCADE,
    token_id INTEGER REFERENCES tokens(id) ON DELETE CASCADE,
    count INTEGER DEFAULT 1,
    mention_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    source TEXT DEFAULT 'tiktok', -- 'tiktok', 'telegram', 'twitter', 'discord'
    channel_id TEXT, -- For telegram messages
    message_id BIGINT, -- For telegram messages
    context TEXT, -- Additional context about the mention
    sentiment TEXT, -- 'positive', 'negative', 'neutral'
    confidence DECIMAL(3,2), -- Confidence score 0-1
    metadata JSONB DEFAULT '{}'::jsonb
);

-- Create indexes for mentions
CREATE INDEX IF NOT EXISTS idx_mentions_tiktok_id ON mentions(tiktok_id);
CREATE INDEX IF NOT EXISTS idx_mentions_telegram_message_id ON mentions(telegram_message_id);
CREATE INDEX IF NOT EXISTS idx_mentions_token_id ON mentions(token_id);
CREATE INDEX IF NOT EXISTS idx_mentions_mention_at ON mentions(mention_at);
CREATE INDEX IF NOT EXISTS idx_mentions_source ON mentions(source);
CREATE INDEX IF NOT EXISTS idx_mentions_channel_id ON mentions(channel_id);
CREATE INDEX IF NOT EXISTS idx_mentions_sentiment ON mentions(sentiment);

-- =====================================================
-- MARKET DATA TABLES (Bitquery Integration)
-- =====================================================

-- Prices table - stores token price data
CREATE TABLE IF NOT EXISTS prices (
    id SERIAL PRIMARY KEY,
    token_id INTEGER REFERENCES tokens(id) ON DELETE CASCADE,
    token_uri TEXT REFERENCES tokens(uri) ON DELETE CASCADE,
    price_usd DECIMAL(20,8),
    price_sol DECIMAL(20,8),
    trade_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    timestamp TIMESTAMP WITH TIME ZONE, -- Block timestamp from blockchain
    is_latest BOOLEAN DEFAULT false, -- Flag to mark the latest price for each token
    volume_24h DECIMAL(20,2),
    market_cap DECIMAL(20,2),
    price_change_24h DECIMAL(10,4),
    price_change_7d DECIMAL(10,4),
    price_change_30d DECIMAL(10,4),
    high_24h DECIMAL(20,8),
    low_24h DECIMAL(20,8),
    metadata JSONB DEFAULT '{}'::jsonb
);

-- Create indexes for prices
CREATE INDEX IF NOT EXISTS idx_prices_token_id ON prices(token_id);
CREATE INDEX IF NOT EXISTS idx_prices_token_uri ON prices(token_uri);
CREATE INDEX IF NOT EXISTS idx_prices_timestamp ON prices(timestamp);
CREATE INDEX IF NOT EXISTS idx_prices_trade_at ON prices(trade_at);
CREATE INDEX IF NOT EXISTS idx_prices_is_latest ON prices(is_latest);
CREATE INDEX IF NOT EXISTS idx_prices_volume_24h ON prices(volume_24h);
CREATE INDEX IF NOT EXISTS idx_prices_market_cap ON prices(market_cap);

-- Create unique constraint for upsert operations (full index required for ON CONFLICT)
DROP INDEX IF EXISTS idx_prices_unique_token_timestamp;
CREATE UNIQUE INDEX IF NOT EXISTS idx_prices_unique_token_timestamp 
ON prices(token_uri, timestamp);

-- =====================================================
-- PATTERN ANALYSIS TABLES
-- =====================================================

-- Pattern analysis results table
CREATE TABLE IF NOT EXISTS pattern_analysis_results (
    id SERIAL PRIMARY KEY,
    analysis_type TEXT NOT NULL, -- 'tiktok', 'telegram', 'comprehensive', 'ai_insights'
    platform TEXT NOT NULL, -- 'tiktok', 'telegram', 'combined', 'all'
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    summary JSONB DEFAULT '{}'::jsonb,
    trending_keywords JSONB DEFAULT '[]'::jsonb,
    correlations JSONB DEFAULT '[]'::jsonb,
    recommendations JSONB DEFAULT '[]'::jsonb,
    risk_assessment JSONB DEFAULT '{}'::jsonb,
    market_sentiment JSONB DEFAULT '{}'::jsonb,
    metadata JSONB DEFAULT '{}'::jsonb
);

-- Pattern correlations table
CREATE TABLE IF NOT EXISTS pattern_correlations (
    id SERIAL PRIMARY KEY,
    analysis_id INTEGER REFERENCES pattern_analysis_results(id) ON DELETE CASCADE,
    keyword TEXT NOT NULL,
    token_name TEXT,
    token_symbol TEXT,
    token_uri TEXT,
    correlation_score DECIMAL(5,4), -- -1 to 1
    social_metrics JSONB DEFAULT '{}'::jsonb,
    trading_metrics JSONB DEFAULT '{}'::jsonb,
    risk_level TEXT, -- 'Low', 'Medium', 'High', 'Very High'
    recommendation_text TEXT,
    confidence DECIMAL(3,2), -- 0-1
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Trending keywords table
CREATE TABLE IF NOT EXISTS trending_keywords (
    id SERIAL PRIMARY KEY,
    keyword TEXT NOT NULL,
    platform TEXT NOT NULL, -- 'tiktok', 'telegram', 'combined', 'all'
    frequency INTEGER DEFAULT 1,
    total_mentions INTEGER DEFAULT 1,
    first_seen TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_seen TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    trend_score DECIMAL(5,2), -- Calculated trend score
    sentiment_score DECIMAL(3,2), -- -1 to 1
    volume_24h INTEGER DEFAULT 0,
    metadata JSONB DEFAULT '{}'::jsonb,
    UNIQUE(keyword, platform)
);

-- Create indexes for pattern analysis
CREATE INDEX IF NOT EXISTS idx_pattern_analysis_type ON pattern_analysis_results(analysis_type);
CREATE INDEX IF NOT EXISTS idx_pattern_analysis_platform ON pattern_analysis_results(platform);
CREATE INDEX IF NOT EXISTS idx_pattern_analysis_timestamp ON pattern_analysis_results(timestamp);
CREATE INDEX IF NOT EXISTS idx_pattern_correlations_analysis_id ON pattern_correlations(analysis_id);
CREATE INDEX IF NOT EXISTS idx_pattern_correlations_keyword ON pattern_correlations(keyword);
CREATE INDEX IF NOT EXISTS idx_pattern_correlations_token_uri ON pattern_correlations(token_uri);
CREATE INDEX IF NOT EXISTS idx_pattern_correlations_risk_level ON pattern_correlations(risk_level);
CREATE INDEX IF NOT EXISTS idx_trending_keywords_keyword ON trending_keywords(keyword);
CREATE INDEX IF NOT EXISTS idx_trending_keywords_platform ON trending_keywords(platform);
CREATE INDEX IF NOT EXISTS idx_trending_keywords_trend_score ON trending_keywords(trend_score);
CREATE INDEX IF NOT EXISTS idx_trending_keywords_last_seen ON trending_keywords(last_seen);

-- =====================================================
-- TWITTER INTEGRATION TABLES
-- =====================================================

-- Twitter alerts table
CREATE TABLE IF NOT EXISTS twitter_alerts (
    id SERIAL PRIMARY KEY,
    alert_type TEXT NOT NULL, -- 'trending', 'volume_spike', 'price_alert', 'mention'
    token_uri TEXT REFERENCES tokens(uri) ON DELETE CASCADE,
    token_symbol TEXT,
    data JSONB DEFAULT '{}'::jsonb,
    tweet_id TEXT,
    tweet_url TEXT,
    status TEXT DEFAULT 'pending', -- 'pending', 'posted', 'failed', 'cancelled'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    posted_at TIMESTAMP WITH TIME ZONE,
    metadata JSONB DEFAULT '{}'::jsonb
);

-- Twitter mentions table
CREATE TABLE IF NOT EXISTS twitter_mentions (
    id SERIAL PRIMARY KEY,
    tweet_id TEXT UNIQUE NOT NULL,
    author_username TEXT,
    author_display_name TEXT,
    text TEXT,
    created_at TIMESTAMP WITH TIME ZONE,
    scraped_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    likes INTEGER DEFAULT 0,
    retweets INTEGER DEFAULT 0,
    replies INTEGER DEFAULT 0,
    sentiment TEXT, -- 'positive', 'negative', 'neutral'
    confidence DECIMAL(3,2), -- 0-1
    entities JSONB DEFAULT '{}'::jsonb,
    metadata JSONB DEFAULT '{}'::jsonb
);

-- Create indexes for Twitter tables
CREATE INDEX IF NOT EXISTS idx_twitter_alerts_alert_type ON twitter_alerts(alert_type);
CREATE INDEX IF NOT EXISTS idx_twitter_alerts_token_uri ON twitter_alerts(token_uri);
CREATE INDEX IF NOT EXISTS idx_twitter_alerts_status ON twitter_alerts(status);
CREATE INDEX IF NOT EXISTS idx_twitter_alerts_created_at ON twitter_alerts(created_at);
CREATE INDEX IF NOT EXISTS idx_twitter_mentions_author_username ON twitter_mentions(author_username);
CREATE INDEX IF NOT EXISTS idx_twitter_mentions_created_at ON twitter_mentions(created_at);
CREATE INDEX IF NOT EXISTS idx_twitter_mentions_sentiment ON twitter_mentions(sentiment);
CREATE INDEX IF NOT EXISTS idx_twitter_mentions_text ON twitter_mentions USING GIN(to_tsvector('english', text));

-- =====================================================
-- ELIZAOS AI AGENTS TABLES
-- =====================================================

-- AI conversations table
CREATE TABLE IF NOT EXISTS ai_conversations (
    id SERIAL PRIMARY KEY,
    user_id TEXT,
    session_id TEXT,
    message_type TEXT NOT NULL, -- 'user', 'ai', 'system'
    content TEXT NOT NULL,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    metadata JSONB DEFAULT '{}'::jsonb,
    response_time_ms INTEGER,
    agent_name TEXT, -- 'trading_bot', 'content_generator', 'twitter_manager'
    confidence DECIMAL(3,2) -- 0-1
);

-- AI recommendations table
CREATE TABLE IF NOT EXISTS ai_recommendations (
    id SERIAL PRIMARY KEY,
    user_id TEXT,
    recommendation_type TEXT NOT NULL, -- 'trading', 'trending', 'educational', 'risk_management'
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    priority TEXT DEFAULT 'medium', -- 'low', 'medium', 'high', 'urgent'
    status TEXT DEFAULT 'active', -- 'active', 'read', 'dismissed', 'expired'
    token_uri TEXT REFERENCES tokens(uri) ON DELETE CASCADE,
    confidence DECIMAL(3,2), -- 0-1
    risk_level TEXT, -- 'low', 'medium', 'high'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    expires_at TIMESTAMP WITH TIME ZONE,
    metadata JSONB DEFAULT '{}'::jsonb
);

-- AI agent performance table
CREATE TABLE IF NOT EXISTS ai_agent_performance (
    id SERIAL PRIMARY KEY,
    agent_name TEXT NOT NULL,
    metric_name TEXT NOT NULL, -- 'response_time', 'accuracy', 'user_satisfaction', 'trades_executed'
    metric_value DECIMAL(10,4),
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    metadata JSONB DEFAULT '{}'::jsonb
);

-- Create indexes for AI tables
CREATE INDEX IF NOT EXISTS idx_ai_conversations_user_id ON ai_conversations(user_id);
CREATE INDEX IF NOT EXISTS idx_ai_conversations_session_id ON ai_conversations(session_id);
CREATE INDEX IF NOT EXISTS idx_ai_conversations_timestamp ON ai_conversations(timestamp);
CREATE INDEX IF NOT EXISTS idx_ai_conversations_agent_name ON ai_conversations(agent_name);
CREATE INDEX IF NOT EXISTS idx_ai_recommendations_user_id ON ai_recommendations(user_id);
CREATE INDEX IF NOT EXISTS idx_ai_recommendations_type ON ai_recommendations(recommendation_type);
CREATE INDEX IF NOT EXISTS idx_ai_recommendations_priority ON ai_recommendations(priority);
CREATE INDEX IF NOT EXISTS idx_ai_recommendations_status ON ai_recommendations(status);
CREATE INDEX IF NOT EXISTS idx_ai_recommendations_created_at ON ai_recommendations(created_at);
CREATE INDEX IF NOT EXISTS idx_ai_agent_performance_agent_name ON ai_agent_performance(agent_name);
CREATE INDEX IF NOT EXISTS idx_ai_agent_performance_metric_name ON ai_agent_performance(metric_name);
CREATE INDEX IF NOT EXISTS idx_ai_agent_performance_timestamp ON ai_agent_performance(timestamp);

-- =====================================================
-- USER PREFERENCES AND PERSONALIZATION
-- =====================================================

-- User profiles table
CREATE TABLE IF NOT EXISTS user_profiles (
    id SERIAL PRIMARY KEY,
    user_id TEXT UNIQUE NOT NULL,
    username TEXT,
    email TEXT,
    preferences JSONB DEFAULT '{}'::jsonb,
    trading_experience TEXT DEFAULT 'beginner', -- 'beginner', 'intermediate', 'advanced'
    risk_tolerance TEXT DEFAULT 'medium', -- 'low', 'medium', 'high'
    favorite_tokens TEXT[],
    notification_settings JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_active TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    metadata JSONB DEFAULT '{}'::jsonb
);

-- User trading history table
CREATE TABLE IF NOT EXISTS user_trading_history (
    id SERIAL PRIMARY KEY,
    user_id TEXT NOT NULL,
    token_uri TEXT REFERENCES tokens(uri) ON DELETE CASCADE,
    action TEXT NOT NULL, -- 'buy', 'sell', 'hold'
    amount DECIMAL(20,8),
    price DECIMAL(20,8),
    total_value DECIMAL(20,2),
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    source TEXT DEFAULT 'manual', -- 'manual', 'ai_recommendation', 'auto_trade'
    metadata JSONB DEFAULT '{}'::jsonb
);

-- Create indexes for user tables
CREATE INDEX IF NOT EXISTS idx_user_profiles_user_id ON user_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_user_profiles_username ON user_profiles(username);
CREATE INDEX IF NOT EXISTS idx_user_profiles_email ON user_profiles(email);
CREATE INDEX IF NOT EXISTS idx_user_trading_history_user_id ON user_trading_history(user_id);
CREATE INDEX IF NOT EXISTS idx_user_trading_history_token_uri ON user_trading_history(token_uri);
CREATE INDEX IF NOT EXISTS idx_user_trading_history_timestamp ON user_trading_history(timestamp);
CREATE INDEX IF NOT EXISTS idx_user_trading_history_action ON user_trading_history(action);

-- =====================================================
-- SYSTEM MONITORING AND LOGS
-- =====================================================

-- System logs table
CREATE TABLE IF NOT EXISTS system_logs (
    id SERIAL PRIMARY KEY,
    level TEXT NOT NULL, -- 'debug', 'info', 'warn', 'error', 'fatal'
    component TEXT NOT NULL, -- 'tiktok_scraper', 'telegram_scraper', 'bitquery', 'ai_agents'
    message TEXT NOT NULL,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    metadata JSONB DEFAULT '{}'::jsonb,
    error_stack TEXT
);

-- System metrics table
CREATE TABLE IF NOT EXISTS system_metrics (
    id SERIAL PRIMARY KEY,
    metric_name TEXT NOT NULL,
    metric_value DECIMAL(15,4),
    component TEXT NOT NULL,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    metadata JSONB DEFAULT '{}'::jsonb
);

-- Create indexes for system tables
CREATE INDEX IF NOT EXISTS idx_system_logs_level ON system_logs(level);
CREATE INDEX IF NOT EXISTS idx_system_logs_component ON system_logs(component);
CREATE INDEX IF NOT EXISTS idx_system_logs_timestamp ON system_logs(timestamp);
CREATE INDEX IF NOT EXISTS idx_system_metrics_metric_name ON system_metrics(metric_name);
CREATE INDEX IF NOT EXISTS idx_system_metrics_component ON system_metrics(component);
CREATE INDEX IF NOT EXISTS idx_system_metrics_timestamp ON system_metrics(timestamp);

-- =====================================================
-- HELPER FUNCTIONS
-- =====================================================

-- Function to update is_latest flags for prices
CREATE OR REPLACE FUNCTION update_latest_prices()
RETURNS void AS $$
BEGIN
    -- Reset all is_latest flags to false
    UPDATE prices SET is_latest = false;
    
    -- Set is_latest to true for the most recent price of each token
    UPDATE prices 
    SET is_latest = true
    WHERE id IN (
        SELECT DISTINCT ON (token_uri) id
        FROM prices
        WHERE token_uri IS NOT NULL
        ORDER BY token_uri, timestamp DESC NULLS LAST, trade_at DESC
    );
END;
$$ LANGUAGE plpgsql;

-- Function to convert unix timestamp to timestamp with time zone
CREATE OR REPLACE FUNCTION unix_to_timestamp(unix_time BIGINT)
RETURNS TIMESTAMP WITH TIME ZONE AS $$
BEGIN
    RETURN to_timestamp(unix_time);
END;
$$ LANGUAGE plpgsql;

-- Function to update token mention counts
CREATE OR REPLACE FUNCTION update_token_mention_counts()
RETURNS void AS $$
BEGIN
    UPDATE tokens 
    SET mentions = (
        SELECT COALESCE(SUM(count), 0)
        FROM mentions 
        WHERE mentions.token_id = tokens.id
    );
END;
$$ LANGUAGE plpgsql;

-- Function to clean up old data
CREATE OR REPLACE FUNCTION cleanup_old_data()
RETURNS void AS $$
BEGIN
    -- Delete system logs older than 30 days
    DELETE FROM system_logs 
    WHERE timestamp < NOW() - INTERVAL '30 days';
    
    -- Delete old price data (keep only latest and last 7 days)
    DELETE FROM prices 
    WHERE is_latest = false 
    AND trade_at < NOW() - INTERVAL '7 days';
    
    -- Delete old AI conversations (keep last 90 days)
    DELETE FROM ai_conversations 
    WHERE timestamp < NOW() - INTERVAL '90 days';
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- ROW LEVEL SECURITY (RLS)
-- =====================================================

-- Enable RLS on all tables
ALTER TABLE tokens ENABLE ROW LEVEL SECURITY;
ALTER TABLE tiktoks ENABLE ROW LEVEL SECURITY;
ALTER TABLE tiktok_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE telegram_channels ENABLE ROW LEVEL SECURITY;
ALTER TABLE telegram_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE mentions ENABLE ROW LEVEL SECURITY;
ALTER TABLE prices ENABLE ROW LEVEL SECURITY;
ALTER TABLE pattern_analysis_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE pattern_correlations ENABLE ROW LEVEL SECURITY;
ALTER TABLE trending_keywords ENABLE ROW LEVEL SECURITY;
ALTER TABLE twitter_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE twitter_mentions ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_recommendations ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_agent_performance ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_trading_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE system_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE system_metrics ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access (adjust as needed for your security requirements)
CREATE POLICY "Public read access" ON tokens FOR SELECT USING (true);
CREATE POLICY "Public read access" ON tiktoks FOR SELECT USING (true);
CREATE POLICY "Public read access" ON tiktok_comments FOR SELECT USING (true);
CREATE POLICY "Public read access" ON telegram_channels FOR SELECT USING (true);
CREATE POLICY "Public read access" ON telegram_messages FOR SELECT USING (true);
CREATE POLICY "Public read access" ON mentions FOR SELECT USING (true);
CREATE POLICY "Public read access" ON prices FOR SELECT USING (true);
CREATE POLICY "Public read access" ON pattern_analysis_results FOR SELECT USING (true);
CREATE POLICY "Public read access" ON pattern_correlations FOR SELECT USING (true);
CREATE POLICY "Public read access" ON trending_keywords FOR SELECT USING (true);
CREATE POLICY "Public read access" ON twitter_alerts FOR SELECT USING (true);
CREATE POLICY "Public read access" ON twitter_mentions FOR SELECT USING (true);

-- =====================================================
-- INITIAL DATA AND SETUP
-- =====================================================

-- Insert some default telegram channels
INSERT INTO telegram_channels (username, display_name, description, enabled) VALUES
('cryptocurrency', 'Cryptocurrency', 'Official cryptocurrency channel', true),
('bitcoin', 'Bitcoin', 'Bitcoin news and updates', true),
('solana', 'Solana', 'Solana ecosystem updates', true),
('memecoins', 'Memecoins', 'Memecoin news and trends', true)
ON CONFLICT (username) DO NOTHING;

-- =====================================================
-- COMMENTS AND DOCUMENTATION
-- =====================================================

COMMENT ON TABLE tokens IS 'Core tokens table storing all discovered memecoins and their metadata';
COMMENT ON TABLE tiktoks IS 'TikTok videos scraped for memecoin mentions and trends';
COMMENT ON TABLE tiktok_comments IS 'Individual TikTok comments for detailed sentiment analysis';
COMMENT ON TABLE telegram_channels IS 'Telegram channels being monitored for memecoin content';
COMMENT ON TABLE telegram_messages IS 'Messages scraped from Telegram channels';
COMMENT ON TABLE mentions IS 'Cross-platform token mentions linking social media content to tokens';
COMMENT ON TABLE prices IS 'Token price data from Bitquery and other sources';
COMMENT ON TABLE pattern_analysis_results IS 'AI-powered pattern analysis results and insights';
COMMENT ON TABLE pattern_correlations IS 'Detailed correlations between keywords and tokens';
COMMENT ON TABLE trending_keywords IS 'Trending keywords across all platforms';
COMMENT ON TABLE twitter_alerts IS 'Twitter alerts and automated posts';
COMMENT ON TABLE twitter_mentions IS 'Twitter mentions and engagement data';
COMMENT ON TABLE ai_conversations IS 'AI agent conversations and interactions';
COMMENT ON TABLE ai_recommendations IS 'AI-generated trading and investment recommendations';
COMMENT ON TABLE user_profiles IS 'User profiles and personalization data';
COMMENT ON TABLE user_trading_history IS 'User trading history and portfolio tracking';
COMMENT ON TABLE system_logs IS 'System logs for monitoring and debugging';
COMMENT ON TABLE system_metrics IS 'System performance metrics and KPIs';

-- =====================================================
-- SCHEMA COMPLETE
-- =====================================================

-- Display completion message
DO $$
BEGIN
    RAISE NOTICE '=====================================================';
    RAISE NOTICE 'IRIS MEMECOIN HUNTING PLATFORM SCHEMA CREATED';
    RAISE NOTICE '=====================================================';
    RAISE NOTICE 'Tables created: 20+';
    RAISE NOTICE 'Indexes created: 50+';
    RAISE NOTICE 'Functions created: 4';
    RAISE NOTICE 'RLS enabled on all tables';
    RAISE NOTICE '=====================================================';
    RAISE NOTICE 'Ready for TikTok, Telegram, Bitquery, and AI data!';
    RAISE NOTICE '=====================================================';
END $$;

