export interface MiddlewareConfig {
  privateRoutes?: string[];
  publicRoutes?: string[];
  loginRedirectPath?: string;
}

export function isPrivateRoute(pathname: string, privateRoutes: string[]): boolean {
  return privateRoutes.some(
    (route) => pathname === route || pathname.startsWith(route + '/'),
  );
}

export function isPublicRoute(pathname: string, publicRoutes: string[]): boolean {
  return publicRoutes.some(
    (route) => pathname === route || pathname.startsWith(route + '/'),
  );
}
