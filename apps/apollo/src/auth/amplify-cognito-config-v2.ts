import type { ResourcesConfig } from 'aws-amplify';

export const authConfig: ResourcesConfig['Auth'] = {
  Cognito: {
    userPoolId: String(process.env.NEXT_PUBLIC_USER_POOL_ID),
    userPoolClientId: String(process.env.NEXT_PUBLIC_USER_POOL_CLIENT_ID),
    loginWith: {
      oauth: {
        domain: String(process.env.NEXT_PUBLIC_COGNITO_DOMAIN),
        scopes: ['phone', 'email', 'profile', 'openid'],
        redirectSignIn: [
          String(process.env.NEXT_PUBLIC_REDIRECT_SIGN_IN_URL_LOCAL),
          String(process.env.NEXT_PUBLIC_REDIRECT_SIGN_IN_URL),
        ],
        redirectSignOut: [
          String(process.env.NEXT_PUBLIC_REDIRECT_SIGN_OUT_URL_LOCAL),
          String(process.env.NEXT_PUBLIC_REDIRECT_SIGN_OUT_URL),
        ],
        responseType: 'token',
        providers: ['Google'],
      },
    },
  },
};
