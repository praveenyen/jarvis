import { isServer } from '@tanstack/react-query';
import IHttpClient, { CacheConfig } from '@/lib/httpClient/IHttpClient';
import HttpClientFactory from '@/lib/httpClient/HttpClientFactory';
import { ParamsType } from '@/lib/queries/drStrange/queryResponseTypes';
import {
  AadharXmlData,
  DocActivity,
  DocumentMoveRequest,
  PreSignedUrlResp,
} from '@/components/documents/DocumentScreenType';

const fetchClient: IHttpClient = HttpClientFactory.getHttpClient('fetch');
const axiosClient: IHttpClient = HttpClientFactory.getHttpClient('axios');

const API_URL = {
  SERVER: process.env.DR_STRANGE_SERVER,
  CLIENT: process.env.NEXT_PUBLIC_API_URL,
};
export const getDocAppForm = (
  appFormId: string,
  lpc: string,
  headers?: Record<string, string>,
  cacheConfig?: CacheConfig,
): Promise<string[]> => {
  const queryParams: URLSearchParams = new URLSearchParams({
    loanProductCode: lpc,
  });

  if (isServer) {
    const fetchClientParams: Record<string, string> = Object.fromEntries(
      queryParams.entries(),
    );

    const url = API_URL.SERVER + `appForm/${appFormId}/docsBySection`;
    return fetchClient.get<string[]>(
      url,
      fetchClientParams,
      headers,
      cacheConfig,
    );
  } else {
    const url =
      API_URL.CLIENT +
      `/api/v1/appForm/${appFormId}/document?loanProductCode=${lpc}`;
    return axiosClient.get<string[]>(url);
  }
};

export const getAddSectionListItem = (
  lpc: string,
  headers?: Record<string, string>,
  cacheConfig?: CacheConfig,
): Promise<string[]> => {
  if (isServer) {
    const url = API_URL.SERVER + `sectionConfig/loanProduct/${lpc}`;
    return fetchClient.get<string[]>(url, undefined, headers, cacheConfig);
  } else {
    const url =
      API_URL.CLIENT +
      `/api/v1/sectionConfig/loanProduct?loanProductCode=${lpc}`;
    return axiosClient.get<string[]>(url);
  }
};

export const getPreSignedUrl = (
  params: ParamsType,
  headers?: Record<string, string>,
  cacheConfig?: CacheConfig,
): Promise<PreSignedUrlResp> => {
  const queryParams: URLSearchParams = new URLSearchParams(params);
  
  if (isServer) {
    const fetchClientParams: Record<string, string> = Object.fromEntries(
      queryParams.entries(),
    );
    const url = API_URL.SERVER + `pre-signed-url`;
    return fetchClient.get<PreSignedUrlResp>(
      url,
      fetchClientParams,
      headers,
      cacheConfig,
    );
  } else {
    const url = API_URL.CLIENT + `/api/v1/pre-signed-url?${queryParams}`;
    return axiosClient.get<PreSignedUrlResp>(url);
  }
};

export const uploadDocDetails = (
  appformId: string,
  data: any,
  headers?: Record<string, string>,
  cacheConfig?: CacheConfig,
): Promise<any> => {
  if (isServer) {
    const url = API_URL.SERVER + `appForm/${appformId}/tagMultiple`;
    return fetchClient.post<any, any>(url, data, undefined, headers);
  } else {
    const url = API_URL.CLIENT + `/api/v1/appForm/${appformId}/tagMultiple`;
    return axiosClient.post<any, any>(url, data);
  }
};

export const attachFileToSection = (
  appformId: string,
  docId: number,
  data: DocumentMoveRequest,
  headers?: Record<string, string>,
  cacheConfig?: CacheConfig,
): Promise<any> => {
  if (isServer) {
    const url =
      API_URL.SERVER + `appForm/${appformId}/appFormDoc/${docId}/link`;
    return fetchClient.put<any, any>(url, data, undefined, headers);
  } else {
    const url =
      API_URL.CLIENT + `/api/v1/appForm/${appformId}/appFormDoc/${docId}/link`;
    return axiosClient.put<any, any>(url, data);
  }
};

