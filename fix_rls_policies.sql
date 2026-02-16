-- =====================================================
-- FIX RLS POLICIES FOR IRIS PLATFORM
-- =====================================================
-- This script fixes the Row Level Security policies
-- that are preventing the scrapers from inserting data
-- =====================================================

-- Drop existing restrictive policies
DROP POLICY IF EXISTS "Public read access" ON tokens;
DROP POLICY IF EXISTS "Public read access" ON tiktoks;
DROP POLICY IF EXISTS "Public read access" ON tiktok_comments;
DROP POLICY IF EXISTS "Public read access" ON telegram_channels;
DROP POLICY IF EXISTS "Public read access" ON telegram_messages;
DROP POLICY IF EXISTS "Public read access" ON mentions;
DROP POLICY IF EXISTS "Public read access" ON prices;
DROP POLICY IF EXISTS "Public read access" ON pattern_analysis_results;
DROP POLICY IF EXISTS "Public read access" ON pattern_correlations;
DROP POLICY IF EXISTS "Public read access" ON trending_keywords;
DROP POLICY IF EXISTS "Public read access" ON twitter_alerts;
DROP POLICY IF EXISTS "Public read access" ON twitter_mentions;

-- Create permissive policies for scrapers and applications
-- These policies allow full access for authenticated users and service role

-- Tokens table policies
CREATE POLICY "Allow all operations for authenticated users" ON tokens
    FOR ALL USING (auth.role() = 'authenticated' OR auth.role() = 'service_role');

-- TikTok tables policies
CREATE POLICY "Allow all operations for authenticated users" ON tiktoks
    FOR ALL USING (auth.role() = 'authenticated' OR auth.role() = 'service_role');

CREATE POLICY "Allow all operations for authenticated users" ON tiktok_comments
    FOR ALL USING (auth.role() = 'authenticated' OR auth.role() = 'service_role');

-- Telegram tables policies
CREATE POLICY "Allow all operations for authenticated users" ON telegram_channels
    FOR ALL USING (auth.role() = 'authenticated' OR auth.role() = 'service_role');

CREATE POLICY "Allow all operations for authenticated users" ON telegram_messages
    FOR ALL USING (auth.role() = 'authenticated' OR auth.role() = 'service_role');

-- Mentions table policies
CREATE POLICY "Allow all operations for authenticated users" ON mentions
    FOR ALL USING (auth.role() = 'authenticated' OR auth.role() = 'service_role');

-- Prices table policies
CREATE POLICY "Allow all operations for authenticated users" ON prices
    FOR ALL USING (auth.role() = 'authenticated' OR auth.role() = 'service_role');

-- Pattern analysis tables policies
CREATE POLICY "Allow all operations for authenticated users" ON pattern_analysis_results
    FOR ALL USING (auth.role() = 'authenticated' OR auth.role() = 'service_role');

CREATE POLICY "Allow all operations for authenticated users" ON pattern_correlations
    FOR ALL USING (auth.role() = 'authenticated' OR auth.role() = 'service_role');

CREATE POLICY "Allow all operations for authenticated users" ON trending_keywords
    FOR ALL USING (auth.role() = 'authenticated' OR auth.role() = 'service_role');

-- Twitter tables policies
CREATE POLICY "Allow all operations for authenticated users" ON twitter_alerts
    FOR ALL USING (auth.role() = 'authenticated' OR auth.role() = 'service_role');

CREATE POLICY "Allow all operations for authenticated users" ON twitter_mentions
    FOR ALL USING (auth.role() = 'authenticated' OR auth.role() = 'service_role');

-- AI tables policies
CREATE POLICY "Allow all operations for authenticated users" ON ai_conversations
    FOR ALL USING (auth.role() = 'authenticated' OR auth.role() = 'service_role');

CREATE POLICY "Allow all operations for authenticated users" ON ai_recommendations
    FOR ALL USING (auth.role() = 'authenticated' OR auth.role() = 'service_role');

