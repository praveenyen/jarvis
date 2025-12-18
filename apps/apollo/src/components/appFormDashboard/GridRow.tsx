'use client';

import { Button, Box, Group, Table, Tooltip, ActionIcon } from '@mantine/core';
import {
  formatDateToDDMMYYYY,
  formatSnakeCase,
  truncateString,
} from '@/lib/utils/utils';
import { AppFormListRecord } from '@/lib/queries/shield/queryResponseTypes';
import AppFormStatusBadge from '@/components/common/AppFormStatusBadge';
import classes from './Application.module.css';
import { HTMLElementType, useEffect, useRef, useState } from 'react';
import CustomIcon from '@/components/icons/CustomIcons';
import { useRouter } from 'next/navigation';
import { useDisclosure } from '@mantine/hooks';
import { useNotification } from '@/lib/context/notifications/useNotifications';
import { useLoader } from '@/lib/context/loaders/useLoader';
type Props = {
  data: AppFormListRecord;
  selectedTab: string | null;
};

const GridRow: React.FC<Props> = ({ data, selectedTab }) => {
  const router = useRouter();
  const [loadingOverlayVisible, loandingOverlayHandlers] = useDisclosure(false);
  const { notify } = useNotification();
  const { start } = useLoader();
  const copyBtnRef = useRef(null);
  const tdStyleObj = {
    paddingLeft: '8px',
    paddingRight: '8px',
    paddingTop: '8px',
    paddingBottom: '8px',
  };

  const onTableRowClick = (
    event: React.MouseEvent,
    appFormId: string,
    lpc: string,
  ) => {
    if (
      (event.target as HTMLElement).tagName !== 'svg' &&
      (event.target as HTMLElement).innerText !== 'Assign'
    ) {
      start();
      loandingOverlayHandlers.open();
      router.push(`application/${appFormId}/appForm?lpc=${lpc}`);
    }
  };

  const [tooltipOpened, setTooltipOpened] = useState<{
    [key: string]: boolean;
  }>({});

  const handleCopy = (key: string | null, textToCopy: string | null): void => {
    if (textToCopy == null || key == null) {
      return;
    }
    navigator.clipboard
      .writeText(textToCopy)
      .then(() => {
        notify({ message: 'AppForm ID copied!' });
        setTooltipOpened((prev) => ({ ...prev, [key]: true }));

        // Auto-hide tooltip after 1.5 seconds
        setTimeout(() => {
          setTooltipOpened((prev) => ({ ...prev, [key]: false }));
        }, 1500);
      })
      .catch((err) => {
        console.error('Failed to copy text: ', err);
      });
  };
  return (
    // <Box>
    //   <LoadingOverlay
    //     visible={loadingOverlayVisible}
    //     zIndex={1000}
    //     overlayProps={{ radius: 'sm', blur: 1 }}
    //     loaderProps={{ color: 'brandBlue', type: 'dots' }}
    //   />

    <Table.Tr
      onClick={(event) =>
        onTableRowClick(event, data.appFormId, data.productCode)
      }
      style={{ cursor: 'pointer' }}
    >
      <Table.Td style={tdStyleObj}>
        {data.applicantName} <br />
        {data.appFormRefId && (
          <Group className={classes.copyPasteWrapper}>
            {data.appFormRefId}
            {
              <Tooltip
                label="Copied!"
                color="teal"
                opened={tooltipOpened[data.appFormRefId] || false}
                withArrow
              >
                <ActionIcon
                  variant="transparent"
                  aria-label="copy"
                  onClick={(event) => {
                    event.nativeEvent.stopImmediatePropagation();
                    handleCopy(data.appFormRefId, data.appFormRefId);
                  }}
                >
                  <CustomIcon
                    src="MaterialIcon"
                    name="MdContentPaste"
                    size={'15px'}
                    className={classes.copyPasteButton}
                  />{' '}
                </ActionIcon>
              </Tooltip>
            }
          </Group>
        )}
      </Table.Td>
      <Table.Td style={tdStyleObj}>
        <Group className={classes.copyPasteWrapper} data-action="copy">
          {truncateString(13, data.appFormId)}
          {
            <Tooltip
              label="Copied!"
              color="teal"
              opened={tooltipOpened[data.appFormId] || false}
              withArrow
            >
              <CustomIcon
                src="MaterialIcon"
                name="MdContentPaste"
                size={'15px'}
                className={classes.copyPasteButton}
                onClick={() => handleCopy(data.appFormId, data.appFormId)}
              />
            </Tooltip>
          }
        </Group>
      </Table.Td>
      <Table.Td style={tdStyleObj}>{data.partnerLoanId}</Table.Td>
      <Table.Td style={tdStyleObj}>{data.partnerId}</Table.Td>
      <Table.Td style={tdStyleObj}>{data.productCode}</Table.Td>
      {/* <Table.Td>{data.dsa_lead_type}</Table.Td> */}
      <Table.Td style={tdStyleObj}>
        {formatDateToDDMMYYYY(data.appDate, false)}
      </Table.Td>
      {selectedTab !== 'rejected' ? (
        <Table.Td style={tdStyleObj}>
          <AppFormStatusBadge status={data.status || 'N/A'} />
        </Table.Td>
      ) : (
        <Table.Td style={tdStyleObj}>
          <AppFormStatusBadge status={data.rejectReason || 'N/A'} />
        </Table.Td>
      )}
      <Table.Td style={tdStyleObj}>
        {formatDateToDDMMYYYY(data.lastUpdatedAt, true)}
      </Table.Td>
      {/* <Table.Td style={tdStyleObj}>
        <Button
          variant="default"
          size="xs"
          leftSection={<CustomIcon src="MaterialIcon" name="MdPersonAddAlt" />}
          data-action="assign"
        >
          Assign
        </Button>
      </Table.Td> */}
    </Table.Tr>
    // </Box>
  );
};

export default GridRow;
