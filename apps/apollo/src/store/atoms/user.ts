import { atom } from 'jotai';
import { User } from '@/lib/models/User';
import { UsersResponse } from '@/lib/queries/heimdall/queryResponseTypes';

export const user = atom<null | User>(null);
export const userRoles = atom<null | string[]>(null);
export const isAuthenticated = atom<Boolean>(false);
export const allUsers = atom<UsersResponse|null>(null);
