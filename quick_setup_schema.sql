-- =====================================================
-- IRIS MEMECOIN HUNTING PLATFORM - QUICK SETUP SCHEMA
-- =====================================================
-- This is a simplified version for quick setup
-- Run this first, then run the complete schema if needed
-- =====================================================

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- =====================================================
-- CORE TABLES (MINIMAL SETUP)
-- =====================================================

-- Tokens table
CREATE TABLE IF NOT EXISTS tokens (
    id SERIAL PRIMARY KEY,
    uri TEXT UNIQUE NOT NULL,
    name TEXT,
    symbol TEXT,
    address TEXT,
    market_cap DECIMAL(20,2),
    total_supply BIGINT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    metadata JSONB DEFAULT '{}'::jsonb
);

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
    hashtags TEXT[],
    metadata JSONB DEFAULT '{}'::jsonb
);

-- Telegram channels table
CREATE TABLE IF NOT EXISTS telegram_channels (
    id SERIAL PRIMARY KEY,
    username TEXT UNIQUE NOT NULL,
    display_name TEXT,
    enabled BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Telegram messages table
CREATE TABLE IF NOT EXISTS telegram_messages (
    id SERIAL PRIMARY KEY,
    channel_id TEXT NOT NULL,
    message_id BIGINT NOT NULL,
    text TEXT,
    date BIGINT,
    scraped_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(channel_id, message_id)
);

-- Prices table
CREATE TABLE IF NOT EXISTS prices (
    id SERIAL PRIMARY KEY,
    token_uri TEXT REFERENCES tokens(uri) ON DELETE CASCADE,
    price_usd DECIMAL(20,8),
    price_sol DECIMAL(20,8),
    trade_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    is_latest BOOLEAN DEFAULT false,
    volume_24h DECIMAL(20,2),
    market_cap DECIMAL(20,2)
);

-- Mentions table
CREATE TABLE IF NOT EXISTS mentions (
    id SERIAL PRIMARY KEY,
    tiktok_id TEXT REFERENCES tiktoks(id) ON DELETE CASCADE,
    token_id INTEGER REFERENCES tokens(id) ON DELETE CASCADE,
    count INTEGER DEFAULT 1,
    mention_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    source TEXT DEFAULT 'tiktok'
);

-- =====================================================
-- BASIC INDEXES
-- =====================================================

CREATE INDEX IF NOT EXISTS idx_tokens_uri ON tokens(uri);
CREATE INDEX IF NOT EXISTS idx_tokens_symbol ON tokens(symbol);
CREATE INDEX IF NOT EXISTS idx_tiktoks_username ON tiktoks(username);
CREATE INDEX IF NOT EXISTS idx_tiktoks_created_at ON tiktoks(created_at);
CREATE INDEX IF NOT EXISTS idx_telegram_messages_channel_id ON telegram_messages(channel_id);
CREATE INDEX IF NOT EXISTS idx_prices_token_uri ON prices(token_uri);
CREATE INDEX IF NOT EXISTS idx_mentions_token_id ON mentions(token_id);

-- =====================================================
-- HELPER FUNCTION
-- =====================================================

CREATE OR REPLACE FUNCTION unix_to_timestamp(unix_time BIGINT)
RETURNS TIMESTAMP WITH TIME ZONE AS $$
BEGIN
    RETURN to_timestamp(unix_time);
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- COMPLETION MESSAGE
-- =====================================================

DO $$
BEGIN
    RAISE NOTICE '=====================================================';
    RAISE NOTICE 'IRIS QUICK SETUP SCHEMA COMPLETED';
    RAISE NOTICE '=====================================================';
    RAISE NOTICE 'Basic tables created for TikTok, Telegram, and Bitquery';
    RAISE NOTICE 'Run complete_supabase_schema.sql for full features';
    RAISE NOTICE '=====================================================';
END $$;

