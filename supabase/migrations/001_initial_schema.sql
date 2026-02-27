-- Invite codes table
CREATE TABLE invite_codes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT UNIQUE NOT NULL,
  method TEXT NOT NULL CHECK (method IN ('dice', 'point_buy', 'direct')),
  era TEXT NOT NULL CHECK (era IN ('classic_1920s', 'modern', 'gaslight')),
  max_tries INTEGER NOT NULL DEFAULT 1,
  times_used INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Characters table
CREATE TABLE characters (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  invite_code_id UUID NOT NULL REFERENCES invite_codes(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'submitted')),
  name TEXT,
  age INTEGER,
  gender TEXT,
  appearance TEXT,
  characteristics JSONB DEFAULT '{}',
  luck INTEGER,
  derived JSONB DEFAULT '{}',
  occupation_id TEXT,
  occupation_skill_points JSONB DEFAULT '{}',
  personal_skill_points JSONB DEFAULT '{}',
  backstory JSONB DEFAULT '{}',
  equipment JSONB DEFAULT '[]',
  cash TEXT,
  assets TEXT,
  spending_level TEXT,
  era TEXT,
  method TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Index for finding characters by invite code
CREATE INDEX idx_characters_invite_code ON characters(invite_code_id);

-- RPC function: atomic increment of times_used
CREATE OR REPLACE FUNCTION increment_times_used(code_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE invite_codes
  SET times_used = times_used + 1
  WHERE id = code_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER characters_updated_at
  BEFORE UPDATE ON characters
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- RLS policies
ALTER TABLE invite_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE characters ENABLE ROW LEVEL SECURITY;

-- Anon can read active invite codes
CREATE POLICY "anon_read_invite_codes" ON invite_codes
  FOR SELECT TO anon
  USING (is_active = true);

-- Anon can read all characters
CREATE POLICY "anon_read_characters" ON characters
  FOR SELECT TO anon
  USING (true);

-- Anon can insert characters
CREATE POLICY "anon_insert_characters" ON characters
  FOR INSERT TO anon
  WITH CHECK (true);

-- Anon can update only draft characters
CREATE POLICY "anon_update_draft_characters" ON characters
  FOR UPDATE TO anon
  USING (status = 'draft')
  WITH CHECK (status IN ('draft', 'submitted'));

-- Anon can delete draft characters (for re-roll replacement)
CREATE POLICY "anon_delete_draft_characters" ON characters
  FOR DELETE TO anon
  USING (status = 'draft');

-- Service role has full access (used by admin Edge Function)
CREATE POLICY "service_role_all_invite_codes" ON invite_codes
  FOR ALL TO service_role
  USING (true)
  WITH CHECK (true);

CREATE POLICY "service_role_all_characters" ON characters
  FOR ALL TO service_role
  USING (true)
  WITH CHECK (true);
