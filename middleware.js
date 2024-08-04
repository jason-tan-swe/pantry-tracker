import { auth } from "@/utils/auth"

export default auth((request) => {
  const { nextUrl } = request
  const isLoggedIn = !!request.auth

  // Public routes that don't require authentication
  const publicRoutes = ['/', '/login', '/register']
  if (!isLoggedIn && publicRoutes.includes(nextUrl.pathname)) {
    return null // Allow access to public routes
  }

  // Redirect authenticated users to dashboard if they try to access login or register
  if (isLoggedIn && !request.nextUrl.pathname.startsWith('/dashboard')) {
    return Response.redirect(new URL('/dashboard', request.url))
  }

  // Redirect unauthenticated users to login for protected routes
  if (!isLoggedIn && !nextUrl.pathname.startsWith('/login')) {
    return Response.redirect(new URL('/login', request.url))
  }

  // Allow access to protected routes for authenticated users
  return null
})

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
}