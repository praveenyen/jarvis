import {
    useQuery,
    UseQueryResult,
  UseQueryOptions,
} from '@tanstack/react-query';
import { MnrlFriDiuReq, MnrlFriDiuResponse } from './queryResponseTypes';
import { mnrlFriFraudCheckVerify } from './services';
import { postMnrlFriQKey } from '../queryKeys';

type MnrlFriFraudCheckResult = UseQueryResult<MnrlFriDiuResponse, Error>;

export function useMnrlFriFraudCheck(
  postParams: MnrlFriDiuReq | null,
  options?: Omit<
    UseQueryOptions<MnrlFriDiuResponse, Error>,
    'queryKey' | 'queryFn'
  >,
): MnrlFriFraudCheckResult {

  const baseQueryOptions = {
    queryKey: postMnrlFriQKey(postParams),
    queryFn: () => mnrlFriFraudCheckVerify(postParams as MnrlFriDiuReq),
    enabled: postParams !== null,
  };
  return useQuery({
    ...baseQueryOptions,
    ...options,
  });
}