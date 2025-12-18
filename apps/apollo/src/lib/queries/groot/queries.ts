import { useQuery, UseQueryOptions, UseQueryResult } from '@tanstack/react-query';
import { getLoanProductCodes, getLoanProductConfigs } from './services';
import {
  getLoanProductCodesQkey,
  getLoanProductConfigsQKey,
} from '@/lib/queries/queryKeys';
import { TProductCodesShortened } from './queryResponseTypes';

export function useLoanProductCodes(
  headers?: Record<string, string>,
): UseQueryResult<string[], Error> {
  return useQuery<string[]>({
    queryKey: getLoanProductCodesQkey(),
    queryFn: () => getLoanProductCodes(),
  });
}

export function useLoanProductConfigs(
  headers?: Record<string, string>,
  options?: Omit<
    UseQueryOptions<TProductCodesShortened[], Error>,
    'queryKey' | 'queryFn'
  >,
): UseQueryResult<TProductCodesShortened[], Error> {
  return useQuery<TProductCodesShortened[]>({
    queryKey: getLoanProductConfigsQKey(),
    queryFn: () => getLoanProductConfigs(headers),
    ...options
  });
}
