import {
  useQuery,
  UseQueryOptions,
  UseQueryResult,
} from '@tanstack/react-query';
import { getAllUsers, getUserRole } from '@/lib/queries/heimdall/services';
import { getAllUsersQkey, getUserRoleQKey } from '@/lib/queries/queryKeys';
import {
  RoleResponse,
  UsersResponse,
} from '@/lib/queries/heimdall/queryResponseTypes';

export function useAllUsers(): UseQueryResult<UsersResponse, Error> {
  return useQuery<UsersResponse>({
    queryKey: getAllUsersQkey(),
    queryFn: () => getAllUsers(),
  });
}

export function useUserRole(
  userId: string,
  options?: Omit<UseQueryOptions<RoleResponse, Error>, 'queryKey' | 'queryFn'>,
): UseQueryResult<RoleResponse, Error> {
  return useQuery<RoleResponse>({
    queryKey: getUserRoleQKey(),
    queryFn: () => getUserRole(userId),

    ...options,
  });
}
