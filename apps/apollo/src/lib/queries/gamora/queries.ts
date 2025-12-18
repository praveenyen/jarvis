import { useQuery } from '@tanstack/react-query';
import {
  getDocumentUBL,
} from '@/lib/queries/queryKeys';
import {
  getDocUBLGamora,
} from '@/lib/queries/gamora/service';

export function useAppformDocList(
  roles: string,
  documentType: string,
  headers?: Record<string, string>,
) {
  return useQuery<any | Error>({
    queryKey: getDocumentUBL(roles, documentType),
    queryFn: () => getDocUBLGamora(roles, documentType, headers),
  });
}
