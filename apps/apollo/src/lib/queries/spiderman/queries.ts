import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { getDisbursementList, getDisbursementListCreditLine, getResonForReject, putResonForReject, putUtrPayment } from './service';
import { getDisbursalListCreditLineKey, getDisbursalListKey, getResonForRejectKey, getResonForRejectListKey, paymentUtrKey } from '../queryKeys';
import { NewUtrSuccessPayload, rejectedStatusPayload } from '@/components/disbursement/DisbursementCommonType';
import { TProductCodesShortened } from '../groot/queryResponseTypes';

export function useDisbursalList(
  status: string,
  pageNo?: string,
  productType?: TProductCodesShortened[],
  groupDateFrom?: string,
  groupDateTo?: string,
  groupId?: string,
): UseQueryResult<any, Error> {
  return useQuery<any>({
    queryKey: getDisbursalListKey(status, pageNo, productType, groupDateFrom, groupDateTo, groupId),
    queryFn: () => getDisbursementList(status, pageNo, productType, groupDateFrom, groupDateTo, groupId),
  });
}

export function useDisbursalListCreditLine(
  status: string,
  pageNo?: string,
  productType?: string,
  groupDateFrom?: string,
  groupDateTo?: string,
  groupId?: string,
): UseQueryResult<any, Error> {
  return useQuery<any>({
    queryKey: getDisbursalListCreditLineKey(status, pageNo, productType, groupDateFrom, groupDateTo, groupId),
    queryFn: () => getDisbursementListCreditLine(status, pageNo, productType, groupDateFrom, groupDateTo, groupId),
  });
}
export function useRejectReasonList(): UseQueryResult<any, Error> {
  return useQuery<any>({
    queryKey: getResonForRejectListKey(),
    queryFn: () => getResonForReject(),
  });
}

export function useRejectReason(
  rejectLoanData: rejectedStatusPayload
): UseQueryResult<any, Error> {
  return useQuery<any>({
    queryKey: getResonForRejectKey(rejectLoanData),
    queryFn: () => putResonForReject(rejectLoanData),
  });
}
export function usePaymentStatus(
  dataToBeSent: NewUtrSuccessPayload
): UseQueryResult<any, Error> {
  return useQuery<any>({
    queryKey: paymentUtrKey(dataToBeSent),
    queryFn: () => putUtrPayment(dataToBeSent),
  });
}
