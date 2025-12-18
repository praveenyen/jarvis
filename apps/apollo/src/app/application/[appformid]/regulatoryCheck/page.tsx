import { HydrationBoundary, QueryClient } from '@tanstack/react-query';
import ServerAuthHelper from '@/auth/ServerAuthHelper';
import {
  getRegCheckDetailedQKey,
  getRegCheckVersionQKey,
} from '@/lib/queries/queryKeys';

import { dehydrate } from '@tanstack/query-core';
import {
  getRegCheckDetailed,
  getRegCheckVersion,
} from '@/lib/queries/deadpool/services';
import RegulatoryCheckTab from '@/components/regulatoryCheck/RegulatoryCheckTab';

export default async function RegulatoryCheck({
  params,
}: {
  params: Promise<{ appformid: string }>;
}) {
  /*TODO HOW TO INVALIDATE */
  const queryClient = new QueryClient();
  /*TODO handle auth error*/
  const userToken = await ServerAuthHelper.getTokenFromCookies();
  const headers = ServerAuthHelper.getAuthHeader(userToken!);
  /**TODO @vineeth remove this check */
  const appFormId = (await params).appformid;
  //const appFormId = '8448ed5e-4e9b-4bbc-b15a-b5ca11f815e2';
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
