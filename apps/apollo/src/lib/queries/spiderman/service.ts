import { isServer } from '@tanstack/react-query';
import IHttpClient, { CacheConfig } from '@/lib/httpClient/IHttpClient';
import HttpClientFactory from '@/lib/httpClient/HttpClientFactory';
import { NewUtrSuccessPayload, ProcessToPayload, rejectedStatusPayload } from '@/components/disbursement/DisbursementCommonType';
import { TProductCodesShortened } from '../groot/queryResponseTypes';
import { getLpcFromList, isCreditLine } from '@/components/disbursement/commonFunctionDisbursement';

const axiosClient: IHttpClient = HttpClientFactory.getHttpClient('axios');
const fetchClient: IHttpClient = HttpClientFactory.getHttpClient('fetch');

const API_URL = {
  SERVER: process.env.SPIDERMAN_SERVER,
  CLIENT: process.env.NEXT_PUBLIC_API_URL,
};

export const getDisbursementList = (
  status: string,
  pageNumber?: string,
  productType?: TProductCodesShortened[],
  groupDateFrom?: string,
  groupDateTo?: string,
  groupId?: string,
  headers?: Record<string, string>,
  cacheConfig?: CacheConfig,
): Promise<any> => {


  let isCreditLineFlow: Boolean = false; // used to determine if the request is for credit line or not.

  const params: Record<string, string> = { status };
  if (pageNumber !== undefined) {
    params.pageNumber = pageNumber;
  }

  if (productType && productType.length > 0) {
    if (!isServer) {
      params.loanProductCode = JSON.stringify(productType);
    } else {
      isCreditLineFlow = isCreditLine(productType[0]);
      const lpcList = getLpcFromList(productType).join(',');
      params.loanProductCode = lpcList;
    }
  }

  if (groupId !== '' && groupId !== undefined && isCreditLineFlow) {
    params.loanId = groupId;
  }

  if (groupId !== '' && groupId !== undefined && !isCreditLineFlow) {
    params.groupId = groupId;
  }

  if (groupDateFrom !== '' && groupDateFrom !== undefined && groupDateTo !== '' && groupDateTo !== undefined) {
    params.from = groupDateFrom;
    params.to = groupDateTo;
  }

  const queryParams: URLSearchParams = new URLSearchParams(params);
  const fetchClientParams: Record<string, string> = Object.fromEntries(
    queryParams.entries(),
  );

  if (isServer) {
    if (isCreditLineFlow) {

      const url =
        API_URL.SERVER +
        `creditLine/information`;
      return fetchClient.get<any>(
        url,
        fetchClientParams,
        headers,
        cacheConfig,
      );
    }
    if (!isCreditLineFlow) {

      const url =
        API_URL.SERVER +
        `disbursal/information`;
      return fetchClient.get<any>(
        url,
        fetchClientParams,
        headers,
        cacheConfig,
      );
    }

    
  } else {
    const url =
      API_URL.CLIENT +
      `/api/v1/disbursal/information`;
    return axiosClient.get<any>(
      url,
      fetchClientParams
    );
  }
  return Promise.reject(new Error('No valid code path was executed in getDisbursementList'));
};

export const getDisbursementListCreditLine = (
  status: string,
  pageNumber?: string,
  productType?: string,
  groupDateFrom?: string,
  groupDateTo?: string,
  groupId?: string,
  headers?: Record<string, string>,
  cacheConfig?: CacheConfig,
): Promise<any> => {

  const params: Record<string, string> = { status };
  if (pageNumber !== undefined) {
    params.pageNumber = pageNumber;
  }

  if (productType !== '' && productType !== undefined) {
    params.loanProductCode = productType;
  }

  if (groupId !== '' && groupId !== undefined) {
    params.groupId = groupId;
  }

  if (groupDateFrom !== '' && groupDateFrom !== undefined && groupDateTo !== '' && groupDateTo !== undefined) {
    params.from = groupDateFrom;
    params.to = groupDateTo;
  }

  const queryParams: URLSearchParams = new URLSearchParams(params);
  const fetchClientParams: Record<string, string> = Object.fromEntries(
    queryParams.entries(),
  );

  if (isServer) {
    const url =
      API_URL.SERVER +
      `creditLine/information`;
    return fetchClient.get<any>(
      url,
      fetchClientParams,
      headers,
      cacheConfig,
    );
  } else {
    const url =
      API_URL.CLIENT +
      `/api/v1/creditLine/information`;
    return axiosClient.get<any>(
      url,
      fetchClientParams
    );
  }
};

