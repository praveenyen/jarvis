export type TAppformData = {
  id: string;
  partnerLoanId: string;
  restructured: string;
  oldPartnerLoanId: string;
  limitEnhanced: string;
  batchId: string;
  partnerAppId: string;
  partnerId: string;
  partnerAppTime: Date;
  partnerDisburseTime: Date;
  partnerSanctionTime: Date;
  source: string;
  loanType: string;
  creditLine: CreditLine;
  linkedIndividuals: LinkedIndividual[];
  coApplicants: CoApplicant[];
  beneficialOwners: BeneficialOwners[];
  linkedBusiness: ApplicantResp;
  assetGroup: string;
  loan: Loan;
  creditPolicy: string;
  ckycFlag: string;
  ckycValidationMode: TCkycValidationMode;
  offerId: string;
  mandate: TMandateResp;
  invoiceFinancing: string;
  pennyTesting: PennyTesting;
  kycType: string;
  customerConsents: string;
  loanProduct: string;
  appFormStatus: string;
  workflowId: string;
  status: string;
  stage: string;
  greenChannelFlag: boolean;
  createdAt: Date;
  dsa: string;
  marketplace: boolean;
  bankStmtReq: string;
  flowType: string;
  softRejected: boolean;
  eligibleForSoftReject: boolean;
  pslEligibility: boolean;
  miscData: MiscData;
  otpValidation: string;
  fcuStatus: string;
  onHoldReason: string;
  offers: string;
  loanAppDedupe: string;
  reviewed: boolean
};

export type TAppFormListResponse = {
  pageNumber: number;
  pageSize: number;
  count: number;
  data: AppFormListRecord[];
};

export type TCkycValidationMode = {
  mode: string,
  mobileNo: string,
  stmtType: string,
  stmtName: string
}

export type AppFormListRecord = {
  ckycFlag: 't' | null;
  stageUpdatedAt: string | null;
  dsa_scheme: string | null;
  loanType: string;
  dsa_sales_manager: string | null;
  lastUpdatedAt: string;
  appDate: string;
  applicantName: string;
  appFormId: string;
  dsa_branch: string | null;
  partnerLoanId: string;
  productCode: string;
  stage: string | null;
  rejectReason: string | null;
  applicantType: string;
  dsa_program: string | null;
  appFormRefId: string | null;
  dsa_branch_city: string | null;
  isTopUp: 'false|true';
  softRejected: boolean;
  appFormStatus: string | null;
  partnerId: string;
  dsa_lead_type: string | null;
  status: string | null;
  vkycFlag: 't' | null;
};

export type TMandateResp = {
  pennyTestingSuccess: boolean;
  mandateMethod: string;
  accountNumber: string;
  holderName: string;
  bankName: string;
  status: string;
};

export type LinkedIndividual = {
  riskCategory: string;
  vkycFlag: boolean;
  aadharXmlType: string;
  vkyc: Vkyc;
  insuranceDetails: InsuranceResp;
  vasDetails: VasDetailsResp;
} & ApplicantResp;

export type CoApplicant = {
  riskCategory: string;
  vkycFlag: boolean;
  vkyc: Vkyc;
  aadhaarXmlType: string;
} & ApplicantResp;

export type VasDetailsResp = {
  id: number;
  serviceProvider: string;
  type: string;
  tenure: number;
  serviceStartDate: string;
  nomineeApplicant: NomineeApplicantResp;
  amount: number;
  vasSumInsured: number;
  subscriptionType: string;
  pennantFeeCode: string;
};

export type InsuranceResp = {
  id: number;
  coverType: string;
  anyPreExistingDisease: string;
  detailsOfPreExistingDisease: string;
  quoteStatus: string;
  insuranceProvider: string;
  duration: number;
  loanDisbDate: string;
  sumInsured: number;
  insurancePremiumAmount: number;
  collateralIds: string;
  bookingStatus: string;
  reason: string;
  policyNo: string;
  insuranceProductCode: string;
  nomineeApplicant: NomineeApplicantResp;
};

export type NomineeApplicantResp = {
  name: string;
  dob: string;
  gender: string;
  relationshipWithApplicant: string;
  contancts: Contact[];
  address: Address[];
};

