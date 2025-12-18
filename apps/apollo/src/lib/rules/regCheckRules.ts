import { smeDirectLpc } from '@/lib/utils/constants';
import { TAppformData } from '@/lib/queries/shield/queryResponseTypes';

export function enableManualApproval(
  appFormData: TAppformData,
  regCheckStatus: string,
): boolean {
  if (appFormData.appFormStatus === '-20') {
    return false;
  }
  if (
    (appFormData.flowType === 'SME' ||
      smeDirectLpc.includes(appFormData.loanProduct)) &&
    regCheckStatus === '-11'
  ) {
    return true;
  }
  return false;
}
