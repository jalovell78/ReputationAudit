ALTER TABLE audits
ADD COLUMN stripe_session_id TEXT,
ADD COLUMN payment_status TEXT DEFAULT 'unpaid';
