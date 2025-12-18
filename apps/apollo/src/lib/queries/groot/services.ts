import { isServer } from '@tanstack/react-query';
import IHttpClient, { CacheConfig } from '@/lib/httpClient/IHttpClient';
import HttpClientFactory from '@/lib/httpClient/HttpClientFactory';
import { TProductCodes, TProductCodesShortened } from './queryResponseTypes';
const axiosClient: IHttpClient = HttpClientFactory.getHttpClient('axios');
const fetchClient: IHttpClient = HttpClientFactory.getHttpClient('fetch');
const API_URL = {
  SERVER: process.env.GROOT_SERVER,
  CLIENT: process.env.NEXT_PUBLIC_API_URL,
};

export const getLoanProductCodes = (
  headers?: Record<string, string>,
  cacheConfig?: CacheConfig,
): Promise<string[]> => {
  if (isServer) {
    const url = API_URL.SERVER + 'loanProduct/codes';
    return fetchClient.get<string[]>(url, undefined, headers, cacheConfig);
  } else {
    const url = API_URL.CLIENT + '/api/v1/loanProduct/codes';
    return axiosClient.get<string[]>(url);
  }
};

export const getLoanProductConfigs = async (
  headers?: Record<string, string>,
  cacheConfig?: CacheConfig,
): Promise<TProductCodesShortened[]> => {
  if (isServer) {
    const url = API_URL.SERVER + 'loanProduct/basic';
    const res = await fetchClient.get<TProductCodes[]>(url, undefined, headers,cacheConfig);
    let loanProductCodes: TProductCodesShortened[] = [];
    res.forEach((lpc) => {
      loanProductCodes.push({
        id: lpc.id,
        code: lpc.productCode,
        name: lpc.partnerName,
        color: lpc.colorHex,
        channelType: lpc.channelType,
        isCreditLine: lpc.creditLineProduct,
        disbursalWorkflowName: lpc.disbursalWorkflowName,
      });
    });
    return loanProductCodes;
    // return NextResponse.json(loanProductCodes, { status: 200 });
  } else {
    const url = API_URL.CLIENT + '/api/v1/loanProduct/basic';
    return axiosClient.get<TProductCodesShortened[]>(url);
  }
};
