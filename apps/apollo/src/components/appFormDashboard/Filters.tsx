'use client';

import {
  Grid,
  Select,
  Input,
  CloseButton,
  ComboboxData,
  Switch,
  Group,
  NumberInput,
  Text,
} from '@mantine/core';
import { DatePickerInput } from '@mantine/dates';
import classes from './Filter.module.css';
import { useEffect, useState } from 'react';
import {
  allStatusOptions,
  appflowOptions,
  ckycOptions,
  greenChannelAppStates,
  reviewTypeOptions,
  searchByOptions,
  vkycoptions,
} from '@/components/appFormDashboard/constants';
import { useLoanProductCodes } from '@/lib/queries/groot/queries';
import {
  AllFilters,
  PartialFilters,
} from '@/components/appFormDashboard/FilterTypes';
import dayjs from 'dayjs';

type Props = {
  appliedFilters: PartialFilters;
  handleFilterChange: <T extends keyof PartialFilters>(
    name: T,
    value: PartialFilters[T],
  ) => void;
  count: number | undefined;
};

export default function Filters(props: Props) {
  const { appliedFilters, handleFilterChange, count } = props;
  /*WE have to maintain state dor dateRange and serachText as inputs wont get updated with  state
   * and we cannot take partial dates or partial text in search params and is it would trigger an updatea
   * and it will try to fetch results using that
   * */

  const [dateRange, setDateRange] = useState<[Date | null, Date | null]>(
    appliedFilters.dateRange!,
  );

  const [searchText, setSearchText] = useState<string | undefined>('');
  const loanProductCodeResult = useLoanProductCodes();
  // const allUsersRes = useAllUsers();
  // const partnerCodesRes = usePartnerCodes();
  // const branchHierarchy = useBranchHierarchy();
  // const allDesignationsRes = useAllDesignations();
  // const salesManagerRes = useSpecifiedUsers('SALES_MANAGER');
  // const areaSalesManagerRes = useSpecifiedUsers('AREA_SALES_MANAGER');
  // const allUsersDSARes = useAllUsersDSA();

  const getDropDownOptions = (optionType: keyof AllFilters): ComboboxData => {
    if (optionType === 'searchBy') {
      const options: { value: string; label: string }[] = [];

      /*convert search by option to [{value, label}]*/
      for (const [key, val] of Object.entries(searchByOptions)) {
        options.push({ value: key, label: val });
      }
      return options as ComboboxData;
    }

    if (optionType === 'status') {
      const options: { value: string; label: string }[] = [];

      allStatusOptions?.forEach((option) => {
        options.push({ value: option.key, label: option.label });
      });
      return options as ComboboxData;
    }

    // if (optionType === 'assignedTo') {
    //   const options: { value: string; label: string }[] = [];
    //   if (allUsersRes.isFetching || allUsersRes.isError) {
    //     return options;
    //   } else {
    //     const users = allUsersRes.data!.users;
    //     users?.forEach((option) => {
    //       options.push({ value: option.id, label: option.name });
    //     });
    //     return options as ComboboxData;
    //   }
    // }

    if (optionType === 'productCode') {
      const options: { value: string; label: string }[] = [];

      if (loanProductCodeResult.isFetching || loanProductCodeResult.isError) {
        return [];
      } else {
        for (const product of loanProductCodeResult.data!) {
          options.push({ value: product, label: product });
        }
        return options as ComboboxData;
      }
    }

    if (optionType === 'ckycFlow') {
      const options: { value: string; label: string }[] = [];

      for (const [key, val] of Object.entries(ckycOptions)) {
        options.push({ value: key, label: val });
      }
      return options as ComboboxData;
    }

    if (optionType === 'vkycFlow') {
      const options: { value: string; label: string }[] = [];

      for (const [key, val] of Object.entries(vkycoptions)) {
        options.push({ value: key, label: val });
      }
      return options as ComboboxData;
    }

    if (optionType === 'appFlow') {
      const options: { value: string; label: string }[] = [];

      for (const [key, val] of Object.entries(appflowOptions)) {
        options.push({ value: key, label: val });
      }
      return options as ComboboxData;
    }

    if (optionType === 'greenChannelAppState') {
      const options: { value: string; label: string }[] = [];

      for (const [key, val] of Object.entries(greenChannelAppStates)) {
        options.push({ value: key, label: val });
      }
      return options as ComboboxData;
    }
    if (optionType === 'reviewType') {
      const options: { value: string; label: string }[] = [];

      for (const [key, val] of Object.entries(reviewTypeOptions)) {
        options.push({ value: key, label: val });
      }
      return options as ComboboxData;
    }

    if (optionType === 'dsaCompanyCode') {
      const options: { value: string; label: string }[] = [];
      return options;
      /*  if (partnerCodesRes.isFetching || partnerCodesRes.isError) {
        return options;
      } else {
        const partnerCompanyList = partnerCodesRes.data!.partnerCompanyList;
        partnerCompanyList.forEach((option) => {
          options.push({ value: option.dsaCode, label: option.name });
        });
        return options as ComboboxData;
      }*/
    }

    if (optionType === 'dsaSalesManager') {
      const options: { value: string; label: string }[] = [];
      return options;
      // if (salesManagerRes.isFetching || salesManagerRes.isError) {
      //   return options;
      // } else {
      //   const specifiedUsers = salesManagerRes.data!;
      //   specifiedUsers?.forEach((option) => {
      //     options.push({ value: option.emailId, label: option.emailId });
      //   });
      //   return options as ComboboxData;
      // }
    }

    if (optionType === 'dsaAreaSalesManager') {
      const options: { value: string; label: string }[] = [];
      return options;

      // if (areaSalesManagerRes.isFetching || areaSalesManagerRes.isError) {
      //   return options;
      // } else {
      //   const specifiedUsers = areaSalesManagerRes.data!;
      //   specifiedUsers?.forEach((option) => {
      //     options.push({ value: option.emailId, label: option.emailId });
      //   });
      //   return options as ComboboxData;
      // }
    }

    if (optionType === 'dsaManagerType') {
      const options: { value: string; label: string }[] = [];
      return options;
      // if (allDesignationsRes.isFetching || allDesignationsRes.isError) {
      //   return options;
      // } else {
      //   const allDesignations = allDesignationsRes.data!;
      //   allDesignations?.forEach((option) => {
      //     options.push({ value: option.name, label: option.name });
      //   });
      //   return options as ComboboxData;
      // }
    }

    if (optionType === 'creditUser') {
      const options: { value: string; label: string }[] = [];
      // if (allUsersDSARes.isFetching || allUsersDSARes.isError) {
      //   return options;
      // } else {
      //   const users = allUsersDSARes.data!;
      //   const uniqueUsers = Array.from(
      //     new Map(users.users?.map((user) => [user?.email, user])).values(),
      //   );

      //   uniqueUsers?.forEach((option) => {
      //     options.push({ value: option.email, label: option.email });
      //   });
      //   return options as ComboboxData;
      // }
    }

    return [];
  };

  const getSearchByValues = () => {
    if (appliedFilters.searchBy === '' || appliedFilters.searchBy == null)
      return 'appFormId';
    return appliedFilters.searchBy;
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      if (searchText && searchText !== '') {
        handleFilterChange('searchText', event.currentTarget.value);
      }
    }
  };

  const handleSearchTextClear = () => {
    setSearchText('');
    handleFilterChange('searchText', '');
  };

  const handleSearchText = (searchText: string | undefined) => {
    setSearchText(searchText);
  };

  const onDatePickerChange = (value: [Date | null, Date | null]) => {
    const startDate = (value as Date[])[0];
    const endDate = (value as Date[])[1];
    /*dont trigger filter change if any of start date or end date is null*/
    if (
      (startDate == null && endDate != null) ||
      (startDate != null && endDate == null)
    ) {
      setDateRange(value);
    } else {
      setDateRange(value);
      onFilterChange('dateRange', value);
    }
  };
  /* This is written so that if anyone changes the date directly in the search params
   * this will trigger
   * */
  useEffect(() => {
    if (appliedFilters.dateRange == null) {
      setDateRange([null, null]);
    } else {
      setDateRange(appliedFilters.dateRange!);
    }
  }, [appliedFilters.dateRange]);

  /* This is written so that if anyone changes the searchText directly in the search params
   * this will trigger
   * */
  useEffect(() => {
    if (appliedFilters.searchText) {
      setSearchText(appliedFilters.searchText);
    } else {
      setSearchText('');
    }
  }, [appliedFilters.searchText]);

  function onFilterChange<K extends keyof PartialFilters>(
    name: K,
    value: PartialFilters[K],
  ) {
    handleFilterChange(name, value);
  }
  const getPaginationMax = () => {
    if (appliedFilters.needCount) {
      return Math.ceil(count! / appliedFilters.pageSize!);
    }

    if (count && count < appliedFilters.pageSize!) {
      return appliedFilters.pageNumber;
    } else {
      if (appliedFilters.pageSize) {
        return appliedFilters.pageSize + 1;
      }
    }
  };
  const getPaginationText = () => {
    const pageNumber = appliedFilters.pageNumber!;
    const pageSize = appliedFilters.pageSize!;
    const startCount = (pageNumber - 1) * pageSize + 1;
    let text = ``;
    const endCount = pageNumber * pageSize;
    if (count && count < pageSize) {
      text = `${startCount} - ${pageNumber * pageSize - (50 - count)}`;
    } else {
      text = `${startCount} - ${endCount}`;
    }
    if (appliedFilters.needCount && !!count) {
      console.log('count')
      console.log(count)
      text = text + ` of ${count}`;
    }
    return text;
  };
  return (
    <div>
      <Grid columns={24} justify="flex-start" align="center" gutter="xs">
        {/*APPFORM SEARCH FILTER */}
        <Grid.Col span={8}>
          <div style={{ display: 'flex' }}>
            <Select
              style={{ flex: 1, width: '50%' }} // Ensures the Select takes up 1 part of the available space
              radius="md"
              placeholder="Search by"
              data={getDropDownOptions('searchBy')}
              value={getSearchByValues()}
              onChange={(value) => onFilterChange('searchBy', value)}
              searchable
              nothingFoundMessage="Nothing found..."
              clearable
            />
            <Input
              style={{ flex: 1 }}
              placeholder={'Type to search'}
              value={searchText}
              onKeyDown={handleKeyDown}
              onChange={(event) => handleSearchText(event.currentTarget.value)}
              rightSectionPointerEvents="all"
              rightSection={
                searchText === '' || searchText == null ? (
                  <></>
                ) : (
                  <CloseButton
                    aria-label="Clear input"
                    onClick={() => handleSearchTextClear()}
                  />
                )
              }
            />
          </div>
        </Grid.Col>

        {/*PRODUCT FILTER */}
        <Grid.Col span={2}>
          <Select
            size="sm"
            className={classes.calanderDateRangeInput}
            radius="md"
            placeholder="Products"
            data={loanProductCodeResult.data ? loanProductCodeResult.data : []}
            value={appliedFilters.productCode ? appliedFilters.productCode : null}
            nothingFoundMessage={
              loanProductCodeResult.isLoading
                ? 'Loading...'
                : 'Nothing found...'
            }
            onChange={(value) => onFilterChange('productCode', value)}
            searchable
            clearable
          />
        </Grid.Col>

        <Grid.Col span={3}>
          <Select
            size="sm"
            className={classes.calanderDateRangeInput}
            radius="md"
            placeholder="All Status"
            data={getDropDownOptions('status')}
            value={appliedFilters.status ? appliedFilters.status : null}
            onChange={(value) => onFilterChange('status', value)}
            searchable
            nothingFoundMessage="Nothing found..."
            clearable
          />
        </Grid.Col>

        <Grid.Col span={2}>
          <Select
            size="sm"
            className={classes.calanderDateRangeInput}
            radius="md"
            placeholder="CKYC Flow"
            data={getDropDownOptions('ckycFlow')}
            value={appliedFilters.ckycFlow ? appliedFilters.ckycFlow : null}
            onChange={(value) => onFilterChange('ckycFlow', value)}
            searchable
            nothingFoundMessage="Nothing found..."
            clearable
          />
        </Grid.Col>
        <Grid.Col span={2}>
          <Select
            size="sm"
            className={classes.calanderDateRangeInput}
            radius="md"
            placeholder="VKYC Flow"
            data={getDropDownOptions('vkycFlow')}
            value={appliedFilters.vkycFlow ? appliedFilters.vkycFlow : null}
            onChange={(value) => onFilterChange('vkycFlow', value)}
            searchable
            nothingFoundMessage="Nothing found..."
            clearable
          />
        </Grid.Col>
        <Grid.Col span={5}>
          <DatePickerInput
            size="sm"
            radius="md"
            className={classes.calanderDateRangeInput}
            valueFormat="DD/MM/YYYY"
            type="range"
            placeholder="Start Date - End Date"
            allowSingleDateInRange={true}
            value={dateRange}
            onChange={(val: [string | null, string | null]) => {
              const dateValues: [Date | null, Date | null] = [
                val[0] ? new Date(val[0]) : null,
                val[1] ? new Date(val[1]) : null 
              ];
              onDatePickerChange(dateValues);
            }}
            clearable
            maxDate={dayjs().toDate()}
          />
        </Grid.Col>

        <Grid.Col span={3}>
          <Select
            size="sm"
            radius="md"
            placeholder="App Flow"
            data={getDropDownOptions('appFlow')}
            value={appliedFilters.appFlow ? appliedFilters.appFlow : null}
            onChange={(value) => onFilterChange('appFlow', value)}
            searchable
            nothingFoundMessage="Nothing found..."
            clearable
          />
        </Grid.Col>
        {appliedFilters.appFlow == 'greenchannel' && (
          <Grid.Col span={2}>
            <Select
              size="sm"
              className={classes.calanderDateRangeInput}
              radius="md"
              placeholder="Green Channel"
              data={getDropDownOptions('greenChannelAppState')}
              value={appliedFilters.greenChannelAppState ? appliedFilters.greenChannelAppState : null}
              onChange={(value) =>
                onFilterChange('greenChannelAppState', value)
              }
              searchable
              nothingFoundMessage="Nothing found..."
              clearable
            />
          </Grid.Col>
        )}
        {appliedFilters.appFlow == 'greenchannel' &&
          appliedFilters.greenChannelAppState == 'approved' && (
            <Grid.Col span={2}>
              <Select
                size="sm"
                className={classes.calanderDateRangeInput}
                radius="md"
                placeholder="Review Type"
                data={getDropDownOptions('reviewType')}
                value={appliedFilters.reviewType ? appliedFilters.reviewType : null}
                onChange={(value) => onFilterChange('reviewType', value)}
                searchable
                nothingFoundMessage="Nothing found..."
                clearable
              />
            </Grid.Col>
          )}
      </Grid>
      <br />
      <div>
        <Grid justify="space-between" align="center">
          <Grid.Col span={2}>
            <Switch
              color="#32B353"
              label="Show Count"
              checked={appliedFilters.needCount}
              onChange={(event) =>
                handleFilterChange('needCount', event.currentTarget.checked)
              }
            />
          </Grid.Col>
          <Grid.Col span={4}>
            {' '}
            <Group justify="flex-end">
              <Text>
                <b>{getPaginationText()}</b>
              </Text>
              <NumberInput
                value={appliedFilters.pageNumber}
                placeholder="Go to"
                size="sm"
                min={1}
                max={getPaginationMax()}
                styles={{ input: { width: 60 } }}
                onChange={(count) =>
                  handleFilterChange('pageNumber', count as number)
                }
              />
            </Group>
          </Grid.Col>
        </Grid>
      </div>
    </div>
  );
}
