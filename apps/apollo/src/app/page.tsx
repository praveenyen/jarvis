'use client';
import { Suspense } from 'react';
import WelcomeAppShell from '@/components/welcome/WelcomeAppShell';
import LoadingSkeleton from '@/components/common/LoadingSkeleton';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';

dayjs.extend(customParseFormat);

export default function LandingPage() {
  return (
    <Suspense fallback={<LoadingSkeleton />}>
      <WelcomeAppShell />
    </Suspense>
  );
}
