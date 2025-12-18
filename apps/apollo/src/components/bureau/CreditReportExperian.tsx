import {
  Accordion,
  NumberFormatter,
  Flex,
  Group,
  Paper,
  SimpleGrid,
  Stack,
  Text,
  Title,
} from '@mantine/core';
import { BureauScoreIndicator } from './common/BureauScoreIndicator';
import { memo, ReactNode, useCallback, useMemo } from 'react';
import {
  convertPaymentHistory,
  formatDateForBureauDates,
  months,
} from './bureauHelpers';
import { financePurpose, loanTypeMapExp } from './common/codeMappings';
import { PaymentHistoryTable } from './common/PaymentHistoryTable';
import { CreditReportView } from './BureauView';
import { useElementSize } from '@mantine/hooks';
import { TFields } from '../common/TitleCard';

interface AccordionLabelProps {
  label: string;
  image: string;
  description: string;
}

export const FieldLabel = memo(
  ({
    label,
    value,
  }: {
    label: string | ReactNode;
    value: string | number | undefined;
  }) => {
    return (
      <Stack gap={0}>
        <Text size="sm" fw={600}>
          {label}
        </Text>
        <Text size="sm" fw={300}>
          {value}
        </Text>
      </Stack>
    );
  },
);

export const CreditReportExperian: React.FC<CreditReportView> = ({
  appFormId,
  lpc,
  bureauData,
  styles,
}) => {
  const accountSummaryFields = [
    { label: 'Total', key: 'totalAccount', type: 'text' },
    { label: 'High credit/Sanctioned', key: '', type: 'currency' }, //sum of sanctionAmount in accounts
    {
      label: 'Current balance',
      key: 'outstandingBalanceAll',
      type: 'currency', //sum of currentBalance in accounts
    },
    { label: 'Zero balance', key: '', type: 'text' },
    { label: 'Recent account date', key: '', type: 'text' },
    { label: 'Oldest account date', key: '', type: 'text' },
  ];

  const enquirySummaryFields = [
    { label: 'Last 7 Days', key: 'last7Days' },
    { label: 'Last 30 days', key: 'last30Days' },
    { label: 'Last 90 days', key: 'last90Days' },
    { label: 'Last 180 Days', key: 'last180Days' },
  ];

  const datesFields = [
    { label: 'Opened/ Disbursed On', key: 'dateOpened' },
    { label: 'Last Payment', key: 'dateClosed' },
    { label: 'Closed', key: 'outstandingBalanceAll' },
    { label: 'Reported', key: 'dateReportedAndCertified' },
  ];
  //actual payment value - not applicable to experian
  //cash limit
  const amountsFields = [
    { label: 'High Credit', key: 'sanctionAmount', type: 'currency' },
    { label: 'Credit Facility', key: 'CreditFacility', type: 'text' },
    { label: 'Over Due', key: 'amountOverdue', type: 'currency' },
    { label: 'Credit Limit', key: 'creditLimit', type: 'currency' },
    { label: 'Repayment Tenure', key: 'repaymentTenure', type: 'text' },
    { label: 'Repayment Frequency', key: 'frequency', type: 'text' },
    { label: 'Written Off(Total)', key: 'writtenOff', type: 'currency' },
    { label: 'Interest Rate', key: 'rateOfInterest', type: 'percentage' },
    {
      label: 'Written Off(Principal)',
      key: 'writtenOffPrincipal',
      type: 'currency',
    },
    { label: 'Settlement Amount', key: 'settlementAmount', type: 'currency' },
  ];

  const accountsFields = [
    { label: 'Member Name', key: 'memberName' },
    { label: 'Account Number', key: 'accountNumber' },
    { label: 'Account Type', key: 'type' },
    { label: 'Collateral Type', key: 'collateralType' },
    { label: 'Collateral Value', key: 'collateralValue' },
  ];

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
            'OwnershipIndicator',
            'sanctionAmount',
            'currentBalance',
            'status',
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
                    accountObj.hasOwnProperty(item) &&
                    accountObj[item] !== '' &&
                    loanTypeMapExp[parseInt(accountObj.type)]) ||
                    '-'}
                </Text>
              );
            else
              return !['sanctionAmount', 'currentBalance'].includes(item) ? (
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
                    {formatDateForBureauDates(accountObj[dateItem.key])}
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
                  ) : amountItem.type === 'percentage' ? (
                    <Text size="xs" fw={700}>
                      {accountObj[amountItem.key] && `${accountObj[amountItem.key]}%`}
                    </Text>
                  ) : (
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
                    {accountObj[accountItem.key]}
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
    let allAccounts = convertPaymentHistory(
      structuredClone(bureauData?.accounts),
      'accountHistory',
      'DaysPastDue',
      'experian'
    );
    const items = allAccounts?.map(
      (item: Record<string, string>, index: number) => (
        <Accordion.Item
          value={`accordionItem${index}`}
          key={`accordionItem${index}`}
        >
          <Accordion.Control>{AccordionLabel(item, index)}</Accordion.Control>
          <Accordion.Panel>{AccordionContent(item)}</Accordion.Panel>
        </Accordion.Item>
      ),
    );
    return items;
  }, [bureauData]);

  const getAccountSummaryValue = useCallback(
    (field: { label: string; key: string; type: string }) => {
      let accounts = structuredClone(bureauData?.accounts || []);
      accounts = accounts?.sort(
        (a: any, b: any) =>
          new Date(formatDateForBureauDates(a.dateOpened)).getTime() -
          new Date(formatDateForBureauDates(b.dateOpened)).getTime(),
      );
      switch (field.label) {
        case 'Total':
          return bureauData?.accountSummary[field.key] || '-';
        case 'Open Accounts':
          return (
            bureauData?.accountSummary?.totalAccount -
              bureauData?.accountSummary?.accountClosed || '-'
          );
        case 'Current balance':
          return (
            accounts?.reduce((acc: number, account: any) => {
              return (
                acc +
                ((account.currentBalance && parseInt(account.currentBalance)) ||
                  0)
              );
            }, 0) || '-'
          );
        case 'High credit/Sanctioned':
          return (
            accounts?.reduce((acc: number, account: any) => {
              return (
                acc +
                ((account?.sanctionAmount &&
                  parseInt(account.sanctionAmount)) ||
                  0)
              );
            }, 0) || '-'
          );
        case 'Zero balance':
          return (
            accounts?.filter((account: any) => !Number(account.currentBalance))
              .length || '-'
          );
        case 'Recent account date':
          return (
            formatDateForBureauDates(
              accounts[accounts.length - 1]?.dateOpened,
            ) || '-'
          );
        case 'Oldest account date':
          return formatDateForBureauDates(accounts[0]?.dateOpened) || '-';
      }
    },
    [bureauData],
  );

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
      // style={{...styles}}
    >
      <Title order={4}>Credit Report EXPERIAN</Title>
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
              size={width}
              score={bureauData?.score ? bureauData?.score : 0}
            ></BureauScoreIndicator>
          </Paper>
          <Paper shadow="sm" p="md" radius="md" w={'80%'}>
            <Stack>
              <Text size="sm" fw={700}>
                SCORING FACTORS
              </Text>
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
                    value={
                      field.hasOwnProperty('type') &&
                      field.type !== 'currency' ? (
                        getAccountSummaryValue(field)
                      ) : (
                        <NumberFormatter
                          prefix="₹ "
                          value={getAccountSummaryValue(field) || ''}
                          thousandSeparator=","
                          thousandsGroupStyle="lakh"
                        />
                      )
                    }
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
                    value={
                      bureauData.enquirySummary.hasOwnProperty(field.key)
                        ? bureauData.enquirySummary[field.key]
                        : '-'
                    }
                  ></FieldLabel>
                ))}
                <FieldLabel
                  label="Recent Date"
                  value={
                    formatDateForBureauDates(bureauData?.header?.ReportDate) ||
                    '-'
                  }
                />
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
            variant="contained"
            defaultValue={bureauData?.accounts?.map(
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
                            valueToShow = formatDateForBureauDates(
                              en[heading] as string,
                            );
                          else {
                            if (heading === 'purpose')
                              valueToShow =
                                financePurpose[en[heading] as number] || '-';
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