CREATE POLICY "Allow all operations for authenticated users" ON ai_agent_performance
    FOR ALL USING (auth.role() = 'authenticated' OR auth.role() = 'service_role');

-- User tables policies
CREATE POLICY "Allow all operations for authenticated users" ON user_profiles
    FOR ALL USING (auth.role() = 'authenticated' OR auth.role() = 'service_role');

CREATE POLICY "Allow all operations for authenticated users" ON user_trading_history
    FOR ALL USING (auth.role() = 'authenticated' OR auth.role() = 'service_role');

-- System tables policies
CREATE POLICY "Allow all operations for authenticated users" ON system_logs
    FOR ALL USING (auth.role() = 'authenticated' OR auth.role() = 'service_role');

CREATE POLICY "Allow all operations for authenticated users" ON system_metrics
    FOR ALL USING (auth.role() = 'authenticated' OR auth.role() = 'service_role');

-- =====================================================
-- ALTERNATIVE: DISABLE RLS TEMPORARILY (FOR TESTING)
-- =====================================================
-- If you want to disable RLS completely for testing, uncomment these lines:

-- ALTER TABLE tokens DISABLE ROW LEVEL SECURITY;
-- ALTER TABLE tiktoks DISABLE ROW LEVEL SECURITY;
-- ALTER TABLE tiktok_comments DISABLE ROW LEVEL SECURITY;
-- ALTER TABLE telegram_channels DISABLE ROW LEVEL SECURITY;
-- ALTER TABLE telegram_messages DISABLE ROW LEVEL SECURITY;
-- ALTER TABLE mentions DISABLE ROW LEVEL SECURITY;
-- ALTER TABLE prices DISABLE ROW LEVEL SECURITY;
-- ALTER TABLE pattern_analysis_results DISABLE ROW LEVEL SECURITY;
-- ALTER TABLE pattern_correlations DISABLE ROW LEVEL SECURITY;
-- ALTER TABLE trending_keywords DISABLE ROW LEVEL SECURITY;
-- ALTER TABLE twitter_alerts DISABLE ROW LEVEL SECURITY;
-- ALTER TABLE twitter_mentions DISABLE ROW LEVEL SECURITY;
-- ALTER TABLE ai_conversations DISABLE ROW LEVEL SECURITY;
-- ALTER TABLE ai_recommendations DISABLE ROW LEVEL SECURITY;
-- ALTER TABLE ai_agent_performance DISABLE ROW LEVEL SECURITY;
-- ALTER TABLE user_profiles DISABLE ROW LEVEL SECURITY;
-- ALTER TABLE user_trading_history DISABLE ROW LEVEL SECURITY;
-- ALTER TABLE system_logs DISABLE ROW LEVEL SECURITY;
-- ALTER TABLE system_metrics DISABLE ROW LEVEL SECURITY;

-- =====================================================
-- VERIFICATION QUERIES
-- =====================================================

-- Check if RLS is enabled and policies exist
SELECT schemaname, tablename, rowsecurity
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename IN ('tokens', 'tiktoks', 'telegram_messages', 'mentions', 'prices')
ORDER BY tablename;

-- Check existing policies
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE schemaname = 'public' 
AND tablename IN ('tokens', 'tiktoks', 'telegram_messages', 'mentions', 'prices')
ORDER BY tablename, policyname;

-- =====================================================
-- COMPLETION MESSAGE
-- =====================================================

DO $$
BEGIN
    RAISE NOTICE '=====================================================';
    RAISE NOTICE 'RLS POLICIES FIXED FOR IRIS PLATFORM';
    RAISE NOTICE '=====================================================';
    RAISE NOTICE 'Policies updated to allow authenticated users';
    RAISE NOTICE 'Scrapers should now be able to insert data';
    RAISE NOTICE '=====================================================';
    RAISE NOTICE 'If issues persist, consider disabling RLS temporarily';
    RAISE NOTICE '=====================================================';
END $$;
