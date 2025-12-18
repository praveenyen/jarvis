import HttpClientFactory from '@/lib/httpClient/HttpClientFactory';
import { isServer } from '@tanstack/react-query';
import {
  TKycCustomStatusInput,
  TKycCustomStatusOutput,
  TVerifyAppFormStatus,
} from './queryResponseTypes';
import { TKycInfo } from '@/lib/queries/hulk/queryResponseTypes';
import { Kyc } from '@/lib/queries/shield/queryResponseTypes';

const HULK_SERVER = process.env.HULK_SERVER;
const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

const fetchClient = HttpClientFactory.getHttpClient('fetch');
const axiosClient = HttpClientFactory.getHttpClient('axios');

export const fetchVerificationData = (
  appFormId: string | undefined,
  headers?: Record<string, string>,
  params?: Record<string, string>,
) => {
  if (isServer) {
    const url = HULK_SERVER + `appForm/${appFormId}/verify`;
    return fetchClient.get<TVerifyAppFormStatus>(url, undefined, headers);
  } else {
    const url = BASE_URL + `/api/v1/appForm/${appFormId}/verify`;
    return axiosClient.get<TVerifyAppFormStatus>(url);
  }
};

export const updateKycData = (
  applicantId: number,
  updateKycPayload: TKycCustomStatusInput | undefined,
  headers?: Record<string, string>,
) => {
  if (isServer) {
    const url = HULK_SERVER + `applicant/${applicantId}/kyc/status`;
    return fetchClient.put<
      TKycCustomStatusInput | undefined,
      TKycCustomStatusOutput
    >(url, updateKycPayload, undefined, headers);
  }
  return axiosClient.put<
    TKycCustomStatusInput | undefined,
    TKycCustomStatusOutput
  >(
    BASE_URL + `/api/v1/applicant/${applicantId}/kyc/status`,
    updateKycPayload,
    undefined,
    headers,
  );
};

export const resolveKyc = (
  applicantId: number,
  kycId: number,
  kycData: Kyc | undefined,
  headers?: Record<string, string>,
) => {
  if (isServer) {
    const url = HULK_SERVER + `applicant/${applicantId}/kyc/${kycId}`;
    return fetchClient.put<Kyc | undefined, Kyc>(
      url,
      kycData,
      undefined,
      headers,
    );
  } else
    return axiosClient.put<Kyc | undefined, Kyc>(
      BASE_URL + `/api/v1/applicant/${applicantId}/kyc/${kycId}`,
      kycData,
      undefined,
      headers,
    );
};

// export const saveKycData = async (
//   applicantId: string,
//   kycId: string,
//   saveKycPayload: Object,
// ) => {
//   const response = await fetch(
//     `/api/v1/applicant/${applicantId}/kyc/${kycId}`,
//     {
//       method: 'PUT',
//       body: JSON.stringify({ data: saveKycPayload }),
//     },
//   );
//   const saveKycData = response;
//   return saveKycData;
// };

// export const updateKycData = async (
//   applicantId: string,
//   updateKycPayload: Object,
// ) => {
//   const response = await fetch(`/api/v1/applicant/${applicantId}/kyc/status`, {
//     method: 'PUT',
//     body: JSON.stringify({ data: updateKycPayload }),
//   });
//   const updateKycData = await response.json();
//   return updateKycData;
// };
