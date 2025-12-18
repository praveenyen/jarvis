import HttpClientFactory from '@/lib/httpClient/HttpClientFactory';
import { isServer } from '@tanstack/react-query';
import { CacheConfig } from '@/lib/httpClient/IHttpClient';
import {
  TAppFormBasic,
  TAppFormChangeSet,
  TAppformData,
  TAppFormEditRequest,
  TAppFormListResponse,
  TAppFormStageStatus,
  TLoanStatusUpdateReq,
  TLoanStatusUpdateResp,
  TPreviousLoan,
  TStatusOutput,
  TStatusReason,
} from './queryResponseTypes';
import { TKycInfo } from '../hulk/queryResponseTypes';

const SHIELD_URL = process.env.SHIELD_SERVER;
const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

const fetchClient = HttpClientFactory.getHttpClient('fetch');
const axiosClient = HttpClientFactory.getHttpClient('axios');

export const getAppFormList = (
  filters: Record<string, string>,
  headers: Record<string, string>,
  cacheConfig?: CacheConfig,
) => {
  if (isServer) {
    const url = SHIELD_URL + 'appForm/list';
    return fetchClient.get<TAppFormListResponse>(
      url,
      filters,
      headers,
      cacheConfig,
    );
  } else {
    const url = BASE_URL + '/api/v1/appForm/list';
    return axiosClient.get<TAppFormListResponse>(url, filters, headers);
  }
};

export const getAppFormData = (
  appFormId: string,
  headers?: Record<string, string>,
  params?: Record<string, string>,
) => {
  if (isServer) {
    const url = SHIELD_URL + `appForm/${appFormId}`;
    return fetchClient.get<TAppformData>(url, params, headers);
  } else {
    const url = BASE_URL + `/api/v1/appForm/${appFormId}`;
    return axiosClient.get<TAppformData>(url);
  }
};

export const getStatusReasons = (
  status: string,
  headers?: Record<string, string>,
  params?: Record<string, string>,
) => {
  if (isServer) {
    const url = SHIELD_URL + `appForm/reason`;
    return fetchClient.get<Record<string, TStatusReason[]>>(
      url,
      { statuses: status },
      headers,
    );
  } else {
    const url = BASE_URL + `/api/v1/appForm/reason`;
    return axiosClient.get<Record<string, TStatusReason[]>>(
      url,
      { statuses: status },
      headers,
    );
  }
};

export const getAppFormStatus = (
  appFormId: string | undefined,
  headers?: Record<string, string>,
  params?: Record<string, string>,
) => {
  if (isServer) {
    const url = SHIELD_URL + `appForm/${appFormId}/status`;
    return fetchClient.get<TStatusOutput[]>(url, undefined, headers);
  } else {
    const url = BASE_URL + `/api/v1/appForm/${appFormId}/status`;
    return axiosClient.get<TStatusOutput[]>(url, undefined, headers);
  }
};

export const updateAppFormStatus = (
  appFormId: string | undefined,
  updateRequest: TLoanStatusUpdateReq,
  headers?: Record<string, string>,
  params?: Record<string, string>,
) => {

  const mergedHeaders = {
    ...headers,
    source: 'apollo'
  };
  if (isServer) {
    const url = SHIELD_URL + `appForm/${appFormId}/status`;
    return fetchClient.post<TLoanStatusUpdateReq, TLoanStatusUpdateResp>(
      url,
      updateRequest,
      undefined,
      mergedHeaders,
    );
  } else {
    const url = BASE_URL + `/api/v1/appForm/${appFormId}/status`;
    return axiosClient.post<TLoanStatusUpdateReq, TLoanStatusUpdateResp>(
      url,
      updateRequest,
      undefined,
      mergedHeaders,
    );
  }
};

export const updateAppForm = (
  appFormId: string | undefined,
  updateRequest: TAppFormEditRequest,
  headers?: Record<string, string>,
  params?: Record<string, string | boolean>,
) => {
  if (isServer) {
    const url = SHIELD_URL + `appForm/${appFormId}`;
    return fetchClient.patch<TAppFormEditRequest, TAppformData>(
      url,
      updateRequest,
      params,
      headers,
    );
  } else {
    const url = BASE_URL + `/api/v1/appForm/${appFormId}`;
    return axiosClient.patch<TAppFormEditRequest, TAppformData>(
      url,
      updateRequest,
      params,
      headers,
    );
  }
};

export const getKyc = (
  applicantId: string,
  kycId: string,
  headers?: Record<string, string>,
) => {
  if (isServer) {
    const url = SHIELD_URL + `applicant/${applicantId}/kyc/${kycId}`;
    return fetchClient.get<TKycInfo>(url, undefined, headers);
  } else {
    return axiosClient.get<TKycInfo>(
      BASE_URL + `/api/v1/applicant/${applicantId}/kyc/${kycId}`,
    );
  }
};

export const getAllLoansForDedupe = (
  applicantId: number,
  headers?: Record<string, string>,
  cacheConfig?: CacheConfig,
) => {
  if (isServer) {
    return fetchClient.get<TPreviousLoan>(
      SHIELD_URL + `applicant/${applicantId}/loans`,
      undefined,
      headers,
    );
  } else {
    return axiosClient.get<TPreviousLoan>(
      BASE_URL + `/api/v1/applicant/${applicantId}/loans`,
    );
  }
};

export const getAppFormBasicInfoByPartnerLoanId = (
  partnerLoanId: string,
  details: string | null = 'appFormBasic',
  headers?: Record<string, string>,
) => {
  /*This call doesnt go from server so I have not writtem the server call. 
  If needed we can write*/
  if (isServer) {
    return fetchClient.get<TAppFormBasic>(
      SHIELD_URL +
        `partnerLoanId/${partnerLoanId}/selective?details=${details}`,
      undefined,
      headers,
    );
  } else {
    return axiosClient.get<TAppFormBasic>(
      BASE_URL +
        `/api/v1/partnerLoanId/${partnerLoanId}/selective?details=${details}`,
    );
  }
};

export const getAppFormHistory = (
  appFormId: string,
  headers?: Record<string, string>,
) => {
  if (isServer)
    return fetchClient.get<TAppFormChangeSet[]>(
      SHIELD_URL + `appForm/${appFormId}/history`,
      undefined,
      headers,
    );
  else {
    return axiosClient.get<TAppFormChangeSet[]>(
      BASE_URL + `/api/v1/appForm/${appFormId}/history`,
    );
  }
};

export const updateMCUStage = (
  appFormId: string,
  data: TAppFormStageStatus,
  headers?: Record<string, string>,
) => {
  if (isServer)
    return fetchClient.put<TAppFormStageStatus, TAppFormStageStatus>(
      SHIELD_URL + `appForm/${appFormId}/stageStatus`,
      data,
      headers,
    );
  else {
    return axiosClient.put<TAppFormStageStatus, TAppFormStageStatus>(
      BASE_URL + `/api/v1/appForm/${appFormId}/stageStatus`,
      data,
    );
  }
};
