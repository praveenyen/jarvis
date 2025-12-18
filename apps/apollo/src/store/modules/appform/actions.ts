import { useAppFormDataGet } from '@/lib/queries/shield/queries';
export const fetchAppFormData = async (
  set: Function,
  appFormID: string,
  headers?: Record<string, string>,
) => {
  const {
    data: appFormData,
    isLoading: isAppformGetLoading,
    isSuccess: isAppformGetSuccess,
    status: appFormGetStatus,
  } = useAppFormDataGet(appFormID, headers);

  try {
    if (isAppformGetSuccess) set(appFormData);
    else throw new Error();
  } catch (error) {
    console.error('Error fetching appform details:', error);
    throw error;
  }
};
