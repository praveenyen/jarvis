import { isServer } from '@tanstack/react-query';
import IHttpClient, { CacheConfig } from '@/lib/httpClient/IHttpClient';
import HttpClientFactory from '@/lib/httpClient/HttpClientFactory';
import {
  TClAvailableLimit,
  TSaveLoanResult,
} from '@/lib/queries/asgard/queryResponseTypes';
const axiosClient: IHttpClient = HttpClientFactory.getHttpClient('axios');
const fetchClient: IHttpClient = HttpClientFactory.getHttpClient('fetch');

const API_URL = {
  SERVER: process.env.ASGARD_SERVER,
  CLIENT: process.env.NEXT_PUBLIC_API_URL,
};

export const getClAvailableLimit = (
  appFormID: string | undefined,
  headers?: Record<string, string>,
  cacheConfig?: CacheConfig,
): Promise<TClAvailableLimit> => {
  if (isServer) {
    const url =
      API_URL.SERVER + 'creditLine/availableLimit/appForm/' + appFormID;
    return fetchClient.get<TClAvailableLimit>(
      url,
      undefined,
      headers,
      cacheConfig,
    );
  } else {
    const url =
      API_URL.CLIENT + '/api/v1/creditLine/availableLimit/appForm/' + appFormID;
    return axiosClient.get<TClAvailableLimit>(url);
  }
};

export const getLoanDetails = (
  appFormID: string | undefined,
  headers?: Record<string, string>,
  cacheConfig?: CacheConfig,
): Promise<TSaveLoanResult> => {
  if (isServer) {
    const url = API_URL.SERVER + `loan/appForm/${appFormID}/loanDetails`;
    return fetchClient.get<TSaveLoanResult>(
      url,
      undefined,
      headers,
      cacheConfig,
    );
  } else {
    const url =
      API_URL.CLIENT + `/api/v1/loan/appForm/${appFormID}/loanDetails`;
    console.log(url);
    return axiosClient.get<TSaveLoanResult>(url);
  }
};
