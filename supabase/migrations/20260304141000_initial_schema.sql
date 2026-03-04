-- Enable pgcrypto for UUIDs if needed, though gen_random_uuid() is built-in for PG 13+
-- CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Profiles Table (links to Supabase auth.users)
CREATE TABLE profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Audits Table (Grouping the 5 feedback requests)
CREATE TABLE audits (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    status TEXT DEFAULT 'in_progress', -- e.g. 'in_progress', 'completed'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Feedback Entries Table (The 5 archetypes per audit)
CREATE TABLE feedback_entries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    audit_id UUID NOT NULL REFERENCES audits(id) ON DELETE CASCADE,
    archetype TEXT NOT NULL, -- 'Close Friend', 'Client', 'Family Member', 'Critic/Hater', 'Subordinate'
    rater_name TEXT,
    rater_email TEXT,
    rater_link_id UUID UNIQUE DEFAULT gen_random_uuid(), -- Used for the zero-knowledge anonymous link
    status TEXT DEFAULT 'pending', -- 'pending', 'submitted'
    original_text TEXT,
    sanitized_text TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    submitted_at TIMESTAMP WITH TIME ZONE
);

-- RLS (Row Level Security) Policies
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE audits ENABLE ROW LEVEL SECURITY;
ALTER TABLE feedback_entries ENABLE ROW LEVEL SECURITY;

-- Profile Policies
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

-- Audit Policies
CREATE POLICY "Users can view own audits" ON audits FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create own audits" ON audits FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own audits" ON audits FOR UPDATE USING (auth.uid() = user_id);

-- Feedback Entries Policies
-- System or Auth user can view their own audit's feedback
CREATE POLICY "Users can view feedback for their audits" ON feedback_entries FOR SELECT USING (
    EXISTS (SELECT 1 FROM audits WHERE audits.id = feedback_entries.audit_id AND audits.user_id = auth.uid())
);
-- Users can insert feedback entries for their audits
CREATE POLICY "Users can insert feedback for their audits" ON feedback_entries FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM audits WHERE audits.id = feedback_entries.audit_id AND audits.user_id = auth.uid())
);
-- Anonymous raters can view pending feedback entry by rater_link_id
CREATE POLICY "Anonymous raters can view their invite" ON feedback_entries FOR SELECT USING (
    status = 'pending'
);
-- Anonymous raters can update (submit) their feedback entry via RPC or direct update if allowed
CREATE POLICY "Anonymous raters can submit feedback" ON feedback_entries FOR UPDATE USING (
    status = 'pending'
);
