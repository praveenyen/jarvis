import {
  useMutation,
  UseMutationResult,
  useQuery,
  UseQueryOptions,
  UseQueryResult,
} from '@tanstack/react-query';
import {
  getLoanProductCodesQkey,
  getRegCheckDetailedQKey,
  getRegCheckVersionQKey,
} from '@/lib/queries/queryKeys';
import {
  approveRegCheck,
  approveRegCheckV3,
  getRegCheckDetailed,
  getRegCheckVersion,
} from '@/lib/queries/deadpool/services';
import {
  GetRegCheckDetailed,
  UpdateRegCheckRequest,
  UpdateRegCheckRequestV3,
  UpdateRegCheckResponse,
} from '@/lib/queries/deadpool/queryResponseTypes';
import { TAppFormListResponse } from '@/lib/queries/shield/queryResponseTypes';

export function useRegCheckDetailed(
  appFormId: string,
  options?: Omit<
    UseQueryOptions<GetRegCheckDetailed, Error>,
    'queryKey' | 'queryFn'
  >,
): UseQueryResult<GetRegCheckDetailed, Error> {
  return useQuery<GetRegCheckDetailed>({
    queryKey: getRegCheckDetailedQKey(appFormId),
    queryFn: () => getRegCheckDetailed(appFormId, 'v2'),
    ...options,
  });
}

export function useApproveRegCheck(
  onErrorFn: (error: Error) => void,
  onSuccessFn: (data: UpdateRegCheckResponse) => void,
  onSettledFn: (
    data: UpdateRegCheckResponse | undefined,
    error: Error | null,
    variables: { appFormId: string; newStatus: UpdateRegCheckRequest },
  ) => void,
) {
  return useMutation<
    UpdateRegCheckResponse,
    Error,
    { appFormId: string; newStatus: UpdateRegCheckRequestV3 }
  >({
    mutationFn: ({ appFormId, newStatus }) =>
      approveRegCheckV3(appFormId, newStatus),
    onError: onErrorFn,
    onSuccess: onSuccessFn,
    onSettled: onSettledFn,
  });
}

export function useRegCheckVersion(
  appFormId: string,
): UseQueryResult<Record<'version', string>, Error> {
  return useQuery<Record<'version', string>>({
    queryKey: getRegCheckVersionQKey(appFormId),
    queryFn: () => getRegCheckVersion(appFormId),
  });
}