export type BeneficialOwners = {
  riskcategory: string;
  vkycFlag: boolean;
  aadhaarXmlType: string;
  vkyc: Vkyc;
} & ApplicantResp;

export type Vkyc = {
  latTag: number;
  longTag: number;
  country: string;
  city: string;
  riskCategory: string;
  status: string;
  state: string;
  vkycDate: string;
};

export type CreditLine = {
  id: number;
  creditLimit: number;
  dateOfCreditLimit: string;
  dateOfCreditLimitRevision: string;
  availableCreditLimit: string;
  expiryDateOfCreditLimit: string;
  blocked: boolean;
};

export type WebPresenceResp = {
  category: string;
  url: string;
};

export type CkycResponse = {
  ckycNumber: string;
  ckycSearchResultValue: number;
};

export type ReferenceAddressReq = {
  type: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  country: string;
  pinCode: string;
  ownership: string;
  priority: number;
};
export type References = {
  type: string;
  name: string;
  relation: string;
  phone: string;
  address: ReferenceAddressReq;
};

export type ApplicantResp = {
  id: number;
  applicantType: string;
  individual: Individual | null;
  business: Business | null;
  bankAccounts: BankAccount[];
  kyc: Kyc[];
  addresses: Address[];
  misc: MiscData;
  contacts: Contact[];
  webPresenceList: WebPresenceResp[];
  ckyc: CkycResponse;
  partnerBureau: PartnerBureau[];
  nsdl: Nsdl;
  dedupe: string;
  dedupeReason: string;
  customerId: string;
  cif: string;
  limitId: string;
  transitionState: string;
  regulatoryStatus: string;
  references: References[];
  employmentStatus: string;
  employerName: string;
  salaryDepositMethod: string;
  residentialStatus: string;
  applicantMiscData: null;
  scores: ScoresResp[];
  type: string;
  obligations: ObligationsResp[];
  courseDetail: CourseDetailResp;
  declaredData: DeclaredData;
  aadhaarXmlType: string;
};

export type ObligationsResp = {
  id: number;
  obligationType: string;
  emiAmount: number;
  accountNumber: string;
  financier: string;
  currentOutstanding: number;
  remainingTenure: number;
  obligate: string;
  closeType: string;
};
export type DeclaredData = {
  dob: string;
};
export type ScoresResp = {
  key: string;
  score: string;
};

export type CourseDetailResp = {
  courseName: string;
  instituteName: string;
};

export type Loan = {
  id: number;
  feeDetails: { [x: string]: string }[];
  insuranceFeeDetails: { [x: string]: string }[];
  loanProduct: string;
  loanRepayMethod: string;
  loanAssetValue: string;
  loanIntRate: string;
  tenure: string;
  insuranceTenure: string;
  amount: number;
  enduse: string;
  loanStartDate: string;
  merchant: string;
  emiScheduleList: string;
  partnerInterestAmount: string;
  productNameList: string;
  mandateSource: string;
  partnerScore: string;
  downPayment: string;
  alwBpiTreatment: boolean;
  partnerEmiAmount: string;
  processingFee: string;
  repayFrq: string;
  repayPftFrq: string;
  nextRepayDate: string;
  nextRepayPftDate: string;
  partnerBpiAmount: string;
  disbursement: Disbursement;
  fundingAllocation: number;
  disbursalAmount: string;
  coLenderSMAClassificaiton: string;
  fieldInvestigationDate: string;
  fieldInvestigationStatus: string;
  numberOfCoBorrowers: string;
  partnerUtrNumber: string;
  partnerDisbursementAmount: string;
  overAllLoanAmount: string;
  sanctionDate: string;
  emiType: string;
  status: string;
  topUp: TTopUp;
  insuranceFee: string;
  lifeInsuranceFee: string;
  insuranceType: string;
  requestedAmount: number;
  negotiationStatus: number;
  mcuStatus: number;
  loanSegment: string;
  loanSegmentDetails: string;
  modeOfDisbursal: string;
  customerConfirmationStatus: string;
  noOfAdvancedEmi: number;
  optingStructuredEmi: boolean;
  optingAdvancedEmi: boolean;
  splitType: string;
  noOfSteps: number;
  emiOptedProgram: string;
  stepsDetails: string;
  totalProfit: string;
  totalRepayAmt: string;
  effectiveRateOfReturn: string;
  requestedTenure: string;
  repayPftRate: string;
  rackRate: string;
};

