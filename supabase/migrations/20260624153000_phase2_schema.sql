-- ============================================================
-- Phase 2 — Schema updates & fixes for Runnaract 2.0
-- ============================================================
-- ⚠️ AFTER RUNNING THIS MIGRATION, CREATE A STORAGE BUCKET:
-- Name: receipts
-- Public: true
-- (via Supabase Dashboard > Storage > New Bucket)
-- This is needed for receipt uploads in the transfer payment flow.

-- 1. Add "prefer not to say" gender option
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_enum
    WHERE enumlabel = 'prefer_not_to_say'
      AND enumtypid = 'gender_type'::regtype
  ) THEN
    ALTER TYPE public.gender_type ADD VALUE 'prefer_not_to_say';
  END IF;
END;
$$;

-- 2. Add carta responsiva fields to participants
ALTER TABLE public.participants
  ADD COLUMN IF NOT EXISTS carta_responsiva_url TEXT,
  ADD COLUMN IF NOT EXISTS is_minor BOOLEAN NOT NULL DEFAULT false;

-- 3. Create sponsors table
CREATE TABLE IF NOT EXISTS public.sponsors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  logo_url TEXT,
  website_url TEXT,
  social_url TEXT,
  sponsorship_level TEXT NOT NULL DEFAULT 'basic',
  display_order INT NOT NULL DEFAULT 0,
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. Fix capacity guard — count only approved payments
CREATE OR REPLACE FUNCTION public.enforce_capacity()
RETURNS trigger LANGUAGE plpgsql AS $$
DECLARE
  approved_count INTEGER;
BEGIN
  SELECT COUNT(DISTINCT participant_id) INTO approved_count
  FROM public.payments
  WHERE payment_status = 'approved';
  IF approved_count >= 2000 THEN
    RAISE EXCEPTION 'CAPACITY_REACHED' USING ERRCODE = 'check_violation';
  END IF;
  RETURN NEW;
END;
$$;

-- 5. Fix folio generation — trigger on payment approval, not participant INSERT
DROP TRIGGER IF EXISTS set_registration_folio ON public.participants;

CREATE OR REPLACE FUNCTION public.assign_folio_on_payment_approval()
RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  IF NEW.payment_status = 'approved'
     AND (OLD.payment_status IS DISTINCT FROM 'approved')
  THEN
    UPDATE public.participants
    SET registration_folio = 'RUNN26-' || LPAD(nextval('public.registration_folio_seq')::TEXT, 4, '0')
    WHERE id = NEW.participant_id
      AND registration_folio IS NULL;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS assign_folio_on_payment_approval ON public.payments;
CREATE TRIGGER assign_folio_on_payment_approval
  AFTER UPDATE ON public.payments
  FOR EACH ROW
  EXECUTE FUNCTION public.assign_folio_on_payment_approval();

-- 6. Race categories — add phase-based pricing helper
CREATE OR REPLACE FUNCTION public.current_price(p_distance_km INT)
RETURNS INT LANGUAGE plpgsql IMMUTABLE AS $$
BEGIN
  -- Phase 1: until July 10 2026 23:59:59 CST
  IF CURRENT_TIMESTAMP AT TIME ZONE 'America/Mexico_City'
     <= '2026-07-10 23:59:59-06:00'::TIMESTAMPTZ
  THEN
    RETURN CASE p_distance_km
      WHEN 3 THEN 300
      WHEN 5 THEN 400
      WHEN 10 THEN 450
      ELSE 0
    END;
  ELSE
    RETURN CASE p_distance_km
      WHEN 3 THEN 350
      WHEN 5 THEN 450
      WHEN 10 THEN 500
      ELSE 0
    END;
  END IF;
END;
$$;

-- Keep race_categories prices in sync via a daily-updatable view
CREATE OR REPLACE VIEW public.race_categories_with_current_price AS
SELECT
  id,
  name,
  distance_km,
  current_price(distance_km) AS current_price,
  price AS base_price,
  active
FROM public.race_categories;

-- 7. Grants
GRANT SELECT ON public.sponsors TO anon, authenticated;
GRANT ALL ON public.sponsors TO service_role;

-- 8. RLS policies
ALTER TABLE public.sponsors ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Sponsors are publicly readable" ON public.sponsors;
CREATE POLICY "Sponsors are publicly readable"
  ON public.sponsors FOR SELECT
  TO anon, authenticated
  USING (active = true);

-- Allow public lookup of registration by email or folio
DROP POLICY IF EXISTS "Participants are readable by lookup" ON public.participants;
CREATE POLICY "Participants are readable by lookup"
  ON public.participants FOR SELECT
  TO anon, authenticated
  USING (true);

-- Allow public lookup of payments linked to their participant
DROP POLICY IF EXISTS "Payments are readable by lookup" ON public.payments;
CREATE POLICY "Payments are readable by lookup"
  ON public.payments FOR SELECT
  TO anon, authenticated
  USING (true);

-- 9. Helper function for public registration lookup
CREATE OR REPLACE FUNCTION public.lookup_registration(
  p_email TEXT DEFAULT NULL,
  p_folio TEXT DEFAULT NULL
)
RETURNS TABLE(
  first_name TEXT,
  last_name TEXT,
  distance_km INT,
  payment_status TEXT,
  registration_folio TEXT,
  contact_email TEXT,
  category_name TEXT
)
LANGUAGE plpgsql SECURITY DEFINER STABLE AS $$
BEGIN
  RETURN QUERY
  SELECT
    pp.first_name,
    pp.last_name,
    rc.distance_km,
    py.payment_status::TEXT,
    pp.registration_folio,
    'registro@runnaract.mx'::TEXT AS contact_email,
    rc.name AS category_name
  FROM public.participants pp
  JOIN public.race_categories rc ON rc.id = pp.category_id
  LEFT JOIN LATERAL (
    SELECT payment_status
    FROM public.payments
    WHERE participant_id = pp.id
    ORDER BY created_at DESC
    LIMIT 1
  ) py ON true
  WHERE (p_email IS NOT NULL AND LOWER(pp.email) = LOWER(p_email))
     OR (p_folio IS NOT NULL AND pp.registration_folio = p_folio)
  LIMIT 1;
END;
$$;

GRANT EXECUTE ON FUNCTION public.lookup_registration TO anon, authenticated;
