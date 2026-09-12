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

  try {
    let decoded = rawCookie
    try {
      decoded = decodeURIComponent(rawCookie)
    } catch {
      // Use raw if decodeURIComponent fails
    }

    const parsed = JSON.parse(decoded)
    if (parsed && (parsed.id || parsed.email)) {
      return {
        id: parsed.id || `usr_${Date.now()}`,
        email: parsed.email || 'operator@nakshatra-x.space',
        full_name: parsed.full_name || 'Orbital Operator',
        avatar_url: parsed.avatar_url || '',
        role: parsed.role || 'operator',
        provider: parsed.provider || 'Email OTP',
        designation: parsed.designation || 'Mission Specialist',
        email_verified: !!parsed.email_verified,
      }
    }
  } catch (err) {
    console.error('[AUTH] Failed to parse session cookie:', err)
  }

  return null
}

export async function getCurrentUser(): Promise<UserProfile | null> {
  try {
    const cookieStore = await cookies()

    // Check for authenticated operator session cookie
    const sessionCookie = cookieStore.get('nx-operator-session')?.value
    return parseSessionCookie(sessionCookie)
  } catch (err) {
    console.error('[AUTH] getCurrentUser error:', err)
    return null
  }
}
