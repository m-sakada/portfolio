import { NextRequest, NextResponse } from 'next/server'

export default function proxy(request: NextRequest) {
  // 環境変数が設定されていない場合は認証を無効にする
  const authUser = process.env.BASIC_AUTH_USER
  const authPassword = process.env.BASIC_AUTH_PASSWORD

  if (!authUser || !authPassword) {
    return NextResponse.next()
  }

  // Basic認証の設定
  const basicAuth = request.headers.get('authorization')
  const url = request.nextUrl

  if (basicAuth) {
    const authValue = basicAuth.split(' ')[1]
    const [user, pwd] = atob(authValue).split(':')

    if (user === authUser && pwd === authPassword) {
      return NextResponse.next()
    }
  }

  url.pathname = '/api/auth'

  return NextResponse.rewrite(url)
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api/auth (authentication endpoint)
     * - api/revalidate (webhook endpoint)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api/auth|api/revalidate|_next/static|_next/image|favicon.ico).*)',
  ],
}