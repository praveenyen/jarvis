import { Box } from "@mantine/core";
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import { getDisbursalListKey } from "@/lib/queries/queryKeys";
import { getDisbursementList } from "@/lib/queries/spiderman/service";
import ServerAuthHelper from '@/auth/ServerAuthHelper';
import dynamic from "next/dynamic";

const DisbursementMainScreen = dynamic(
       () => import('@/components/disbursement/DisbursementMainScreen'),
);


export default async function Disbursement() {

       const queryClient = new QueryClient();
       const userToken = await ServerAuthHelper.getTokenFromCookies();

       const headers = ServerAuthHelper.getAuthHeader(userToken!);


       const disbursmentList = queryClient.prefetchQuery({
              queryKey: getDisbursalListKey('10'),
              queryFn: () => getDisbursementList('10', '1', undefined, undefined, undefined, undefined, headers),
       });

       await Promise.all([
              disbursmentList
       ]);

       return (

              <HydrationBoundary state={dehydrate(queryClient)}>
                     <DisbursementMainScreen />
              </HydrationBoundary>
       );
}