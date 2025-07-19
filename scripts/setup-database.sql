-- Hit the Books Database Setup Script
-- Run this in Supabase SQL Editor

-- Create opportunities table
CREATE TABLE IF NOT EXISTS opportunities (
  id BIGSERIAL PRIMARY KEY,
  sport TEXT NOT NULL,
  bookie_1 TEXT NOT NULL,
  odds_1 DECIMAL NOT NULL,
  team_1 TEXT NOT NULL,
  bookie_2 TEXT NOT NULL,
  odds_2 DECIMAL NOT NULL,
  team_2 TEXT NOT NULL,
  stake_2 DECIMAL NOT NULL,
  profit DECIMAL NOT NULL,
  betfair_scalar DECIMAL DEFAULT 1,
  bookie TEXT NOT NULL,
  bet_type TEXT NOT NULL CHECK (bet_type IN ('bonus', 'turnover')),
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create bet_log table
CREATE TABLE IF NOT EXISTS bet_log (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  username TEXT NOT NULL,
  sport TEXT NOT NULL,
  bookie_1 TEXT NOT NULL,
  odds_1 DECIMAL NOT NULL,
  team_1 TEXT NOT NULL,
  stake_1 DECIMAL NOT NULL,
  bookie_2 TEXT NOT NULL,
  odds_2 DECIMAL NOT NULL,
  team_2 TEXT NOT NULL,
  stake_2 DECIMAL NOT NULL,
  profit DECIMAL NOT NULL,
  profit_actual DECIMAL,
  betfair_scalar DECIMAL DEFAULT 1,
  bookie TEXT NOT NULL,
  bet_type TEXT NOT NULL CHECK (bet_type IN ('bonus', 'turnover')),
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user_actions table
CREATE TABLE IF NOT EXISTS user_actions (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  username TEXT NOT NULL,
  email TEXT NOT NULL,
  action_type TEXT NOT NULL,
  action_details JSONB,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_opportunities_timestamp ON opportunities(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_opportunities_bet_type ON opportunities(bet_type);
CREATE INDEX IF NOT EXISTS idx_opportunities_bookie ON opportunities(bookie);
CREATE INDEX IF NOT EXISTS idx_opportunities_sport ON opportunities(sport);

CREATE INDEX IF NOT EXISTS idx_bet_log_user_id ON bet_log(user_id);
CREATE INDEX IF NOT EXISTS idx_bet_log_timestamp ON bet_log(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_bet_log_bet_type ON bet_log(bet_type);

CREATE INDEX IF NOT EXISTS idx_user_actions_user_id ON user_actions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_actions_timestamp ON user_actions(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_user_actions_action_type ON user_actions(action_type);

-- Enable Row Level Security (RLS)
ALTER TABLE opportunities ENABLE ROW LEVEL SECURITY;
ALTER TABLE bet_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_actions ENABLE ROW LEVEL SECURITY;

-- RLS Policies for opportunities table (public read access)
CREATE POLICY IF NOT EXISTS "Opportunities are viewable by everyone" 
ON opportunities FOR SELECT 
USING (true);

-- RLS Policies for bet_log table (users can only see their own logs)
CREATE POLICY IF NOT EXISTS "Users can view their own bet logs" 
ON bet_log FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY IF NOT EXISTS "Users can insert their own bet logs" 
ON bet_log FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY IF NOT EXISTS "Users can update their own bet logs" 
ON bet_log FOR UPDATE 
USING (auth.uid() = user_id);

-- RLS Policies for user_actions table (users can only see their own actions)
CREATE POLICY IF NOT EXISTS "Users can view their own actions" 
ON user_actions FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY IF NOT EXISTS "Users can insert their own actions" 
ON user_actions FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Optional: Create a function to automatically log user actions
CREATE OR REPLACE FUNCTION log_user_action(
  p_action_type TEXT,
  p_action_details JSONB DEFAULT NULL
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_user_id UUID;
  v_user_email TEXT;
  v_user_name TEXT;
BEGIN
  -- Get current user info
  SELECT auth.uid() INTO v_user_id;
  
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'User not authenticated';
  END IF;
  
  -- Get user details from auth.users
  SELECT email, raw_user_meta_data->>'name' 
  INTO v_user_email, v_user_name
  FROM auth.users 
  WHERE id = v_user_id;
  
  -- Insert the action log
  INSERT INTO user_actions (
    user_id, 
    username, 
    email, 
    action_type, 
    action_details
  ) VALUES (
    v_user_id,
    COALESCE(v_user_name, v_user_email),
    v_user_email,
    p_action_type,
    p_action_details
  );
END;
$$;

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT SELECT ON opportunities TO anon, authenticated;
GRANT ALL ON bet_log TO authenticated;
GRANT ALL ON user_actions TO authenticated;
GRANT EXECUTE ON FUNCTION log_user_action TO authenticated;

-- Sample data for testing (optional)
-- INSERT INTO opportunities (sport, bookie_1, odds_1, team_1, bookie_2, odds_2, team_2, stake_2, profit, bookie, bet_type) VALUES
-- ('AFL', 'Sportsbet', 2.10, 'Richmond', 'Betfair', 2.05, 'Collingwood', 95.24, 4.76, 'sportsbet', 'turnover'),
-- ('NRL', 'TAB', 1.85, 'Storm', 'Ladbrokes', 2.20, 'Panthers', 108.11, 6.80, 'tab', 'bonus');

COMMIT; 