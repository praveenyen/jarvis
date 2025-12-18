import {
  useQuery,
  useMutation,
  useQueries,
  UseQueryResult,
} from '@tanstack/react-query';
import {
  getCalulateExposureQKey,
  getDedupeDataQKey,
  getExposureResultQKey,
} from '@/lib/queries/queryKeys';
import {
  calculateExposure,
  fetchDedupeData,
  generateUniqueCustomer,
  getExposureResult,
  mergeApplicant,
} from './services';
import {
  TAppFormDataDedupe,
  TApplicantDedupeResult,
  TExposureInput,
} from './queryResponseTypes';
import { TPreviousLoan } from '../shield/queryResponseTypes';
import { getPreviousLoanQKey } from '@/lib/queries/queryKeys';
import { getAllLoansForDedupe } from '../shield/services';

export function useDedupeData(appId: string) {
  return useQuery({
    queryKey: getDedupeDataQKey(appId),
    queryFn: () => fetchDedupeData(appId),
  });
}

export function useMergeApplicants(
  onErrorFn: (error: Error) => void,
  onSuccessFn: (data: TApplicantDedupeResult | undefined) => void,
) {
  return useMutation<
    TApplicantDedupeResult | undefined,
    Error,
    {
      applicantId: number;
      matchId: string;
    }
  >({
    mutationFn: ({ applicantId, matchId }) =>
      mergeApplicant(applicantId, matchId),
    onError: onErrorFn,
    onSuccess: onSuccessFn,
  });
}

export function useGenerateUniqueCustomer(
  onErrorFn: (error: Error) => void,
  onSuccessFn: (data: TApplicantDedupeResult) => void,
) {
  return useMutation<
    TApplicantDedupeResult,
    Error,
    { applicantId: number; status: string }
  >({
    mutationFn: ({ applicantId, status }) =>
      generateUniqueCustomer(applicantId, status),
    onError: onErrorFn,
    onSuccess: onSuccessFn,
  });
}

export function useGetPreviousLoans(
  dedupeData: TAppFormDataDedupe | undefined,
) {
  return useQueries<any[], UseQueryResult<TPreviousLoan>[]>({
    queries:
      dedupeData?.detailedApplicantDedupeList
        ?.filter(
          (applicant) =>
            applicant?.dedupeStatus === '1' || applicant?.dedupeStatus === '2',
        )
        ?.map((applicant) => ({
          queryKey: getPreviousLoanQKey(applicant.id),
          queryFn: () => getAllLoansForDedupe(applicant.id),
        })) || [],
  });
}

export function useGetExposureResult(appFormId: string, stage: string) {
  return useQuery({
    queryKey: getExposureResultQKey(appFormId),
    queryFn: () => getExposureResult(appFormId, stage),
  });
}

export function useCalculateExposure(
  postParams: TExposureInput,
  enabled: boolean,
) {
  return useQuery({
    queryKey: getCalulateExposureQKey(postParams?.appFormId || '-'),
    queryFn: () => calculateExposure(postParams),
    enabled: enabled,
  });
}
