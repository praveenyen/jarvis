export type SearchBy = {
  individualName: string;
  businessName: string;
  appFormId: string;
  partnerLoanId: string;
  appFormRefId: string;
};

export type GreenChannelAppStates = {
  manualReview: string;
  approved: string;
  techIssue: string;
};

export type GreenChannelManualReview = {
  manualReview: string;
  autoReview: string;
};

export type CkycFlow = {
  ckyc: 'CKYC';
  nonckyc: 'Non CKYC';
};

export type VkycFlow = {
  vkyc: 'VKYC';
  nonvkyc: 'Non VKYC';
};

export type AppFlow = {
  greenchannel: 'Green Channel';
  nongreenchannel: 'Non Green Channel';
};

export type AllFilters = {
  searchText: string;
  searchBy?: string | null;
  channel: string | null;
  productCode: string | null;
  status: string | null;
  assignedTo: string | null;
  myCases: string | null;
  ckycFlow: string | null;
  vkycFlow: string | null;
  dateRange?: [Date | null, Date | null];
  appFlow: string | null;
  greenChannelAppState: string | null;
  reviewType: string | null;
  dsaCompanyCode: string | null;
  dsa_lead_type: string[] /*todo: need type*/;
  dsaSalesManager: string | null;
  designation: string | null;
  dsaAreaSalesManager: string | null;
  dsaManagerType: string | null;
  dsaSelectedManagerMail: string | null;
  creditUser: string | null;
  dsaCity: string | null;
  needCount: boolean;
  pageSize: number;
  pageNumber: number;
  selectedTab?: string;
  needApplicantName?: boolean;
  startDate?: string;
  endDate?: string;
};

export type PartialFilters = Partial<AllFilters>;

export type ApplicationData = {
  ckycFlag: boolean | null;
  stageUpdatedAt: string | null;
  dsa_scheme: string | null;
  loanType: string;
  dsa_sales_manager: string | null;
  lastUpdatedAt: string;
  appDate: string | null;
  applicantName: string;
  appFormId: string;
  dsa_branch: string | null;
  partnerLoanId: string;
  productCode: string;
  stage: string | null;
  applicantType: string;
  dsa_program: string | null;
  appFormRefId: string | null;
  dsa_branch_city: string | null;
  isTopUp: string; // "true" or "false" as string
  softRejected: boolean;
  appFormStatus: string;
  partnerId: string;
  dsa_lead_type: string | null;
  status: string | null;
  vkycFlag: boolean | null;
};
