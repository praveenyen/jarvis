import Dedupe from '@/components/dedupe/Dedupe';
import { Suspense } from 'react';
import LoadingSkeleton from '@/components/common/LoadingSkeleton';

export default async function DedupePage({
  params,
  searchParams,
}: {
  params: Promise<{ appformid: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const appFormId = (await params).appformid;

  return (
    <Suspense fallback={<LoadingSkeleton />}>
      <Dedupe appFormId={appFormId}></Dedupe>
    </Suspense>
  );
}
