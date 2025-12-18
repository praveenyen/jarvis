import { AppForm } from '@/components/appForm/AppForm';
import AppFormView from '@/components/appForm/AppFormView';
import LoadingSkeleton from '@/components/common/LoadingSkeleton';
import { Suspense } from 'react';

export default async function AppFormPage({
  params,
  searchParams,
}: {
  params: Promise<{ appformid: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const appFormId = (await params).appformid;
  return (
    <Suspense fallback={<LoadingSkeleton />}>
      <AppFormView></AppFormView>
    </Suspense>
  );
}
