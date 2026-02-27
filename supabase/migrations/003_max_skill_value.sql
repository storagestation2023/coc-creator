-- Add max_skill_value column (maximum value a single skill can reach during allocation)
ALTER TABLE invite_codes ADD COLUMN max_skill_value INTEGER NOT NULL DEFAULT 99;
