import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // Routes protégées Admin
  const isAdminRoute = path.startsWith('/admin');

  // Routes protégées Dashboard
  const isDashboardRoute = path.startsWith('/dashboard');

  // Récupérer le token et l'utilisateur depuis les cookies ou localStorage
  // Note: Comme localStorage n'est pas accessible côté serveur, on va vérifier côté client
  
  // Si c'est une route admin, on laisse le composant gérer la vérification
  // pour éviter les problèmes d'hydratation
  if (isAdminRoute || isDashboardRoute) {
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/dashboard/:path*'],
};