import { TAppformData } from '@/lib/queries/shield/queryResponseTypes';
import {
  AadharXmlData,
  Document,
} from '@/components/documents/DocumentScreenType';
export const contentTypeList: Record<string, string> = {
  pdf: 'application/pdf',
  jpg: 'image/jpg',
  jpeg: 'image/jpeg',
  png: 'image/png',
  xml: 'application/xml',
  zip: 'application/zip',
  svg: 'image/svg+xml',
  gif: 'image/gif',
  json: 'application/json',
  txt: 'text/plain',
};

export const getContentType = (exe: string) => {
  return contentTypeList[exe];
};

const hasRole = (
  targetRole: string,
  currentRoles: string[] | null,
): boolean => {
  if (!currentRoles) return false; // null or undefined handling

  return currentRoles.includes(targetRole);
};

export const QcApproveRole = (
  loanProduct: string,
  roles: string[] | null,
): boolean => {
  const isLoanProductMatch =
    loanProduct === 'UBL' || loanProduct === 'SEP' || loanProduct === 'FCL';

  if (isLoanProductMatch) {
    return hasRole('qcApprove', roles) || hasRole('superadmin', roles);
  }

  return false;
};
export const isSMEApplication = (flowType: string) => {
  return flowType === 'SME';
};

export const isUBLApp = (loanProduct: string) => {
  return (
    loanProduct === 'UBL' || loanProduct === 'SEP' || loanProduct === 'FCL'
  );
};

export const isUPLApp = (loanProduct: string) => {
  return loanProduct === 'UPL';
};

export const isSBLApp = (loanProduct: string) => {
  return loanProduct === 'SBL' || loanProduct === 'SEP';
};

export const isSecuredLPC = (loanProduct: string) => {
  return (
    loanProduct == 'LAP' ||
    loanProduct == 'PLP' ||
    loanProduct == 'LPA' ||
    loanProduct == 'HLD'
  );
};

const isSEPApplication = (loanProduct: string) => loanProduct === 'SEP';
const isSBDApplication = (loanProduct: string) => loanProduct === 'SBD';

export const enableApprove = (
  loanProduct: string | undefined,
  stage: string | undefined,
  role: string[] | null,
  appformDoc: any,
): boolean => {
  if (!loanProduct || !role) return false;

  if (isSecuredLPC(loanProduct)) {
    return !(
      stage === 'disbursalRequestApproverStage' &&
      (hasRole('disbursalRequestApproverRole', role) ||
        hasRole('superadmin', role)) &&
      appformDoc.checklistStatus
    );
  }

  const needsQcApproval =
    loanProduct === 'UBL' ||
    loanProduct === 'FCL' ||
    loanProduct === 'SBL' ||
    loanProduct === 'SBD' ||
    loanProduct === 'SBA' ||
    isSEPApplication(loanProduct) ||
    isSBDApplication(loanProduct); // Assuming you also need this one

  if (needsQcApproval) {
    return !(
      appformDoc.checklistStatus &&
      (hasRole('qcApprove', role) ||
        hasRole('qcadmin', role) ||
        hasRole('superadmin', role)) &&
      stage === 'qcApproveStage'
    );
  }

  return !appformDoc.checklistStatus;
};

export const generateAadhaarData = (
  appformData: TAppformData,
  doc: Document,
) => {
  const aadhaarType = appformData?.linkedIndividuals[0].aadhaarXmlType;
  const dataToBeSent: AadharXmlData = {
    aadhaarUrl: doc.s3Url,
  };
  if (aadhaarType) {
    dataToBeSent.aadhaarType = aadhaarType;
  }
  if (appformData.loanProduct === 'CLP' && aadhaarType == 'digilocker') {
    dataToBeSent.verifySignature = false;
  }

  return dataToBeSent;
};
