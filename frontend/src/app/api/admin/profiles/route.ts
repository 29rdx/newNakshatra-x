import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET() {
  const cookieStore = await cookies()
  const isAdmin = cookieStore.get('admin_session')?.value === 'true'

  if (!isAdmin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const usersList: any[] = []
  const seenIds = new Set<string>()

  // 1. Fetch real authenticated users directly from Supabase Auth via Admin SDK
  try {
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.listUsers()
    if (!authError && authData?.users) {
      for (const u of authData.users) {
        seenIds.add(u.id)
        const meta = u.user_metadata || {}
        const appMeta = u.app_metadata || {}
        const providerName =
          appMeta.provider === 'nakshatra-admin-sealed'
            ? 'Master Admin'
            : appMeta.provider === 'google'
            ? 'Google OAuth'
            : appMeta.provider === 'email'
            ? 'Email OTP'
            : (u.identities && u.identities[0]?.provider) || 'Supabase Auth'

        usersList.push({
          id: u.id,
          email: u.email || 'No Email',
          full_name:
            meta.full_name || meta.name || u.email?.split('@')[0] || 'Orbital Operator',
          avatar_url: meta.avatar_url || meta.picture || null,
          role:
            meta.role ||
            (appMeta.role === 'superadmin' ? 'Chief Orbital Commander' : 'Mission Specialist'),
          provider: providerName,
          created_at: u.created_at,
          last_sign_in_at: u.last_sign_in_at || u.created_at || new Date().toISOString(),
        })
      }
    }
  } catch (err) {
    console.error('[ADMIN] Error listing Supabase auth users:', err)
  }


  // 2. Fetch from Supabase profiles table (if created)
  try {
    const { data: profiles, error: profError } = await supabaseAdmin
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false })

    if (!profError && profiles) {
      for (const p of profiles) {
        if (!seenIds.has(p.id)) {
          seenIds.add(p.id)
          usersList.push({
            id: p.id,
            email: p.email,
            full_name: p.full_name,
            avatar_url: p.avatar_url || null,
            role: p.role || 'operator',
            provider: p.provider || 'Supabase',
            created_at: p.created_at,
            last_sign_in_at: p.last_sign_in_at || null,
          })
        }
      }
    }
  } catch (err) {
    console.warn('[ADMIN] Profiles table not yet queried:', err)
  }

  // 3. Fallback: Retrieve current active operator session if available
  const operatorSession = cookieStore.get('nx-operator-session')?.value
  if (operatorSession) {
    try {
      const parsed = JSON.parse(operatorSession)
      if (parsed.id && !seenIds.has(parsed.id)) {
        seenIds.add(parsed.id)
        usersList.push({
          id: parsed.id,
          email: parsed.email,
          full_name: parsed.full_name,
          avatar_url: parsed.avatar_url || null,
          role: parsed.role || 'operator',
          provider: parsed.provider || 'Session Active',
          created_at: new Date().toISOString(),
        })
      }
    } catch {
      // Fall through
    }
  }

  // 4. Also include default demo operators if list is empty
  if (usersList.length === 0) {
    usersList.push({
      id: 'op-commander-01',
      email: 'commander@nakshatra-x.space',
      full_name: 'Commander Rupraj Datta',
      avatar_url: null,
      role: 'Chief Orbital Commander',
      provider: 'Mission Specialist Access',
      created_at: new Date(Date.now() - 86400000).toISOString(),
    })
  }

  return NextResponse.json({ users: usersList })
}

