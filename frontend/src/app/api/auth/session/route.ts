import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { parseSessionCookie } from '@/lib/auth'

export async function GET() {
  try {
    const cookieStore = await cookies()
    const sessionVal = cookieStore.get('nx-operator-session')?.value
    const user = parseSessionCookie(sessionVal)

    return NextResponse.json({ user })
  } catch (err: any) {
    return NextResponse.json({ user: null })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}))

    if (!body.id && !body.email) {
      return NextResponse.json(
        { error: 'Missing required user identification' },
        { status: 400 }
      )
    }

    const userProfile = {
      id: body.id || `usr-${Date.now()}`,
      email: body.email || '',
      full_name: body.full_name || body.name || body.email?.split('@')[0] || 'Orbital Operator',
      avatar_url: body.avatar_url || body.photoURL || '',
      role: body.role || 'operator',
      designation: body.designation || 'Mission Specialist',
      provider: body.provider || 'Email Verification',
      email_verified: !!body.email_verified,
    }

    const isHttps = request.headers.get('x-forwarded-proto') === 'https' ||
                    process.env.NODE_ENV === 'production'

    const cookieStore = await cookies()
    cookieStore.set('nx-operator-session', JSON.stringify(userProfile), {
      httpOnly: true,
      secure: isHttps,
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    })

    return NextResponse.json({
      success: true,
      user: userProfile,
    })
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || 'Failed to establish session' },
      { status: 500 }
    )
  }
}

export async function DELETE() {
  try {
    const cookieStore = await cookies()
    cookieStore.set('nx-operator-session', '', {
      httpOnly: true,
      sameSite: 'lax',
      path: '/',
      maxAge: 0,
    })
  } catch {
    // Ignore
  }
  return NextResponse.json({ success: true })
}
