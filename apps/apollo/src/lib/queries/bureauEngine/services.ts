import { isServer } from '@tanstack/react-query';
import IHttpClient, { CacheConfig } from '@/lib/httpClient/IHttpClient';
import HttpClientFactory from '@/lib/httpClient/HttpClientFactory';
import { TBureauReport, TCreditResponse, TPreSignLinkResponse } from './queryResponseTypes';
import { cibilGJsonQuery, experianGjsonQuery } from './gJsonQuery';
import { BureauCreditReport } from '@/components/bureau/bureauType';
const axiosClient: IHttpClient = HttpClientFactory.getHttpClient('axios');
const fetchClient: IHttpClient = HttpClientFactory.getHttpClient('fetch');

const API_URL = {
  SERVER: process.env.BUREAU_ENGINE_SERVER,
  CLIENT: process.env.NEXT_PUBLIC_API_URL,
};

export const getCreditReportFile = async (
  appFormId: string | undefined,
  applicantId: string | undefined,
  headers?: Record<string, string>,
  cacheConfig?: CacheConfig,
): Promise<TCreditResponse | null> => {
  // let bureauReport: TBureauReport | null = null;
  if (isServer) {
    const url =
      API_URL.SERVER +
      `api/v1/appForm/${appFormId}/applicant/${applicantId}/creditReport`;

    let reportData = await fetchClient.get<TCreditResponse>(
      url,
      undefined,
      headers,
      cacheConfig,
    );
    return reportData;
  } else {
    const url =
      API_URL.CLIENT +
      `/api/v1/appForm/${appFormId}/applicant/${applicantId}/creditReport`;
    let reportData = await axiosClient.get<TCreditResponse>(url);
    return reportData;
  }
};

export const getCreditReport = (
  bureauPullId: string,
  bureauName: string,
  headers?: Record<string, string>,
  cacheConfig?: CacheConfig,
): Promise<Record<string, any>> => {
  let data = {};
  switch (bureauName.toLowerCase()) {
    case 'experian':
      data = experianGjsonQuery;
      break;
    case 'cibil':
      data = cibilGJsonQuery;
      break;
  }
  if (isServer) {
    const url = API_URL.SERVER + `api/v1/bureauPull/${bureauPullId}/jsonReport`;
    return fetchClient.post<Record<string, any>, Record<string, any>>(
      url,
      data,
      undefined,
      headers,
      cacheConfig,
    );
  } else {
    const url =
      API_URL.CLIENT + `/api/v1/bureauPull/${bureauPullId}/jsonReport`;
    return axiosClient.post<Record<string, any>, Record<string, any>>(
      url,
      data,
      { bureauName },
    );
  }
};

export const uploadBureauDoc = (
  appFormId: string,
  applicantId: string,
  bureauCreditReport: BureauCreditReport,
  headers?: Record<string, string>,
  cacheConfig?: CacheConfig,
): Promise<Record<string, any>> => {
  if (isServer) {
    const url =
      API_URL.SERVER +
      `api/v1/appForm/${appFormId}/applicant/${applicantId}/creditReport/external`;
    return fetchClient.post<Record<string, any>, Record<string, any>>(
      url,
      bureauCreditReport,
      undefined,
      headers,
      cacheConfig,
    );
  } else {
    const url =
      API_URL.CLIENT +
      `/api/v1/appForm/${appFormId}/applicant/${applicantId}/creditReport/external`;
    return axiosClient.post<Record<string, any>, Record<string, any>>(
      url,
      bureauCreditReport,
      undefined,
    );
  }
};

export const getPresignedBureauReport = (
  fileId: string,
  headers?: Record<string, string>,
) => {
  if (isServer) {
    const url =
      API_URL.SERVER +
      `api/v1/file/${fileId}`;
    return fetchClient.get<TPreSignLinkResponse>(
      url,
      undefined,
      headers,
      undefined,
    );
  } else {
    const url =
      API_URL.CLIENT +
      `/api/v1/file/${fileId}`;
    return axiosClient.get<TPreSignLinkResponse>(
      url,
      undefined,
      headers,
      undefined,
    );
  }
};
