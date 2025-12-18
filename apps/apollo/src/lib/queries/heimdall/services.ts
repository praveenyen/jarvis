import HttpClientFactory from '@/lib/httpClient/HttpClientFactory';
import IHttpClient, { CacheConfig } from '@/lib/httpClient/IHttpClient';
import { isServer } from '@tanstack/react-query';
import {
  RoleResponse,
  UsersResponse,
} from '@/lib/queries/heimdall/queryResponseTypes';

const axiosClient: IHttpClient = HttpClientFactory.getHttpClient('axios');
const fetchClient: IHttpClient = HttpClientFactory.getHttpClient('fetch');
const API_URL = {
  SERVER: process.env.HEIMDALL_SERVER,
  CLIENT: process.env.NEXT_PUBLIC_API_URL,
};

export const getAllUsers = (
  headers?: Record<string, string>,
  cacheConfig?: CacheConfig,
) => {
  if (isServer) {
    const url = API_URL.SERVER + 'filteredUsers';
    return fetchClient.get<UsersResponse>(url, undefined, headers, cacheConfig);
  } else {
    const url = API_URL.CLIENT + '/api/v1/user';
    return axiosClient.get<UsersResponse>(url);
  }
};

export const getUserRole = (
  userId: string,
  headers?: Record<string, string>,
  cacheConfig?: CacheConfig,
) => {
  if (isServer) {
    const url = API_URL.SERVER + `user/${userId}/role`;
    return fetchClient.get<RoleResponse>(url, undefined, headers, cacheConfig);
  } else {
    const url = API_URL.CLIENT + `/api/v1/user/${userId}/role`;
    return axiosClient.get<RoleResponse>(url);
  }
};
