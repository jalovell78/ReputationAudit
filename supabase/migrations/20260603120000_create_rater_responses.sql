-- Migration: Create rater_responses table for metrics gathering
-- Run this in the Supabase SQL Editor

CREATE TABLE IF NOT EXISTS rater_responses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    audit_id UUID NOT NULL REFERENCES audits(id) ON DELETE CASCADE,
    category_name TEXT NOT NULL,
    quantitative_score INT NOT NULL CHECK (quantitative_score >= 1 AND quantitative_score <= 5),
    selected_tags TEXT[] DEFAULT NULL,
    optional_text_seed TEXT DEFAULT NULL,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Fast lookup for reports & dashboard metrics
CREATE INDEX IF NOT EXISTS rater_responses_audit_id_idx ON rater_responses(audit_id);

-- RLS
ALTER TABLE rater_responses ENABLE ROW LEVEL SECURITY;

-- Allow audit owners to retrieve responses for their own audits
CREATE POLICY "Allow audit owners to select rater responses"
    ON rater_responses FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM audits
            WHERE audits.id = rater_responses.audit_id
            AND audits.user_id = auth.uid()
        )
    );
