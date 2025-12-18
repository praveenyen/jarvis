import {
  Accordion,
  Flex,
  Group,
  NumberFormatter,
  Paper,
  SimpleGrid,
  Stack,
  Text,
  Title,
} from '@mantine/core';
import { CreditReportView } from './BureauView';
import { FieldLabel } from './CreditReportExperian';
import { BureauScoreIndicator } from './common/BureauScoreIndicator';
import {
  collateralTypes,
  financePurpose,
  loanTypeMapCibil,
  ownershipIndicatorTypeMap,
  reasonCodeMap,
} from './common/codeMappings';
import {
  convertPaymentHistory,
  countRecentDates,
  formatDate,
  formatDateForBureauDates,
  months,
  parseDDMMYYYYCompact,
  parseDDMMYYYYCompactDateString,
  writePaymentHistory,
} from './bureauHelpers';
import { useCallback, useMemo } from 'react';
import { PaymentHistoryTable } from './common/PaymentHistoryTable';
import { useElementSize } from '@mantine/hooks';

const accountSummaryFields = [
  { label: 'Total', key: 'totalAccount' },
  {
    label: 'High credit/Sanctioned',
    key: 'sanctionedAmount',
    type: 'currency',
  },
  { label: 'Current balance', key: 'currentBalance', type: 'currency' },
  { label: 'Zero balance', key: 'zeroAccount' },
  { label: 'Recent account date', key: 'recentAccount' },
  { label: 'Oldest account date', key: 'oldestAccount' },
];

const enquirySummaryFields = [
  { label: 'Last 7 days', key: 'last7Days', days: 7 },
  { label: 'Last 30 days', key: 'last30Days', days: 30 },
  { label: 'Last 90 days', key: 'last90Days', days: 90 },
  { label: 'Last 180 days', key: 'last180Days', days: 180 },
  { label: 'Last 1 year', key: 'last1Year', days: 365 },
  { label: 'Last 2 years', key: 'last2Year', days: 730 },
  { label: 'Recent Date', key: 'recentDate', days: 0 },
];

const datesFields = [
  { label: 'Opened/ Disbursed On', key: 'DateOpenedOrDisbursed' },
  { label: 'Last Payment', key: 'DateOfLastPayment' },
  { label: 'Closed', key: 'DateClosed' },
  { label: 'Reported', key: 'DateReportedAndCertified' },
  { label: 'PMT HIST START', key: 'PaymentHistoryStartDate' },
  { label: 'PMT HIST END', key: 'PaymentHistoryEndDate' },
];

const amountsFields = [
  {
    label: 'High Credit',
    key: 'HighCreditOrSanctionedAmount',
    type: 'currency',
  },
  { label: 'Credit Facility', key: 'CreditFacility', type: 'text' },
  // { label: 'Over Due', key: '', type: 'currency' },
  { label: 'Credit Limit', key: 'CreditLimit', type: 'currency' },
  { label: 'Repayment Tenure', key: 'RepaymentTenure', type: 'text' },
  { label: 'Repayment Frequency', key: 'PaymentFrequency', type: 'text' },
  {
    label: 'Written Off(Total)',
    key: 'WrittenOffAmountTotal',
    type: 'currency',
  },
  { label: 'Interest Rate', key: 'RateOfInterest', type: 'percentage' },
  // {
  //   label: 'Written Off(Principal)',
  //   key: 'writtenOffPrincipal',
  //   type: 'currency',
  // },
  { label: 'Settlement Amount', key: 'SettlementAmount', type: 'currency' },
];
const accountsFields = [
  { label: 'Member Name', key: 'ReportingMemberShortName' },
  // { label: 'Account Number', key: 'accountNumber' },
  { label: 'Collateral Type', key: 'TypeOfCollateral' }
  // { label: 'Collateral Value', key: 'accountNumber' },
];

