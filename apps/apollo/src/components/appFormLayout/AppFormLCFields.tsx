import { Flex, Grid, SimpleGrid, Stack, Text, Tooltip } from '@mantine/core';
import { appFormRawData, getLoan } from '@/store/modules/appform';
import { useAtomValue } from 'jotai';
import { useEffect, useMemo, useState } from 'react';
import {
  capitaliseFilter,
  currencyFilter,
  formattedDate,
  getYearsDifference,
} from '@/components/appFormLayout/appFormHelpers';
import { isCoLendingPartner } from '@/lib/rules/commonRules';
import { TProductCodesShortened } from '@/lib/queries/groot/queryResponseTypes';
import { getAppFormApplicantList } from '@/store/modules/appform';
import { CreditLine, Loan } from '@/lib/queries/shield/queryResponseTypes';
import { TClAvailableLimit } from '@/lib/queries/asgard/queryResponseTypes';
import IHttpClient from '@/lib/httpClient/IHttpClient';
import HttpClientFactory from '@/lib/httpClient/HttpClientFactory';
const axiosClient: IHttpClient = HttpClientFactory.getHttpClient('axios');
import '@/components/appFormLayout/AppFormLCFields.css';
import iconColors from '@/components/icons/iconColors';
import { AppAvatar } from '@/components/common/AppAvatar';
import { randomIntFromInterval } from '@/lib/utils/utils';

