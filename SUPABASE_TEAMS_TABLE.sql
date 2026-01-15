-- Create teams table for storing team information
CREATE TABLE IF NOT EXISTS teams (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  team_name VARCHAR(255) NOT NULL UNIQUE,
  captain_name VARCHAR(255) NOT NULL,
  captain_phone VARCHAR(20) NOT NULL,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_teams_team_name ON teams(team_name);
CREATE INDEX IF NOT EXISTS idx_teams_captain_name ON teams(captain_name);
CREATE INDEX IF NOT EXISTS idx_teams_user_id ON teams(user_id);
CREATE INDEX IF NOT EXISTS idx_teams_created_at ON teams(created_at);

-- Create function to automatically update updated_at
CREATE OR REPLACE FUNCTION update_teams_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
DROP TRIGGER IF EXISTS update_teams_updated_at ON teams;
CREATE TRIGGER update_teams_updated_at 
    BEFORE UPDATE ON teams 
    FOR EACH ROW 
    EXECUTE FUNCTION update_teams_updated_at_column();

-- Enable Row Level Security (RLS)
ALTER TABLE teams ENABLE ROW LEVEL SECURITY;

-- Create policy to allow users to manage their own teams
CREATE POLICY "Users can view all teams" ON teams
    FOR SELECT
    USING (true);

CREATE POLICY "Users can insert their own teams" ON teams
    FOR INSERT
    WITH CHECK (true);

CREATE POLICY "Users can update their own teams" ON teams
    FOR UPDATE
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Users can delete their own teams" ON teams
    FOR DELETE
    USING (true);
