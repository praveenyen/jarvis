import { NewUtrSuccessPayload, rejectedStatusPayload } from '@/components/disbursement/DisbursementCommonType';
import { ParamsType } from '@/lib/queries/drStrange/queryResponseTypes';
import { TProductCodesShortened } from './groot/queryResponseTypes';
import { MnrlFriDiuReq } from './rogue/queryResponseTypes';

export const getAppFormListQkey = (filters: Record<string, string>) => [
  'getApppFormList',
  filters,
];
export const getLoanProductCodesQkey = () => ['getLoanProductCodes'];
export const getLoanProductConfigsQKey = () => ['getLoanProductConfigs'];
export const getDocumentList = () => ['getDoc'];

export const getAllUsersQkey = () => ['getAllUsers'];
export const getPartnerCodesQkey = () => ['getPartnerCodes'];
export const getBranchHierarchyQkey = () => ['getBranchHierarchy'];
export const getSpecifiedUsersQkey = (managerType: string) => [
  'getSpecifiedUsers',
  managerType,
];
export const getAllUsersDSAQkey = () => ['getAllUsersDSA'];
export const getAllDesignationsQkey = () => ['getAllDesignations'];
export const getUserRoleQKey = () => ['getUserRole'];
export const getAppFormQKey = (id: string) => ['getAppForm', id];
export const getRegCheckDetailedQKey = (id: string) => [
  'getRegCheckDetailed',
  id,
];

export const getAppFormDataQKey = (appFormId: string | undefined) => [
  'getAppFormRawData',
  appFormId,
];

export const getRiskCategoryQKey = (customerId: string) => [
  'getRiskCategory',
  customerId,
];

export const getVerificationDataQKey = (appFormId: string) => [
  'verificationData',
  appFormId,
];

export const getDedupeDataQKey = (appId: string) => ['getDedupeList', appId];

export const getPreviousLoanQKey = (applicantId: number) => [
  'previousLoans',
  applicantId,
];

export const getExposureResultQKey = (appId: string) => [
  'getExposureResult',
  appId,
];

export const getCalulateExposureQKey = (appId: string) => [
  'calculateExposure',
  appId,
];

export const postMnrlFriQKey = (mnrlFriReq: MnrlFriDiuReq | null) => [
  'mnrlreq',
  mnrlFriReq,
];

export const getAppFormHistoryQKey = (appFormId: string | undefined) => [
  'history',
  appFormId,
];

export const getCreditDatQKey = (
  appFormId: string,
  applicantId: string,
  bureauName: string | null,
) => ['creditData', appFormId, applicantId, bureauName];

export const getDisbursalListKey = (
  status: string,
  pageNo?: string,
  productType?: TProductCodesShortened[],
  groupDateFrom?: string,
  groupDateTo?: string,
  groupId?: string,
  lpcConfig?: boolean | null
) => ['disbursalList', status, pageNo, productType, groupDateFrom, groupDateTo, groupId, lpcConfig];

export const getDisbursalListCreditLineKey = (
  status: string,
  pageNo?: string,
  productType?: string,
  groupDateFrom?: string,
  groupDateTo?: string,
  groupId?: string,
  lpcConfig?: boolean | null
) => ['disbursalList', status, pageNo, productType, groupDateFrom, groupDateTo, groupId, lpcConfig];

export const getResonForRejectListKey = (
) => ['disbursalResonRejectList'];

export const getResonForRejectKey = (rejectReasonLoan: rejectedStatusPayload
) => ['disbursalResonReject'];
export const paymentUtrKey = (dataToBeSent: NewUtrSuccessPayload
) => ['disbursalResonReject', dataToBeSent];

export const getCreditReportFileQKey = (
  appFormId: string,
  applicantId: string,
) => ['creditReportFile', appFormId, applicantId];

export const getCreditReportQkey = (
  bureauPullId: string,
  bureauName: string,
  appFormId: string,
) => ['creditReport', bureauPullId, bureauName, appFormId];
export const getAppformDocumentQkey = (appformId: string, lpc: string) => [
  'appformDocList',
  appformId,
  lpc,
];
export const getPreSignedUrlQKey = (params: ParamsType) => [
  'preSignedUpload',
  params,
];

export const uploadDocQKey = (appformId: string, data: any) => [
  'uploadDocToService',
  appformId,
  data,
];

export const dragandDropDocQKey = (
  appformId: string,
  docId: number,
  data: any,
) => ['dragandDropDocService', appformId, docId, data];

export const addTagSectionItemQKey = (lpc: string) => [
  'addTagSectionLpcItem',
  lpc,
];

export const getPositiveConfirmationRecordQKey = (appFormId: string) => [
  'positiveConfirmationRecord',
  appFormId,
];

export const getRegCheckVersionQKey = (appFormId: string) => [
  'getRegCheckVersion',
  appFormId,
];

export const getDocumentUBL = (roles:string, documentType:string ) => [
  'getUBLDocuments',
  roles,
  documentType
]

export const getDiscrepancyDataQKey = (appformId: string ) => [
  'getDiscrepancyData',appformId
]

export const getDiscrepancyStatusQKey = (appformId: string ) => [
  'getDiscrepancyStatus',appformId
]

export const getNarrationsQKey = () => [
  'getNarrations'
]
