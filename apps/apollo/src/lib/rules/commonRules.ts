import { TProductCodesShortened } from '@/lib/queries/groot/queryResponseTypes';
import {
  DocsSection
} from '@/components/documents/DocumentScreenType';

export const isCoLendingPartner = (
  key: string,
  productCodes: TProductCodesShortened[],
) => {
  const colending = 'CL';
  if (productCodes) {
    const productCodeData = productCodes.find((el) => {
      return key === el.code;
    });
    if (productCodeData !== undefined) {
      return productCodeData.channelType === colending;
    }
  }
  return false;
};

export const isSmeDirect = (loanProduct: string) => ['PCL', 'SMB', 'UDC', 'LKB', 'MNC', 'AFB','PCT'].includes(loanProduct);

export const isFlowTypeSME = (flowType: string) => flowType === 'SME';

export const isBranchLedProducts = (loanProduct: string) =>
  ['UPL', 'UBL', 'SBL', 'SBD', 'SBA'].includes(loanProduct);

export const isUblFclSblSbdSba = (loanProduct: string | undefined) =>
  loanProduct && ['UBL', 'FCL', 'SBL', 'SBD', 'SBA'].includes(loanProduct);

export const isUblSblSbdSba = (loanProduct: string | undefined) =>
  loanProduct && ['UBL', 'FCL', 'SBL', 'SBD'].includes(loanProduct);

export const isLapLpaPlp = (loanProduct: string | undefined) =>
  loanProduct && ['LAP', 'LPA', 'PLP'].includes(loanProduct);

export const isUblFcl = (loanProduct: string | undefined) =>
  loanProduct && ['UBL', 'FCL'].includes(loanProduct);

export const isSbl = (loanProduct: string | undefined) =>
  loanProduct && loanProduct === 'SBL';

export const isUpl = (loanProduct: string | undefined) =>
  loanProduct && loanProduct === 'UPL';

export const isSamastaLoan = (loanProduct: string | undefined) =>
  loanProduct && loanProduct === 'SAM';

export const cibilLoanProducts: string[] = [
  'CLP',
  'KBL',
  'LKB',
  'PCL',
  'MCN',
  'MBS',
  'HIL',
  'MSR',
  'UBL',
  'FCL',
  'UPL',
  'INC',
  'BYJ',
  'JAR',
  'LPC',
  'LPA',
];

  export const getLeftBorderColor = (docSections: DocsSection): string => {
    if (docSections.osvStatus === true) return '#4caf50'; // Green
    if (docSections.osvStatus === false) return '#f44336'; // Red

    if (docSections.checklist == true) return '#2974db'; // No border if checklist is off

    return 'transparent'; // Default Blue (indicator-checklist base color)
  };
