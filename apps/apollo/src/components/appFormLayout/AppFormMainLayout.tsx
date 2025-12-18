'use client';

import { useParams, usePathname, useSearchParams } from 'next/navigation';
import AppBreadCrumb from '@/components/appFormLayout/AppBreadCrumb';
import AppFormHeader from '@/components/appFormLayout/AppFormHeader';
import { useAppFormDataGet } from '@/lib/queries/shield/queries';
import { useLoader } from '@/lib/context/loaders/useLoader';
import { appFormRawData } from '@/store/atoms';
import { useAtomValue, useSetAtom } from 'jotai';
import { useEffect, useMemo, useState } from 'react';
import AppFormStepper from '@/components/appFormLayout/AppFormStepper';
import AppFormLCFields from '@/components/appFormLayout/AppFormLCFields';
import { useLoanProductConfigs } from '@/lib/queries';
import { getClAvailableLimit } from '@/lib/queries/asgard/services';
import { AppTabNav } from '@/components/appFormLayout/AppTabNav';
import { allUsers } from '@/store/atoms/user';
import { useAllUsers } from '@/lib/queries';
import classes from '@/components/appFormLayout/AppTabNav.module.css';
import { TProductCodesShortened } from '@/lib/queries/groot/queryResponseTypes';
import DiscrepancyManagement from '@/components/discrepancy/DiscrepancyManagement';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useDiscrepancyStatusGet } from '@/lib/queries/kaizen/queries';
import { getDiscrepancyStatusQKey } from '@/lib/queries/queryKeys';
import { isDiscrepancyModuleEnabled } from '@/lib/utils/utils';

export default function AppFormMainLayout({
  headers,
  lpcDetail,
  children,
}: {
  headers: Record<string, string>;
  lpcDetail: TProductCodesShortened | undefined;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { stop } = useLoader();
  const setAllUsersData = useSetAtom(allUsers);

  const appFormDataFromState = useAtomValue(appFormRawData);
  const setAppFormData = useSetAtom(appFormRawData);
  const { data: allUsersRes, isSuccess: allUserFetchSuccess } = useAllUsers();

  const params = useParams<{ appformid: string }>();
  const appFormId = params.appformid;
  const breadcrumbItems = [
    { label: 'Application', href: '/application' },
    { label: `App ID ${appFormId}` },
  ];
  const queryClient = useQueryClient();

  const { data: discrepancyStatus } = useDiscrepancyStatusGet(appFormId);
  const {
    data: appFormData,
    isLoading: isAppformGetLoading,
    isSuccess: isAppformGetSuccess,
    isRefetching: isAppformRefetching,
    status: appFormGetStatus,
  } = useAppFormDataGet(appFormId, headers);

  const {
    data: productCodes,
    isSuccess: isgetLoanSuccess,
    status: getLoanStatus,
  } = useLoanProductConfigs(headers, {
    staleTime: 3 * 1000,
  });

  // useHydrateAtoms([[appFormRawData, appFormData as TAppformData]]);

  const {
    data: clAvailableLimit,
    isError: clAvailableLimitError,
    isSuccess: clAvailableLimitSuccess,
  } = useQuery({
    queryKey: ['getcreditLine', 'getAvailableLimit'],
    queryFn: () => getClAvailableLimit(appFormId, headers),
    retry: false,
  });

  useEffect(() => {
    if (allUserFetchSuccess) setAllUsersData(allUsersRes);
  }, [allUserFetchSuccess]);

  const enableDiscrepancyModule = useMemo(() => {
    if (appFormData) {
      return isDiscrepancyModuleEnabled(appFormData?.appFormStatus)
    }
  }, [appFormData]);

  const fnRefetchDiscrepancyStatus = async () => {
    await queryClient.invalidateQueries({
      queryKey: getDiscrepancyStatusQKey(appFormId),
    });
  };

  useEffect(() => {
    return () => {
      /**Todo set store value to null*/
      setAppFormData(null);
    };
  }, []);

  useEffect(() => {
    if (appFormData) setAppFormData(appFormData);
  }, [isAppformGetSuccess, appFormData, isAppformRefetching]);

  useEffect(() => {
    stop();
  }, [pathname]);

  return (
    <div style={{ minHeight: '400px', alignItems: 'stretch' }}>
      {/*Render only if appform data is presnet in state*/}
      {appFormDataFromState && (
        <>
          <div style={{ alignItems: 'center' }} className={classes.clearfix}>
            <AppBreadCrumb items={breadcrumbItems} />
            <AppFormHeader
              headers={headers}
              discrepancyStatus={discrepancyStatus}
            />
            <AppFormStepper />
            <AppFormLCFields
              appFormId={appFormId}
              lpcDetail={lpcDetail}
              productCodes={isgetLoanSuccess ? productCodes : []}
              clAvailableLimit={clAvailableLimit}
              isAvailableLimitFetchedError={clAvailableLimitError}
              isAvailableLimitFetchedSuccess={clAvailableLimitSuccess}
            />
            <AppTabNav pathname={pathname} />
            {children}
          </div>
          {enableDiscrepancyModule && (
            <DiscrepancyManagement
              appFormId={appFormId}
              setAppFormData={setAppFormData}
              fnRefetchDiscrepancyStatus={fnRefetchDiscrepancyStatus}
            />
          )}
        </>
      )}
    </div>
  );
}
