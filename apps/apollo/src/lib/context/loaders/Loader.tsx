'use client';

import { useLoader } from './useLoader';
import { LoadingOverlay } from '@mantine/core';

export default function Loader() {
  const { isLoading, loaderProps } = useLoader();

  return <LoadingOverlay visible={isLoading} loaderProps={loaderProps} />;
}
