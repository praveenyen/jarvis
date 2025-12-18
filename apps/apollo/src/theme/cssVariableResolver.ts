import { CSSVariablesResolver } from '@mantine/core';
export const customCssVariableResolver: CSSVariablesResolver = (theme) => ({
  variables: {
    //  variables that do not depend on color scheme
  },
  light: {
    // variables for light color scheme only
    '--mantine-color-text': theme.colors.neutral[8], // used as text color
    '--mantine-primary-brand-color': theme.colors.primary[8],
    '--mantine-primary-color': theme.colors.primary[5],
    '--mantine-color-body': 'var(--mantine-color-white)', // used as body color
    '--mantine-color-error': 'var(--mantine-color-error-10)', // used as error color
    '--mantine-color-placeholder': '#868e96', // used as placeholder color
    '--mantine-color-anchor': 'var(--mantine-color-secondary-10)',
    '--text-color': theme.colors.neutral[5],
    '--tab-border-color': 'transparent',
  },
  dark: {
    // variables for dark color scheme only
  },
});
