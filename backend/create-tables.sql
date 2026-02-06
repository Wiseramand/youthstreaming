-- Create tables for Youth Angola Streaming

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  role TEXT DEFAULT 'USER' CHECK (role IN ('USER', 'ADMIN', 'VIP')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  avatar_url TEXT,
  bio TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Donations table
CREATE TABLE IF NOT EXISTS donations (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
  amount DECIMAL(10,2) NOT NULL,
  method TEXT NOT NULL,
  identifier TEXT,
  name TEXT,
  user_id TEXT REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Streams table
CREATE TABLE IF NOT EXISTS streams (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  source_type TEXT NOT NULL CHECK (source_type IN ('YOUTUBE', 'OBS')),
  source_url TEXT NOT NULL,
  thumbnail TEXT NOT NULL,
  category TEXT DEFAULT 'Geral',
  is_live BOOLEAN DEFAULT true,
  access_level TEXT DEFAULT 'PUBLIC' CHECK (access_level IN ('PUBLIC', 'VIP')),
  viewers INTEGER DEFAULT 0,
  user_id TEXT REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_donations_user_id ON donations(user_id);
CREATE INDEX IF NOT EXISTS idx_streams_user_id ON streams(user_id);
CREATE INDEX IF NOT EXISTS idx_streams_is_live ON streams(is_live);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for updated_at
DROP TRIGGER IF EXISTS update_users_updated_at ON users;
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_profiles_updated_at ON profiles;
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_streams_updated_at ON streams;
CREATE TRIGGER update_streams_updated_at BEFORE UPDATE ON streams FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert admin user
INSERT INTO users (email, password, role) VALUES 
('wisebacasol@gmail.com', '$2b$10$i3ViUHb.zVZrHMjd5nlbV.gtqPaQfs0Zf/LADIpZeLPWnIvQndWdm', 'ADMIN')
ON CONFLICT (email) DO NOTHING;

-- Insert admin profile
INSERT INTO profiles (user_id, full_name) 
SELECT id, 'Administrador' FROM users WHERE email = 'wisebacasol@gmail.com'
ON CONFLICT (user_id) DO NOTHING;

-- Test data
INSERT INTO streams (title, description, source_type, source_url, thumbnail, category, access_level, user_id) 
SELECT 
  'Test Stream',
  'Stream de teste para validação',
  'YOUTUBE',
  'https://youtube.com/watch?v=test',
  'https://via.placeholder.com/300x150',
  'Teste',
  'PUBLIC',
  id 
FROM users WHERE email = 'wisebacasol@gmail.com'
ON CONFLICT DO NOTHING;

INSERT INTO donations (amount, method, identifier, name, user_id)
SELECT 
  10.50,
  'PayPal',
  'test123',
  'Test User',
  id
FROM users WHERE email = 'wisebacasol@gmail.com'
ON CONFLICT DO NOTHING;

SELECT 'Tables created successfully!' as status;