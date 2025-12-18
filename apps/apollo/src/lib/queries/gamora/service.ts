import { isServer } from '@tanstack/react-query';
import IHttpClient, { CacheConfig } from '@/lib/httpClient/IHttpClient';
import HttpClientFactory from '@/lib/httpClient/HttpClientFactory';

const fetchClient: IHttpClient = HttpClientFactory.getHttpClient('fetch');
const axiosClient: IHttpClient = HttpClientFactory.getHttpClient('axios');

const API_URL = {
  SERVER: process.env.GAMORA_SERVER,
  CLIENT: process.env.NEXT_PUBLIC_API_URL,
};
export const getDocUBLGamora = (
  roles: string | null,
  documentType: string,
  headers?: Record<string, string>,
  cacheConfig?: CacheConfig,
): any => {
  if (roles == null || roles == undefined) return '';
  const queryParams: URLSearchParams = new URLSearchParams({
    roles: roles,
  });

  const fetchClientParams: Record<string, string> = Object.fromEntries(
    queryParams.entries(),
  );

  if (isServer) {
    const url = API_URL.SERVER + `output/UBL/${documentType}`;
    console.log('url')
    console.log(url)
    return fetchClient.get<string[]>(
      url,
      fetchClientParams,
      headers,
    );
  } else {
    const url =
      API_URL.CLIENT +
      `/api/v1/output/ubl/${documentType}`;
    return axiosClient.get<string[]>(url, fetchClientParams);
  }
};

