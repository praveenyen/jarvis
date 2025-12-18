import { useAtom } from 'jotai';
import { appFormRawData } from '@/store/atoms';
import { fetchAppFormData } from './actions';

export const useAppFormData = (
  appFormId: string,
  headers?: Record<string, string>,
) => {
  const [appFormData, setappFormData] = useAtom(appFormRawData);

  const fetchAppFormDataFunc = async () => {
    await fetchAppFormData(setappFormData, appFormId, headers);
  };

  return { appFormData, fetchAppFormDataFunc };
};
