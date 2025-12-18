'use client';

import { Flex, Tabs, Tooltip } from '@mantine/core';
import { useRouter } from 'next/navigation';
import { useAtomValue } from 'jotai';
import { appFormRawData } from '@/store/atoms';
import { ReactNode, useMemo } from 'react';
import { isSBDApplication, isSecuredLPC } from '@/store/modules/appform';
import { Atom } from 'jotai';
import Link from 'next/link';
import classes from '@/components/appFormLayout/AppTabNav.module.css';
import { useLoader } from '@/lib/context/loaders/useLoader';
import {
  isBranchLedProducts,
  isLapLpaPlp,
  isUblFcl,
  isUblFclSblSbdSba,
} from '@/lib/rules/commonRules';
import { isUblSblSbdSba, isSbl } from '@/lib/rules/commonRules';
import { useRegCheckDetailed } from '@/lib/queries/deadpool/queries';
import CustomIcon from '../icons/CustomIcons';
import { theme } from '@/theme/theme';

const regCheckStatusMap: Record<string, Record<string, string>> = {
  '-11': {
    regStatusType: '',
    message: 'Rejected',
    icon: 'MdOutlineSentimentDissatisfied',
    color: (theme.colors?.error && theme.colors?.error[9]) || 'red',
  },
  '0': {
    regStatusType: '',
    message: 'Pending',
    icon: 'MdOutlineWarningAmber',
    color: (theme.colors?.secondary && theme.colors?.secondary[6]) || 'yellow',
  },
  '1': {
    regStatusType: 'info',
    message: 'Resolved',
    icon: 'MdSentimentVerySatisfied',
    color: (theme.colors?.brandGreen && theme.colors?.brandGreen[5]) || 'green',
  },
  '2': {
    regStatusType: 'info',
    message: 'Resolved',
    icon: 'MdSentimentVerySatisfied',
    color: (theme.colors?.brandGreen && theme.colors?.brandGreen[5]) || 'green',
  },
  '3H': {
    regStatusType: 'danger',
    message: 'Manual Intervention Needed',
    icon: 'MdReportGmailerrorred',
    color: (theme.colors?.secondary && theme.colors?.secondary[6]) || 'yellow',
  },
  '3M': {
    regStatusType: 'danger',
    message: 'Manual Intervention Needed',
    icon: 'MdReportGmailerrorred',
    color: (theme.colors?.secondary && theme.colors?.secondary[6]) || 'yellow',
  },
  failure: {
    regStatusType: 'danger',
    message: 'Failed',
    icon: 'MdOutlineSentimentDissatisfied',
    color: (theme.colors?.error && theme.colors?.error[9]) || 'red',
  },
  'FAILURE': {
    regStatusType: 'danger',
    message: 'Failed',
    icon: 'MdOutlineSentimentDissatisfied',
    color: (theme.colors?.error && theme.colors?.error[9]) || 'red',
  },
};

