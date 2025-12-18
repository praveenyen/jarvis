import { isServer } from '@tanstack/react-query';
import IHttpClient, { CacheConfig } from '@/lib/httpClient/IHttpClient';
import HttpClientFactory from '@/lib/httpClient/HttpClientFactory';
import {
  GetRegCheckDetailed,
  UpdateRegCheckRequest,
  UpdateRegCheckRequestV3,
  UpdateRegCheckResponse,
} from '@/lib/queries/deadpool/queryResponseTypes';
const axiosClient: IHttpClient = HttpClientFactory.getHttpClient('axios');
const fetchClient: IHttpClient = HttpClientFactory.getHttpClient('fetch');
const API_URL = {
  SERVER: process.env.DEADPOOL_SERVER,
  CLIENT: process.env.NEXT_PUBLIC_API_URL,
};

export const getRegCheckDetailed = (
  appFormId: string,
  version: string,
  headers?: Record<string, string>,
  cacheConfig?: CacheConfig,
): Promise<GetRegCheckDetailed> => {
  if (isServer) {
    const url =
      API_URL.SERVER +
      `${version}/appForm/${appFormId}/regulatoryCheck/detailed`;
    return fetchClient.get<GetRegCheckDetailed>(
      url,
      undefined,
      headers,
      cacheConfig,
    );
  } else {
    const url =
      API_URL.CLIENT +
      `/api/${version}/appForm/${appFormId}/regulatoryCheck/detailed`;
    return axiosClient.get<GetRegCheckDetailed>(url);
  }
};

export const approveRegCheck = (
  appFormId: string,
  request: UpdateRegCheckRequest,
  headers?: Record<string, string>,

  cacheConfig?: CacheConfig,
): Promise<UpdateRegCheckResponse> => {
  if (isServer) {
    const url = API_URL.SERVER + `v2/appForm/${appFormId}/regulatoryCheck`;
    return fetchClient.put<UpdateRegCheckRequest, UpdateRegCheckResponse>(
      url,
      request,
      undefined,
      headers,
      cacheConfig,
    );
  } else {
    const url = API_URL.CLIENT + `/api/v2/appForm/${appFormId}/regulatoryCheck`;
    return axiosClient.put<UpdateRegCheckRequest, UpdateRegCheckResponse>(
      url,
      request,
    );
  }
};

export const approveRegCheckV3 = (
  appFormId: string,
  request: UpdateRegCheckRequestV3,
  headers?: Record<string, string>,
  cacheConfig?: CacheConfig,
): Promise<UpdateRegCheckResponse> => {
  if (isServer) {
    const url = API_URL.SERVER + `v3/entity/${appFormId}/regulatoryCheck`;
    return fetchClient.put<UpdateRegCheckRequestV3, UpdateRegCheckResponse>(
      url,
      request,
      undefined,
      headers,
      cacheConfig,
    );
  } else {
    const url = API_URL.CLIENT + `/api/v3/entity/${appFormId}/regulatoryCheck`;
    return axiosClient.put<UpdateRegCheckRequestV3, UpdateRegCheckResponse>(
      url,
      request,
    );
  }
};

export const getRegCheckVersion = (
  appFormId: string,
  headers?: Record<string, string>,
  cacheConfig?: CacheConfig,
): Promise<Record<'version', string>> => {
  if (isServer) {
    const url =
      API_URL.SERVER + `v2/appForm/${appFormId}/regulatoryCheckVersion`;
    return fetchClient.get<Record<'version', string>>(
      url,
      undefined,
      headers,
      cacheConfig,
    );
  } else {
    const url =
      API_URL.CLIENT + `/api/v2/appForm/${appFormId}/regulatoryCheckVersion`;
    return axiosClient.get<Record<'version', string>>(url);
  }
};
