import { Role, RoleResponse } from '@/lib/queries/heimdall/queryResponseTypes';

export type User = {
  email: string;
  exp: number;
  name: string;
  sub: string;
};
