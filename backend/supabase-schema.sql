-- ZK-Vote Database Schema for Supabase

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Table: Users
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role VARCHAR(20) NOT NULL DEFAULT 'votant' CHECK (role IN ('admin', 'votant')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table: Elections
CREATE TABLE IF NOT EXISTS elections (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  titre VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  date_debut TIMESTAMP WITH TIME ZONE NOT NULL,
  date_fin TIMESTAMP WITH TIME ZONE NOT NULL,
  active BOOLEAN DEFAULT true,
  created_by UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT valid_dates CHECK (date_fin > date_debut)
);

-- Table: Election Options
CREATE TABLE IF NOT EXISTS election_options (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  election_id UUID NOT NULL REFERENCES elections(id) ON DELETE CASCADE,
  label VARCHAR(255) NOT NULL,
  "order" INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table: Votes
CREATE TABLE IF NOT EXISTS votes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  election_id UUID NOT NULL REFERENCES elections(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  option_id UUID NOT NULL REFERENCES election_options(id) ON DELETE CASCADE,
  zk_proof TEXT NOT NULL,
  hash_vote VARCHAR(255) UNIQUE NOT NULL,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT unique_vote_per_user_election UNIQUE (election_id, user_id)
);

-- Indexes for better performance
CREATE INDEX IF NOT EXISTS idx_elections_created_by ON elections(created_by);
CREATE INDEX IF NOT EXISTS idx_elections_active ON elections(active);
CREATE INDEX IF NOT EXISTS idx_elections_dates ON elections(date_debut, date_fin);
CREATE INDEX IF NOT EXISTS idx_election_options_election_id ON election_options(election_id);
CREATE INDEX IF NOT EXISTS idx_votes_election_id ON votes(election_id);
CREATE INDEX IF NOT EXISTS idx_votes_user_id ON votes(user_id);
CREATE INDEX IF NOT EXISTS idx_votes_hash ON votes(hash_vote);

-- Enable Row Level Security (RLS)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE elections ENABLE ROW LEVEL SECURITY;
ALTER TABLE election_options ENABLE ROW LEVEL SECURITY;
ALTER TABLE votes ENABLE ROW LEVEL SECURITY;

-- RLS Policies for users
CREATE POLICY "Users can view their own data" ON users
  FOR SELECT USING (auth.uid()::uuid = id);

CREATE POLICY "Users can update their own data" ON users
  FOR UPDATE USING (auth.uid()::uuid = id);

-- RLS Policies for elections (tous peuvent voir, seuls les admins peuvent créer/modifier)
CREATE POLICY "Everyone can view elections" ON elections
  FOR SELECT USING (true);

CREATE POLICY "Only admins can create elections" ON elections
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid()::uuid AND role = 'admin')
  );

CREATE POLICY "Creators and admins can update elections" ON elections
  FOR UPDATE USING (
    created_by = auth.uid()::uuid OR
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid()::uuid AND role = 'admin')
  );

-- RLS Policies for election_options
CREATE POLICY "Everyone can view election options" ON election_options
  FOR SELECT USING (true);

CREATE POLICY "Only admins can manage election options" ON election_options
  FOR ALL USING (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid()::uuid AND role = 'admin')
  );

-- RLS Policies for votes (protection de l'anonymat)
CREATE POLICY "Users can view votes statistics" ON votes
  FOR SELECT USING (true);

CREATE POLICY "Users can cast their vote" ON votes
  FOR INSERT WITH CHECK (user_id = auth.uid()::uuid);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_elections_updated_at BEFORE UPDATE ON elections
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert default admin user (password: admin123 - À CHANGER EN PRODUCTION!)
-- Le hash bcrypt pour 'admin123' est généré avec un salt de 10
INSERT INTO users (email, password, role)
VALUES (
  'admin@zkvote.com',
  '$2a$12$z79uAlfEicYMo1/9bStj/uawk5/8YP94OFCa.8q2.z48aT8ghdYD6',
  'admin'
) ON CONFLICT (email) DO NOTHING;

-- Commenter pour information:
-- Pour générer un nouveau hash bcrypt pour un mot de passe:
-- Utilisez bcrypt.hash('votre_mot_de_passe', 10) dans Node.js
