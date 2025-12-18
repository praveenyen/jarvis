import { createServerRunner } from '@aws-amplify/adapter-nextjs';
import { fetchAuthSession, fetchUserAttributes } from 'aws-amplify/auth/server';
import { cookies } from 'next/headers';
import type { ResourcesConfig } from 'aws-amplify';

let serverRunner: ReturnType<typeof createServerRunner> | null = null;

export function initializeAmplifyServer(authConfig: ResourcesConfig['Auth']) {
  if (!serverRunner) {
    serverRunner = createServerRunner({
      config: {
        Auth: authConfig,
      },
    });
  }
  return serverRunner;
}

export function getServerRunner() {
  if (!serverRunner) {
    throw new Error('Amplify server not initialized. Call initializeAmplifyServer first.');
  }
  return serverRunner;
}

export async function checkAuthentication(): Promise<boolean> {
  const runner = getServerRunner();
  
  return runner.runWithAmplifyServerContext({
    nextServerContext: { cookies },
    operation: async (contextSpec) => {
      try {
        const session = await fetchAuthSession(contextSpec);
        return (
          session.tokens?.accessToken !== undefined &&
          session.tokens?.idToken !== undefined
        );
      } catch (error) {
        console.log('Authentication check error:', error);
        return false;
      }
    },
  });
}

export async function getAuthSession() {
  const runner = getServerRunner();
  
  return runner.runWithAmplifyServerContext({
    nextServerContext: { cookies },
    operation: async (contextSpec) => {
      try {
        return await fetchAuthSession(contextSpec);
      } catch (error) {
        console.error('Failed to fetch auth session:', error);
        return null;
      }
    },
  });
}

export async function getCurrentUser() {
  const runner = getServerRunner();
  
  return runner.runWithAmplifyServerContext({
    nextServerContext: { cookies },
    operation: async (contextSpec) => {
      try {
        const attributes = await fetchUserAttributes(contextSpec);
        return attributes;
      } catch (error) {
        console.error('Failed to fetch user:', error);
        return null;
      }
    },
  });
}
