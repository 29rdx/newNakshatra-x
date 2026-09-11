-- ==============================================================================
-- NAKSHATRA-X : ENTERPRISE USER DATA STORE & REAL-TIME GOOGLE AUTH SYNC
-- ==============================================================================

-- 1. Create Types safely if they don't already exist
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role') THEN
    CREATE TYPE user_role AS ENUM ('user', 'operator', 'analyst', 'admin', 'superadmin');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'subscription_tier') THEN
    CREATE TYPE subscription_tier AS ENUM ('free', 'pro', 'enterprise', 'orbital');
  END IF;
END $$;

-- 2. Create the unified user profile table
CREATE TABLE IF NOT EXISTS public.db_users (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL PRIMARY KEY,
  
  -- Identity & Personal Variables
  email TEXT UNIQUE NOT NULL,
  first_name TEXT,
  last_name TEXT,
  full_name TEXT,
  avatar_url TEXT,
  phone_number TEXT,
  
  -- Nakshatra-X Orbital Mission Roles & Clearances
  role user_role DEFAULT 'user'::user_role NOT NULL,
  designation TEXT DEFAULT 'Mission Specialist',
  security_clearance TEXT DEFAULT 'Level-1 (Telemetry Access)',
  
  -- Authentication & Telemetry Variables
  auth_provider TEXT DEFAULT 'google',
  last_sign_in_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  last_sign_in_ip TEXT,
  sign_in_count INTEGER DEFAULT 1,
  
  -- Subscription & Tier
  subscription_tier subscription_tier DEFAULT 'free'::subscription_tier NOT NULL,
  subscription_status TEXT DEFAULT 'active',
  
  -- UI / Mission Control Preferences (Dark mode, GIS overlays, alerts)
  preferences JSONB DEFAULT '{
    "theme": "dark",
    "gis3d": true,
    "sound_alerts": true,
    "telemetry_refresh_rate_ms": 2000,
    "preferred_projection": "3d-globe"
  }'::jsonb,
  
  -- Extra Metadata from Google OAuth (Locale, verified email, etc.)
  metadata JSONB DEFAULT '{}'::jsonb,
  
  -- Audit Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Configure Row Level Security (RLS)
ALTER TABLE public.db_users ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public profiles are viewable by authenticated users" ON public.db_users;
CREATE POLICY "Public profiles are viewable by authenticated users" ON public.db_users
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users can insert their own profile" ON public.db_users;
CREATE POLICY "Users can insert their own profile" ON public.db_users
  FOR INSERT WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update their own profile" ON public.db_users;
CREATE POLICY "Users can update their own profile" ON public.db_users
  FOR UPDATE USING (auth.uid() = id);

-- 4. Intelligent Auto-Sync Trigger from Google OAuth (auth.users)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  v_full_name TEXT;
  v_first_name TEXT;
  v_last_name TEXT;
  v_avatar TEXT;
  v_provider TEXT;
BEGIN
  -- Extract real data supplied by Google OAuth
  v_full_name := COALESCE(
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'name',
    split_part(NEW.email, '@', 1)
  );
  
  v_first_name := COALESCE(
    NEW.raw_user_meta_data->>'given_name',
    split_part(v_full_name, ' ', 1)
  );
  
  v_last_name := COALESCE(
    NEW.raw_user_meta_data->>'family_name',
    NULLIF(substring(v_full_name from ' (.*)$'), ''),
    ''
  );
  
  v_avatar := COALESCE(
    NEW.raw_user_meta_data->>'avatar_url',
    NEW.raw_user_meta_data->>'picture',
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'
  );

  v_provider := COALESCE(
    NEW.raw_app_meta_data->>'provider',
    'google'
  );

  -- Upsert real profile into public.db_users
  INSERT INTO public.db_users (
    id,
    email,
    first_name,
    last_name,
    full_name,
    avatar_url,
    auth_provider,
    last_sign_in_at,
    metadata
  )
  VALUES (
    NEW.id,
    NEW.email,
    v_first_name,
    v_last_name,
    v_full_name,
    v_avatar,
    v_provider,
    timezone('utc'::text, now()),
    COALESCE(NEW.raw_user_meta_data, '{}'::jsonb)
  )
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    full_name = COALESCE(EXCLUDED.full_name, db_users.full_name),
    avatar_url = COALESCE(EXCLUDED.avatar_url, db_users.avatar_url),
    last_sign_in_at = timezone('utc'::text, now()),
    sign_in_count = db_users.sign_in_count + 1,
    metadata = EXCLUDED.metadata,
    updated_at = timezone('utc'::text, now());

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 5. Attach the trigger on auth.users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT OR UPDATE ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- 6. Updated_at auto-trigger
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = timezone('utc'::text, now());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_db_users_updated_at ON public.db_users;
CREATE TRIGGER trg_db_users_updated_at
  BEFORE UPDATE ON public.db_users
  FOR EACH ROW EXECUTE PROCEDURE public.set_updated_at();
