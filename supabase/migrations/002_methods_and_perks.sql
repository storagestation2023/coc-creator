-- Add methods column (JSONB array of allowed creation methods per code)
ALTER TABLE invite_codes ADD COLUMN methods JSONB NOT NULL DEFAULT '["dice"]'::jsonb;

-- Add perks column (JSONB array of perk IDs)
ALTER TABLE invite_codes ADD COLUMN perks JSONB NOT NULL DEFAULT '[]'::jsonb;

-- Migrate existing rows: copy single method value into methods array
UPDATE invite_codes SET methods = jsonb_build_array(method);
