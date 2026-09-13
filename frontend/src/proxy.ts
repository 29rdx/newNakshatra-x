import { NextResponse, type NextRequest } from "next/server";

export async function proxy(request: NextRequest) {
  const response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  // 1. Clickjacking Protection
  response.headers.set('X-Frame-Options', 'DENY')

  // 2. MIME Sniffing Protection
  response.headers.set('X-Content-Type-Options', 'nosniff')

  // 3. Referrer Policy
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')

  // 4. Hardware Permissions Policy (Restricts unauthorized camera/mic access)
  response.headers.set(
    'Permissions-Policy',
    'camera=(), microphone=(), geolocation=(self), payment=()'
  )

  // 5. Strict Transport Security (HSTS - Enforces HTTPS in Production)
  if (process.env.NODE_ENV === 'production') {
    response.headers.set(
      'Strict-Transport-Security',
      'max-age=63072000; includeSubDomains; preload'
    )
  }

  // 6. XSS Protection Filter
  response.headers.set('X-XSS-Protection', '1; mode=block')

  return response
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|frames/|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
