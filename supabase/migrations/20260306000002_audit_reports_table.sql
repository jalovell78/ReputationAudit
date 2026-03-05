-- Migration: Create audit_reports table for versioned report storage
-- Run this in the Supabase SQL Editor

CREATE TABLE IF NOT EXISTS audit_reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    audit_id UUID NOT NULL REFERENCES audits(id) ON DELETE CASCADE,
    report_markdown TEXT NOT NULL,
    perception_gap JSONB DEFAULT NULL,
    goal_type TEXT DEFAULT NULL,
    feedback_count INTEGER NOT NULL DEFAULT 0,  -- # of submitted entries at generation time
    generated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Fast lookup: latest report for a given audit
CREATE INDEX IF NOT EXISTS audit_reports_audit_id_generated_at_idx 
    ON audit_reports(audit_id, generated_at DESC);

-- RLS
ALTER TABLE audit_reports ENABLE ROW LEVEL SECURITY;

-- Users can only read reports belonging to their own audits
CREATE POLICY "Users can view reports for their own audits"
    ON audit_reports FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM audits 
            WHERE audits.id = audit_reports.audit_id 
            AND audits.user_id = auth.uid()
        )
    );
