import { createAuthMiddleware } from '@repo/auth-middleware';
import { cookies } from 'next/headers';
import { fetchAuthSession } from 'aws-amplify/auth/server';
import { runWithAmplifyServerContext } from '@/auth/configureAmplifyServerSide';

export const config = {
  /*
   * Match all request paths except for the ones starting with
   */
  matcher: ['/((?!_next/static|_next/image|.*\\.png$|api/).*)'],
};

async function checkAuthentication(): Promise<boolean> {
  return runWithAmplifyServerContext({
    nextServerContext: { cookies },
    operation: async (contextSpec) => {
      try {
        const session = await fetchAuthSession(contextSpec);
        return (
          session.tokens?.accessToken !== undefined &&
          session.tokens?.idToken !== undefined
        );
      } catch (error) {
        console.log(error);
        return false;
      }
    },
  });
}

// Configure which routes require authentication
export const middleware = createAuthMiddleware({
  privateRoutes: ['/dashboard'],
  loginRedirectPath: '/login',
  authCheckFn: checkAuthentication,
});
