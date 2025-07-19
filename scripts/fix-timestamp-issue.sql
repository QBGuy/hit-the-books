-- Fix Timestamp Issue in Hit the Books Database
-- This script addresses the 10-hour timezone issue by ensuring proper UTC handling

-- Step 1: Check current column type
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'opportunities' AND column_name = 'timestamp';

-- Step 2: Backup existing data (optional but recommended)
CREATE TABLE IF NOT EXISTS opportunities_backup AS 
SELECT * FROM opportunities;

-- Step 3: Modify the timestamp column to explicitly handle UTC
-- This ensures that timestamps are stored and retrieved as UTC
ALTER TABLE opportunities 
ALTER COLUMN timestamp TYPE TIMESTAMP WITH TIME ZONE USING 
  CASE 
    WHEN timestamp::text LIKE '%Z' THEN timestamp::timestamptz
    ELSE (timestamp::text || 'Z')::timestamptz
  END;

-- Step 4: Update existing data to have proper UTC timestamps
-- Add 'Z' suffix to existing timestamps that don't have it
UPDATE opportunities 
SET timestamp = (timestamp::text || 'Z')::timestamptz
WHERE timestamp::text NOT LIKE '%Z';

-- Step 5: Verify the fix
SELECT 
  id,
  timestamp,
  timestamp::text as timestamp_text,
  timestamp AT TIME ZONE 'UTC' as utc_time,
  timestamp AT TIME ZONE 'Australia/Sydney' as sydney_time
FROM opportunities 
ORDER BY timestamp DESC 
LIMIT 5;

-- Step 6: Create a function to ensure future timestamps are properly formatted
CREATE OR REPLACE FUNCTION ensure_utc_timestamp(input_timestamp TEXT)
RETURNS TIMESTAMP WITH TIME ZONE
LANGUAGE plpgsql
AS $$
BEGIN
  -- If timestamp doesn't end with Z, add it
  IF input_timestamp NOT LIKE '%Z' THEN
    RETURN (input_timestamp || 'Z')::timestamptz;
  ELSE
    RETURN input_timestamp::timestamptz;
  END IF;
END;
$$;

-- Step 7: Create a trigger to automatically fix timestamps on insert/update
CREATE OR REPLACE FUNCTION fix_timestamp_on_change()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  -- Ensure timestamp has Z suffix
  IF NEW.timestamp::text NOT LIKE '%Z' THEN
    NEW.timestamp := (NEW.timestamp::text || 'Z')::timestamptz;
  END IF;
  
  RETURN NEW;
END;
$$;

-- Create trigger for opportunities table
DROP TRIGGER IF EXISTS fix_timestamp_trigger ON opportunities;
CREATE TRIGGER fix_timestamp_trigger
  BEFORE INSERT OR UPDATE ON opportunities
  FOR EACH ROW
  EXECUTE FUNCTION fix_timestamp_on_change();

-- Step 8: Test the fix with a sample insert
INSERT INTO opportunities (
  sport, bookie_1, odds_1, team_1, bookie_2, odds_2, team_2, 
  stake_2, profit, bookie, bet_type, timestamp
) VALUES (
  'test_sport', 'test_bookie', 2.0, 'Team A', 'test_bookie2', 2.1, 'Team B',
  100.0, 5.0, 'test_bookie', 'turnover', NOW()
);

-- Check the inserted record
SELECT 
  id,
  timestamp,
  timestamp::text as timestamp_text,
  timestamp AT TIME ZONE 'UTC' as utc_time,
  timestamp AT TIME ZONE 'Australia/Sydney' as sydney_time
FROM opportunities 
WHERE sport = 'test_sport'
ORDER BY timestamp DESC 
LIMIT 1;

-- Clean up test data
DELETE FROM opportunities WHERE sport = 'test_sport';

-- Step 9: Verify the column type after changes
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'opportunities' AND column_name = 'timestamp';

-- Summary of changes made
SELECT 'Timestamp fix completed successfully' as status; 