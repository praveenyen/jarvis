import { Box, Flex, Group, Text } from '@mantine/core';

type PaymentHistory = {
  [month: string]: string;
};

type AccountType = {
  accountHistory?: {
    [year: string]: PaymentHistory;
  };
  paymentHistory?: {
    [year: string]: PaymentHistory;
  };
};

type Props = {
  account: AccountType;
  months: string[];
  historyFieldName: 'accountHistory' | 'paymentHistory';
};

export const PaymentHistoryTable = ({
  account,
  months,
  historyFieldName,
}: Props) => {
  if (!account[historyFieldName]) return null;

  const allMonths = [...months,' '];

  return (
    <Box w="100%" px="md" pb="md">
      <Group
        justify="space-between"
        align="center"
        gap="md"
        grow
        p={4}
        style={{ background: '#faf8f5' }}
      >
        {allMonths.reverse().map((month, index) => (
          <Text size="xs" fw={700}>
            {month}
          </Text>
        ))}
      </Group>

      {Object.entries(account[historyFieldName]).map(([year, payment]) => (
        <Group
          justify="space-between"
          align="center"
          gap="md"
          p={4}
          grow
          style={{ borderTop: '1px solid #eeeeee' }}
        >
          <Text size="xs">{year}</Text>
          {months.map((month) => {
            const value = payment[month]?.toUpperCase();
            return <Text size="xs">{payment[month]}</Text>;
          })}
        </Group>
      ))}
    </Box>
  );
};
