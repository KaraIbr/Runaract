-- Admin user for Runnaract admin panel
-- Run this in Supabase SQL Editor (runs as service_role)
-- Email: eva@runnaract.com
-- Password: Evarocks123

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'eva@runnaract.com') THEN
    INSERT INTO auth.users (
      instance_id,
      id,
      aud,
      role,
      email,
      encrypted_password,
      email_confirmed_at,
      created_at,
      updated_at,
      confirmation_token,
      confirmation_sent_at,
      recovery_token
    ) VALUES (
      '00000000-0000-0000-0000-000000000000',
      gen_random_uuid(),
      'authenticated',
      'authenticated',
      'eva@runnaract.com',
      crypt('Evarocks123', gen_salt('bf')),
      now(),
      now(),
      now(),
      '',
      now(),
      ''
    );
  END IF;
END $$;
