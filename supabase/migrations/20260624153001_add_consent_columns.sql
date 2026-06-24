-- ============================================================
-- Add consent_accepted column to consents table
-- ============================================================

ALTER TABLE public.consents
  ADD COLUMN IF NOT EXISTS consent_accepted BOOLEAN NOT NULL DEFAULT false;

-- Grant usage on storage bucket for carta responsiva uploads
-- The "runaract" bucket must already exist
-- Carta files will be stored under cartas/ folder inside the bucket
