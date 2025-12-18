import HttpClientFactory from '@/lib/httpClient/HttpClientFactory';
import IHttpClient, { CacheConfig } from '@/lib/httpClient/IHttpClient';
import { isServer } from '@tanstack/react-query';

import {
  TAppFormDataDedupe,
  TApplicantDedupeResult,
  TExposure,
  TExposureResponse,
  TExposureInput,
} from './queryResponseTypes';

const axiosClient: IHttpClient = HttpClientFactory.getHttpClient('axios');
const fetchClient: IHttpClient = HttpClientFactory.getHttpClient('fetch');
const API_URL = {
  SERVER: process.env.VISION_SERVER,
  CLIENT: process.env.NEXT_PUBLIC_API_URL,
};

export const fetchDedupeData = (
  appFormId: string,
  headers?: Record<string, string>,
  cacheConfig?: CacheConfig,
) => {
  if (isServer) {
    const url = API_URL.SERVER + `appForm/${appFormId}/dedupe/detailed`;
    return fetchClient.get<TAppFormDataDedupe>(
      url,
      undefined,
      headers,
      cacheConfig,
    );
  } else {
    const url = API_URL.CLIENT + `/api/v1/appForm/${appFormId}/dedupe/detailed`;
    return axiosClient.get<TAppFormDataDedupe>(url);
  }
};

export const mergeApplicant = (
  applicantId: number,
  matchId: string,
  headers?: Record<string, string>,
  cacheConfig?: CacheConfig,
) => {
  if (isServer) {
    const url = API_URL.SERVER + `applicant/${applicantId}/merge`;
    return fetchClient.post<
      { matchingApplicantId: string },
      TApplicantDedupeResult
    >(url, { matchingApplicantId: matchId }, undefined, headers, cacheConfig);
  } else {
    const url = API_URL.CLIENT + `/api/v1/applicant/${applicantId}/merge`;
    return axiosClient.post<
      { matchingApplicantId: string },
      TApplicantDedupeResult
    >(url, { matchingApplicantId: matchId });
  }
};

export const generateUniqueCustomer = (
  applicantId: number,
  status: string,
  headers?: Record<string, string>,
  cacheConfig?: CacheConfig,
) => {
  if (isServer) {
    const url = API_URL.SERVER + `applicant/${applicantId}/dedupe`;
    return fetchClient.put<null, TApplicantDedupeResult>(
      url,
      null,
      { status: status },
      headers,
      cacheConfig,
    );
  } else {
    return axiosClient.put<null, TApplicantDedupeResult>(
      API_URL.CLIENT + `/api/v1/applicant/${applicantId}/dedupe`,
      null,
      { status: status },
    );
  }
};

export const getExposureResult = (
  appFormId: string,
  stage: string,
  headers?: Record<string, string>,
  cacheConfig?: CacheConfig,
) => {
  if (isServer) {
    const url =
      API_URL.SERVER + `appForm/${appFormId}/stage/${stage}/exposureResult`;
    return fetchClient.get<TExposure>(url, undefined, headers, cacheConfig);
  } else {
    return axiosClient.get<TExposure>(
      API_URL.CLIENT +
        `/api/v1/appForm/${appFormId}/stage/${stage}/exposureResult`,
    );
  }
};

export const calculateExposure = (
  exposureReqInput: TExposureInput,
  headers?: Record<string, string>,
  cacheConfig?: CacheConfig,
) => {
  if (isServer) {
    return fetchClient.post<TExposureInput, TExposureResponse>(
      API_URL.SERVER + `exposure/calculate`,
      exposureReqInput,
      undefined,
      headers,
      cacheConfig,
    );
  } else {
    return axiosClient.post<TExposureInput, TExposureResponse>(
      API_URL.CLIENT + `/api/v1/exposure/calculate`,
      exposureReqInput,
    );
  }
};
