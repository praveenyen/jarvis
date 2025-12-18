'use client';

import React, { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import authHelper, { Token } from '@/auth/ClientAuthHelper';
import { useAtom } from 'jotai/index';
import { isAuthenticated, user } from '@/store/atoms';
import { User } from '@/lib/models/User';
import { userRoles } from '@/store/atoms/user';
import { UseQueryResult } from '@tanstack/react-query';
import { RoleResponse } from '@/lib/queries/heimdall/queryResponseTypes';
import { useUserRole } from '@/lib/queries/heimdall/queries';
import styles from './ClientAuth.module.css';


export default function ClientAuthHydrater({
  children,
}: {
  children: React.ReactNode;
}): React.ReactNode {
  const [userData, setUserDetails] = useAtom(user);
  const [auth, setIsAuthenticated] = useAtom(isAuthenticated);
  const [roles, setRoles] = useAtom(userRoles);
  const pathname = usePathname();


  const userRolesResult: UseQueryResult<RoleResponse> = useUserRole(
    userData?.sub!,
    {
      enabled: !!userData,
    },
  );

  useEffect(() => {
    if (userRolesResult.isSuccess && userRolesResult.data) {
      const roles = userRolesResult.data.user.roles.map((role) => role.role);
      setRoles(roles);
    }
  }, [userRolesResult.isSuccess, userRolesResult.data]);

  async function hydrateUserDetails(): Promise<void> {
    const token: Token = await authHelper.getToken();
    const user: User = authHelper.parseJwtToken(token.idToken);
    setIsAuthenticated(true);
    setUserDetails(user);
  }
  /*TODO every path name will set a trigger */
  useEffect(() => {
    if (pathname === '/login') {
      return;
    }
    hydrateUserDetails();
  }, [pathname]);

  if (pathname === '/login') {
    return <>{children}</>;
  }
  if (!auth || userRolesResult.isLoading) {
    return <div className={styles.loaderContainer}>
      <div className={styles.loader}></div>
      <p className={styles.loaderText}>
        Please wait... Authenticating user
      </p>
    </div>
  }
  if (!roles) {
    return <div className={styles.loaderContainer}>
      <div className={styles.loader}></div>
      <p className={styles.loaderText}>
        Please wait... getting user roles
      </p>
    </div>

  }

  /*TODO give proper mesage*/
  if (userRolesResult.isError) {
    return <div>Error loading roles. Please try again later.</div>;
  }

  return <>{children}</>;
}
