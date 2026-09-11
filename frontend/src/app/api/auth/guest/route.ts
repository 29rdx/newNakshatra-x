import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import crypto from 'crypto'

// Guest/Demo quick login — 1-click access with a demo profile
export async function POST(request: Request) {
  try {
    const isHttps = request.headers.get('x-forwarded-proto') === 'https' ||
                    process.env.NODE_ENV === 'production'

    const guestProfile = {
      id: `guest_${crypto.randomBytes(6).toString('hex')}`,
      email: 'guest@nakshatra-x.demo',
      full_name: 'Guest Operator',
      avatar_url: `https://api.dicebear.com/7.x/bottts/svg?seed=guest-${Date.now()}&backgroundColor=050b14`,
      role: 'guest',
      designation: 'Demo Observer',
      provider: 'Guest Access',
      email_verified: false,
      verified_at: new Date().toISOString(),
    }

    const cookieStore = await cookies()
    cookieStore.set('nx-operator-session', JSON.stringify(guestProfile), {
      httpOnly: false, // Allow client-side sync so browser never drops session
      secure: isHttps,
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24, // 1 day for guests
    })

    console.log(`[AUTH/GUEST] Guest session created: ${guestProfile.id}`)

    return NextResponse.json({
      success: true,
      message: 'Guest session created',
      user: guestProfile,
    })
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || 'Failed to create guest session' },
      { status: 500 }
    )
  }
}