export const CreditReportCibil: React.FC<CreditReportView> = ({
  appFormId,
  lpc,
  bureauData,
  styles,
}) => {
  const getAccountSummaryFor = useCallback(
    (keyName: string) => {
      switch (keyName) {
        case 'totalAccount':
          return bureauData?.account?.length;
        case 'sanctionedAmount':
          return (
            <NumberFormatter
              prefix="₹ "
              value={bureauData?.account?.reduce(
                (
                  acc: number,
                  accountItem: Record<string, string | undefined>,
                ) =>
                  acc +
                  parseInt(accountItem?.HighCreditOrSanctionedAmount || '0'),
                0,
              )}
              thousandSeparator=","
              thousandsGroupStyle="lakh"
            />
          );
        case 'currentBalance':
          return (
            <NumberFormatter
              prefix="₹ "
              value={bureauData?.account?.reduce(
                (
                  acc: number,
                  accountItem: Record<string, string | undefined>,
                ) => acc + parseInt(accountItem?.CurrentBalance || '0'),
                0,
              )}
              thousandSeparator=","
              thousandsGroupStyle="lakh"
            />
          );
        case 'zeroAccount':
          return (
            bureauData?.account?.filter(
              (accountItem: Record<string, string | undefined>) =>
                !parseInt(accountItem?.CurrentBalance as string),
            )?.length || '-'
          );
        case 'recentAccount':
        case 'oldestAccount':
          const parsedDates =
            bureauData?.account
              ?.map(
                (accountItem: Record<string, string | undefined>) =>
                  accountItem?.DateOpenedOrDisbursed,
              )
              ?.filter((item: any) => item)
              ?.map((date: string) => parseDDMMYYYYCompact(date)) || [];

          return parsedDates.length > 0
            ? keyName === 'recentAccount'
              ? formatDate(new Date(Math.max(...parsedDates)))
              : formatDate(new Date(Math.min(...parsedDates)))
            : '-';
      }
    },
    [bureauData],
  );

  const getEnquirySummaryFor = useCallback(
    ({ label, key, days }: { label: string; key: string; days: number }) => {
      if (key !== 'recentDate')
        return countRecentDates(bureauData?.enquiry, days);
      else {
        const parsedDates =
          bureauData?.enquiry
            ?.map(
              (enquiryItem: Record<string, string | undefined>) =>
                enquiryItem?.date,
            )
            ?.filter((item: any) => item)
            ?.map((date: string) => parseDDMMYYYYCompact(date)) || [];

        return (
          (parsedDates.length > 0 &&
            formatDate(new Date(Math.max(...parsedDates)))) ||
          '-'
        );
      }
    },
    [bureauData],
  );

  const AccordionLabel = useCallback(
    (accountObj: any, accountIndex: number) => {
      return (
        <Group
          justify="space-between"
          gap="xl"
          grow
          key={'experianAccounts' + accountIndex}
        >
          {[
            'index',
            'type',
            'OwenershipIndicator',
            'HighCreditOrSanctionedAmount',
            'CurrentBalance',
            'CreditFacility',
          ].map((item) => {
            if (item === 'index')
              return (
                <Text size="xs" fw="600">
                  {accountIndex + 1}
                </Text>
              );
            else if (item === 'type')
              return (
                <Text size="xs" fw="600">
                  {(accountObj &&
                    accountObj.hasOwnProperty('AccountType') &&
                    accountObj['AccountType'] !== '' &&
                    loanTypeMapCibil[parseInt(accountObj.AccountType)]) ||
                    '-'}
                </Text>
              );
            else if (item === 'OwenershipIndicator')
              return (
                <Text size="xs" fw="600">
                  {(accountObj &&
                    accountObj.hasOwnProperty(item) &&
                    accountObj[item] !== '' &&
                    ownershipIndicatorTypeMap[parseInt(accountObj[item])]) ||
                    '-'}
                </Text>
              );
            else
              return ![
                'HighCreditOrSanctionedAmount',
                'CurrentBalance',
              ].includes(item) ? (
                <Text size="xs" fw="600">
                  {(accountObj &&
                    accountObj.hasOwnProperty(item) &&
                    accountObj[item] !== '' &&
                    accountObj[item]) ||
                    '-'}
                </Text>
              ) : (
                <Text size="xs" fw={600}>
                  <NumberFormatter
                    prefix="₹ "
                    value={
                      accountObj &&
                      accountObj.hasOwnProperty(item) &&
                      accountObj[item]
                    }
                    thousandSeparator=","
                    thousandsGroupStyle="lakh"
                  />
                </Text>
              );
          })}
        </Group>
      );
    },
    [],
  );

  const AccordionContent = useCallback((accountObj: Record<string, string>) => {
    return (
      <Stack w={'100%'}>
        <Flex w={'100%'} gap={12}>
          <Paper shadow="xs" w={'30%'}>
            <Stack>
              {datesFields.map((dateItem) => (
                <Group justify="space-between" gap="md" grow w={'100%'}>
                  <Text size="xs">{dateItem.label}</Text>
                  <Text size="xs" fw={700}>
                    {parseDDMMYYYYCompactDateString(accountObj[dateItem.key])}
                  </Text>
                </Group>
              ))}
            </Stack>
          </Paper>
          <Paper shadow="xs" w={'70%'}>
            <SimpleGrid cols={2}>
              {amountsFields.map((amountItem) => (
                <Group justify="space-between" gap="md" grow>
                  <Text size="xs">{amountItem.label}</Text>
                  {amountItem.type === 'text' ? (
                    <Text size="xs" fw={700}>
                      {accountObj[amountItem.key]}
                    </Text>
                  ) : amountItem.type === 'percentage' ?  <Text size="xs" fw={700}>
                      {accountObj[amountItem.key]} %
                    </Text> : (
                    <Text size="xs">
                      <NumberFormatter
                        prefix="₹ "
                        value={
                          (accountObj &&
                            accountObj.hasOwnProperty(amountItem.key) &&
                            accountObj[amountItem.key]) ||
                          ''
                        }
                        thousandSeparator=","
                        thousandsGroupStyle="lakh"
                      />
                    </Text>
                  )}
                </Group>
              ))}
            </SimpleGrid>
          </Paper>
        </Flex>
        <Flex gap={30}>
          <Paper shadow="xs" w={'30%'}>
            <Stack>
              {accountsFields.map((accountItem) => (
                <Group justify="space-between" gap="md" grow w={'100%'}>
                  <Text size="xs">{accountItem.label}</Text>
                  <Text size="xs" fw={700}>
                   {accountItem.key === 'TypeOfCollateral'
                      ? collateralTypes[accountObj[accountItem.key]]
                      : accountObj[accountItem.key]}
                  </Text>
                </Group>
              ))}
            </Stack>
          </Paper>
          <Paper shadow="xs" w={'100%'}>
            <PaymentHistoryTable
              account={accountObj}
              months={months}
              historyFieldName="accountHistory"
            />
          </Paper>
        </Flex>
      </Stack>
    );
  }, []);

  const accounts = useMemo(() => {
    let allAccounts = structuredClone(bureauData?.account);
    allAccounts = allAccounts?.map((acc: Record<string, string>) => ({
      ...acc,
      accountHistory: writePaymentHistory(
        acc.PaymentHistory1,
        acc.PaymentHistory2,
        acc.PaymentHistoryStartDate,
        acc.PaymentHistoryEndDate,
      ),
    }));
    allAccounts = convertPaymentHistory(allAccounts, 'accountHistory', 'type','cibil');
    const items = allAccounts?.map(
      (item: Record<string, string>, index: number) => (
        <Accordion.Item value={`accordionItem${index}`} key={index}>
          <Accordion.Control>{AccordionLabel(item, index)}</Accordion.Control>
          <Accordion.Panel>{AccordionContent(item)}</Accordion.Panel>
        </Accordion.Item>
      ),
    );
    return items;
  }, [bureauData]);
      const { ref, width } = useElementSize();

  return bureauData ? (
    <Stack
      mt={25}
      ml={20}
      style={{
        float: 'left',
        display: 'inline-flex',
        // ...styles
      }}
      className="w-4/5"
    >
      <Title order={4}>Credit Report CIBIL</Title>
      <Stack
        className="rounded-lg"
        bg={'white'}
        justify={'flex-start'}
        align={'flex-start'}
        px={15}
        py={15}
      >
        <Flex w={'100%'} gap={16}>
          <Paper
            shadow="sm"
            p="md"
            ref={ref}
            radius="md"
            w={'20%'}
            h={150}
            style={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <BureauScoreIndicator
              score={bureauData?.score ? parseInt(bureauData?.score?.value) : 0} size={width}
            ></BureauScoreIndicator>
          </Paper>
          <Paper shadow="sm" p="md" radius="md" w={'80%'}>
            <Stack>
              <Text size="sm" fw={700}>
                SCORING FACTORS
              </Text>
              {Object.keys(bureauData?.score)
                .filter((key) => key.toLowerCase().includes('reasoncode'))
                .map((reason) => (
                  <Text size="xs">
                    {reasonCodeMap[parseInt(bureauData.score[reason])]}
                  </Text>
                ))}
            </Stack>
          </Paper>
        </Flex>

        <Flex w={'100%'} gap={16}>
          <Stack gap={8} w={'50%'}>
            <Title order={5}>Account Summary</Title>
            <Paper shadow="sm" p="md" radius="md">
              <SimpleGrid
                type="container"
                w={'100%'}
                cols={{ base: 1, '300px': 2, '500px': 3, '1000px': 5 }}
                spacing={{ base: 10, '300px': 'xl' }}
              >
                {accountSummaryFields.map((field) => (
                  <FieldLabel
                    key={field.label}
                    label={field.label}
                    value={getAccountSummaryFor(field.key)}
                  ></FieldLabel>
                ))}
              </SimpleGrid>
            </Paper>
          </Stack>

          <Stack gap={8} w={'50%'}>
            <Title order={5}>Enquiry Summary</Title>
            <Paper shadow="sm" p="md" radius="md">
              <SimpleGrid
                type="container"
                w={'100%'}
                cols={{ base: 1, '300px': 2, '500px': 3, '1000px': 5 }}
                spacing={{ base: 10, '300px': 'xl' }}
              >
                <FieldLabel
                  label="Total"
                  value={bureauData?.enquiry?.length || '-'}
                />
                {enquirySummaryFields.map((field) => (
                  <FieldLabel
                    label={field.label}
                    value={getEnquirySummaryFor(field)}
                  ></FieldLabel>
                ))}
              </SimpleGrid>
            </Paper>
          </Stack>
        </Flex>

        <Stack w={'100%'}>
          <Title order={5}>Accounts</Title>
          <Group justify="space-between" gap="xl" grow pr={24} pl={4}>
            {[
              '#',
              'TYPE',
              'OWNERSHIP',
              'SANCTIONED AMOUNT',
              'CURRENT BALANCE',
              'STATUS',
            ].map((heading) => (
              <Text fw={600} size="xs" c="neutral.9">
                {heading}
              </Text>
            ))}
          </Group>

          <Accordion
            multiple
            chevronPosition="right"
            variant="separated"
            defaultValue={bureauData?.account?.map(
              (_: any, index: number) => `accordionItem${index}`,
            )}
          >
            {accounts}
          </Accordion>
        </Stack>

        <Stack w={'100%'}>
          <Title order={5}>Enquiries</Title>
          <Group justify="space-between" gap="xl" grow pl="12px">
            {['#', 'MEMBER', 'DATE', 'PURPOSE', 'AMOUNT'].map((heading) => (
              <Text fw={600} size="xs" c="neutral.9">
                {heading}
              </Text>
            ))}
          </Group>
          <Stack w={'100%'} gap={4}>
            {bureauData?.enquiry && bureauData.enquiry?.length > 0 ? (
              bureauData.enquiry.map(
                (en: Record<string, string | number>, index: number) => (
                  <Paper w={'100%'} shadow="xs" p={12}>
                    <Group
                      justify="space-between"
                      gap="xl"
                      grow
                      key={en.firstName}
                    >
                      {['index', 'firstName', 'date', 'purpose', 'amount'].map(
                        (heading) => {
                          let valueToShow: any = en[heading] || '-';

                          if (heading === 'index') valueToShow = index + 1;
                          else if (heading === 'date')
                            valueToShow = parseDDMMYYYYCompactDateString(
                              en[heading] as string,
                            );
                          else {
                            if (heading === 'purpose')
                              valueToShow =
                                loanTypeMapCibil[parseInt(en[heading] as string)] || '-';
                          }
                          return (
                            <Text fw={700} size="xs">
                              {valueToShow}
                            </Text>
                          );
                        },
                      )}
                    </Group>
                  </Paper>
                ),
              )
            ) : (
              <Group justify="space-between" gap="xl" grow>
                <Text c="neutral.3">No enquiries</Text>
              </Group>
            )}
          </Stack>
        </Stack>
      </Stack>
    </Stack>
  ) : (
    <></>
  );
};
