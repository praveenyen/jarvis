'use client';

import { useEffect } from 'react';
import { configureAmplifyClient, createAuthConfig } from '@repo/auth-middleware';

export function AmplifyClientProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    configureAmplifyClient(
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
  }, []);

  return <>{children}</>;
}
