-- =====================================================
-- QUICK FIX: DISABLE RLS FOR TESTING
-- =====================================================
-- This script disables Row Level Security on all tables
-- Use this for testing, then enable proper RLS policies later
-- =====================================================

-- Disable RLS on all tables
ALTER TABLE tokens DISABLE ROW LEVEL SECURITY;
ALTER TABLE tiktoks DISABLE ROW LEVEL SECURITY;
ALTER TABLE tiktok_comments DISABLE ROW LEVEL SECURITY;
ALTER TABLE telegram_channels DISABLE ROW LEVEL SECURITY;
ALTER TABLE telegram_messages DISABLE ROW LEVEL SECURITY;
ALTER TABLE mentions DISABLE ROW LEVEL SECURITY;
ALTER TABLE prices DISABLE ROW LEVEL SECURITY;
ALTER TABLE pattern_analysis_results DISABLE ROW LEVEL SECURITY;
ALTER TABLE pattern_correlations DISABLE ROW LEVEL SECURITY;
ALTER TABLE trending_keywords DISABLE ROW LEVEL SECURITY;
ALTER TABLE twitter_alerts DISABLE ROW LEVEL SECURITY;
ALTER TABLE twitter_mentions DISABLE ROW LEVEL SECURITY;
ALTER TABLE ai_conversations DISABLE ROW LEVEL SECURITY;
ALTER TABLE ai_recommendations DISABLE ROW LEVEL SECURITY;
ALTER TABLE ai_agent_performance DISABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE user_trading_history DISABLE ROW LEVEL SECURITY;
ALTER TABLE system_logs DISABLE ROW LEVEL SECURITY;
ALTER TABLE system_metrics DISABLE ROW LEVEL SECURITY;

-- Verify RLS is disabled
SELECT schemaname, tablename, rowsecurity
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename IN ('tokens', 'tiktoks', 'telegram_messages', 'mentions', 'prices')
ORDER BY tablename;

-- Test insert (this should work now)
INSERT INTO tokens (uri, name, symbol, address) 
VALUES ('test_uri_123', 'Test Token', 'TEST', 'test_address_123')
ON CONFLICT (uri) DO NOTHING;

-- Clean up test data
DELETE FROM tokens WHERE uri = 'test_uri_123';

DO $$
BEGIN
    RAISE NOTICE '=====================================================';
    RAISE NOTICE 'RLS DISABLED FOR ALL TABLES';
    RAISE NOTICE '=====================================================';
    RAISE NOTICE 'Your scrapers should now work without RLS errors';
    RAISE NOTICE 'Remember to enable proper RLS policies for production';
    RAISE NOTICE '=====================================================';
END $$;
