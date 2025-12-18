// import VerificationTab from '@/components/Verification/VerificationTab';
import VerificationTab from '@/components/verification/VerificationTab';

import LoadingSkeleton from '@/components/common/LoadingSkeleton';
import { Suspense } from 'react';
export default async function VerificationPage({
  params,
}: {
  params: Promise<{ appformid: string }>;
}) {
  return (
    <Suspense fallback={<LoadingSkeleton />}>
      <VerificationTab />
    </Suspense>
  );
}
