-- =====================================================
-- FIX PRICES TABLE UPSERT CONSTRAINT
-- =====================================================
-- Run this in Supabase SQL Editor to fix error 42P10:
-- "there is no unique or exclusion constraint matching the ON CONFLICT specification"
--
-- Cause: PostgreSQL ON CONFLICT only works with a full unique constraint.
-- The schema had a partial unique index (WHERE ...), which does not qualify.

-- Step 1: Remove duplicate (token_uri, timestamp) rows, keeping the latest by id
DELETE FROM prices a
USING prices b
WHERE a.id < b.id
  AND a.token_uri IS NOT NULL AND a.timestamp IS NOT NULL
  AND b.token_uri IS NOT NULL AND b.timestamp IS NOT NULL
  AND a.token_uri = b.token_uri AND a.timestamp = b.timestamp;

-- Step 2: Drop the existing partial unique index if it exists
DROP INDEX IF EXISTS idx_prices_unique_token_timestamp;

-- Step 3: Create a full unique index so ON CONFLICT (token_uri, timestamp) works
CREATE UNIQUE INDEX idx_prices_unique_token_timestamp 
ON prices(token_uri, timestamp);

-- Verify the constraint was created
SELECT 
    indexname,
    indexdef
FROM pg_indexes 
WHERE tablename = 'prices' 
AND indexname = 'idx_prices_unique_token_timestamp';

-- Test the constraint by checking for duplicates
SELECT 
    token_uri, 
    timestamp, 
    COUNT(*) as duplicate_count
FROM prices 
WHERE token_uri IS NOT NULL 
AND timestamp IS NOT NULL
GROUP BY token_uri, timestamp 
HAVING COUNT(*) > 1
LIMIT 10;
