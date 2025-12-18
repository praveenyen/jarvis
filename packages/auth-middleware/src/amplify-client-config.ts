import { Amplify } from 'aws-amplify';
import type { ResourcesConfig } from 'aws-amplify';

let isConfigured = false;

export function configureAmplifyClient(authConfig: ResourcesConfig['Auth']) {
  if (!isConfigured) {
    Amplify.configure({
      Auth: authConfig,
    }, {
      ssr: true,
    });
    isConfigured = true;
  }
}

export function getAmplifyConfig() {
  return Amplify.getConfig();
}