type TLcField = {
  value: any;
  label: string;
};

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;
export default function AppFormLCFields({
  appFormId,
  lpcDetail,
  productCodes,
  clAvailableLimit,
  isAvailableLimitFetchedError,
  isAvailableLimitFetchedSuccess,
}: {
  appFormId: string;
  lpcDetail: TProductCodesShortened | undefined;
  productCodes: TProductCodesShortened[];
  clAvailableLimit: TClAvailableLimit | undefined;
  isAvailableLimitFetchedError: boolean;
  isAvailableLimitFetchedSuccess: boolean;
}) {
  const appFormData = useAtomValue(appFormRawData);

  const applicantList = useAtomValue(getAppFormApplicantList);
  const loan = useAtomValue(getLoan);
  const [isClpCreditLineLoaded, setisClpCreditLineLoaded] = useState(false);
  const [dateOfCreditLimitClp, setDateOfCreditLimitClp] = useState('');

  const startDate: string = appFormData?.creditLine?.dateOfCreditLimit || '';
  const expiryDate: string =
    appFormData?.creditLine?.expiryDateOfCreditLimit || '';

  const yearsDifference = getYearsDifference(
    new Date(startDate),
    new Date(expiryDate),
  );

  useEffect(() => {
    setisClpCreditLineLoaded(true);
  }, [isAvailableLimitFetchedError, isAvailableLimitFetchedSuccess]);

  const getLpcPartnerName = useMemo(() => {
    if (lpcDetail) {
      return lpcDetail.name;
    }
    return '-';
  }, [lpcDetail]);

  const updateIfOverallLoanAmountExists = (loan: Loan, key: string) => {
    if (isCoLendingPartner(key, productCodes) && loan.overAllLoanAmount) {
      return loan.overAllLoanAmount;
    }
    return '-';
  };

  const isClpCompleteAppform = useMemo(() => {
    return (
      loan?.loanProduct === 'CLP' &&
      (appFormData?.status === 'QC_COMPLETE' ||
        appFormData?.status === 'BOOKING_COMPLETE')
    );
  }, [appFormData]);

  const fieldsValues = useMemo(() => {
    if (!loan) return [];
    const loanSmry = loan;
    const values: TLcField[] = [];
    // values: first arrays has the 5 columns with each item being an array
    // and each array within has the 2 fields for the top and bottom with their labels and values
    values.push({
      label: 'LOAN AMT ₹',
      value: currencyFilter(loanSmry?.amount),
    });
    values.push({
      label: 'ALLOCATED AMT ₹',
      value: `${currencyFilter(
        (loanSmry.amount * loanSmry.fundingAllocation).toFixed(2),
      )} (${loanSmry.fundingAllocation * 100}%)`,
    });
    values.push({
      label: 'ROI',
      value: loanSmry.loanIntRate === null ? '-' : `${loanSmry.loanIntRate}%`,
    });
    let tenureValue = loanSmry.tenure;
    // Converting tenure from days to months
    if (loanSmry.loanProduct === 'BPT' && tenureValue != null) {
      tenureValue = (parseInt(loanSmry.tenure) / 30).toFixed(2);
    }
    values.push({
      label: 'TENURE (MONTHS)',
      value: tenureValue,
    });
    values.push({
      label: 'START DATE',
      value: formattedDate(loanSmry.loanStartDate),
    });
    let loanSubType = loanSmry.topUp
      ? loanSmry.topUp.loanSubType
        ? loanSmry.topUp.loanSubType
        : '-'
      : '-';
    if (loanSubType.toUpperCase() == 'BT') {
      loanSubType = 'BT';
    } else if (loanSubType.toUpperCase() == 'TOPUP') {
      loanSubType = 'Topup';
    }
    values.push({
      label: 'LOAN SUB TYPE',
      value: loanSubType,
    });
    values.push({
      label: 'CHANNEL',
      value: getLpcPartnerName,
    });

    values.push({ label: 'TYPE', value: loanSmry.loanProduct });

    values.push({
      label: 'PARTNER L ID',
      value: appFormData?.partnerLoanId,
    });

    values.push({
      label: 'KSF L ID',
      value:
        appFormData && parseInt(appFormData.appFormStatus) === 100
          ? loanSmry?.id
          : '-',
    });

    if (appFormData?.mandate)
      values.push({
        label: 'MANDATE TYPE',
        value:
          appFormData.mandate.mandateMethod === 'emandate'
            ? 'E-Mandate'
            : 'Physical Nach',
      });
    if (isCoLendingPartner(loanSmry.loanProduct, productCodes)) {
      values.push({
        label: 'OVERALL AMT ₹',
        value: updateIfOverallLoanAmountExists(loanSmry, loanSmry.loanProduct),
      });
    }

    values.push({
      label: 'LOAN SEGMENT',
      value: loanSmry.loanSegment ? loanSmry.loanSegment : '-',
    });
    return values;
  }, [appFormData]);

  const fieldsValuesCl = useMemo(() => {
    if (!loan) return [];
    if (isClpCompleteAppform && !isClpCreditLineLoaded) return [];

    const loanSmry = loan;
    const values: TLcField[] = [];

    function getCreditLineFieldsClp(key: keyof TClAvailableLimit) {
      return clAvailableLimit ? clAvailableLimit[key] : null;
    }

    function getCreditLineFields(
      creditLine: CreditLine | undefined,
      key: keyof CreditLine,
    ) {
      return (
        (creditLine &&
          creditLine[key as Exclude<keyof CreditLine, 'blocked'>]) ||
        null
      );
    }

    // values: first arrays has the 4 columns with each item being an array
    // and each array within has the 2 fields for the top and bottom with their labels and values
    const creditLimit = !isClpCompleteAppform
      ? getCreditLineFields(appFormData?.creditLine, 'creditLimit')
      : getCreditLineFieldsClp('sanctionedLimit');

    // zeroth column
    values.push({
      label: 'CREDIT LIMIT ₹',
      value: creditLimit ? currencyFilter(creditLimit) : '-',
    });
    values.push({
      label: 'CHANNEL',
      value: getLpcPartnerName,
    });

    const expiryDate = !isClpCompleteAppform
      ? getCreditLineFields(appFormData?.creditLine, 'expiryDateOfCreditLimit')
      : getCreditLineFieldsClp('expiryDate');

    const startDate = !isClpCompleteAppform
      ? getCreditLineFields(appFormData?.creditLine, 'dateOfCreditLimit')
      : dateOfCreditLimitClp;

    const yearsDifference =
      startDate && expiryDate
        ? getYearsDifference(new Date(startDate), new Date(expiryDate))
        : '-';

    // first column
    values.push({
      label: 'CREDIT LINE TENURE',
      value: yearsDifference,
    });
    values.push({ label: 'TYPE', value: loanSmry.loanProduct });

    // second column
    values.push({
      label: 'START DATE OF CL',
      value: startDate ? formattedDate(startDate.toString()) : '-',
    });
    values.push({
      label: 'PARTNER APP ID',
      value: appFormData?.partnerLoanId,
    });

    // third column
    values.push({
      label: 'EXPIRY DATE OF CL',
      value: expiryDate ? formattedDate(expiryDate.toString()) : '-',
    });

    if (isCoLendingPartner(loanSmry.loanProduct, productCodes)) {
      values.push({
        label: 'OVERALL AMT ₹',
        value: updateIfOverallLoanAmountExists(loanSmry, loanSmry.loanProduct),
      });
    }

    return values;
  }, [appFormData]);

  //unused method, to be used with branch led products
  async function fetchClpCreditLineStartDate() {
    const url = BASE_URL + `/api/v1/appForm/${appFormId}/internal`;
    const result = await axiosClient.get<Record<string, any>>(url);
    setDateOfCreditLimitClp(result?.responseBody?.creditLine?.createdAt || '');
  }

  const isCreditLineProduct = useMemo(() => {
    if (productCodes && appFormData) {
      const productCodeData = productCodes.find((el) => {
        return appFormData.loanProduct === el.code;
      });
      if (productCodeData !== undefined) return productCodeData.isCreditLine;
    }
    return false;
  }, [appFormData, productCodes]);

  // useEffect(() => {
  //   fetchClpCreditLineStartDate();
  // }, [appFormData]);

  return (
    <Flex
      p={12}
      w={'100%'}
      bg="primary.0"
      justify={'space-between'}
      align={'space-between'}
      // gap={'7rem'}
    >
      {loan && productCodes ? (
        // <Grid
        //   w={'60%'}
        //   gutter="sm"
        //   columns={7}
        //   grow={true}
        //   bg="primary.0"
        //   justify="flex-start"
        //   align="flex-start"
        //   style={{ display: 'inline-grid', gridAutoColumns: 'max-content' }}
        // >

        <SimpleGrid
          w="65%"
          cols={{ base: 6, sm: 2, md: 4, lg: 5 }} // Mantine will handle this responsively
          spacing={{ base: 'xs', sm: 'xl', lg: 'sm' }}
          verticalSpacing={{ base: 'xs', sm: 'xl', lg: 'sm' }}
        >
          {(isCreditLineProduct ? fieldsValuesCl : fieldsValues)?.map(
            (field) => (
              // <Grid.Col
              //   key={field.label}
              //   // span={
              //   //   field.label.includes('PARTNER') ||
              //   //   field.label.includes('ALLOCATED') ||
              //   //   field.label.includes('CREDIT LINE')
              //   //     ? 'content'
              //   //     : 1
              //   // }
              // >
              <Stack
                key={field.label}
                gap={1}
                justify="flex-start"
                align="flex-start"
                w={'100%'}
                style={{ width: 'max-content' }}
              >
                <Text c="neutral.9" className="responsive-text">
                  {field.label}
                </Text>
                <Tooltip label={field?.value} withArrow withinPortal>
                  <Text
                    maw={'95%'}
                    className="responsive-text"
                    style={{
                      whiteSpace: 'wrap',
                      fontWeight: 'bold',
                      textWrap: 'wrap',
                      wordWrap: 'break-word',
                    }}
                  >
                    {field?.value || ' - '}
                  </Text>
                </Tooltip>
              </Stack>
            ),
          )}
        </SimpleGrid>
      ) : (
        <></>
      )}
      <Stack
        gap={0}
        pr={20}
        mah={'7rem'}
        style={{ overflowY: 'scroll', float: 'right' }}
        w={'30%'}
      >
        <Flex
          w={'100%'}
          gap="sm"
          style={{ position: 'sticky' }}
          justify={'space-between'}
          align={'center'}
        >
          <Text size="sm" fw={'bold'} miw={'60%'}>
            APPLICANTS ({applicantList.length})
          </Text>
          <Text size="sm" fw={'bold'}>
            TYPE{' '}
          </Text>
        </Flex>
        {applicantList?.map((item, index) => (
          <Flex
            justify={'space-between'}
            align={'center'}
            gap="sm"
            key={item.name}
          >
            <Flex align={'start'} gap="3xs" mt={'3xs'}>
              <AppAvatar
                size={'sm'}
                radius={'sm'}
                name={''}
                color={iconColors[index]}
              >
                {item.iconText}
              </AppAvatar>
              <Text
                size="xs"
                maw={'100%'}
                style={{ textWrap: 'wrap', marginTop: '0.25rem' }}
              >
                {item.name}
              </Text>
            </Flex>
            <Text size="xs">{item.type}</Text>
          </Flex>
        ))}
      </Stack>
    </Flex>
  );
}
