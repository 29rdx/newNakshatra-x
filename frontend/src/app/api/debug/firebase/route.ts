import { NextResponse } from 'next/server'

export async function GET() {
  const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY
  const authDomain = process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
  const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID
  const storageBucket = process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
  const messagingSenderId = process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
  const appId = process.env.NEXT_PUBLIC_FIREBASE_APP_ID

  const checks = {
    apiKey: apiKey ? `${apiKey.substring(0, 8)}...` : 'MISSING',
    authDomain: authDomain || 'MISSING',
    projectId: projectId || 'MISSING',
    storageBucket: storageBucket || 'MISSING',
    messagingSenderId: messagingSenderId || 'MISSING',
    appId: appId ? `${appId.substring(0, 12)}...` : 'MISSING',
    isConfigured: Boolean(
      apiKey &&
        authDomain &&
        projectId &&
        !apiKey.includes('your-') &&
        !apiKey.includes('placeholder')
    ),
  }

  return NextResponse.json({
    status: checks.isConfigured ? 'READY' : 'PENDING_CONFIG',
    provider: 'Google Firebase (Spark Free Tier)',
    checks,
    instructions: checks.isConfigured
      ? 'Firebase credentials detected and ready.'
      : 'Add your Firebase web app config to frontend/.env.local and restart next dev.',
  })
}
