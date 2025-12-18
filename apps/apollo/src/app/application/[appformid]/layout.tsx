import ServerAuthHelper from '@/auth/ServerAuthHelper';
import {
  getAllUsersQkey,
  getAppFormDataQKey,
  getAppFormHistoryQKey,
  getCreditDatQKey,
  getCreditReportFileQKey,
  getLoanProductCodesQkey,
  getLoanProductConfigsQKey,
  getRegCheckVersionQKey,
} from '@/lib/queries/queryKeys';
import {
  getLoanProductCodes,
  getLoanProductConfigs,
} from '@/lib/queries/groot/services';
import { HydrationBoundary, QueryClient } from '@tanstack/react-query';
import {
  getAppFormData,
  getAppFormHistory,
} from '@/lib/queries/shield/services';
import { dehydrate } from '@tanstack/react-query';
import AppFormMainLayout from '@/components/appFormLayout/AppFormMainLayout';
import {
  TAppFormChangeSet,
  TAppformData,
} from '@/lib/queries/shield/queryResponseTypes';
import { ReactNode } from 'react';
import { notFound } from 'next/navigation';
import { appFormRawData } from '@/store/atoms';
import { TVerifyAppFormStatus } from '@/lib/queries/hulk/queryResponseTypes';
import { fetchVerificationData } from '@/lib/queries/hulk/services';
import { getVerificationDataQKey } from '@/lib/queries/queryKeys';
import { TAppFormDataDedupe } from '@/lib/queries/vision/queryResponseTypes';
import { getDedupeDataQKey } from '@/lib/queries/queryKeys';
import { fetchDedupeData } from '@/lib/queries/vision/services';
import { getAllUsers } from '@/lib/queries/heimdall/services';
import { getApplicantList } from '@/store/modules/appform';
import {
  getCreditReportFile,
} from '@/lib/queries/bureauEngine/services';
import {
  TCreditResponse,
} from '@/lib/queries/bureauEngine/queryResponseTypes';
import { getRegCheckVersion } from '@/lib/queries/deadpool/services';
import { TProductCodesShortened } from '@/lib/queries/groot/queryResponseTypes';
import { isSmeDirect } from '@/lib/rules/commonRules';

export default async function AppFormLayout({
  params,
  searchParams,
  children,
}: {
  params: Promise<{ appformid: string }>;
  searchParams?: { lpc?: string };
  children: ReactNode;
}) {
  // Prefetch data
  const queryClient = new QueryClient();
  const userToken = await ServerAuthHelper.getTokenFromCookies();
  const headers = ServerAuthHelper.getAuthHeader(userToken!);
  const appFormId = (await params).appformid;
  const loanProductCode = searchParams?.lpc || '';
  const cibilLoanProducts: string[] = [
    'CLP',
    'KBL',
    'LKB',
    'PCL',
    'MCN',
    'MBS',
    'HIL',
    'MSR',
    'UBL',
    'FCL',
    'UPL',
    'INC',
    'BYJ',
    'JAR',
    'LPC',
    'LPA',
  ];

  await queryClient.prefetchQuery<Promise<TAppformData>>({
    queryKey: getAppFormDataQKey(appFormId),
    queryFn: async () => getAppFormData(appFormId, headers),
    retry: false,
  });
  await queryClient.prefetchQuery({
    queryKey: getLoanProductConfigsQKey(),
    queryFn: () => getLoanProductConfigs(headers),
  });

  Promise.all([
    queryClient.prefetchQuery<Promise<TVerifyAppFormStatus>>({
      queryKey: getVerificationDataQKey(appFormId),
      queryFn: async () => fetchVerificationData(appFormId, headers),
      retry: false,
    }),
    queryClient.prefetchQuery<Promise<TAppFormDataDedupe>>({
      queryKey: getDedupeDataQKey(appFormId),
      queryFn: () => fetchDedupeData(appFormId),
    }),
    queryClient.prefetchQuery<Promise<TAppFormChangeSet[]>>({
      queryKey: getAppFormHistoryQKey(appFormId),
      queryFn: () => getAppFormHistory(appFormId, headers),
    }),
    queryClient.prefetchQuery({
      queryKey: getAllUsersQkey(),
      queryFn: () =>
        getAllUsers(headers, {
          revalidateSec: 3600 * 10,
        }),
    }),
    queryClient.prefetchQuery({
      queryKey: getRegCheckVersionQKey(appFormId),
      queryFn: () =>
        getRegCheckVersion(appFormId, headers, {
          revalidateSec: 3600 * 5,
        }),
    }),
  ]);

  const appFormData = queryClient.getQueryData<TAppformData>(
    getAppFormDataQKey(appFormId),
  );

  const allLpcConfigs = queryClient.getQueryData<TProductCodesShortened[]>(
    getLoanProductConfigsQKey(),
  );

  if (!appFormData) notFound();
  else {
    const applicantList = getApplicantList(appFormData);
    if (applicantList.length > 0 && !isSmeDirect(loanProductCode)) {
      await queryClient.prefetchQuery<TCreditResponse | null>({
        queryKey: getCreditReportFileQKey(
          appFormId,
          applicantList[0].id.toString(),
        ),
        /**
         * Prefetches the credit report file for the first applicant
         * using the Bureau API.
         * @returns {Promise<TCreditResponse | null>} A promise resolving
         * to a TCreditResponse object if the credit report is found,
         * or null if not found.
         */
        queryFn: () =>
          getCreditReportFile(
            appFormId,
            applicantList[0].id.toString(),
            headers
          ),
      });
    }
  }
  //add headers

  // Pass data to client
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <AppFormMainLayout
        headers={headers}
        lpcDetail={allLpcConfigs?.find((lpc) => lpc.code == appFormData.loanProduct)}
      >
        {children}
      </AppFormMainLayout>
    </HydrationBoundary>
  );
}
