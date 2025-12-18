'use client';

import { useCallback } from 'react';
import {
  useQueries,
  UseQueryOptions,
  UseQueryResult,
} from '@tanstack/react-query';

export const useQueriesWithRefetch = (queries: UseQueryOptions[]) => {
  const results = useQueries<UseQueryResult[]>({ queries });

  const refetchAll = useCallback(() => {
    results.forEach((result) => result.refetch());
  }, [results]);

  return {
    results,
    queries,
    refetchAll,
  };
};
