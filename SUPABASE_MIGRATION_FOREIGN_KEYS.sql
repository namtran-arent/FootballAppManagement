-- Migration script to add foreign keys to existing tables
-- WARNING: This will modify existing tables. Make sure to backup your data first!

-- Step 1: Update matches table to use foreign keys
-- Note: This assumes you have teams in the teams table
-- If you have existing matches, you may need to map team names to team IDs first

-- Drop old columns and add new foreign key columns
ALTER TABLE matches 
  DROP COLUMN IF EXISTS home_team,
  DROP COLUMN IF EXISTS away_team,
  DROP COLUMN IF EXISTS home_logo,
  DROP COLUMN IF EXISTS away_logo;

ALTER TABLE matches
  ADD COLUMN IF NOT EXISTS home_team_id UUID REFERENCES teams(id) ON DELETE RESTRICT,
  ADD COLUMN IF NOT EXISTS away_team_id UUID REFERENCES teams(id) ON DELETE RESTRICT;

-- Add constraint to prevent same team for home and away
ALTER TABLE matches
  ADD CONSTRAINT IF NOT EXISTS matches_different_teams CHECK (home_team_id != away_team_id);

-- Update indexes
DROP INDEX IF EXISTS idx_matches_home_team;
DROP INDEX IF EXISTS idx_matches_away_team;
CREATE INDEX IF NOT EXISTS idx_matches_home_team_id ON matches(home_team_id);
CREATE INDEX IF NOT EXISTS idx_matches_away_team_id ON matches(away_team_id);

-- Step 2: Update loans table to use foreign keys
-- Drop old columns
ALTER TABLE loans
  DROP COLUMN IF EXISTS team_name,
  DROP COLUMN IF EXISTS match_info,
  DROP COLUMN IF EXISTS match_date,
  DROP COLUMN IF EXISTS match_time;

-- Add foreign key columns
ALTER TABLE loans
  ADD COLUMN IF NOT EXISTS team_id UUID REFERENCES teams(id) ON DELETE RESTRICT,
  ADD COLUMN IF NOT EXISTS match_id UUID REFERENCES matches(id) ON DELETE RESTRICT;

-- Update indexes
DROP INDEX IF EXISTS idx_loans_team_name;
DROP INDEX IF EXISTS idx_loans_match_date;
CREATE INDEX IF NOT EXISTS idx_loans_team_id ON loans(team_id);
CREATE INDEX IF NOT EXISTS idx_loans_match_id ON loans(match_id);

-- Note: If you have existing data, you'll need to:
-- 1. Map team names to team IDs
-- 2. Map match info to match IDs
-- 3. Update existing records before running this migration
