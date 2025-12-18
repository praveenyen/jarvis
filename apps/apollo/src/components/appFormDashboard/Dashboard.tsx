'use client';
import { Grid, Text, Loader, Box, Space, Button } from '@mantine/core';
import Filters from './Filters';
import classes from './Application.module.css';
import dynamic from 'next/dynamic';

import { useEffect, useMemo, useState } from 'react';

import { useSearchParams } from 'next/navigation';

// import ApplicationHeader from '@/components/appFormDashboard/Header';
// import Tabs from '@/components/appFormDashboard/Tabs';
import Utility from '@/components/appFormDashboard/Utility';
import DashboardGrid from '@/components/appFormDashboard/DashboardGrid';
import {
  AllFilters,
  PartialFilters,
} from '@/components/appFormDashboard/FilterTypes';
import { user, userRoles } from '@/store/modules/user';
import { useAtom } from 'jotai/index';
import { useAppFormList } from '@/lib/queries/shield/queries';

import { ADMIN_ROLES } from '@/components/appFormDashboard/constants';
import CustomIcon from '../icons/CustomIcons';
const LoadingSkeleton = dynamic(() => import('../common/LoadingSkeleton'), {
  ssr: false,
});
const ApplicationHeader = dynamic(
  () => import('@/components/appFormDashboard/Header'),
  { ssr: false },
);
const Tabs = dynamic(() => import('@/components/appFormDashboard/Tabs'), {
  ssr: false,
});
export type AppFormCategory = 'inprogress' | 'rejected';

const defaultFilters: Pick<
  AllFilters,
  'pageNumber' | 'pageSize' | 'needCount' | 'searchBy'
> = {
  pageNumber: 1,
  pageSize: 50,
  needCount: false,
  searchBy: 'appFormId',
};

function getFirstTimePageLoadFilters(): PartialFilters {
  const threeMonthsAgo = new Date();
  threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 2);

  const today = new Date();

  return {
    ...defaultFilters,
    dateRange: [threeMonthsAgo, today],
    selectedTab: 'inprogress',
  };
}

