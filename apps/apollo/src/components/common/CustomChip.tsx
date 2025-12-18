import { Badge } from '@mantine/core';
import { JSX } from 'react';
import { MantineRadius } from '@mantine/core';

type CustomChipInterface = {
  customProps: customProps,
  key?: string
};

type customProps = {
  variant?: string;
  color?: string;
  size?: string;
  radius?: MantineRadius | number;
  value?: string;
  CustomChipEvent?: () => void;
};

export default function CustomChip({
                                     customProps: {
                                       variant,
                                       color,
                                       size,
                                       radius,
                                       value,
                                       CustomChipEvent,
                                       ...props
                                     },
                                     key
                                   }: CustomChipInterface): JSX.Element {
  return (
    <Badge
      variant={variant ? variant : 'default'}
      style={{ cursor: 'pointer' }}
      color={color ? color : 'primary'}
      size={size ? size : 'md'}
      radius={radius ? radius : 'md'}
      fw={700}
      onClick={CustomChipEvent ? () => CustomChipEvent() : () => null}
      {...props}
    >
      {value ? value : ''}
    </Badge>
  );
}
