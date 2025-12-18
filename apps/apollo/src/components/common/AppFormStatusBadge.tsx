'use client';
import { Badge, useMantineTheme } from '@mantine/core';
import { formatSnakeCase } from '@/lib/utils/utils';
import { useCallback } from 'react';

type Props = {
  status: string;
};

export default function AppFormStatusBadge(props: Props) {
  const { status } = props;
  const theme = useMantineTheme();

  const getType = useCallback((stage: string) => {
    switch (stage) {
      case 'qcNotStarted':
        return 'red';
      case 'FCU_IN_PROGRESS':
      case 'QC_IN_PROGRESS':
      case 'CREDIT_IN_PROGRESS':
      case 'DISBURSAL_IN_PROGRESS':
      case 'BOOKING_IN_PROGRESS':
      case 'WELCOME_KIT_IN_PROGRESS':
        return 'blue';
      case 'QC_COMPLETE':
      case 'CREDIT_COMPLETE':
      case 'DISBURSAL_COMPLETE':
      case 'BOOKING_COMPLETE':
      case 'WELCOME_KIT_COMPLETED':
        return 'green';
      default:
        return 'red';
    }
  }, []);

  const chipLightbg = {
    red: theme.colors.error[0],
    blue: theme.colors.primary[0],
    green: theme.colors.brandGreen[1],
  };

  const chipSolid = {
    red: theme.colors.error[5],
    blue: theme.colors.primary[5],
    green: theme.colors.brandGreen[6],
  };

  function getColor(status: string): string {
    let color: string = 'gray';
    if (status === 'approved') {
      color = 'green';
    }
    if (status === 'rejected') {
      color = 'red';
    }
    return color;
  }

  function getStatus(status: string): string {
    if (status === 'BOOKING_COMPLETE') {
      return formatSnakeCase('BOOKED');
    }
    return formatSnakeCase(status);
  }

  return (
    <Badge color={chipSolid[getType(status)]} variant="light" radius="sm">
      {getStatus(status)}
    </Badge>
  );
}
