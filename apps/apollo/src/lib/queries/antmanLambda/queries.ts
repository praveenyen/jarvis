import { UseQueryResult, useQuery } from '@tanstack/react-query';
import { getRiskCategoryQKey } from '../queryKeys';
import { getRiskcategory, TRiskCategoryResp } from './services';

export function useRiskCategory(
  customerId: string,
  headers?: Record<string, string>,
  params?: Record<string, string>,
): UseQueryResult<TRiskCategoryResp, Error> {
  return useQuery<TRiskCategoryResp>({
    queryKey: getRiskCategoryQKey(customerId),
    queryFn: () => getRiskcategory(customerId, headers, params),
    retry: false,
  });
}
