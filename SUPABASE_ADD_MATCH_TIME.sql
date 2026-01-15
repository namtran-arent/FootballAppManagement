-- Add match_time column to matches table
ALTER TABLE matches 
ADD COLUMN IF NOT EXISTS match_time TIME DEFAULT '00:00:00';

-- Create index for match_time
CREATE INDEX IF NOT EXISTS idx_matches_match_time ON matches(match_time);
