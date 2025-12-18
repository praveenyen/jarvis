export type TDetailedApplicantDedupe = {
  id: number;
  customerId: string;
  type: string;
  name: string;
  dedupeStatus: string;
  dedupeReason: string | null;
  dedupedWith: TDetailedDedupe[];
};

export type TDetailedDedupe = {
  name: string;
  uid: string;
  id: number;
  pan: string;
  voterId: string;
  data: TDedupeDetails;
  appForm: string;
  loanStartDate: string;
  createdAt: string;
  lpc: string;
};

export type TDedupeDetails = {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  isActive: boolean;
  isDeleted: boolean;
  inputApplicantId: number;
  matchFoundApplicantId: number;
  inputCustomerId: string;
  matchFoundCustomerId: string;
  inputData: string;
  matchesFoundData: string;
  outcome: string;
  valid: boolean;
};

export type TInputDedupeData = {
  item: string;
  value: string;
};

export type TAppFormDataDedupe = {
  appFormId: string;
  workflowId: string;
  detailedApplicantDedupeList: TDetailedApplicantDedupe[];
};

export type TApplicantDedupeResult = {
  id: number;
  applicantType: string;
  customerId: string;
  dedupe: string;
  dedupeReason: string;
  cif: string;
  transitionState: string;
  type: string;
};

export type TExposure = { exposure: Record<string, TExposureData> };

export type TExposureData = {
  existing: number;
  maximum: number;
  allowable: number;
  mode?: string;
  policyExecuted: Record<string, boolean>;
};

export type TApplicantDetail = {
  kycType: 'panCard';
  applicantType: string;
  kycValue: string;
  customerId: string;
};

export type TExposureInput = {
  appFormId?: string;
  lpc?: string;
  stage: string;
  withdrawalAmount?: number;
  applicantDetails?: TApplicantDetail[];
  mode?: string | 'DECISION';
  applicantPan360?: TApplicantPan360;
};

export type TApplicantPan360 = {
  previousLoanProductCodes: string[];
  pastLoanBucketForGivenLPC: string[];
  withdrawalAmount: number;
  previousLoanDetails: TPreviousLoanDetails[];
  currentAppFormId: string;
  currentLpc: string;
};

export type TPreviousLoanDetails = {
  appFormId: string;
  appFormStatus: String;
  loanProductCode: string;
};

export type TExposureResponse = {
  appFormId: string;
  rulePassed: boolean;
  exposure: Record<string, TExposureData>;
};
