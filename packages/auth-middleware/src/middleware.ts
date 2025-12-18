import { NextRequest, NextResponse } from 'next/server';
import { isPrivateRoute } from './route-utils';

export interface MiddlewareConfig {
  privateRoutes?: string[];
  loginRedirectPath?: string;
  checkAuthFn: () => Promise<boolean>;
}

export function createAuthMiddleware(config: MiddlewareConfig) {
  const privateRoutes = config.privateRoutes || [];
  const loginPath = config.loginRedirectPath || '/login';
  const { checkAuthFn } = config;

  return async function middleware(request: NextRequest): Promise<NextResponse> {
    const response = NextResponse.next();
    const currentPath: string = request.nextUrl.pathname;

    console.info('currentPath: ', currentPath);

    // Skip authentication check if no private routes configured
    if (privateRoutes.length === 0) {
      return response;
    }

    // Skip authentication check for public routes
    if (!isPrivateRoute(currentPath, privateRoutes)) {
      return response;
    }

    // Perform authentication check for protected routes
    const authenticated = await checkAuthFn();

    if (!authenticated) {
      const loginUrl = new URL(loginPath, request.url);
      loginUrl.searchParams.set('redirect', currentPath);
      return NextResponse.redirect(loginUrl);
    }

    return response;
  };
}