export type TTopUp = {
  loanSubType: string;

  oldLoanAmount: number;

  foreClosureAmount: number;

  closureDate: string;

  oldLoanFinancier: string;

  outstandingAmount: number;

  foreClosureMode: string;

  isParallel: boolean;

  multipleLoanAcc: TLoanAcc[];

  loanAcc: TLoanAcc;

  oldActiveLoanAcc: TLoanAcc[];

  foreClosureAmountPartner: number;

  topUpAmount: number;

  oldLoanLenderAccountNumber: string;
};

export type TLoanAcc = {
  loanAccNo: string;
  lenderName: string;
  totalLoanAmount: number;
  loanAppFormId: string;
  loanTags: string[];
};

export type PennyTesting = {
  id: number;
  accountNumber: string;
  holderName: string;
  bankName: string;
  status: string;
  validatedTime: string;
  registeredName: string;
  ifsc: string;
  failureReason: string;
};

export type MiscData = {
  members: string;
  houseHoldDetails: string;
  disbursalConfig: DisbursalConfig;
  foir: string;
  netWorth: number;
  revenue: number;
  income: number;
  incomeBand: string;
  imputedIncome: number;
  activeLoans: number;
  debt: number;
  emi: number;
  workingCapital: number;
  employeeCount: number;
  verifiedIncome: number;
  salaryVerifiedBy: string;
  bmDecile: string;
  fiStatus: string;
  fcuStatus: string;
  segment: number;
  priceBand: string;
  ltRiskDecile: number;
  partnerRiskScore: number;
};
export type DisbursalConfig = {
  disbursalNeeded: boolean;
  loanCreationBeforeDisbursal: boolean;
};

export type Address = {
  id: number;
  type: string;
  line1: string;
  line2: string;
  city: string;
  state: string;
  country: string;
  pinCode: string;
  ownership: string;
  priority: number;
};

export type BankAccount = {
  id: number;
  type: string;
  holderName: string;
  accountNumber: string;
  bankName: string;
  branch: string;
  ifscCode: string;
  purpose: string;
};

export type Individual = {
  id: number;
  firstName: string;
  middleName: string;
  lastName: string;
  salutation: string;
  accessLevel: string;
  education: string;
  maritalStatus: string;
  gender: string;
  cibil: string;
  dob: Date;
  fatherName: string;
  fullName: string;
  caste: string;
  religion: string;
  nationality: string;
  birthCountry: string;
  parentCountry: string;
  riskCountry: string;
  defaultCurrency: string;
  branch: string;
  language: string;
  aliasName: string;
  dependents: string;
  isStaff: string;
  staffId: string;
  employmentType: string;
  sector: string;
  subSector: string;
  industry: string;
  category: string;
  type: string;
  dsaCode: string;
  dsaDepartment: string;
  applicationNo: string;
  coreBankId: string;
  customerGroup: number;
  customerStatus: string;
  sourcingOfficer: number;
  isStlCustomer: string;
  segment: string;
  subSegment: string;
  target: string;
  motherName: string;
  spouseName: string;
  employer: string;
  partyType: string;
  partyRelation: string;
  relatedToDirector: string;
  shareHolding: string;
  empCategory: string;
  designation: string;
  totalWorkEx: string;
  sectorOfWork: string;
  natureOfWork: string;
};

export type Business = {
  id: number;
  name: string;
  type: string;
  parent: string;
  registrationDate: string;
  operationDate: string;
  industryType: string;
  cibil: number;
  crisilRating: string;
  whetherReConstituted: boolean;
  previousConstitution: string;
  newConstitution: string;
  industrySubType: string;
  cmr: number;
  category: string;
  cin: string;
  cgtmse: string;
  uan: string;
  msmeType: string;
  businessName: string;
  shareHolding: number;
  lei: string;
};

