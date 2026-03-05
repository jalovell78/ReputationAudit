-- Migration: Multi-Rater Support
-- Run this in the Supabase SQL Editor

-- Add archetype_group column for grouping multiple raters under a role label
ALTER TABLE feedback_entries
ADD COLUMN IF NOT EXISTS archetype_group TEXT DEFAULT NULL;
-- e.g. 'manager', 'peer', 'direct_report', 'client', 'friend', 'family', 'critic'

COMMENT ON COLUMN feedback_entries.archetype_group IS 'Grouping label for aggregated sentiment (allows multiple raters per group)';

-- NOTE: The previous schema had a UNIQUE constraint on (audit_id, archetype) that prevented
-- multiple raters per archetype. If such a constraint exists, drop it:
-- ALTER TABLE feedback_entries DROP CONSTRAINT IF EXISTS feedback_entries_audit_id_archetype_key;
-- (Check constraint name in your Supabase dashboard under Table Editor > Indexes & Constraints)
