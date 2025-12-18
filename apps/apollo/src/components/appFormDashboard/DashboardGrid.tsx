'use client';
import { TAppFormListResponse } from '@/lib/queries/shield/queryResponseTypes';
import { Table, Paper, useMantineTheme } from '@mantine/core';
import GridRow from '@/components/appFormDashboard/GridRow';
import { JSX, ReactNode, useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';
type Props = {
  records: TAppFormListResponse['data'];
};

/**
 * */
export default function DashboardGrid(props: Props) {
  const { records } = props;
  const theme = useMantineTheme();
  const searchParams = useSearchParams();
  const selectedTab = searchParams.get('selectedTab');

  function getBody(): ReactNode {
    if (records.length > 0) {
      return records.map((record) => {
        return (
          <GridRow
            key={record.appFormId}
            data={record}
            selectedTab={selectedTab}
          />
        );
      });
    } else {
      return (
        <Table.Tr>
          <Table.Td colSpan={11} style={{ textAlign: 'center' }}>
            No data available
          </Table.Td>
        </Table.Tr>
      );
    }
  }

  return (
    <Paper p={0} shadow={'none'} style={{ borderRadius: '8px' }} withBorder>
      <Table
        striped
        highlightOnHover
        className="table-row-border"
        stickyHeader
        stickyHeaderOffset={40}
        verticalSpacing={'xs'}
        cellSpacing={'xs'}
        cellPadding={'8px'}
      >
        <Table.Thead style={{ backgroundColor: theme.colors.primary[0] }}>
          <Table.Tr>
            <Table.Th style={{ border: 'none', borderTopLeftRadius: '8px' }}>
              APPLICANT NAME
            </Table.Th>
            <Table.Th>APP ID</Table.Th>
            <Table.Th>Partner Loan ID</Table.Th>
            <Table.Th>CHANNEL</Table.Th>
            <Table.Th>PRODUCT</Table.Th>
            <Table.Th>APP DATE</Table.Th>
            {/* <Table.Th style={{ textWrap: 'nowrap' }}>ASSIGNED TO</Table.Th> */}

            {selectedTab !== 'rejected' ? (
              <Table.Th>STATUS</Table.Th>
            ) : (
              <Table.Th>REJECTION REASON</Table.Th>
            )}
            <Table.Th>LAST UPDATED</Table.Th>
            {/* <Table.Th style={{ border: 'none', borderTopRightRadius: '8px' }}>
              <></>
            </Table.Th> */}
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>{getBody()}</Table.Tbody>
      </Table>
    </Paper>
  );
}
