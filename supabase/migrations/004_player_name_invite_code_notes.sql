-- Add player_name: the real name of the player (distinct from character name)
ALTER TABLE characters ADD COLUMN player_name TEXT;

-- Add invite_code: denormalized copy of the code string for easy display
ALTER TABLE characters ADD COLUMN invite_code TEXT;

-- Add admin_notes: freeform text for the Keeper's notes
ALTER TABLE characters ADD COLUMN admin_notes TEXT DEFAULT '';
