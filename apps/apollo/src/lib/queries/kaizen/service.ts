import HttpClientFactory from '@/lib/httpClient/HttpClientFactory';
import { isServer } from '@tanstack/react-query';
import { DiscrepancyList, DiscrepancyStatus, NarrationList, TDiscrepancyData, TPositiveConfirmationRecordResponse } from '@/lib/queries/kaizen/queryResponseTypes';

const KAIZEN_URL = process.env.KAIZEN_SERVER;
const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

const fetchClient = HttpClientFactory.getHttpClient('fetch');
const axiosClient = HttpClientFactory.getHttpClient('axios');
export const getPositiveConfirmationRecord = (
  appFormId: string,
  headers?: Record<string, string>,
) => {
  if (isServer) {
    const url = KAIZEN_URL + `positiveconfirmation/record/${appFormId}`;
    return fetchClient.get<TPositiveConfirmationRecordResponse>(
      url,
      undefined,
      headers,
    );
  } else {
    const url = BASE_URL + `/api/v1/positiveconfirmation/record/${appFormId}`;
    return axiosClient.get<TPositiveConfirmationRecordResponse>(url);
  }
};

export const updatePositiveConfirmation = (
  appFormId: string,
  updateRequest: Record<string, string>,
  headers?: Record<string, string>,
) => {
  if (isServer) {
    const url = KAIZEN_URL + `positiveconfirmation/record/${appFormId}`;
    return fetchClient.patch<
      Record<string, string>,
      TPositiveConfirmationRecordResponse
    >(url, updateRequest, undefined, headers);
  } else {
    const url = BASE_URL + `/api/v1/positiveconfirmation/record/${appFormId}`;
    return axiosClient.patch<
      Record<string, string>,
      TPositiveConfirmationRecordResponse
    >(url, updateRequest, undefined, headers);
  }
};


export const getDiscrepancyData = (
  appFormId: string,
  headers?: Record<string, string>,
  params?: Record<string, string>,
) => {
  if (isServer) {
    const url = KAIZEN_URL + `discrepancy/appForm/${appFormId}`;
    return fetchClient.get<TDiscrepancyData>(url, params, headers);
  } else {
    const url = BASE_URL + `/api/v1/discrepancy/appForm/${appFormId}`;
    return axiosClient.get<TDiscrepancyData>(url);
  }
};


export const getNarrations = (
  headers?: Record<string, string>,
  params?: Record<string, string>,
) => {
  if (isServer) {
    const url = KAIZEN_URL + `narration/lpc/Partnership/stage/qcstage`;
    return fetchClient.get<NarrationList>(url, params, headers);
  } else {
    const url = BASE_URL + `/api/v1/narration/lpc/Partnership/stage/qcstage`;
    return axiosClient.get<NarrationList>(url);
  }
};

export const getDiscrepancyStatus = (
  appFormId: string,
  headers?: Record<string, string>,
  params?: Record<string, string>,
) => {
  if (isServer) {
    const url = KAIZEN_URL + `discrepancy/appForm/${appFormId}/status`;
    return fetchClient.get<DiscrepancyStatus>(url, params, headers);
  } else {
    const url = BASE_URL + `/api/v1/discrepancy/appForm/${appFormId}/status`;
    return axiosClient.get<DiscrepancyStatus>(url);
  }
};

export const addDiscrepancy= (
  appFormId: string,
  discrepancyData: DiscrepancyList | undefined,
  headers?: Record<string, string>,
) => {
  if (isServer) {
    const url = KAIZEN_URL +  `discrepancy/appForm/${appFormId}`;
    return fetchClient.post<DiscrepancyList | undefined, DiscrepancyList>(
      url,
      discrepancyData,
      undefined,
      headers,
    );
  } else
    return axiosClient.post<DiscrepancyList | undefined, DiscrepancyList>(
      BASE_URL + `/api/v1/discrepancy/appForm/${appFormId}`,
      discrepancyData,
      undefined,
      headers,
    );
};

export const updateDiscrepancy= (
  appFormId: string,
  discrepancyData: DiscrepancyList | undefined,
  headers?: Record<string, string>,
) => {
  if (isServer) {
    const url = KAIZEN_URL +  `discrepancy/appForm/${appFormId}`;
    return fetchClient.patch<DiscrepancyList | undefined, DiscrepancyList>(
      url,
      discrepancyData,
      undefined,
      headers,
    );
  } else
    return axiosClient.patch<DiscrepancyList | undefined, DiscrepancyList>(
      BASE_URL + `/api/v1/discrepancy/appForm/${appFormId}`,
      discrepancyData,
      undefined,
      headers,
    );
};



