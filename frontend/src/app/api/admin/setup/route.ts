import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { supabaseAdmin } from '@/lib/supabase'

/**
 * Checks if the single primary admin slot is occupied.
 */
async function checkAdminSlotStatus() {
  try {
    const { data, error } = await supabaseAdmin.auth.admin.listUsers()
    if (error) {
      console.error('[ADMIN/SETUP] listUsers error:', error)
      return { isSlotAvailable: true, adminCount: 0, adminUser: null }
    }

    const admin = data?.users?.find(
      (u) =>
        u.app_metadata?.role === 'superadmin' ||
        u.user_metadata?.is_primary_admin === true
    )

    if (admin) {
      return {
        isSlotAvailable: false,
        adminCount: 1,
        adminUser: {
          id: admin.id,
          email: admin.email,
          username: admin.user_metadata?.username || 'Commander',
          full_name: admin.user_metadata?.full_name || 'Primary Commander',
          created_at: admin.created_at,
        },
      }
    }

    return { isSlotAvailable: true, adminCount: 0, adminUser: null }
  } catch (err: any) {
    console.error('[ADMIN/SETUP] checkAdminSlotStatus exception:', err)
    return { isSlotAvailable: true, adminCount: 0, adminUser: null }
  }
}

// GET: Check slot availability
export async function GET() {
  const status = await checkAdminSlotStatus()
  return NextResponse.json({
    isSlotAvailable: status.isSlotAvailable,
    adminCount: status.adminCount,
    adminUser: status.adminUser,
    policy: 'SINGLE_PRIMARY_ADMIN_LOCK',
  })
}

// POST: Register the single primary administrator
export async function POST(request: Request) {
  try {
    // 1. Enforce strict single-slot lock
    const status = await checkAdminSlotStatus()
    if (!status.isSlotAvailable) {
      return NextResponse.json(
        {
          error:
            'ADMIN_SLOT_SEALED: The single primary admin slot has already been claimed. No additional admin accounts are permitted.',
          isSlotAvailable: false,
        },
        { status: 403 }
      )
    }

    const body = await request.json()
    const { email, password, username, fullName } = body

    if (!email || !email.includes('@')) {
      return NextResponse.json({ error: 'Valid email address is required.' }, { status: 400 })
    }

    if (!password || password.length < 8) {
      return NextResponse.json(
        { error: 'Master access password must be at least 8 characters long.' },
        { status: 400 }
      )
    }

    const adminUsername = (username || 'commander').trim().toLowerCase()
    const adminFullName = (fullName || 'Primary Orbital Commander').trim()

    // 2. Create the superadmin in Supabase Auth with bcrypt hashing
    const { data: created, error: createError } = await supabaseAdmin.auth.admin.createUser({
      email: email.trim().toLowerCase(),
      password: password,
      email_confirm: true,
      user_metadata: {
        is_primary_admin: true,
        username: adminUsername,
        full_name: adminFullName,
        role: 'Chief Orbital Commander',
        security_clearance: 'LEVEL-5-OMEGA',
      },
      app_metadata: {
        role: 'superadmin',
        provider: 'nakshatra-admin-sealed',
      },
    })

    if (createError || !created?.user) {
      return NextResponse.json(
        { error: createError?.message || 'Failed to initialize administrator in Supabase.' },
        { status: 500 }
      )
    }

    // 3. Record in public.profiles table as well
    try {
      await supabaseAdmin.from('profiles').upsert(
        {
          id: created.user.id,
          email: created.user.email,
          full_name: adminFullName,
          role: 'Chief Orbital Commander',
          provider: 'Master Admin',
          last_sign_in_at: new Date().toISOString(),
        },
        { onConflict: 'id' }
      )
    } catch {
      // Ignored if profiles table has specific policy
    }

    // 4. Automatically establish authenticated admin session
    const cookieStore = await cookies()
    const isHttps =
      request.headers.get('x-forwarded-proto') === 'https' ||
      process.env.NODE_ENV === 'production'

    cookieStore.set('admin_session', 'true', {
      httpOnly: false,
      secure: isHttps,
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
    })

    cookieStore.set(
      'nx_admin_token',
      JSON.stringify({
        id: created.user.id,
        email: created.user.email,
        username: adminUsername,
        full_name: adminFullName,
        role: 'superadmin',
        loginTime: Date.now(),
      }),
      {
        httpOnly: true,
        secure: isHttps,
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60 * 24 * 7,
      }
    )

    console.log(`[ADMIN/SETUP] Single admin slot claimed by: ${created.user.email}`)

    return NextResponse.json({
      success: true,
      message: 'Primary Commander successfully initialized. Admin slot permanently sealed.',
      admin: {
        id: created.user.id,
        email: created.user.email,
        username: adminUsername,
        full_name: adminFullName,
      },
    })
  } catch (err: any) {
    console.error('[ADMIN/SETUP] Fatal error in admin registration:', err)
    return NextResponse.json(
      { error: err?.message || 'Internal server error initializing administrator.' },
      { status: 500 }
    )
  }
}
