import {
  useQuery,
  UseQueryOptions,
  UseQueryResult,
  useMutation,
} from '@tanstack/react-query';
import {
  getAppFormList,
  getAppFormData,
  updateAppFormStatus,
  getAllLoansForDedupe,
  getAppFormHistory,
  updateMCUStage,
} from './services';
import {
  TAppFormChangeSet,
  TAppformData,
  TAppFormEditRequest,
  TAppFormListResponse,
  TAppFormStageStatus,
  TLoanStatusUpdateReq,
  TLoanStatusUpdateResp,
  TPreviousLoan,
} from './queryResponseTypes';
import {
  getAppFormListQkey,
  getAppFormDataQKey,
  getPreviousLoanQKey,
  getAppFormHistoryQKey,
} from '../queryKeys';
import { updateAppForm } from './services';
import HttpClientException from '@/lib/exceptions/HttpClientException';

export function useAppFormList(
  headers: Record<string, string>,
  filters: Record<string, string>,
  options?: Omit<
    UseQueryOptions<TAppFormListResponse, Error>,
    'queryKey' | 'queryFn'
  >,
): UseQueryResult<TAppFormListResponse, Error> {
  return useQuery<TAppFormListResponse>({
    queryKey: getAppFormListQkey(filters),
    queryFn: () => getAppFormList(filters, headers),
    retry:false,
    ...options,
  });
}

export const useAppFormDataGet = (
  appFormId: string,
  headers?: Record<string, string>,
  params?: Record<string, string>,
  options?: Omit<UseQueryOptions<TAppformData, Error>, 'queryKey' | 'queryFn'>,
): UseQueryResult<TAppformData, Error> => {
  return useQuery({
    queryKey: getAppFormDataQKey(appFormId),
    queryFn: () => getAppFormData(appFormId, params, headers),
    ...options,
  });
};

export function useAppFormStatusUpdate(
  onErrorFn: (error: Error) => void,
  onSuccessFn: (data: TLoanStatusUpdateResp) => void,
  headers?: Record<string, string>,
) {
  return useMutation<
    TLoanStatusUpdateResp,
    Error,
    { appFormId: string; reqData: TLoanStatusUpdateReq }
  >({
    mutationFn: ({ appFormId, reqData }) =>
      updateAppFormStatus(appFormId, reqData, headers),
    onError: onErrorFn,
    onSuccess: onSuccessFn,
  });
}

export function useAppFormGetAllPreviousLoans(
  applicantId: number,
  headers?: Record<string, string>,
) {
  return useQuery<TPreviousLoan | Error>({
    queryKey: getPreviousLoanQKey(applicantId),
    queryFn: () => getAllLoansForDedupe(applicantId, headers),
  });
}

export function useAppFormPatch(
  onErrorFn: (error: HttpClientException) => void,
  onSuccessFn: (data: TAppformData) => void,
  headers?: Record<string, string>,
) {
  return useMutation<
    TAppformData,
    HttpClientException,
    {
      appFormId: string;
      checkAppFormStatus: boolean;
      reRunCpcChecks: boolean;
      validationRequired: boolean;
      reqData: TAppFormEditRequest;
    }
  >({
    mutationFn: ({ appFormId, checkAppFormStatus, reRunCpcChecks, validationRequired, reqData }) =>
      updateAppForm(appFormId, reqData, headers, {
        checkAppFormStatus,
        reRunCpcChecks,
        validationRequired
      }),
    onError: onErrorFn,
    onSuccess: onSuccessFn,
  });
}

export function useAppFormHistory(
  appFormId: string,
  headers?: Record<string, string>,
) {
  return useQuery<TAppFormChangeSet[] | Error>({
    queryKey: getAppFormHistoryQKey(appFormId),
    queryFn: () => getAppFormHistory(appFormId, headers),
  });
}

export function useUpdateMcuStatus(
  onErrorFn: (error: Error) => void,
  onSuccessFn: (data: TAppFormStageStatus) => void,
) {
  return useMutation<
    TAppFormStageStatus,
    Error,
    { appFormId: string; reqData: TAppFormStageStatus }
  >({
    mutationFn: ({ appFormId, reqData }) => updateMCUStage(appFormId, reqData),
    onError: onErrorFn,
    onSuccess: onSuccessFn,
  });
}
