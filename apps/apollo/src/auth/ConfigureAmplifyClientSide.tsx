'use client';
import { Amplify } from 'aws-amplify';
import { cognitoUserPoolsTokenProvider } from 'aws-amplify/auth/cognito';
import { CookieStorage } from 'aws-amplify/utils';
import { authConfig } from '@/auth/amplify-cognito-config-v2';
/*https://docs.amplify.aws/nextjs/build-a-backend/server-side-rendering/*/
/* Can refer https://articles.wesionary.team/next-js-14-aws-amplify-authentication-how-to-setup-and-configure-in-your-app-f30b70bc9377**/

/*Dont see a need of using this currentlyh
 ttps://ui.docs.amplify.aws/react/connected-components/authenticator/advanced*/
Amplify.configure(
  {
    Auth: authConfig,
  },
  { ssr: true },
);

export default function ConfigureAmplifyClientSide() {
  return null;
}