export type Kyc = {
  id: number;
  kycType: string;
  kycValue: string;
  firstName: string;
  middleName: string;
  lastName: string;
  issueDate: string;
  issuingAuthority: string;
  fatherName: string;
  motherName: string;
  spouseName: string;
  dob: string;
  expiryDate: string;
  referenceNo: string;
  nationality: string;
  gender: string;
  passportType: string;
  issuedCountry: string;
  sourceType: string;
  reportStatus: string;
};
export type Contact = {
  id: number;
  type: string;
  value: string;
  notify: string;
  priority: number;
  typeCode: string;
  countryCode: string;
};

export type PartnerBureau = {
  id: number;
  bureauName: string;
  customerName: string[];
  pan: string;
  dob: Date[];
  score: number;
  lastPullDate: Date;
  enquiries: Enquiry[];
  dpd: Dpd[];
  currentOverdue: null;
  suitFiled: null;
  writtenOff: null;
  settled: null;
};
export type Enquiry = {
  noOfEnquiries: NoOfEnquiries;
};
export type NoOfEnquiries = {
  month1: string;
  greaterthan24Month: string;
  total: string;
  mostRecentDate?: string;
  month2to3: string;
  month4to6: string;
  month7to12: string;
  month12to24: string;
};
export type Dpd = {
  numberOfDpd: number;
  dpdType: number;
  timePeriod: number;
};

export type Nsdl = {
  name: string;
};

export type Disbursement = {
  id: number;
  disbParty: string;
  disbType: string;
  disbDate: string;
  disbAmount: string;
  partnerBankId: string;
  ifsc: string;
  accountNo: string;
  acHolderName: string;
  accType: string;
  phoneNumber: number;
  issueBank: string;
  favourName: string;
  payableLoc: string;
  printingLoc: string;
  chequeNo: string;
  valueDate: string;
};

export type TStatusReason = {
  id: 473;
  isActive: boolean;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
  reason: string;
  status: string;
  stage: string;
  reasonCodeName: string;
};

export type TStatusReasonResp = {
  id: number;
  IsActive: boolean;
  reason: string;
  status: string;
  stage: string;
  reasonCodeName: string;
};

export type TStatusOutput = {
  reasons: TStatusReasonResp[];
  status: string;
};

export type TLoanStatusUpdateResp = {
  id: string;
  status: string;
  comments: string;
};

export type TLoanStatusUpdateReq = {
  status: string;
  reasonIds?: number[];
  subStage?: string;
  reasonCodeName?: string;
  fcuStatus?: string;
  comments?: string;
};

export type TPreviousLoan = {
  loans: TLoanDetails[];
  allowableExposure: number;
  approveRepeatLoan: string;
};

export type TLoanDetails = {
  appFormId: string;
  loanProductCode: string;
  loanAmount: string;
};

export type TAppFormBasic = {
  id: string;
  partnerLoanId: string;
  loanProduct: string;
  appFormStatus: string | null;
  status: string | null;
  stage: string | null;
};
export type TAppFormEditData = {
  editData: Record<string, string | number | boolean | null | Date>;
  resourcePath: string;
};

export type TAppFormEditRequest = {
  editRequests: TAppFormEditData[];
};

export type TEditableResource = {
  editData: Record<string, never>;
  originalData: Record<string, never>; // Map<String, Object> equivalent
  resourcePath: string; // Map<String, Object> equivalent
};

export type TAppFormChangeSet = {
  appFormId: string;
  oldDataS3Url: string;
  newDataS3Url: string;
  createdBy: string;
  updatedBy: string;
  createdAt: string;
  updatedAt: string;
  stage: string;
  changeSets: TEditableResource[];
};

export type TAppFormStageStatus = {
  appFormId: string;
  status: string;
  stage: string;
  onHoldReason?: string;
};
export type AadhaarData = {
  country: string;
  loc: string;
  subdist: string;
  vtc: string;
  gender: 'M' | 'F' | 'T';
  verified: string;
  dist: string;
  house: string;
  referenceId: string;
  pc: string;
  careof: string;
  street: string;
  dob: string;
  name: string;
  state: string;
  landmark: string;
  Pht: string;
  aadhaarLastFourDigits: string;
  po: string;
};
