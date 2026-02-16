-- 🔧 URGENT: Fix Database Constraint Issues for Wojat Platform
-- This script fixes the constraint errors in the prices table

-- Step 1: Drop existing problematic constraints if they exist
DROP INDEX IF EXISTS idx_prices_unique_token_timestamp;

-- Step 2: Create proper unique constraint for upsert operations
-- This allows ON CONFLICT to work properly
CREATE UNIQUE INDEX idx_prices_unique_token_timestamp 
ON prices(token_uri, timestamp);

-- Step 3: Ensure all required columns exist
ALTER TABLE prices 
ADD COLUMN IF NOT EXISTS token_id INTEGER,
ADD COLUMN IF NOT EXISTS timestamp TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS is_latest BOOLEAN DEFAULT false;

-- Step 4: Add performance indexes
CREATE INDEX IF NOT EXISTS idx_prices_token_id ON prices(token_id);
CREATE INDEX IF NOT EXISTS idx_prices_timestamp ON prices(timestamp);
CREATE INDEX IF NOT EXISTS idx_prices_is_latest ON prices(is_latest);
CREATE INDEX IF NOT EXISTS idx_prices_token_uri ON prices(token_uri);

-- Step 5: Clean up any existing duplicate data
-- Remove duplicates keeping the most recent entry
DELETE FROM prices a USING (
  SELECT MIN(ctid) as ctid, token_uri, timestamp
  FROM prices 
  WHERE token_uri IS NOT NULL AND timestamp IS NOT NULL
  GROUP BY token_uri, timestamp 
  HAVING COUNT(*) > 1
) b
WHERE a.token_uri = b.token_uri 
AND a.timestamp = b.timestamp 
AND a.ctid <> b.ctid;

-- Step 6: Verify the fix
SELECT 
    indexname,
    indexdef
FROM pg_indexes 
WHERE tablename = 'prices' 
AND indexname = 'idx_prices_unique_token_timestamp';

-- Expected output should show the unique index exists
