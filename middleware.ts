import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const protectedRoutes = ['/', '/api/articles/:path*', '/articles/:path*', '/api/search'];

/**
 * Verifies the JWT token.
 *
 * This function attempts to verify the provided JWT token using the secret key.
 * If successful, it returns the token's payload. Otherwise, it logs an error
 * and returns `null`.
 *
 * @param {string} token - The JWT token to be verified.
 * @returns {Promise<object|null>} - The payload of the verified token or null if verification fails.
 */
async function verifyJWT(token: string) {
  try {
    const { payload } = await jwtVerify(token, new TextEncoder().encode(process.env.JWT_SECRET));
    return payload;
  } catch (error) {
    console.error('Error verificando el JWT:', error);
    return null;
  }
}

/**
 * Middleware function for protecting routes.
 *
 * This middleware checks if a JWT token is present and valid in the cookies for
 * specific protected routes. If no valid token is found, the request is redirected
 * to the login page.
 *
 * @param {NextRequest} req - The incoming request object.
 * @returns {Promise<NextResponse>} - A `NextResponse` object, either allowing the request or redirecting to login.
 */
export async function middleware(req: NextRequest): Promise<NextResponse> {
  // Get the JWT token from the cookies and verify it
  const jwtToken = req.cookies.get('jwtToken')?.value;

  // Redirect to login if the token is missing and the request is to a protected route
  if (!jwtToken && protectedRoutes.some((route) => req.nextUrl.pathname.startsWith(route))) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  const verifiedPayload = await verifyJWT(jwtToken as string);

  // If the token is invalid, redirect to the login page
  if (!verifiedPayload) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  // If valid proceed with the request
  return NextResponse.next();
}

/**
 * Configuration for the middleware function.
 *
 * The `matcher` option defines the routes where the middleware should be applied.
 * Here, it matches the root path, article-related API routes, and article pages.
 */
export const config = {
  matcher: ['/', '/api/articles/:path*', '/articles/:path*', '/api/search'],
};
