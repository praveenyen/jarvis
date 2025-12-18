import { HydrationBoundary, QueryClient } from '@tanstack/react-query';
import ServerAuthHelper from '@/auth/ServerAuthHelper';
import {
  getPartnerCodesQkey,
  getRegCheckDetailedQKey,
  getSpecifiedUsersQkey,
  getUserRoleQKey,
} from '@/lib/queries/queryKeys';

import { dehydrate } from '@tanstack/query-core';
import { getRegCheckDetailed } from '@/lib/queries/deadpool/services';
import RegulatoryCheckTab from '@/components/regulatoryCheck/RegulatoryCheckTab';

export default async function RegulatoryCheck() {
  /*TODO HOW TO INVALIDATE */
  const queryClient = new QueryClient();
  /*TODO handle auth error*/
  const userToken = await ServerAuthHelper.getTokenFromCookies();
  const headers = ServerAuthHelper.getAuthHeader(userToken!);
  const appFormId = '8448ed5e-4e9b-4bbc-b15a-b5ca11f815e2';

  const regCheckPrefetch = queryClient.prefetchQuery({
    queryKey: getRegCheckDetailedQKey(appFormId),
    queryFn: () =>
      getRegCheckDetailed(appFormId, 'v2', headers, {
        revalidateSec: 5,
      }),
  });

  await Promise.all([regCheckPrefetch]);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <RegulatoryCheckTab />
    </HydrationBoundary>
  );
}
