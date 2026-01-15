-- Create matches table for storing football match information
CREATE TABLE IF NOT EXISTS matches (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  home_team_id UUID NOT NULL REFERENCES teams(id) ON DELETE RESTRICT,
  away_team_id UUID NOT NULL REFERENCES teams(id) ON DELETE RESTRICT,
  home_score INTEGER NOT NULL DEFAULT 0,
  away_score INTEGER NOT NULL DEFAULT 0,
  status VARCHAR(20) NOT NULL DEFAULT 'NS' CHECK (status IN ('FT', 'LIVE', 'HT', 'NS')),
  league VARCHAR(255) NOT NULL,
  country VARCHAR(255) NOT NULL,
  match_date DATE NOT NULL,
  location VARCHAR(500),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT matches_different_teams CHECK (home_team_id != away_team_id)
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_matches_home_team_id ON matches(home_team_id);
CREATE INDEX IF NOT EXISTS idx_matches_away_team_id ON matches(away_team_id);
CREATE INDEX IF NOT EXISTS idx_matches_match_date ON matches(match_date);
CREATE INDEX IF NOT EXISTS idx_matches_status ON matches(status);
CREATE INDEX IF NOT EXISTS idx_matches_league ON matches(league);
CREATE INDEX IF NOT EXISTS idx_matches_user_id ON matches(user_id);
CREATE INDEX IF NOT EXISTS idx_matches_created_at ON matches(created_at);

-- Create function to automatically update updated_at
CREATE OR REPLACE FUNCTION update_matches_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
DROP TRIGGER IF EXISTS update_matches_updated_at ON matches;
CREATE TRIGGER update_matches_updated_at 
    BEFORE UPDATE ON matches 
    FOR EACH ROW 
    EXECUTE FUNCTION update_matches_updated_at_column();

-- Enable Row Level Security (RLS)
ALTER TABLE matches ENABLE ROW LEVEL SECURITY;

-- Create policy to allow users to manage their own matches
CREATE POLICY "Users can view all matches" ON matches
    FOR SELECT
    USING (true);

CREATE POLICY "Users can insert their own matches" ON matches
    FOR INSERT
    WITH CHECK (true);

CREATE POLICY "Users can update their own matches" ON matches
    FOR UPDATE
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Users can delete their own matches" ON matches
    FOR DELETE
    USING (true);
