-- =====================================================
-- Fix: Allow dashboard to read Telegram data (anon key)
-- =====================================================
-- Run this in Supabase SQL Editor if Telegram Analytics
-- shows "0 recent messages" and "0 active channels" even
-- when data exists. The dashboard uses the anon key;
-- these policies allow anon to SELECT.
-- =====================================================

-- Drop any existing policies so we can recreate cleanly
DROP POLICY IF EXISTS "Allow all operations for authenticated users" ON telegram_channels;
DROP POLICY IF EXISTS "Allow all operations for authenticated users" ON telegram_messages;
DROP POLICY IF EXISTS "Allow select for authenticated users" ON telegram_messages;
DROP POLICY IF EXISTS "Allow insert for service_role" ON telegram_messages;
DROP POLICY IF EXISTS "Public read access" ON telegram_channels;
DROP POLICY IF EXISTS "Public read access" ON telegram_messages;

-- Allow anyone (including anon) to read – required for dashboard
CREATE POLICY "Public read access" ON telegram_channels FOR SELECT USING (true);
CREATE POLICY "Public read access" ON telegram_messages FOR SELECT USING (true);

-- Drop service role policies if re-running
DROP POLICY IF EXISTS "Service role insert telegram_channels" ON telegram_channels;
DROP POLICY IF EXISTS "Service role insert telegram_messages" ON telegram_messages;
DROP POLICY IF EXISTS "Service role update telegram_channels" ON telegram_channels;

-- Allow service role to insert/update (scraper uses SUPABASE_SERVICE_ROLE_KEY)
CREATE POLICY "Service role insert telegram_channels" ON telegram_channels
  FOR INSERT WITH CHECK (auth.role() = 'service_role');
CREATE POLICY "Service role insert telegram_messages" ON telegram_messages
  FOR INSERT WITH CHECK (auth.role() = 'service_role');
CREATE POLICY "Service role update telegram_channels" ON telegram_channels
  FOR UPDATE USING (auth.role() = 'service_role');
