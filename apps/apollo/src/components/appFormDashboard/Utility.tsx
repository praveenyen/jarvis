'use client';

import {
  ActionIcon,
  Box,
  Button,
  Grid,
  Group,
  Tooltip,
  useMantineTheme,
} from '@mantine/core';
import CustomIcon from '@/components/icons/CustomIcons';
import { json2csv } from 'json-2-csv';
import { PartialFilters } from '@/components/appFormDashboard/FilterTypes';
import { getAppFormList } from '@/lib/queries/shield/services';
import { user, userRoles } from '@/store/modules/user';
import { useAtom } from 'jotai';
import { getDocUBLGamora } from '@/lib/queries/gamora/service';
import { useNotification } from '@/lib/context/notifications/useNotifications';
import HttpClientException from '@/lib/exceptions/HttpClientException';
import { useDisclosure } from '@mantine/hooks';

type Props = {
  appliedFilters: Record<string, string>;
  role: string;
};

export default function Utility(props: Props) {
  const { appliedFilters, role } = props;
  const theme = useMantineTheme();

  const [visibleLoader, { open: showLoader, close: hideLoader }] =
      useDisclosure(false);

    const { notify } = useNotification();
  

    const [roles] = useAtom(userRoles);
  

  const getallData = async () => {

    const newFilterForCSV: Record<string, string> = { ...appliedFilters };
    // const dateRange: [Date | null, Date | null] | undefined =
    //   newFilterForCSV['dateRange'];

    // const startDate = newFilterForCSV['startDate'];
    // const endDate = newFilterForCSV['endDate'];

//     delete newFilterForCSV['dateRange'];
//     delete newFilterForCSV['searchBy'];
//     delete newFilterForCSV['selectedTab'];

    newFilterForCSV['pageNumber'] = '1';
    newFilterForCSV['pageSize'] = '200';
    newFilterForCSV['needCount'] = 'false';
    newFilterForCSV['needApplicantName'] = 'false';
    

//     const adjustDate = (date: Date | null): string => {
//       if (!date) return '';
//       const adjusted = new Date(date.getTime() - (5 * 60 + 30) * 60 * 1000);
//       return adjusted.toISOString();
//     };

//     if (startDate && endDate){
//     newFilterForCSV['startDate'] = adjustDate(new Date(startDate));
//     newFilterForCSV['endDate'] = adjustDate(new Date(endDate));
// }
//     const newFilterRecords: Record<string, string> = Object.fromEntries(
//       Object.entries(newFilterForCSV).map(([key, value]) => [
//         key,
//         String(value),
//       ]),
//     );

    try {
      const totalData: Record<string, string>[] =
        await getDataFromAPi(newFilterForCSV);
      const headerKeys = ['appFormId', 'appDate', 'partnerLoanId', 'partnerId'];
      const textResult = await convertObjToCsv(totalData, headerKeys);
      console.log('totalData:', totalData);
      console.log('textResult:', textResult);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const downloadUserManual = async()=>{
    try {
      const localRoles = roles?.join(",")
      if (localRoles == undefined || localRoles == null) return
      const respo = await getDocUBLGamora(localRoles, 'document')
      const documents = respo.data;

      if (documents.length === 1) {
        const document = documents[0];
        window.open(document.outputUrl, '_blank');
        notify({ message: 'Downloaded User Manual: Successfully downloaded', type: 'success' });
        console.info('Downloaded User Manual: Successfully downloaded');
      } else if (documents.length > 1) {
        notify({ message: 'Multiple documents found. Displaying selection dialog.', type: 'error' });
      } else {
        notify({ message: 'No documents are present for your role', type: 'error' });
        console.warn('No documents are present for your role');
      }
    } catch (error:unknown) {
      if (error instanceof HttpClientException) {
        const errorMessage: any = error.getErrorResp();
        notify({ message: errorMessage['message'], type: 'error' });
      }
    }
 
  }

  const convertObjToCsv = async (
    allAppform: Record<string, string>[],
    headers: string[],
  ) => {
    const filteredData = allAppform.map((item) => {
      return headers.reduce((obj: Record<string, string>, key: string) => {
        obj[key] = item[key];
        return obj;
      }, {});
    });

    try {
      const csv = await json2csv(filteredData);
      const blob = new Blob([csv], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'loans.csv');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      
    } catch (error) {
      console.error('Error converting JSON to CSV:', error);
    }
  };

  

  const getDataFromAPi = async (
    newFilterForCSV: Record<string, string>,
  ): Promise<any[]> => {
    const headers = {
      role: role,
      stage: 'all',
    };

    const appFormListResponse = await getAppFormList(newFilterForCSV, headers);
    if (appFormListResponse.data.length < 200) {
      return appFormListResponse.data;
    }

    const nextPage = (
      parseInt(newFilterForCSV['pageNumber'], 10) + 1
    ).toString();
    newFilterForCSV['pageNumber'] = nextPage;

    const nextData = await getDataFromAPi(newFilterForCSV);

    return [...appFormListResponse.data, ...nextData];
  };

  return (
    <Grid.Col span={4} style={{ textAlign: 'right' }}>
      <Box>
        <Group justify="flex-end" gap="md">
          <Tooltip label="customer 360">
            <ActionIcon size="lg" variant="subtle">
              <CustomIcon
                src={'MaterialIcon'}
                name={'MdOutlineAccountCircle'}
                color={theme.colors.primary[7]}
                size="25px"
                style={{ cursor: 'pointer' }}
              />
            </ActionIcon>
          </Tooltip>
          <ActionIcon size="lg" variant="subtle">
            {visibleLoader ? (
              <CustomIcon
                src={'MaterialIcon'}
                name={'MdOutlineHourglassEmpty'}
                style={{ cursor: 'not-allowed', animation: 'spin 1s linear infinite' }}
                size="25px"
                color={theme.colors.primary[7]}
              />
            ) : (
              <CustomIcon
                src={'MaterialIcon'}
                name={'MdOutlineDownloadForOffline'}
                style={{ cursor: 'pointer' }}
                onClick={async () => {
                  showLoader();
                  try {
                    await getallData();
                  } finally {
                    hideLoader();
                  }
                }}
                size="25px"
                color={theme.colors.primary[7]}
              />
            )}
            <style>
            {`
            @keyframes spin {
              100% { transform: rotate(360deg); }
            }
            `}
            </style>
          </ActionIcon>
          <Button onClick={() => downloadUserManual()} variant="default" size="xs">
            Download User Manual
          </Button>
        </Group>
      </Box>
    </Grid.Col>
  );
}
