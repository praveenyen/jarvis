import { createAuthMiddleware, createAuthConfig } from '@repo/auth-middleware';
import { initializeAmplifyServer, checkAuthentication } from '@repo/auth-middleware/server';

// Initialize Amplify server with auth configuration
initializeAmplifyServer(
  createAuthConfig({
    userPoolId: String(process.env.NEXT_PUBLIC_USER_POOL_ID),
    userPoolClientId: String(process.env.NEXT_PUBLIC_USER_POOL_CLIENT_ID),
    cognitoDomain: String(process.env.NEXT_PUBLIC_COGNITO_DOMAIN),
    redirectSignInUrls: [
      String(process.env.NEXT_PUBLIC_REDIRECT_SIGN_IN_URL_LOCAL),
      String(process.env.NEXT_PUBLIC_REDIRECT_SIGN_IN_URL),
    ],
    redirectSignOutUrls: [
      String(process.env.NEXT_PUBLIC_REDIRECT_SIGN_OUT_URL_LOCAL),
      String(process.env.NEXT_PUBLIC_REDIRECT_SIGN_OUT_URL),
    ],
    oAuthScopes: ['phone', 'email', 'profile', 'openid'],
    providers: ['Google'],
  })
);

export const config = {
  /*
   * Match all request paths except for the ones starting with
   */
  matcher: ['/((?!_next/static|_next/image|vc-ap-microfrontends-unsecured/_next/static|vc-ap-microfrontends-unsecured/_next/image|.*\\.png$|api/).*)'],
};

// Configure which routes require authentication
export const middleware = createAuthMiddleware({
  privateRoutes: ['/unsecured'],
  loginRedirectPath: '/login',
  checkAuthFn: checkAuthentication,
});
