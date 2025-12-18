import { useMutation, useQuery, UseQueryResult } from '@tanstack/react-query';
import { DiscrepancyList, TPositiveConfirmationRecordResponse } from '@/lib/queries/kaizen/queryResponseTypes';
import {
  addDiscrepancy,
  getDiscrepancyData,
  getDiscrepancyStatus,
  getNarrations,
  getPositiveConfirmationRecord,
  updateDiscrepancy,
  updatePositiveConfirmation,
} from '@/lib/queries/kaizen/service';
import { getDiscrepancyDataQKey, getDiscrepancyStatusQKey, getNarrationsQKey, getPositiveConfirmationRecordQKey } from '../queryKeys';

export function usePositiveConfirmationRecordGet(
  appFormId: string,
  headers?: Record<string, string>,
): UseQueryResult<TPositiveConfirmationRecordResponse, Error> {
  return useQuery<TPositiveConfirmationRecordResponse>({
    queryKey: getPositiveConfirmationRecordQKey(appFormId),
    retry:false,
    queryFn: () => getPositiveConfirmationRecord(appFormId, headers),
  });
}

export function usePositiveConfirmationUpdate(
  onErrorFn: (error: Error) => void,
  onSuccessFn: (data: TPositiveConfirmationRecordResponse) => void,
  headers?: Record<string, string>,
) {
  return useMutation<
    TPositiveConfirmationRecordResponse,
    Error,
    { appFormId: string; reqData: Record<string, string> }
  >({
    mutationFn: ({ appFormId, reqData }) =>
      updatePositiveConfirmation(appFormId, reqData, headers),
    retry:false,
    onError: onErrorFn,
    onSuccess: onSuccessFn,
  });
}

export function useDiscrepancyData(appId: string,  headers?: Record<string, string>,
  params?: Record<string, string>,) {
  return useQuery({
    queryKey: getDiscrepancyDataQKey(appId),
    queryFn: () => getDiscrepancyData(appId),
  });
}

export function useNarrations(headers?: Record<string, string>,
  params?: Record<string, string>,) {
  return useQuery({
    queryKey: getNarrationsQKey(),
    queryFn: () => getNarrations(),
  });
}

export function useDiscrepancyStatusGet(appId: string, headers?: Record<string, string>,
  params?: Record<string, string>,) {
    return useQuery({
      queryKey: getDiscrepancyStatusQKey(appId),
      queryFn: () => getDiscrepancyStatus(appId),
    });
  }

export function useAddDiscrepancy(
  onErrorFn: (error: Error) => void,
  onSuccessFn: (data: Object) => void,
) {
  return useMutation<
    Object,
    Error,
    { appFormId: string, reqData:DiscrepancyList }
  >({
    mutationFn: ({ appFormId, reqData }) =>
      addDiscrepancy(appFormId, reqData),
    onError: onErrorFn,
    onSuccess: onSuccessFn,
  });
}

export function useUpdateDiscrepancy(
  onErrorFn: (error: Error) => void,
  onSuccessFn: (data: Object) => void,
) {
  return useMutation<
    Object,
    Error,
    { appFormId: string, reqData:DiscrepancyList }
  >({
    mutationFn: ({ appFormId, reqData }) =>
      updateDiscrepancy(appFormId, reqData),
    onError: onErrorFn,
    onSuccess: onSuccessFn,
  });
}
