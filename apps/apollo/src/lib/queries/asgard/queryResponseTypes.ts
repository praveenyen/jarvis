export type TClAvailableLimit = {
  structureDetailId: number;
  expiryDate: string;
  sanctionedLimit: number;
  availableMaxLimit: number;
  availableMinLimit: number;
};

export type TSaveLoan = {
  loanId: string;
  status: string;
  returnCode: string;
  returnText: string;
  appFormId: string;
  serviceName: string;
  applicantId: string;
  cif: string;
};

export type TSaveLoanResult = {
  createCustomerResult: TSaveLoan[];
  createFinanceResult: TSaveLoan;
  createCustomerFailed: boolean;
  createFinanceFailed: boolean;
};
