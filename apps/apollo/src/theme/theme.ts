'use client';

import {
  Card,
  Container,
  createTheme,
  Paper,
  rem,
  Select,
  MantineThemeOverride,
} from '@mantine/core';
import {
  primaryBlue,
  primaryGreen,
  brandBlue,
  slateColors,
  limeColors,
  errorColors,
  lightColors,
} from './colors';

const CONTAINER_SIZES: Record<string, string> = {
  xxs: rem('200px'),
  xs: rem('300px'),
  sm: rem('400px'),
  md: rem('500px'),
  lg: rem('600px'),
  xl: rem('1400px'),
  xxl: rem('1600px'),
};

export const theme: MantineThemeOverride = createTheme({
  colors: {
    primary: primaryBlue,
    brandBlue: brandBlue,
    secondary: limeColors,
    brandGreen: primaryGreen,
    neutral: slateColors,
    error: errorColors,
    light: lightColors,
  },
  fontSizes: {
    xs: rem('10px'),
    sm: rem('12px'),
    md: rem('14px'),
    lg: rem('16px'),
    xl: rem('20px'),
    '2xl': rem('32px'),
    '3xl': rem('36px'),
    '4xl': rem('48px'),
    '5xl': rem('56px'),
  },
  breakpoints: {
    xs: '500',
    sm: '800',
    md: '1000',
    lg: '1200',
    xl: '1400',
  },
  spacing: {
    '3xs': rem('4px'),
    '2xs': rem('8px'),
    xs: rem('8px'),
    sm: rem('10px'),
    md: rem('14px'),
    lg: rem('20px'),
    xl: rem('24px'),
    '2xl': rem('28px'),
    '3xl': rem('32px'),
  },
  primaryColor: 'primary',
  fontFamily: 'Figtree,sans-serif',
  components: {
    /** Put your mantine component override here */
    Container: Container.extend({
      vars: (_, { size, fluid }) => ({
        root: {
          '--container-size': fluid
            ? '100%'
            : size !== undefined && size in CONTAINER_SIZES
              ? CONTAINER_SIZES[size]
              : rem(size),
        },
      }),
    }),
    Paper: Paper.extend({
      defaultProps: {
        p: 'md',
        shadow: 'xl',
        radius: 'md',
        withBorder: true,
      },
    }),
    Card: Card.extend({
      defaultProps: {
        p: 'xl',
        shadow: 'xl',
        radius: 'var(--mantine-radius-default)',
        withBorder: true,
      },
    }),
    Select: Select.extend({
      defaultProps: {
        checkIconPosition: 'right',
      },
    }),
  },
  other: {
    style: 'mantine',
  },
});
