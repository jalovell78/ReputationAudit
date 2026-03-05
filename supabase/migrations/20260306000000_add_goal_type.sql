-- Migration: Add goal_type and self_audit_responses to audits table
-- Run this in the Supabase SQL Editor

ALTER TABLE audits 
ADD COLUMN IF NOT EXISTS goal_type TEXT DEFAULT NULL;
-- Values: 'career_progression' | 'leadership_mastery' | 'personal_growth' | 'social_intelligence'

ALTER TABLE audits
ADD COLUMN IF NOT EXISTS self_audit_responses JSONB DEFAULT NULL;
-- Stores: { "communication": 3, "leadership": 4, "integrity": 5, ... }

COMMENT ON COLUMN audits.goal_type IS 'The strategic development goal chosen during audit creation';
COMMENT ON COLUMN audits.self_audit_responses IS 'Self-assessment scores keyed by dimension (1-5 scale)';
