import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Rewrites requests for /Amenities (capital A) to the lowercase route
// while preserving the original URL in the browser (no redirect).
export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  // handle /Amenities and any nested paths like /Amenities/foo
  if (pathname === '/Amenities' || pathname.startsWith('/Amenities/')) {
    const url = req.nextUrl.clone()
    url.pathname = pathname.replace(/^\/Amenities/i, '/amenities')
    return NextResponse.rewrite(url)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/Amenities', '/Amenities/:path*'],
}
