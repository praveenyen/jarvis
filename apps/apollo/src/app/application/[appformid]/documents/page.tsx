import LoadingSkeleton from '@/components/common/LoadingSkeleton';
import DocumentMainScreen from '@/components/documents/DocumentMainScreen';
import { HydrationBoundary, QueryClient } from '@tanstack/react-query';
import ServerAuthHelper from '@/auth/ServerAuthHelper';
import { dehydrate } from '@tanstack/query-core';

import { Suspense } from 'react';
import {
  addTagSectionItemQKey,
  getAppformDocumentQkey,
} from '@/lib/queries/queryKeys';
import {
  getAddSectionListItem,
  getDocAppForm,
} from '@/lib/queries/drStrange/service';

export default async function DocumentationPage({
  params,
  searchParams,
}: {
  params: { appformid: string };
  searchParams?: { lpc?: string };
}) {
  const queryClient = new QueryClient();
  const userToken = await ServerAuthHelper.getTokenFromCookies();
  const headers = ServerAuthHelper.getAuthHeader(userToken!);
  const loanProductCode = searchParams?.lpc || '';

  const loanProductCodePrefetch = queryClient.prefetchQuery({
    queryKey: getAppformDocumentQkey(params.appformid, loanProductCode),
    queryFn: () => getDocAppForm(params.appformid, loanProductCode, headers),
  });

  const addSectionLpc = queryClient.prefetchQuery({
    queryKey: addTagSectionItemQKey(loanProductCode),
    queryFn: () => getAddSectionListItem(loanProductCode, headers),
  });

  console.log('try ', loanProductCode);

  await Promise.all([loanProductCodePrefetch, addSectionLpc]);

  return (
    <HydrationBoundary>
      <DocumentMainScreen />
    </HydrationBoundary>
  );
}
