'use client';
import { appFormRawData } from '@/store/modules/appform';
import { useAtomValue } from 'jotai';
import { AppForm } from './AppForm';
import { useLoader } from '@/lib/context/loaders/useLoader';
import { useEffect } from 'react';
import { BusinessAppForm } from './BusinessAppForm';
import { useAppFormHistory } from '@/lib/queries';
import { TAppFormChangeSet } from '@/lib/queries/shield/queryResponseTypes';

export const genderMap: Record<'M' | 'F' | 'T', string> = {
  M: 'Male',
  F: 'Female',
  T: 'Transgender',
};

export const messageRegex = /"message":"([^"]+)"/;

export default function AppFormView() {
  // Fetch the prefetched query
  const appFormData = useAtomValue(appFormRawData);

  const { data: appFormHistory } = useAppFormHistory(appFormData?.id || '');

  const { stop } = useLoader();
  useEffect(() => {
    stop();
  }, []);

  switch (appFormData?.loanProduct) {
    case 'PCL':
    case 'PCT':
    case 'AFB':
    case 'LKB':
      return (
        <BusinessAppForm
          appFormId={appFormData?.id}
          appFormHistory={appFormHistory as TAppFormChangeSet[]}
        />
      );
    default:
      return (
        <AppForm
          appFormId={appFormData?.id}
          appFormHistory={appFormHistory as TAppFormChangeSet[]}
        />
      );
  }
}
