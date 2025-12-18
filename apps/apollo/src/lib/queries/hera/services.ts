import HttpClientFactory from '@/lib/httpClient/HttpClientFactory';
import IHttpClient, { CacheConfig } from '@/lib/httpClient/IHttpClient';
import { isServer } from '@tanstack/react-query';
import {
  AllDesignationsResponse,
  BranchHierarchyResponse,
  PartnerCodesResponse,
  SpecifiedUsersResponse,
} from '@/lib/queries/hera/queryResponseTypes';
import { UsersResponse } from '@/lib/queries/heimdall/queryResponseTypes';

const axiosClient: IHttpClient = HttpClientFactory.getHttpClient('axios');
const fetchClient: IHttpClient = HttpClientFactory.getHttpClient('fetch');
const API_URL = {
  SERVER: process.env.HERA_SERVER,
  CLIENT: process.env.NEXT_PUBLIC_API_URL,
};

export const getPartnerCodes = (
  headers?: Record<string, string>,
  cacheConfig?: CacheConfig,
) => {
  if (isServer) {
    const url = API_URL.SERVER + 'partnerCodes';
    return fetchClient.get<PartnerCodesResponse>(
      url,
      undefined,
      headers,
      cacheConfig,
    );
  } else {
    const url = API_URL.CLIENT + '/api/v1/partnerCodes';
    return axiosClient.get<PartnerCodesResponse>(url);
  }
};

export const getBranchHierarchy = (
  headers?: Record<string, string>,
  cacheConfig?: CacheConfig,
) => {
  if (isServer) {
    const url = API_URL.SERVER + 'branches/hierarchy';
    return fetchClient.get<BranchHierarchyResponse>(
      url,
      undefined,
      headers,
      cacheConfig,
    );
  } else {
    const url = API_URL.CLIENT + '/api/v1/branches/hierarchy';
    return axiosClient.get<BranchHierarchyResponse>(url);
  }
};

export const getSpecifiedUsers = (
  typeOfManager: string,
  headers?: Record<string, string>,
  cacheConfig?: CacheConfig,
) => {
  if (isServer) {
    const url = API_URL.SERVER + `specifiedUsers/${typeOfManager}`;
    return fetchClient.get<SpecifiedUsersResponse>(
      url,
      undefined,
      headers,
      cacheConfig,
    );
  } else {
    const url = API_URL.CLIENT + `/api/v1/specifiedUsers/${typeOfManager}`;
    return axiosClient.get<SpecifiedUsersResponse>(url);
  }
};

export const getAllUsersDSA = (
  headers?: Record<string, string>,
  cacheConfig?: CacheConfig,
) => {
  if (isServer) {
    const url = API_URL.SERVER + `filteredUsers`;
    return fetchClient.get<UsersResponse>(url, undefined, headers, cacheConfig);
  } else {
    const url = API_URL.CLIENT + `/api/v1/allUsers`;
    return axiosClient.get<UsersResponse>(url);
  }
};

export const getAllDesignations = (
  headers?: Record<string, string>,
  cacheConfig?: CacheConfig,
) => {
  if (isServer) {
    const url = API_URL.SERVER + `allDesignations`;
    return fetchClient.get<AllDesignationsResponse>(
      url,
      undefined,
      headers,
      cacheConfig,
    );
  } else {
    const url = API_URL.CLIENT + `/api/v1/allDesignations`;
    return axiosClient.get<AllDesignationsResponse>(url);
  }
};
