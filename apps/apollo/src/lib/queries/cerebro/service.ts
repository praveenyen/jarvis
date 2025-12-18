import { isServer } from '@tanstack/react-query';
import IHttpClient, { CacheConfig } from '@/lib/httpClient/IHttpClient';
import HttpClientFactory from '@/lib/httpClient/HttpClientFactory';
import { TExpBureau } from './queryResponseTypes';

const axiosClient: IHttpClient = HttpClientFactory.getHttpClient('axios');
const fetchClient: IHttpClient = HttpClientFactory.getHttpClient('fetch');

const API_URL = {
  SERVER: process.env.CEREBRO_SERVER,
  CLIENT: process.env.NEXT_PUBLIC_API_URL,
};

export const getCreditData = (
  appFormId: string | undefined,
  applicantId: string | undefined,
  bureauName: string | null,
  headers?: Record<string, string>,
  cacheConfig?: CacheConfig,
): Promise<TExpBureau> => {
  if (isServer) {
    const url =
      API_URL.SERVER +
      `api/v2/appForm/${appFormId}/applicant/${applicantId}/creditData`;
    return fetchClient.get<TExpBureau>(
      url,
      bureauName ? { bureauName, keyFilters: 'bureau' } : undefined,
      headers,
      cacheConfig,
    );
  } else {
    const url =
      API_URL.CLIENT +
      `/api/v2/appForm/${appFormId}/applicant/${applicantId}/creditData`;
    return axiosClient.get<TExpBureau>(
      url,
      bureauName ? { bureauName, keyFilters: 'bureau' } : {},
      undefined,
    );
  }
};
