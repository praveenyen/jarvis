"use client";

import { datadogRum } from '@datadog/browser-rum';

const envType = process.env.NEXT_PUBLIC_ENV_TYPE || ''
const dgAppId = process.env.NEXT_PUBLIC_DATADOG_APPID || ''
const dgClientToken = process.env.NEXT_PUBLIC_DATADOG_CLIENT_TOKEN || ''
const gitCommitId = process.env.NEXT_PUBLIC_APP_VERSION || '1.0.0'

if (envType == "production") {
  console.log('data dog is setup')
  datadogRum.init({
    applicationId: dgAppId,
    clientToken: dgClientToken,
    site: 'datadoghq.com',
    service: 'apollo',
    env: envType,
    // Specify a version number to identify the deployed version of your application in Datadog
    version: gitCommitId,
    sessionSampleRate: 50,
    sessionReplaySampleRate: 0,
    trackUserInteractions: true,
    trackResources: true,
    trackLongTasks: true,
    traceSampleRate: 100,
    defaultPrivacyLevel: 'mask-user-input'

  })


  // datadogRum.startSessionReplayRecording();

}

export default function DatadogInit() {
  // Render nothing - this component is only included so that the init code
  // above will run client-side
  return null;
}
