import HttpClientFactory from '@/lib/httpClient/HttpClientFactory';
import IHttpClient, { CacheConfig } from '@/lib/httpClient/IHttpClient';
import { isServer } from '@tanstack/react-query';
import { MnrlFriDiuReq, MnrlFriDiuResponse } from './queryResponseTypes';

const axiosClient: IHttpClient = HttpClientFactory.getHttpClient('axios');
const fetchClient: IHttpClient = HttpClientFactory.getHttpClient('fetch');
const API_URL = {
    SERVER: process.env.ROGUE_SERVER,
    CLIENT: process.env.NEXT_PUBLIC_API_URL,
};

export const mnrlFriFraudCheckVerify = (
    mnrlFriReqInput: MnrlFriDiuReq,
    headers?: Record<string, string>,
    cacheConfig?: CacheConfig,
) => {
    if (isServer) {
        return fetchClient.post<MnrlFriDiuReq, MnrlFriDiuResponse>(
            API_URL.SERVER + `diu-fraud-check/verify`,
            mnrlFriReqInput,
            undefined,
            headers,
            cacheConfig,
        );
    } else {
        return axiosClient.post<MnrlFriDiuReq, MnrlFriDiuResponse>(
            API_URL.CLIENT + `/api/v1/diuFraudCheck/verify`,
            mnrlFriReqInput, undefined, headers, cacheConfig
        );
    }
};