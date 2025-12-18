import { useQuery, UseQueryResult } from '@tanstack/react-query';
import {
  getAllDesignations,
  getAllUsersDSA,
  getBranchHierarchy,
  getPartnerCodes,
  getSpecifiedUsers,
} from '@/lib/queries/hera/services';
import {
  getAllDesignationsQkey,
  getAllUsersDSAQkey,
  getBranchHierarchyQkey,
  getPartnerCodesQkey,
  getSpecifiedUsersQkey,
} from '@/lib/queries/queryKeys';
import {
  AllDesignationsResponse,
  BranchHierarchyResponse,
  PartnerCodesResponse,
  SpecifiedUsersResponse,
} from '@/lib/queries/hera/queryResponseTypes';
import { UsersResponse } from '@/lib/queries/heimdall/queryResponseTypes';

export function usePartnerCodes(): UseQueryResult<PartnerCodesResponse, Error> {
  return useQuery<PartnerCodesResponse>({
    queryKey: getPartnerCodesQkey(),
    queryFn: () => getPartnerCodes(),
  });
}

export function useBranchHierarchy(): UseQueryResult<
  BranchHierarchyResponse,
  Error
> {
  return useQuery<BranchHierarchyResponse>({
    queryKey: getBranchHierarchyQkey(),
    queryFn: () => getBranchHierarchy(),
  });
}

export function useSpecifiedUsers(
  typeOfManager: string,
): UseQueryResult<SpecifiedUsersResponse, Error> {
  return useQuery<SpecifiedUsersResponse>({
    queryKey: getSpecifiedUsersQkey(typeOfManager),
    queryFn: () => getSpecifiedUsers(typeOfManager),
  });
}
export function useAllUsersDSA(): UseQueryResult<UsersResponse, Error> {
  return useQuery<UsersResponse>({
    queryKey: getAllUsersDSAQkey(),
    queryFn: () => getAllUsersDSA(),
  });
}

export function useAllDesignations(): UseQueryResult<
  AllDesignationsResponse,
  Error
> {
  return useQuery<AllDesignationsResponse>({
    queryKey: getAllDesignationsQkey(),
    queryFn: () => getAllDesignations(),
  });
}