export const deleteFileToSection = (
  appformId: string,
  docId: string,
  headers?: Record<string, string>,
  cacheConfig?: CacheConfig,
) => {
  if (isServer) {
    const url =
      API_URL.SERVER + `appForm/${appformId}/appFormDoc/appFormDocId/${docId}`;
    return fetchClient.delete<undefined, Error>(
      url,
      undefined,
      undefined,
      headers,
    );
  } else {
    const url =
      API_URL.CLIENT + `/api/v1/appForm/${appformId}/appFormDoc/${docId}/link`;
    return axiosClient.delete<undefined, Error>(url, undefined);
  }
};

export const getSectionDetails = (
  sectionId: string,
  headers?: Record<string, string>,
  cacheConfig?: CacheConfig,
) => {
  if (isServer) {
    const url = API_URL.SERVER + `section/sectionConfig/${sectionId}`;
    return fetchClient.get<any>(url, undefined, headers);
  } else {
    const url = API_URL.CLIENT + `/api/v1/section/sectionConfig/${sectionId}`;
    return axiosClient.get<any>(url, undefined);
  }
};

export const setCompeleteDms = (
  appFormId: string,
  lpc: string,
  headers?: Record<string, string>,
  cacheConfig?: CacheConfig,
) => {
  if (isServer) {
    const queryParams: URLSearchParams = new URLSearchParams({
      loanProductCode: lpc,
    });
    const fetchClientParams: Record<string, string> = Object.fromEntries(
      queryParams.entries(),
    );
    const url = API_URL.SERVER + `appForm/${appFormId}/dms/complete`;
    return fetchClient.post<any, any>(
      url,
      undefined,
      fetchClientParams,
      headers,
    );
  } else {
    const queryParams: URLSearchParams = new URLSearchParams({ lpc: lpc });
    const fetchClientParams: Record<string, string> = Object.fromEntries(
      queryParams.entries(),
    );

    const url = API_URL.CLIENT + `/api/v1/appForm/${appFormId}/dmsComplete`;
    return axiosClient.post<any, any>(
      url,
      undefined,
      fetchClientParams,
      headers,
    );
  }
};

export const getUrlS3 = (
  s3Url: string,
  headers?: Record<string, string>,
  cacheConfig?: CacheConfig,
) => {
  const queryParams: URLSearchParams = new URLSearchParams({ url: s3Url });
  const fetchClientParams: Record<string, string> = Object.fromEntries(
    queryParams.entries(),
  );

  if (isServer) {
    const url = API_URL.SERVER + `urlGenerator`;
    const respo = axiosClient.get<any>(url, fetchClientParams, headers);
    return respo;
  } else {
    const url = API_URL.CLIENT + `/api/v1/s3UrlFile`;
    return axiosClient.get<any>(url, fetchClientParams);
  }
};

export const getAadahrXmlData = (
  aadharXmlData: AadharXmlData,
  headers?: Record<string, string>,
  cacheConfig?: CacheConfig,
) => {
  if (aadharXmlData.aadhaarUrl == undefined) return;
  const queryParams: URLSearchParams = new URLSearchParams({
    aadhaarUrl: aadharXmlData.aadhaarUrl,
  });

  if (aadharXmlData.aadhaarType) {
    queryParams.append('aadhaarType', aadharXmlData.aadhaarType);
  }
  if (aadharXmlData.verifySignature) {
    queryParams.append(
      'verifySignature',
      aadharXmlData.verifySignature.toString(),
    );
  }
  const fetchClientParams: Record<string, string> = Object.fromEntries(
    queryParams.entries(),
  );

  if (isServer) {
    const url = API_URL.SERVER + `aadhaarData`;
    const respo = fetchClient.get<any>(url, fetchClientParams, headers);
    return respo;
  } else {
    const url = API_URL.CLIENT + `/api/v1/aadhaarData`;
    return axiosClient.get<any>(url, fetchClientParams);
  }
};

export const getDocActivity = (
  docActivity: DocActivity,
  appFormId:string|undefined,
  headers?: Record<string, string>,
  cacheConfig?: CacheConfig,
) => {

  const docActivityParams = Object.fromEntries(
    Object.entries(docActivity).filter(([, v]) => v !== "" && v !== null && v !== undefined)
  );

  if (isServer) {
    const url = API_URL.SERVER + `appForm/${appFormId}/docActivity`;
    const respo = fetchClient.get<any>(url, docActivityParams, headers);
    return respo;
  } else {
    const url = API_URL.CLIENT + `/api/v1/appForm/${appFormId}/docActivity`;
    return axiosClient.get<any>(url, docActivityParams);
  }
};
