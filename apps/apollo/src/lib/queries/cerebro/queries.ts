import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { TExpBureau } from './queryResponseTypes';
import { GetRegCheckDetailed } from '../deadpool/queryResponseTypes';
import { getCreditData } from './service';
import { getCreditDatQKey } from '../queryKeys';
import { CacheConfig } from '@/lib/httpClient/IHttpClient';

export function useCreditDataGet(
  appFormId: string,
  applicantId: string,
  bureauName: string,
): UseQueryResult<TExpBureau, Error> {
  return useQuery<TExpBureau>({
    queryKey: getCreditDatQKey(appFormId, applicantId, bureauName),
    queryFn: () => getCreditData(appFormId, applicantId, bureauName, undefined),
  });
}
