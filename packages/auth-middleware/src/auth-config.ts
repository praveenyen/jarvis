import type { ResourcesConfig } from 'aws-amplify';

export interface AmplifyAuthConfig {
  userPoolId: string;
  userPoolClientId: string;
  cognitoDomain: string;
  redirectSignInUrls: string[];
  redirectSignOutUrls: string[];
  oAuthScopes?: string[];
  providers?: ('Google' | 'Facebook' | 'Apple' | 'Amazon')[];
}

export function createAuthConfig(config: AmplifyAuthConfig): ResourcesConfig['Auth'] {
  return {
    Cognito: {
      userPoolId: config.userPoolId,
      userPoolClientId: config.userPoolClientId,
      loginWith: {
        oauth: {
          domain: config.cognitoDomain,
          scopes: config.oAuthScopes || ['phone', 'email', 'profile', 'openid'],
          redirectSignIn: config.redirectSignInUrls,
          redirectSignOut: config.redirectSignOutUrls,
          responseType: 'token',
          providers: config.providers || [],
        },
      },
    },
  };
}
