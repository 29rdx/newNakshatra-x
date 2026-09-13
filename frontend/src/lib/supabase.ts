import { createClient } from '@supabase/supabase-js'

const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://xtnfzngrhdtazisrvbci.supabase.co'
const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_EJZOXmiFJaI553N9DzCGuw_wA5BdnsB'
const supabaseServiceKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY || ''

// Client-side Supabase client (anon key)
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Server-side Admin Supabase client (service role key, bypasses RLS)
// Safely created only when service role key is present; falls back to standard client on browser side to prevent runtime crash
export const supabaseAdmin = supabaseServiceKey
  ? createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    })
  : supabase

export interface SupabaseProfile {
  id: string
  email: string
  full_name: string
  avatar_url?: string | null
  role?: string
  provider?: string
  last_sign_in_at?: string
  created_at?: string
}

/**
 * Trigger Google OAuth Sign-in through Supabase
 */
export async function signInWithSupabaseGoogle(redirectTo?: string) {
  const origin = typeof window !== 'undefined' ? window.location.origin : ''
  const targetRedirect = redirectTo || `${origin}/auth/callback`

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: targetRedirect,
      queryParams: {
        access_type: 'offline',
        prompt: 'consent',
      },
    },
  })

  if (error) {
    throw error
  }

  // If Supabase returns an OAuth redirect URL, redirect the browser
  if (data?.url && typeof window !== 'undefined') {
    window.location.href = data.url
  }

  return data
}

