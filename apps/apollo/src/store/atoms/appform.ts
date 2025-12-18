import { atom } from 'jotai';
import {
  TAppformData,
  TStatusReason,
} from '@/lib/queries/shield/queryResponseTypes';

export const appFormRawData = atom<null | TAppformData>(null);
export const appformRejectReasons = atom<null | Record<
  string,
  TStatusReason[]
>>(null);
export const appformRelookReasons = atom<null | Record<
  string,
  TStatusReason[]
>>(null);
