'use client';
import { Amplify } from 'aws-amplify';
import { authConfig } from '@/auth/amplify-cognito-config-v2';

Amplify.configure(
  {
    Auth: authConfig,
  },
  { ssr: true },
);

export default function ConfigureAmplifyClientSide() {
  return null;
}
