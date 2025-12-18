import { useQuery, useMutation, UseQueryOptions } from '@tanstack/react-query';
import { fetchVerificationData, updateKycData } from './services';
import { getVerificationDataQKey } from '@/lib/queries/queryKeys';
import {
  TVerifyAppFormStatus,
  TKycInfo,
  TKycCustomStatusInput,
  TKycCustomStatusOutput,
} from './queryResponseTypes';
import { resolveKyc } from './services';
import {
  Kyc,
  TAppFormListResponse,
} from '@/lib/queries/shield/queryResponseTypes';

export const useVerificationData = (
  appFormId: string,
  options?: Omit<
    UseQueryOptions<TVerifyAppFormStatus, Error>,
    'queryKey' | 'queryFn'
  >,
) => {
  return useQuery<TVerifyAppFormStatus>({
    queryKey: getVerificationDataQKey(appFormId),
    queryFn: () => fetchVerificationData(appFormId),
    ...options,
  });
};

export function useResolveKyc(
  onErrorFn: (error: Error) => void,
  onSuccessFn: (data: Kyc) => void,
) {
  return useMutation<
    Kyc,
    Error,
    { applicantId: number; kycId: number; reqData: Kyc }
  >({
    mutationFn: ({ applicantId, kycId, reqData }) =>
      resolveKyc(applicantId, kycId, reqData),
    onError: onErrorFn,
    onSuccess: onSuccessFn,
  });
}

export function useUpdateKycStatus(
  onErrorFn: (erro: Error) => void,
  onSuccessFn: (data: TKycCustomStatusOutput | undefined) => void,
) {
  return useMutation<
    TKycCustomStatusOutput | undefined,
    Error,
    { applicantId: number; reqData: TKycCustomStatusInput | undefined }
  >({
    mutationFn: ({ applicantId, reqData }) =>
      updateKycData(applicantId, reqData),
    onError: onErrorFn,
    onSuccess: onSuccessFn,
  });
}
