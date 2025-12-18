export type TVerifyAppFormStatus = {
  appFormId: string;
  status: string;
  individualStatus: TComponentStatus[];
  beneficialOwnerStatus: TComponentStatus[];
  coApplicantStatus: TComponentStatus[];
  authorizedSignatoryStatus: TComponentStatus[];
  businessStatus?: TComponentStatus | null;
  statusCodeLegends: StatusCodeLegends;
  workflowId?: string;
};

export type TComponentStatus = {
  id: string;
  status: string;
  name: string;
  kycList: TComponentStatusResponseDto[];
  uan: TComponentStatusResponseDto;
};

export type TComponentStatusResponseDto = {
  id: string;
  component: string;
  item: string;
  status: string;
  componentSourceId: string;
  reason: string;
  tpResponse: null | {
    name?: string;
  };
  itemValue: string;
};

export type StatusCodeLegends = {
  statusCodePositive: string;
  statusCodeNegative: string;
  statusCodePartialMatch: string;
  noResponse: string;
  statusCodePartialPositiveMedium: string;
  statusCodeForceProceed: string;
  statusCodeManualRejection: string;
};

export type TKycCustomStatusOutput = {
  applicantId: string;
  kycType: string;
  kycId: string;
  status: string;
  message: string;
};
export type TKycCustomStatusInput = {
  kycType: string;
  status: string;
  reason: string;
};

export type TKycInfo = {
  kycType: string;
  kycValue: string;
  firstName: string;
  middleName?: string;
  lastName: string;
  issueDate: string;
  issuingAuthority: string;
  fatherName?: string; // Father's name is optional
  motherName?: string; // Mother's name is optional
  spouseName?: string; // Spouse's name is optional
  dob: string | Date;
  expiryDate?: string; // Expiry date is optional
  referenceNo?: string; // Reference number is optional
  nationality: string;
  gender: string;
  passportType?: string;
  issuedCountry?: string;
  sourceType?: string;
  reportStatus: TReportStatus;
  kycMatch?: boolean;
  kycLinked?: boolean;
};

type TReportStatus =
  | 'NONINITIATED'
  | 'INITIATED'
  | 'GENERATED'
  | 'UNSUPPORTED'
  | 'NOVINTAGEFILING'
  | 'FAILED';
