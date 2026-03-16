-- Add self_prediction_text to audits table
ALTER TABLE audits
ADD COLUMN self_prediction_text TEXT;
