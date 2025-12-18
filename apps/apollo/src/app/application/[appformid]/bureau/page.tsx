import BureauView from '@/components/bureau/BureauView';
import LoadingSkeleton from '@/components/common/LoadingSkeleton';
import { Suspense } from 'react';

export default async function BureauPage({
  params,
  searchParams,
}: {
  params: Promise<{ appformid: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const appFormId = (await params).appformid;
  const lpc = ((await searchParams)['lpc'] as string) || '';

  return (
    <Suspense fallback={<LoadingSkeleton />}>
      <BureauView appFormId={appFormId} lpc={lpc}></BureauView>
    </Suspense>
  );
}