export const putResonForReject = (
  dataToBeSent: rejectedStatusPayload | ProcessToPayload,
  headers?: Record<string, string>,
  cacheConfig?: CacheConfig,
): Promise<any> => {
  if (isServer) {
    const url =
      API_URL.SERVER +
      `disbursementAppForm/status`;
    return fetchClient.put<any, any>(
      url,
      dataToBeSent,
      undefined,
      headers,
      cacheConfig,
    );
  } else {
    const url =
      API_URL.CLIENT +
      `/api/v1/disbursal/status`;
    return axiosClient.put<any, any>(
      url, dataToBeSent, undefined
    );
  }
};

export const processedToPay = (
  dataToBeSent: ProcessToPayload,
  headers?: Record<string, string>,
  cacheConfig?: CacheConfig,
): Promise<any> => {
  if (isServer) {
    const url =
      API_URL.SERVER +
      `disbursal/group/status`;
    return fetchClient.put<any, any>(
      url,
      dataToBeSent,
      undefined,
      headers,
      cacheConfig,
    );
  } else {
    const url =
      API_URL.CLIENT +
      `/api/v1/disbursal/group/status`;
    return axiosClient.put<any, any>(
      url, dataToBeSent, undefined
    );
  }
};

export const putUtrPayment = (
  dataToBeSent: NewUtrSuccessPayload,
  withdrawal?: boolean,
  headers?: Record<string, string>,
  cacheConfig?: CacheConfig,
): Promise<any> => {


  const params: Record<string, string> = { };

  if(withdrawal){
    params.withdrawalId = dataToBeSent.groupId;
  }
  
  const queryParams: URLSearchParams = new URLSearchParams(params);
  const fetchClientParams: Record<string, string> = Object.fromEntries(
    queryParams.entries(),
  );


  if (isServer) {
    const payload = {
      utr: dataToBeSent.utr,
      modeOfPayment: dataToBeSent.modeOfPayment,
      groupId: dataToBeSent.groupId
    };
    const url =
      API_URL.SERVER +
      `loan/${dataToBeSent.appFormId}/payment`;
    return fetchClient.put<any, any>(
      url,
      payload,
      withdrawal ? fetchClientParams : undefined,
      headers,
      cacheConfig,
    );
  } else {
    const url =
      API_URL.CLIENT +
      `/api/v1/disbursal/payment`;
    return axiosClient.put<any, any>(
      url, dataToBeSent, withdrawal ? fetchClientParams : undefined
    );
  }
};



export const getResonForReject = (
  headers?: Record<string, string>,
  cacheConfig?: CacheConfig,
): Promise<any> => {

  if (isServer) {
    const params: Record<string, string> = { status: "-80" };
    const queryParams: URLSearchParams = new URLSearchParams(params);
    const fetchClientParams: Record<string, string> = Object.fromEntries(
      queryParams.entries(),
    );
    const url =
      API_URL.SERVER +
      `loanStatus/reason`;
    return fetchClient.get<any>(
      url,
      fetchClientParams,
      headers,
      cacheConfig,
    );
  } else {
    const url =
      API_URL.CLIENT +
      `/api/v1/disbursal/status`;
    return axiosClient.get<any>(
      url
    );
  }
};
