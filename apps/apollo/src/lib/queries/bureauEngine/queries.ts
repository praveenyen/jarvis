import { useQuery, UseQueryResult } from '@tanstack/react-query';

import { getCreditReportFileQKey, getCreditReportQkey } from '../queryKeys';
import {  getCreditReportFile } from '../bureauEngine/services';
import {
  TBureauReport,
  TCreditResponse,
} from '../bureauEngine/queryResponseTypes';

export function useCreditReportFile(
  appFormId: string,
  applicantId: string,
): UseQueryResult<TCreditResponse | null, Error> {
  return useQuery<TCreditResponse | null>({
    retry:false,
    queryKey: getCreditReportFileQKey(appFormId, applicantId),
    queryFn: () => getCreditReportFile(appFormId, applicantId, undefined),
  });
}