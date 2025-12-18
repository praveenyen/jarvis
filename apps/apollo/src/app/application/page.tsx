import { HydrationBoundary, QueryClient } from '@tanstack/react-query';
import ServerAuthHelper from '@/auth/ServerAuthHelper';
import {
  getAllDesignationsQkey,
  getAllUsersDSAQkey,
  getAllUsersQkey,
  getBranchHierarchyQkey,
  getLoanProductCodesQkey,
  getSpecifiedUsersQkey,
  getUserRoleQKey,
} from '@/lib/queries/queryKeys';
import dynamic from 'next/dynamic';

import { getLoanProductCodes } from '@/lib/queries/groot/services';
import { getAllUsers } from '@/lib/queries/heimdall/services';
import {
  getAllDesignations,
  getAllUsersDSA,
  getBranchHierarchy,
  getSpecifiedUsers,
} from '@/lib/queries/hera/services';
import { dehydrate } from '@tanstack/query-core';
const Dashboard = dynamic(
  () => import('@/components/appFormDashboard/Dashboard'),
);

export default async function AppFormDashboardContainer() {
  /*TODO HOW TO INVALIDATE */
  const queryClient = new QueryClient();
  /*TODO handle auth error*/
  const userToken = await ServerAuthHelper.getTokenFromCookies();
  const headers = ServerAuthHelper.getAuthHeader(userToken!);
  const userDetails = ServerAuthHelper.parseJwtToken(userToken);
  const userId = userDetails.sub;

  const loanProductCodePrefetch = queryClient.prefetchQuery({
    queryKey: getLoanProductCodesQkey(),
    queryFn: () => getLoanProductCodes(headers),
  });
  // const allUsersPrefetch = queryClient.prefetchQuery({
  //   queryKey: getAllUsersQkey(),
  //   queryFn: () => getAllUsers(headers),
  // });
  /* const partnerCodesPrefetch = queryClient.prefetchQuery({
    queryKey: getPartnerCodesQkey(),
    queryFn: () => getPartnerCodes(headers),
  });*/
  // const branchHierarchyPrefetch = queryClient.prefetchQuery({
  //   queryKey: getBranchHierarchyQkey(),
  //   queryFn: () => getBranchHierarchy(headers),
  // });

  // const salesManagerPrefetch = queryClient.prefetchQuery({
  //   queryKey: getSpecifiedUsersQkey('SALES_MANAGER'),
  //   queryFn: () => getSpecifiedUsers('SALES_MANAGER', headers),
  // });

  // const areaSalesManagerPrefetch = queryClient.prefetchQuery({
  //   queryKey: getSpecifiedUsersQkey('AREA_SALES_MANAGER'),
  //   queryFn: () => getSpecifiedUsers('AREA_SALES_MANAGER', headers),
  // });

  // const allUsersDSAPrefetch = queryClient.prefetchQuery({
  //   queryKey: getAllUsersDSAQkey(),
  //   queryFn: () => getAllUsersDSA(headers),
  // });

  // const allDesginationsPrefetch = queryClient.prefetchQuery({
  //   queryKey: getAllDesignationsQkey(),
  //   queryFn: () => getAllDesignations(headers),
  // });

  await Promise.all([
    loanProductCodePrefetch,
    // allUsersPrefetch,
    // branchHierarchyPrefetch,
    // salesManagerPrefetch,
    // areaSalesManagerPrefetch,
    // allUsersDSAPrefetch,
    // allDesginationsPrefetch,
  ]);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Dashboard />
    </HydrationBoundary>
  );
}
