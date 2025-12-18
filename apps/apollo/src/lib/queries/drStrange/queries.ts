import { useQuery } from '@tanstack/react-query';
import {
  addTagSectionItemQKey,
  dragandDropDocQKey,
  getAppformDocumentQkey,
  getPreSignedUrlQKey,
  uploadDocQKey,
} from '@/lib/queries/queryKeys';
import {
  attachFileToSection,
  getAddSectionListItem,
  getDocAppForm,
  getPreSignedUrl,
  uploadDocDetails,
} from '@/lib/queries/drStrange/service';
import { ParamsType } from '@/lib/queries/drStrange/queryResponseTypes';

export function useAppformDocList(
  appformId: string,
  lpc: string,
  headers?: Record<string, string>,
) {
  return useQuery<any | Error>({
    queryKey: getAppformDocumentQkey(appformId, lpc),
    queryFn: () => getDocAppForm(appformId, lpc, headers),
  });
}

export function usePreSignedUrl(
  params: ParamsType,
  headers?: Record<string, string>,
) {
  return useQuery<any | Error>({
    queryKey: getPreSignedUrlQKey(params),
    queryFn: () => getPreSignedUrl(params, headers),
  });
}

export function useUploadDoc(
  appformId: string,
  data: any,
  headers?: Record<string, string>,
) {
  return useQuery<any | Error>({
    queryKey: uploadDocQKey(appformId, data),
    queryFn: () => uploadDocDetails(appformId, data, headers),
  });
}

export function useDragAndDropDoc(
  appformId: string,
  docId: number,
  data: any,
  headers?: Record<string, string>,
) {
  return useQuery<any | Error>({
    queryKey: dragandDropDocQKey(appformId, docId, data),
    queryFn: () => attachFileToSection(appformId, docId, data, headers),
  });
}

export function useAddTagToSectionOptionItem(
  lpc: string,
  headers?: Record<string, string>,
) {
  return useQuery<any | Error>({
    queryKey: addTagSectionItemQKey(lpc),
    queryFn: () => getAddSectionListItem(lpc, headers),
  });
}