export const AppTabNav = ({ pathname }: { pathname: string }) => {
  const router = useRouter();
  const currentPath = pathname.split('/')[3]; // controlled tab value
  const appFormData = useAtomValue(appFormRawData);
  const isSBDApp = useAtomValue(isSBDApplication);
  const isSecuredLpc = useAtomValue(isSecuredLPC);
  const { start } = useLoader();
  const { data: regCheckDetails } = useRegCheckDetailed(appFormData?.id || '');

  const checkLoanAmount = useMemo(() => {
    return appFormData?.loan
      ? appFormData?.loan?.requestedAmount > 500000
      : false;
  }, [appFormData]);

  const isBankStatementAnalysisEnabled = useMemo(() => {
    if (appFormData?.loanProduct)
      return isBranchLedProducts(appFormData.loanProduct);
    else return false;
  }, [appFormData]);

  const handleNavigate = (newPath: string) => {
    start();
    const newRoute = pathname.replace(/\/[^/]+$/, newPath);
    router.push(newRoute);
  };

  type tabData = {
    label: string;
    path: string;
    key: string;
    isVisible: boolean | Atom<boolean> | undefined | null | '';
    leftSection?: ReactNode;
    isTooltip?: boolean;
  };

  const tabs: tabData[] = useMemo(
    () => [
      { label: 'App Form', path: '/appForm', key: 'appForm', isVisible: true },
      { label: 'Verification', path: '/verification', key: 'verification', isVisible: true },
      {
        label: 'Dedupe',
        path: '/dedupe',
        key: 'dedupe',
        isVisible: appFormData?.loanProduct && !isUblFclSblSbdSba(appFormData.loanProduct),
      },
      {
        label: 'Reg. check',
        path: '/regulatoryCheck',
        key: 'regulatoryCheck',
        isVisible: true,
        isTooltip: true,
        leftSection: regCheckDetails?.status && regCheckStatusMap[regCheckDetails.status]?.message ? (
          <Tooltip
            label={regCheckStatusMap[regCheckDetails.status]?.message}
            color={regCheckStatusMap[regCheckDetails.status]?.color}
          >
            <CustomIcon
              style={{ fontWeight: 'bold' }}
              size="20px"
              src="MaterialIcon"
              name={regCheckStatusMap[regCheckDetails.status].icon}
              color={regCheckStatusMap[regCheckDetails.status]?.color}
            />
          </Tooltip>
        ) : (
          <CustomIcon
            style={{ fontWeight: 'bold' }}
            size="20px"
            src="MaterialIcon"
            name={regCheckStatusMap[regCheckDetails?.status || '0']?.icon || ''}
            color={regCheckStatusMap[regCheckDetails?.status || '0']?.color || 'gray'}
          />
        ),
      },
      { label: 'Documents', path: '/documents', key: 'documents', isVisible: true },
      { label: 'Bureau View', path: '/bureau', key: 'bureau', isVisible: true },
      { label: 'Banking', path: '/banking', key: 'banking', isVisible: false },
      {
        label: 'CAM',
        path: '/cam',
        key: 'cam',
        isVisible: isUblSblSbdSba(appFormData?.loanProduct) || isSBDApp,
      },
      {
        label: 'Credit Analysis',
        path: '/creditAnalysis',
        key: 'creditAnalysis',
        isVisible: false,
      },
      {
        label: 'Comments',
        path: '/comments',
        key: 'comments',
        isVisible: false && appFormData?.flowType === 'SME',
      },
      {
        label: 'GST Analysis',
        path: '/gstAnalysis',
        key: 'gstAnalysis',
        isVisible:
          isUblFcl(appFormData?.loanProduct) ||
          isSecuredLpc ||
          ((isSbl(appFormData?.loanProduct) || isSBDApp) && checkLoanAmount),
      },
      {
        label: 'Deviations',
        path: '/deviations',
        key: 'deviations',
        isVisible: false,
      },
      {
        label: 'Company Analysis',
        path: '/companyAnalysis',
        key: 'companyAnalysis',
        isVisible: isUblFcl(appFormData?.loanProduct),
      },
      {
        label: 'Statement Analysis',
        path: '/statementAnalysis',
        key: 'statementAnalysis',
        isVisible: isBankStatementAnalysisEnabled,
      },
      {
        label: 'PD & Property Visit',
        path: '/pdForm',
        key: 'pdForm',
        isVisible: isSecuredLpc,
      },
      {
        label: 'Sales Visit',
        path: '/salesVisit',
        key: 'salesVisit',
        isVisible: isLapLpaPlp(appFormData?.loanProduct),
      },
    ],
    [
      appFormData,
      isSBDApplication,
      isSBDApp,
      isSecuredLpc,
      isBankStatementAnalysisEnabled,
      checkLoanAmount,
      regCheckDetails,
    ],
  );

  return (
    <Flex
      w={'100%'}
      pl={12}
      pr={12}
      style={{
        boxShadow: 'rgba(100, 100, 111, 0.1) 0px 7px 29px 0px',
        position: 'sticky',
        top: '43px',
        zIndex: 100,
        backgroundColor: 'white',
      }}
    >
      <Tabs
        value={currentPath}
        styles={{
          tab: {
            borderColor: '#faf8f5',
          },
        }}
        classNames={classes}
      >
        <Tabs.List>
          {tabs.map((tabItem) =>
            tabItem.isVisible ? (
              <Link
                key={tabItem.key}
                href={pathname.replace(/\/[^/]+$/, tabItem.path)}
                passHref
                legacyBehavior
              >
                <Tabs.Tab
                  component="a"
                  size="xl"
                  value={tabItem.key}
                  leftSection={tabItem?.leftSection}
                  onClick={(e) => {
                    const isModifierClick = e.metaKey || e.ctrlKey || e.button === 1;
                    if (isModifierClick) return;

                    e.preventDefault();

                    const newRoute = pathname.replace(/\/[^/]+$/, tabItem.path);
                    if (newRoute === pathname) return; // prevent reload on current tab

                    handleNavigate(tabItem.path);
                  }}
                >
                  {tabItem.label}
                </Tabs.Tab>
              </Link>
            ) : null
          )}
        </Tabs.List>
      </Tabs>
    </Flex>
  );
};