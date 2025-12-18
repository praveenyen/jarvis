import { TAppformData } from '@/lib/queries/shield/queryResponseTypes';
import { TComponentStatus } from '@/lib/queries/hulk/queryResponseTypes';

const isUBLApp = (appFormData: TAppformData) => {
  return (
    appFormData &&
    (appFormData?.loanProduct === 'UBL' || appFormData?.loanProduct === 'FCL')
  );
};

const isFCLApplication = (appFormData: TAppformData) =>
  appFormData.loanProduct === 'FCL';

const isUBLApplication = (appFormData: TAppformData) =>
  appFormData.flowType === 'SME';

export const showUanData = (
  appFormData: TAppformData,
  verificationComp: TComponentStatus,
) => {
  return (
    !(
      isUBLApp(appFormData) &&
      appFormData.linkedBusiness.business != null &&
      appFormData.linkedBusiness.business.msmeType === 'Non-MSME'
    ) &&
    (isUBLApplication(appFormData) || isFCLApplication(appFormData)) &&
    verificationComp !== null &&
    verificationComp.uan !== null
  );
};
