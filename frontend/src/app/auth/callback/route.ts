import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { supabaseAdmin, supabase } from '@/lib/supabase'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') || '/dashboard'

  if (code) {
    try {
      const { data, error } = await supabase.auth.exchangeCodeForSession(code)

      if (!error && data?.user) {
        const user = data.user
        const meta = user.user_metadata || {}

        const profile = {
          id: user.id,
          email: user.email || '',
          full_name:
            meta.full_name || meta.name || user.email?.split('@')[0] || 'Orbital Specialist',
          avatar_url: meta.avatar_url || meta.picture || '',
          role: 'operator',
          designation: 'Mission Specialist',
          provider: 'Supabase Google',
          email_verified: !!user.email_confirmed_at,
          last_sign_in_at: user.last_sign_in_at || new Date().toISOString(),
          created_at: user.created_at || new Date().toISOString(),
        }

        // 1. Try to upsert into Supabase public.profiles table (if created)
        try {
          await supabaseAdmin.from('profiles').upsert(
            {
              id: profile.id,
              email: profile.email,
              full_name: profile.full_name,
              avatar_url: profile.avatar_url,
              role: profile.role,
              provider: profile.provider,
              last_sign_in_at: new Date().toISOString(),
            },
            { onConflict: 'id' }
          )
        } catch (dbErr) {
          console.warn('[SUPABASE] Could not write to profiles table (table may not exist yet):', dbErr)
        }

        // 2. Set authenticated operator session cookie for the frontend
        const cookieStore = await cookies()
        const isHttps =
          request.headers.get('x-forwarded-proto') === 'https' ||
          process.env.NODE_ENV === 'production'

        cookieStore.set('nx-operator-session', JSON.stringify(profile), {
          httpOnly: false,
          secure: isHttps,
          sameSite: 'lax',
          path: '/',
          maxAge: 60 * 60 * 24 * 7, // 7 days
        })

        return NextResponse.redirect(`${origin}${next}`)
      }
    } catch (exchangeErr) {
      console.error('[SUPABASE] Exchange code error:', exchangeErr)
    }
  }

  // If code exchange failed or wasn't provided, redirect back to login
  return NextResponse.redirect(`${origin}/login?error=auth_failed`)
}
