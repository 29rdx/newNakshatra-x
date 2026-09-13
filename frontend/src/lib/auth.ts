import { cookies } from 'next/headers'

export interface UserProfile {
  id: string
  email: string
  full_name: string
  avatar_url?: string
  role: string
  provider: string
  designation?: string
  email_verified?: boolean
}

export function parseSessionCookie(rawCookie: string | undefined): UserProfile | null {
  if (!rawCookie) return null

  const candidates = [rawCookie]
  try {
    const decodedOnce = decodeURIComponent(rawCookie)
    candidates.push(decodedOnce)
    try {
      candidates.push(decodeURIComponent(decodedOnce))
    } catch {
      // Ignore double decode error
    }
  } catch {
    // Ignore single decode error
  }

  for (const str of candidates) {
    try {
      const parsed = typeof str === 'string' ? JSON.parse(str) : str
      if (parsed && typeof parsed === 'object' && (parsed.id || parsed.email)) {
        return {
          id: parsed.id || `usr_${Date.now()}`,
          email: parsed.email || 'operator@nakshatra-x.space',
          full_name: parsed.full_name || parsed.name || 'Orbital Operator',
          avatar_url: parsed.avatar_url || '',
          role: parsed.role || 'operator',
          provider: parsed.provider || 'Session Auth',
          designation: parsed.designation || 'Mission Specialist',
          email_verified: !!parsed.email_verified,
        }
      }
    } catch {
      // Try next candidate
    }
  }

  return null
}

export async function getCurrentUser(): Promise<UserProfile | null> {
  try {
    const cookieStore = await cookies()

    // 1. Check for authenticated operator session cookie
    const sessionCookie = cookieStore.get('nx-operator-session')?.value
    const user = parseSessionCookie(sessionCookie)
    if (user) return user

    // 2. Check for admin token or admin session fallback
    const adminToken = cookieStore.get('nx_admin_token')?.value
    const adminUser = parseSessionCookie(adminToken)
    if (adminUser) return adminUser

    const isAdminSession = cookieStore.get('admin_session')?.value
    if (isAdminSession === 'true') {
      return {
        id: 'admin_commander_root',
        email: 'admin@nakshatra-x.space',
        full_name: 'Chief Orbital Commander',
        avatar_url: 'https://api.dicebear.com/7.x/bottts/svg?seed=admin&backgroundColor=050b14',
        role: 'superadmin',
        provider: 'Master Administration',
        designation: 'Chief Administrator',
        email_verified: true,
      }
    }
  } catch (err) {
    console.error('[AUTH] getCurrentUser error:', err)
  }

  return null
}