let firstTimeLoadFilters = getFirstTimePageLoadFilters();
/** TODO @abhishek hydration */
export default function Dashboard() {
  const [apiFilters, setApiFilters] = useState<Record<string, string>>({});
  const searchParams = useSearchParams();
  const [userData] = useAtom(user);
  const [roles] = useAtom(userRoles);

  function getRole(roles: string[]) {
    let role = '';
    let adminRole = roles.find((role) => {
      return ADMIN_ROLES.indexOf(role.toLowerCase()) > -1;
    });
    if (adminRole !== undefined) {
      role = adminRole === 'superadmin' ? 'qcadmin' : adminRole;
    } else {
      role = roles[0].toLowerCase();
    }

    return role.toLowerCase();
  }

  function getHeaders(): Record<string, string> {
    return {
      role: role,
      stage: 'all',
    };
  }

  const role = useMemo(() => getRole(roles!), [roles]);

  const headers = useMemo(() => getHeaders(), [role]);

  /*Invalidate after 3 secs*/
  const appFormListResponse = useAppFormList(headers, apiFilters, {
    enabled: Object.keys(apiFilters).length > 0,
    staleTime: 3 * 1000,
  });

  const processAppFormCategory = (category: AppFormCategory): void => {
    onFilterChange('selectedTab', category);
  };

  function clearFilters() {
    /**This is so that the user stays in the same tab when he calls default filters */
    const newFilters = {
      selectedTab: memoizedFiltersFromSearchParam.selectedTab,
      ...defaultFilters,
    };
    const searchParams: URLSearchParams =
      convertFiltersToSearchParams(newFilters);
    window.history.pushState(null, '', `?${searchParams.toString()}`);
  }

  function onFilterChange<K extends keyof PartialFilters>(
    key: K,
    value: PartialFilters[K],
  ) {
    const filterValues = memoizedFiltersFromSearchParam;
    filterValues[key] = value;

    const newSearchParams: URLSearchParams =
      convertFiltersToSearchParams(filterValues);

    window.history.pushState(null, '', `?${newSearchParams.toString()}`);
  }

  function convertFiltersToSearchParams(filterValues: PartialFilters) {
    const validFiltersArr = Object.entries(filterValues).filter(
      ([key, value]) => {
        return value !== '' && value != null;
      },
    );
    const validFilters = Object.fromEntries(validFiltersArr) as Record<
      string,
      any
    >;

    const newUrlSearchParams = new URLSearchParams(validFilters);

    /*In mantine when datepicker is cleared they are set to [null, null][*/
    if (validFilters.dateRange != null) {
      const dates = validFilters.dateRange as Date[];
      if (dates[0] == null || dates[1] == null) {
        newUrlSearchParams.delete('dateRange');
      } else {
        const startDateString = dates[0].toLocaleDateString('en-CA');
        const endDateString = dates[1].toLocaleDateString('en-CA');
        const formattedDateString = startDateString + ',' + endDateString;
        newUrlSearchParams.set('dateRange', formattedDateString);
      }
    }
    return newUrlSearchParams;
  }

  const memoizedFiltersFromSearchParam = useMemo(
    () => convertSearchParamsToFilters(),
    [searchParams],
  );

  function convertSearchParamsToFilters(): PartialFilters {
    const applicableFilters: PartialFilters = {};
    for (const [key, value] of searchParams.entries()) {
      if (value) {
        switch (key) {
          case 'searchBy':
          case 'searchText':
          case 'channel':
          case 'productCode':
          case 'status':
          case 'assignedTo':
          case 'myCases':
          case 'creditUser':
          case 'ckycFlow':
          case 'vkycFlow':
          case 'appFlow':
          case 'reviewType':
          case 'dsaCity':
          case 'dsaCompanyCode':
          case 'dsaSalesManager':
          case 'dsaAreaSalesManager':
          case 'greenChannelAppState':
            applicableFilters[key] = value as string;
            break;
          case 'needCount':
            applicableFilters[key] = value === 'true';
            break;
          case 'selectedTab':
            applicableFilters.selectedTab = value as string;
            break;
          case 'dateRange':
            const startDateStr = value.split(',')[0];
            const endDateStr = value.split(',')[1];
            const startDate = new Date(startDateStr);
            const endDate = new Date(endDateStr);
            applicableFilters.dateRange = [startDate, endDate];
            break;
          case 'pageNumber':
            applicableFilters[key] = parseInt(value);
            break;
          case 'pageSize':
            // applicableFilters[key] = parseInt(value);
            // hardcoding pagesize to 50 for now
            applicableFilters[key] = 50;
            break;
          default:
            break;
        }
      }
    }
    return applicableFilters;
  }

  function convertFiltersToApiQueryParams(
    filters: PartialFilters,
  ): Record<string, string> {
    const filtersForAPIQuery: Record<string, string> = {};
    for (const [key, value] of Object.entries(filters)) {
      if (value != null || value !== undefined) {
        switch (key) {
          case 'searchBy':
            if (filters.searchText !== '' && filters.searchText !== undefined) {
              filtersForAPIQuery[filters.searchBy!] = filters.searchText;
            }
            break;
          case 'status':
          case 'creditUser':
          case 'dsaCity':
          case 'dsaCompanyCode':
          case 'dsaSalesManager':
          case 'dsaAreaSalesManager':
            filtersForAPIQuery[key] = value as string;
            break;
          case 'productCode':
            filtersForAPIQuery.productCode = value as string;
            break;
          case 'channel':
            filtersForAPIQuery.partnerId = value as string;
            break;
          case 'myCases':
          case 'assignedTo':
            filtersForAPIQuery.userId = value as string;
            break;
          case 'pageNumber':
            filtersForAPIQuery[key] = value!.toString();
            break;
          case 'pageSize':
            // pageSize hardcoded to 50
            filtersForAPIQuery[key] = '50';
            break;
          case 'ckycFlow':
            if (value === 'ckyc') {
              filtersForAPIQuery.ckycFlag = 'true';
            }
            break;
          case 'vkycFlow':
            if (value === 'vkyc') {
              filtersForAPIQuery.vkycFlag = 'true';
            }
            break;
          case 'reviewType':
            if (value === 'manualReview' || value === 'autoReview') {
              filtersForAPIQuery.gcDecision = value;
            }
            break;
          case 'selectedTab':
            if (filters.selectedTab === 'rejected') {
              filtersForAPIQuery.appFormStatus = '-20';
            }
            break;
          case 'appFlow':
            if (value == 'greenchannel') {
              filtersForAPIQuery.greenChannel = 'true';
            } else {
              filtersForAPIQuery.greenChannel = 'false';
            }
            break;
          case 'greenChannelAppState':
            if (value === 'manualReview') {
              filtersForAPIQuery.appFormStatus = '8';
            } else if (value === 'techIssue') {
              filtersForAPIQuery.appFormStatus = '9';
            } else if (value === 'approved') {
              filtersForAPIQuery.appFormStatus = '15';
            }
            break;
          case 'needCount':
            filtersForAPIQuery.needCount = value!.toString();
            break;
          case 'dateRange':
            /*Have to close as arrays are reference*/
            const clonedDates = [...(value as Date[])].map(
              (date) => new Date(date),
            );
            const startDate = clonedDates[0];
            const endDate = clonedDates[1];
            startDate.setDate(startDate.getDate() - 1);
            startDate.setUTCHours(18, 30, 0);
            endDate.setDate(endDate.getDate() - 1);
            endDate.setUTCHours(18, 30, 0);
            filtersForAPIQuery.startDate = startDate.toISOString();
            filtersForAPIQuery.endDate = endDate.toISOString();
            break;
          default:
            break;
        }
      }
    }
    return filtersForAPIQuery;
  }

  function getCount() {
    if (appFormListResponse.isSuccess) {
      return appFormListResponse.data.count;
    }
    return undefined;
  }

  function getRecords() {
    if (appFormListResponse.isError) {
      return [];
    }
    return appFormListResponse.data?.data!;
  }
  useEffect(() => {
    if (searchParams.size === 0) {
      window.history.replaceState(
        null,
        '',
        `?${convertFiltersToSearchParams(firstTimeLoadFilters).toString()}`,
      );
      return;
    }
    const newFilters = memoizedFiltersFromSearchParam;
    const apiQuery = convertFiltersToApiQueryParams(newFilters);
    setApiFilters(apiQuery);
  }, [searchParams]);

  if (Object.keys(memoizedFiltersFromSearchParam).length === 0) {
    /*TODO refactor loading*/
    return <LoadingSkeleton>loading..</LoadingSkeleton>;
  }

  if (appFormListResponse.isError) {
    console.log(appFormListResponse.error);
  }

  return (
    <Box p={10}>
      <Box
        pb={10}
        style={{
          position: 'sticky',
          top: '0px',
          zIndex: 100,
          backgroundColor: '#faf8f5',
        }}
      >
        <Grid gutter="md" justify="space-between" align="center">
          {/*APPLICATION HEADER*/}
          <ApplicationHeader />
          {/*TABS*/}
          <Tabs
            appFormCategory={
              memoizedFiltersFromSearchParam.selectedTab as AppFormCategory
            }
            processAppFormCategory={processAppFormCategory}
          />
          {/*DOWNLOAD USER MANUAL*/}
          <Utility
            appliedFilters={apiFilters}
            role={role}
          />
        </Grid>
      </Box>
      <Space h="lg"></Space>

      {/*FILTERS*/}
      <Filters
        handleFilterChange={onFilterChange}
        count={getCount()}
        appliedFilters={memoizedFiltersFromSearchParam}
      />

      <Button
        variant="transparent"
        color="error.4"
        onClick={clearFilters}
        styles={{
          label: {
            fontWeight: 'bold',
            '&:hover': {
              color: 'red',
            },
          },
        }}
        rightSection={<CustomIcon src="MaterialIcon" name="MdClear" />}
      >
        Clear Filters
      </Button>
      <br />

      {/* <Text className={classes.crossHair}>
        <b onClick={clearFilters}>Clear Filters</b>
      </Text> */}

      {/*APPLICATION GRID STARTS*/}
      {/*TODO add error handling and see what to use for isFetching , isLoading*/}
      <Box>
        {appFormListResponse.isFetching || appFormListResponse.isPending ? (
          <div
            style={{
              minHeight: '400px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Loader color="brandBlue" size="md" />
          </div>
        ) : (
          <DashboardGrid records={getRecords()} />
        )}
      </Box>
    </Box>
  );
}
