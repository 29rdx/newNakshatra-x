import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { supabase } from '@/lib/supabase'

// GET: Handles GitHub OAuth Redirect Callback, Exchanges Token & Logs User In
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const state = searchParams.get('state')
  const errorParam = searchParams.get('error')

  if (errorParam || !code) {
    const loginUrl = new URL('/login', origin)
    loginUrl.searchParams.set('error', 'GitHub authentication was cancelled or failed.')
    return NextResponse.redirect(loginUrl)
  }

  const clientId = process.env.GITHUB_CLIENT_ID || process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID
  const clientSecret = process.env.GITHUB_CLIENT_SECRET

  if (!clientId || !clientSecret) {
    const loginUrl = new URL('/login', origin)
    loginUrl.searchParams.set(
      'error',
      'GitHub Client Secret is missing in .env.local. Please set GITHUB_CLIENT_SECRET.'
    )
    return NextResponse.redirect(loginUrl)
  }

  try {
    // 1. Exchange temporary authorization code for GitHub access token
    const tokenRes = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        client_id: clientId,
        client_secret: clientSecret,
        code,
        redirect_uri: `${origin}/api/auth/github/callback`,
      }),
    })

    const tokenData = await tokenRes.json()

    if (tokenData.error || !tokenData.access_token) {
      console.error('[AUTH/GITHUB/CALLBACK] Token exchange error:', tokenData)
      const loginUrl = new URL('/login', origin)
      loginUrl.searchParams.set('error', tokenData.error_description || 'Failed to obtain access token from GitHub.')
      return NextResponse.redirect(loginUrl)
    }

    const accessToken = tokenData.access_token

    // 2. Fetch User Profile from GitHub API
    const userRes = await fetch('https://api.github.com/user', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'User-Agent': 'NAKSHATRA-X-Space-Platform',
      },
    })

    const ghUser = await userRes.json()

    if (!ghUser || !ghUser.id) {
      throw new Error('Failed to retrieve GitHub user profile.')
    }

    // 3. Fetch Primary Email if GitHub user email is private
    let primaryEmail = ghUser.email

    if (!primaryEmail) {
      const emailRes = await fetch('https://api.github.com/user/emails', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'User-Agent': 'NAKSHATRA-X-Space-Platform',
        },
      })
      const emails = await emailRes.json().catch(() => [])
      if (Array.isArray(emails)) {
        const primaryObj = emails.find((e: any) => e.primary && e.verified) || emails[0]
        if (primaryObj?.email) {
          primaryEmail = primaryObj.email
        }
      }
    }

    const userEmail = primaryEmail || `${ghUser.login}@users.noreply.github.com`
    const fullName = ghUser.name || ghUser.login || 'GitHub Mission Specialist'
    const avatarUrl = ghUser.avatar_url || ''

    const userProfile = {
      id: `gh_${ghUser.id}`,
      email: userEmail,
      full_name: fullName,
      avatar_url: avatarUrl,
      role: 'operator',
      designation: 'GitHub Verified Specialist',
      provider: 'GitHub OAuth 2.0',
      email_verified: true,
    }

    // 4. Synchronize user profile into Supabase PostgreSQL profiles table
    try {
      await supabase.from('profiles').upsert(
        {
          id: userProfile.id,
          email: userProfile.email,
          full_name: userProfile.full_name,
          avatar_url: userProfile.avatar_url,
          role: userProfile.role,
          provider: userProfile.provider,
          last_sign_in_at: new Date().toISOString(),
        },
        { onConflict: 'id' }
      )
    } catch (dbErr) {
      console.warn('[AUTH/GITHUB] Supabase profiles sync notice:', dbErr)
    }

    // 5. Establish Server Session Cookie
    const isHttps =
      request.headers.get('x-forwarded-proto') === 'https' ||
      process.env.NODE_ENV === 'production'

    const cookieStore = await cookies()
    cookieStore.set('nx-operator-session', JSON.stringify(userProfile), {
      httpOnly: false,
      secure: isHttps,
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    })

    // Redirect to Dashboard upon successful login
    return NextResponse.redirect(new URL('/dashboard', origin))
  } catch (err: any) {
    console.error('[AUTH/GITHUB/CALLBACK] Callback Exception:', err)
    const loginUrl = new URL('/login', origin)
    loginUrl.searchParams.set('error', err?.message || 'GitHub login callback failed.')
    return NextResponse.redirect(loginUrl)
  }
}
