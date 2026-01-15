-- Create loans table for storing player loan requests
CREATE TABLE IF NOT EXISTS loans (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  team_id UUID NOT NULL REFERENCES teams(id) ON DELETE RESTRICT,
  match_id UUID NOT NULL REFERENCES matches(id) ON DELETE RESTRICT,
  number_of_players INTEGER NOT NULL DEFAULT 1,
  status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('active', 'completed', 'pending')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_loans_team_id ON loans(team_id);
CREATE INDEX IF NOT EXISTS idx_loans_match_id ON loans(match_id);
CREATE INDEX IF NOT EXISTS idx_loans_status ON loans(status);
CREATE INDEX IF NOT EXISTS idx_loans_user_id ON loans(user_id);
CREATE INDEX IF NOT EXISTS idx_loans_created_at ON loans(created_at);

-- Create function to automatically update updated_at
CREATE OR REPLACE FUNCTION update_loans_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
DROP TRIGGER IF EXISTS update_loans_updated_at ON loans;
CREATE TRIGGER update_loans_updated_at 
    BEFORE UPDATE ON loans 
    FOR EACH ROW 
    EXECUTE FUNCTION update_loans_updated_at_column();

-- Enable Row Level Security (RLS)
ALTER TABLE loans ENABLE ROW LEVEL SECURITY;

-- Create policy to allow users to manage their own loans
CREATE POLICY "Users can view all loans" ON loans
    FOR SELECT
    USING (true);

CREATE POLICY "Users can insert their own loans" ON loans
    FOR INSERT
    WITH CHECK (true);

CREATE POLICY "Users can update their own loans" ON loans
    FOR UPDATE
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Users can delete their own loans" ON loans
    FOR DELETE
    USING (true);
