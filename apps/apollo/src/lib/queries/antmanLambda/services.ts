import { isServer } from '@tanstack/react-query';
import IHttpClient, { CacheConfig } from '@/lib/httpClient/IHttpClient';
import HttpClientFactory from '@/lib/httpClient/HttpClientFactory';
const axiosClient: IHttpClient = HttpClientFactory.getHttpClient('axios');
const fetchClient: IHttpClient = HttpClientFactory.getHttpClient('fetch');

const API_URL = {
  SERVER: process.env.ANTMAN_LAMBDAS,
  CLIENT: process.env.NEXT_PUBLIC_API_URL,
};

export type TRiskCategoryResp = {
  risk_category: any;
};

export const getRiskcategory = (
  customerId: string,
  headers?: Record<string, string>,
  cacheConfig?: CacheConfig,
): Promise<TRiskCategoryResp> => {
  if (isServer) {
    const url =
      API_URL.SERVER +
      `riskCategorisationFunctionAntman/customer/${customerId}`;
    return fetchClient.get<TRiskCategoryResp>(
      url,
      undefined,
      headers,
      cacheConfig,
    );
  } else {
    const url = API_URL.CLIENT + '/getRiskCategory/' + customerId;
    return axiosClient.get<TRiskCategoryResp>(url);
  }
};
