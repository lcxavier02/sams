import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

// Definir las rutas protegidas
const protectedRoutes = ['/', '/api/articles/:path*', '/articles/:path*'];

// Función para verificar el JWT usando jose
async function verifyJWT(token: string) {
  try {
    const { payload } = await jwtVerify(token, new TextEncoder().encode(process.env.JWT_SECRET));
    return payload;
  } catch (error) {
    console.error('Error verificando el JWT:', error);
    return null;
  }
}

export async function middleware(req: NextRequest) {
  const jwtToken = req.cookies.get('jwtToken')?.value;

  // Si no hay token y el usuario intenta acceder a una ruta protegida, redirigirlo a login
  if (!jwtToken && protectedRoutes.some((route) => req.nextUrl.pathname.startsWith(route))) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  const verifiedPayload = await verifyJWT(jwtToken as string);

  if (!verifiedPayload) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/', '/api/articles/:path*', '/articles/:path*'],
};
