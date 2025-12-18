import { createServerRunner } from '@aws-amplify/adapter-nextjs';
import { authConfig } from '@/auth/amplify-cognito-config-v2';

export const { runWithAmplifyServerContext } = createServerRunner({
  config: {
    Auth: authConfig,
  },
});
