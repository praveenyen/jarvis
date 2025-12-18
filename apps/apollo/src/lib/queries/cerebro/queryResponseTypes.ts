export type TExpBureau = {
  bureau: {
    header: TExpHeader;
    userMessage: string;
    customer: Record<string, string>;
    kyc: TExpKYC[];
    contact: TExpContact[];
    email: string[];
    employment: Record<string, unknown>;
    address: TExpAddress[] | TCibilAddress[];
    accountSummary: TExpAccountSummary[];
    account: TExpAccount[];
    enquirySummary: TExpEnquirySummary[];
    enquiry: TExpEnquiry[];
    score: TExpScore[];
    secondaryReport?: {
      header: TExpHeader;
      customer: Record<string, string>;
      kyc: TExpKYC[];
      contact: TExpContact[];
      email: string[];
      address: TExpAddress[] | TCibilAddress[];
    }[];
  };
};

export type TExpHeader = {
  systemCode: string;
  dateProcessed: string;
  timeProcessed: string;
};

export type TExpKYC = {
  type: string;
  value: string;
};

export type TExpContact = {
  type: string;
  value: string;
};

export type TExpAddress = {
  line1?: string;
  city?: string;
  state?: string;
  pincode?: string;
};

export type TCibilAddress = {
  line1?: string;
  line5?: string;
  category: string;
  dateReported: string;
  city?: string;
  state?: string;
  pincode?: string;
  enrichedThroughEnquiry: string;
};

export type TExpAccountSummary = {
  totalAccount: number;
  activeAccount: number;
  accountDefault: number;
  accountClosed: number;
  outstandingBalanceSecured: number;
  outstandingBalanceSecuredPercentage: number;
  outstandingBalanceUnsecured: number;
  outstandingBalanceUnsecuredPercentage: number;
  outstandingBalanceAll: number;
};

export type TExpAccount = {
  memberName: string;
  accountNumber: string;
  type: string;
  dateOpened: string;
  sanctionAmount?: number;
  frequency?: string;
  paymentHistory1: string;
  currentBalance: number;
  amountPastDue?: number;
  dateReportedAndCertified: string;
  lastPaymentDate?: string;
  settlementAmount?: number;
  repaymentTenure: number;
  dateClosed?: string;
  rateOfInterest?: number;
  accountHistory: TExpAccountHistory[];
};

export type TExpAccountHistory = {
  year: number;
  month: number;
  dpd?: number;
  asset: string;
};

export type TExpEnquirySummary = {
  last7Days: number;
  last30Days: number;
  last90Days: number;
  last180Days: number;
};

export type TExpEnquiry = {
  firstName: string;
  date: string;
  reason: string;
  purpose: string;
  amount: number;
};

export type TExpScore = {
  value: number;
};
