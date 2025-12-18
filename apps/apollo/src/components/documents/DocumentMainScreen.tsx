'use client';

import {
  Box,
  Button,
  Card,
  Center,
  Grid,
  Group,
  LoadingOverlay,
  Modal,
  Select,
  Text,
  Stack,
} from '@mantine/core';
import ChecklistDocumentList from '@/components/documents/checkList/ChecklistDocumentList';
import DocumentUploadItem from '@/components/documents/documentList/documentUploadItem';
import UntaggedFilesMainComponent from '@/components/documents/untaggedFiles/untaggedFilesMain';
import { DragDropContext } from '@hello-pangea/dnd';
import { useEffect, useState } from 'react';
import { useAtomValue } from 'jotai';
import { appFormRawData } from '@/store/atoms';

import {
  useAddTagToSectionOptionItem,
  useAppformDocList,
} from '@/lib/queries/drStrange/queries';
import { modals } from '@mantine/modals';
import {
  AadhaarData,
  ApplicantResp,
  CoApplicant,
  LinkedIndividual,
  TAppformData,
} from '@/lib/queries/shield/queryResponseTypes';
import { getAppFormApplicantList, useAppFormData } from '@/store/modules/appform';
import {
  attachFileToSection,
  deleteFileToSection,
  getAadahrXmlData,
  getPreSignedUrl,
  getUrlS3,
  setCompeleteDms,
  uploadDocDetails,
} from '@/lib/queries/drStrange/service';
import { ParamsType } from '@/lib/queries/drStrange/queryResponseTypes';
import { generateAadhaarData, getContentType } from '@/lib/rules/documentRules';
import {
  DropResult,
  UploadFilePreSignDetails,
  PreSignedUrlResp,
  DocumentDetails,
  LinkedEntity,
  UploadResponse,
  DocsSection,
  AllowedDocType,
  DocumentMoveRequest,
  Document,
  FileUplaodDetails,
  TaggedUnTaggedData,
  AddSectionProperty,
  SectionProperty,
  DocumentSection,
} from '@/components/documents/DocumentScreenType';
import React from 'react';
import { useDisclosure } from '@mantine/hooks';
import { DeleteDocModel } from '@/components/documents/models/DeleteDocModel';
import { AddSectionUploadModal } from '@/components/documents/models/AddSectionUploadModal';
import { UntagCategory } from '@/components/documents/models/UntagCategory';
import { AddCategoryToSection } from '@/components/documents/models/AddCategoryToSection';
import HttpClientException from '@/lib/exceptions/HttpClientException';
import { useNotification } from '@/lib/context/notifications/useNotifications';
import { XmlJsonModal } from './models/XmlJsonModal';
import CustomIcon from '../icons/CustomIcons';
import ViewActivityModal from './models/ViewActivityModal';
import { useQueryClient } from '@tanstack/react-query';
import { getAppFormDataQKey, getDiscrepancyStatusQKey } from '@/lib/queries/queryKeys';
import { parse } from 'path';

export default function DocumentMainScreen() {
  const appformData: TAppformData | null = useAtomValue(appFormRawData);
  const applicantList: any | null = useAtomValue(getAppFormApplicantList);

  const { notify } = useNotification();

  const [filesWithUploadDetails, setFilesWithUploadDetails] =
    useState<FileUplaodDetails>({
      uploadDetails: null,
      files: [],
      entityId: null,
      dropFiles: null,
      uploadSectionDetails: null,
      callMode: null,
    });

  //loader
  const [visibleLoader, { open: showLoader, close: hideLoader }] =
    useDisclosure(false);

  const [fileUploadDetails, setFileUploadDetails] = useState<
    UploadFilePreSignDetails[]
  >([]);

  const [tagListForSection, setTagListForSection] = useState<
    AddSectionProperty[]
  >([]);

  const cancelUploadDetails = () => {
    setFilesWithUploadDetails(resetFilesWithUploadDetails());
    modals.closeAll();
  };
  const queryClient = useQueryClient();

  const resetFilesWithUploadDetails = () => {
    return {
      uploadDetails: null,
      files: [],
      entityId: null,
      dropFiles: null,
      uploadSectionDetails: null,
      callMode: null,
    };
  };

  const appFormDocList = useAppformDocList(
    appformData?.id ? appformData?.id : '',
    appformData?.loanProduct ? appformData?.loanProduct : '',
  );

  const addTagSection = useAddTagToSectionOptionItem(
    appformData?.loanProduct ? appformData?.loanProduct : '',
  );


  const file_UploadToS3 = async (
    file: File,
    uploadSection: UploadResponse | null,
    entityId: string | null,
  ) => {
    showLoader();
    const fileName: string = file.name;
    let exe = fileName.slice(fileName.lastIndexOf('.') + 1);
    const contentType = getContentType(exe) || 'multipart/form-data';
    try {
      const preSignedURL: PreSignedUrlResp | undefined =
        await getPreSignedUrlFromService(file, appformData?.id || '');

      if (!preSignedURL) {
        console.error('Failed to get pre-signed URL');
        return;
      }

      const filePreSignDetails: UploadFilePreSignDetails = {
        filePreSignedUrl: preSignedURL.presignedUrl,
        fileUrls: preSignedURL.objectUrl,
        file: file,
        contentType: contentType,
        uploadSection: uploadSection,
        entityId: entityId ?? null,
      };
      setFileUploadDetails((prevFileDetails: UploadFilePreSignDetails[]) => [
        ...prevFileDetails,
        filePreSignDetails,
      ]);
    } catch (error) {
      notify({ message: 'Error in generating presign url', type: 'error' });
    }
  };

  const fileUploadToS3 = async () => {
    if (fileUploadDetails.length > 0) {
      try {
        const uploadPromises = fileUploadDetails.map((fileItem) =>
          fetch(fileItem.filePreSignedUrl, {
            method: 'PUT',
            headers: {
              'Content-Type': fileItem.contentType,
            },
            body: fileItem.file,
          })
            .then((response) => {
              if (!response.ok) {
                throw new Error(
                  `Error uploading file ${fileItem.file.name}: ${response.statusText}`,
                );
              }
              return response;
            })
            .catch((error) => {
              console.error(
                `Upload failed for file ${fileItem.file.name}:`,
                error,
              );
            }),
        );
        // Wait for all uploads to complete in parallel
        await Promise.all(uploadPromises);
        postDocuments();
      } catch (error) {
        notify({ message: 'File not uploaded successfully', type: 'error' });
      }
    }
  };

  const [tagUntagList, settagUntagList] = useState<TaggedUnTaggedData>({
    coApplicants: [],
    beneficialOwners: [],
    linkedBusiness: null,
    authorizedSignatories: [],
    linkedIndividuals: [],
    appForm: [],
    untaggedList: [],
  });

  useEffect(() => {
    if (fileUploadDetails) {
      fileUploadToS3();
    }

    if (appFormDocList.data) {
      const data = appFormDocList.data;

      const apiDetails = {
        untaggedList: data.untagged || [],
        coApplicants: data.coApplicants || [],
        linkedBusiness: data.linkedBusiness || {},
        linkedIndividuals: data.linkedIndividual || [],
        authorizedSignatories: data.authorizedSignatories || [],
        beneficialOwners: data.beneficialOwners || [],
        appForm: data.appForm || [],
        dmsComplete: data.dmsComplete || false,
        checklistStatus: data.checklistStatus || false,
      };

      settagUntagList(apiDetails);
    }

    if (addTagSection.data) {
      const addTagToSection = addTagSection.data;
      setTagListForSection(addTagToSection);
    }
  }, [appFormDocList.data, fileUploadDetails, addTagSection.data]);

  const postDocuments = async () => {
    let fileUrls: { fileUrls: string; entityId: number | null }[] =
      fileUploadDetails.map((file: UploadFilePreSignDetails) => {
        if (file.entityId) {
          return { fileUrls: file.fileUrls, entityId: parseInt(file.entityId) };
        }
        return { fileUrls: file.fileUrls, entityId: null };
      });

    const docSection: UploadResponse | undefined = fileUploadDetails[0]
      .uploadSection
      ? fileUploadDetails[0].uploadSection
      : undefined;

    try {
      const documentRequestBody = {
        s3Urls: [fileUrls[0].fileUrls],
        applicantId: fileUrls[0].entityId ?? null,
        docTypeId: docSection?.docTypeId,
        sectionId: docSection?.sectionId,
        osvStatus: docSection?.osvStatus,
      };

      const response = await uploadDocDetails(
        appformData?.id || '',
        docSection
          ? documentRequestBody
          : {
              s3Urls: [fileUrls[0].fileUrls],
              applicantId: null,
              docTypeId: null,
              sectionId: null,
              osvStatus: null,
            },
      );

      if (
        response.ResponseMessage &&
        Object.keys(response.ResponseMessage).length > 0
      ) {
        const messageString = Object.entries(response.ResponseMessage)
          .map(([url, message]) => `${url}: ${message}`)
          .join(', ');
        notify({ message: messageString, type: 'error' });
      }
      notify({ message: 'File uploaded successfully', type: 'success' });

      setFileUploadDetails((previousData) => [...[]]);
      hideLoader();
      await refetchLoader();
    } catch (error: unknown) {
      if (error instanceof HttpClientException) {
        const errorMessage: any = error.getErrorResp();
        notify({ message: errorMessage['message'], type: 'error' });
      }

      await refetchLoader();
    }
  };

  const getPreSignedUrlFromService = async (
    file: File,
    appformId: string,
  ): Promise<PreSignedUrlResp | undefined> => {
    const params: ParamsType = {
      method: 'PUT',
      objectKey: `${appformId}/${file.name}`,
    };
    try {
      const preSignedURL: PreSignedUrlResp = await getPreSignedUrl(params);
      return preSignedURL;
    } catch (error) {
      notify({ message: 'error in generating s3 preSignURL', type: 'error' });
    }
  };

  const addSectionToLinkedSection = (sectionProperty: DocumentSection) => {
    const localTagUnTagList = { ...tagUntagList };
    const allowDocType = sectionProperty.sectionProperty.allowedDocTypes;
    const addSectionDetails: DocsSection = {
      section: sectionProperty.name,
      sectionId: sectionProperty.id,
      checklist: false,
      osvStatus: false,
      isActive: allowDocType.length == 1 ? allowDocType[0].isActive : null,
      sectionConfigId: allowDocType.length == 1 ? allowDocType[0].id : null,
      count: 0,
      sectionProperty: sectionProperty.sectionProperty,
      docs: [],
    };

    localTagUnTagList.appForm.push(addSectionDetails);

    settagUntagList(localTagUnTagList);
  };

  //document for ckyc checklist
  const getDocumentRecord = () => {
    if (!appFormDocList.isFetched || appFormDocList.isError) {
      return [];
    }
    return appFormDocList.data;
  };

  const approvedDocumentSection = async () => {
    modals.closeAll();
    showLoader();
    if (appformData?.id && appformData?.loanProduct) {
      try {
        const resp = await setCompeleteDms(
          appformData?.id,
          appformData?.loanProduct,
        );
        notify({
          message: 'Documents KYC Check has been approved! ',
          type: 'success',
        });
        await refetchLoader();
        let refetchAppformCounter = 0
        const refetchAppform = setInterval(() => {
          if(appformData.appFormStatus != "12" && refetchAppformCounter < 3){
            refetchAppformCounter += 1
          queryClient.invalidateQueries({
            queryKey: getAppFormDataQKey(appformData?.id),
          });
        }
        else clearInterval(refetchAppform) 
        },3000)
      } catch (error: unknown) {
        if (error instanceof HttpClientException) {
          const errorMessage: any = error.getErrorResp();
          notify({ message: errorMessage['message'], type: 'error' });
        }

        await refetchLoader();
      }
    }
  };

  const deleteDocElement = async (
    doc: Document,
    idPath: string,
    openType: string,
  ) => {
    if (doc.filename.includes('copy')) {
      const targetids: string[] = idPath.split(' ');

      const section = targetids[0];
      const entityId = targetids[1];
      const sectionId = targetids[2];
      const docIndex = parseInt(targetids[3]);

      if (section == 'linkedIndividuals') {
        const localTagList: LinkedEntity[] = tagUntagList.linkedIndividuals;
        if (Array.isArray(localTagList)) {
          localTagList.map((item: LinkedEntity) => {
            if (entityId == item.entityId.toString()) {
              item.docsSections.map((docSec: DocsSection) => {
                if (docSec.sectionId == sectionId) {
                  docSec.docs.splice(docIndex, 1);
                }
              });
            }
          });
        }
        const taggedListLocal = { ...tagUntagList };
        taggedListLocal.linkedIndividuals = localTagList;
        settagUntagList(taggedListLocal);
      }
      if (section == 'linkedBusiness') {
        const localTagList: LinkedEntity | null = tagUntagList.linkedBusiness;
        if (localTagList == null) return;
        localTagList.docsSections.map((docSec: DocsSection) => {
          if (docSec.sectionId == sectionId) {
            docSec.docs.splice(docIndex, 1);
          }
        });

        const taggedListLocal = { ...tagUntagList };
        taggedListLocal.linkedBusiness = localTagList;
        settagUntagList(taggedListLocal);
      }
      if (section == 'appForm') {
        const localTagList: DocsSection[] = tagUntagList.appForm;
        if (localTagList == null) return;

        localTagList.map((docSec: DocsSection) => {
          if (docSec.sectionId == sectionId) {
            docSec.docs.splice(docIndex, 1);
          }
        });

        const taggedListLocal = { ...tagUntagList };
        taggedListLocal.appForm = localTagList;
        settagUntagList(taggedListLocal);
      }
    } else {
      if (openType == 'modal') {
        modals.open({
          children: (
            <DeleteDocModel
              doc={doc}
              idPath={idPath}
              deleteDocElement={deleteDocElement}
              cancelUploadDetails={cancelUploadDetails}
            />
          ),
          withCloseButton: false,
          yOffset: '200px',
        });
      }

      if (openType == 'delete') {
        modals.closeAll();
        showLoader();
        if (appformData) {
          try {
            const deleteRespo = deleteFileToSection(
              appformData.id,
              doc.id.toString(),
            );
            notify({ message: (await deleteRespo).message, type: 'success' });

            await refetchLoader();
          } catch (error: unknown) {
            console.error('Caught error:', error);
            if (error instanceof HttpClientException) {
              const errorMessage: any = error.getErrorResp();
              notify({ message: errorMessage['message'], type: 'error' });
            }
            await refetchLoader();
          }
        }
      }
    }
  };

  const getSection = (sectionPathId: string): DocsSection | null => {
    const ids: string[] = sectionPathId.split(' ');
    if (ids.length < 3) return null;
    const sectionType: string = ids[0];
    const entityId: string = ids[1];
    const sectionId: string = ids[2];

    if (sectionType === 'appForm') {
      return (
        tagUntagList.appForm.find((doc) => doc.sectionId === sectionId) ?? null
      );
    }

    if (sectionType === 'linkedBusiness') {
      const linkedEntity: LinkedEntity | null = tagUntagList.linkedBusiness;
      if (!linkedEntity) return null;
      return filterSectionItem(sectionId, linkedEntity);
    }

    const multiEntitySections = [
      'linkedIndividuals',
      'coApplicants',
      'beneficialOwners',
      'authorizedSignatories',
    ];

    if (multiEntitySections.includes(sectionType as keyof TaggedUnTaggedData)) {
      const entityList: LinkedEntity[] = tagUntagList[
        sectionType as keyof TaggedUnTaggedData
      ] as LinkedEntity[];
      const linkedEntity = entityList?.find(
        (item) => item.entityId === entityId,
      );
      if (!linkedEntity) return null;
      return filterSectionItem(sectionId, linkedEntity);
    }

    return null;
  };

  const filterSectionItem = (sectionId: string, lnkdIdl: LinkedEntity) => {
    const lnkDocSecItem: DocsSection | undefined = lnkdIdl?.docsSections.find(
      (docItem: DocsSection) => {
        return docItem.sectionId == sectionId;
      },
    );

    if (lnkDocSecItem == undefined) return null;
    return lnkDocSecItem;
  };

  const getValues = (droppableId: string): Document | null => {
    const ids: string[] = droppableId.split(' ');
    if (ids.length < 3 && ids[0] !== 'untagged') return null;
    const sectionType: string = ids[0];
    const entityId: string = ids[1];
    const sectionId: string = ids[2];
    const index: number = parseInt(ids[3]);
    const elementIndex: number = parseInt(ids[4]);

    if (sectionType == 'linkedIndividuals') {
      const linkedIndividuals = tagUntagList.linkedIndividuals;
      for (let individual of linkedIndividuals) {
        if (individual.entityId == entityId) {
          for (let docs of individual.docsSections) {
            if (docs.sectionId == sectionId) {
              return docs.docs[elementIndex];
            }
          }
        }
      }
    }

    if (sectionType == 'linkedBusiness') {
      const linkedBusiness = tagUntagList.linkedBusiness;
      if (linkedBusiness?.docsSections == undefined) return null;
      for (let docsSection of linkedBusiness?.docsSections) {
        if (docsSection.sectionId == sectionId) {
          return docsSection.docs[elementIndex];
        }
      }
    }

    if (sectionType == 'untagged') {
      const untaggedList = tagUntagList.untaggedList;
      if (untaggedList.length == 0) return null;
      for (let docDetails of untaggedList) {
        if (docDetails.id == parseInt(entityId)) {
          return docDetails;
        }
      }
    }
    if (sectionType == 'appForm') {
      const untaggedList = tagUntagList.appForm;

      if (untaggedList.length == 0) return null;
      const filterAppformData: DocsSection|undefined = untaggedList.find((docDetails:DocsSection) => docDetails.sectionId == entityId);
      if (filterAppformData !== undefined) {
        return filterAppformData.docs[parseInt(ids[3])];
      }
    }

    return null;
  };

  const unTagFile = (sourceEntityId:string,sourceSectionId:string, fileID:number)=>{
    const updateSectionOnEdit: DocumentMoveRequest = {
      docTypeId: null,
      entityId: null,
      entityTypeId: null,
      osvStatus: null,
      destinationSectionId: null,
      sourceSectionId: sourceSectionId ?? null,
    };

    modals.closeAll();
    updateEditSection(fileID, updateSectionOnEdit)
  }

  const closeUnTagModal = () => {
    modals.closeAll();
  };


  const onDragEnd = (result: DropResult) => {
    const { source, destination, draggableId } = result;
    if (destination == undefined)
      return notify({
        message: 'please select a valid destination',
        type: 'error',
      });
    if (destination.droppableId == source.droppableId)
      return notify({
        message: "source and destination can't be same",
        type: 'error',
      });

    const sourceIds: string[] = source.droppableId.split(' ');
    const destinationIds: string[] = destination?.droppableId.split(' ');

    if (destination.droppableId == 'untaggedList'){
      const sourceData: Document | null = getValues(draggableId);
      const sourceEntityId: string = sourceIds[1];
      const sourceSectionId: string = sourceIds[2];
      if (sourceData == null) {
        notify({ message: 'source not found', type: 'error' });
        return
      }

      modals.open({
        children: (
          <UntagCategory
            sourceData={sourceData}
            sourceEntityId = {sourceEntityId}
            sourceSectionId = {sourceSectionId}
            unTagFile={unTagFile}
            closeUnTagModal={closeUnTagModal}
          />
        ),
        withCloseButton: true,
        yOffset: '200px',
        size: 'md',
        styles: {
        },
      });
      return
    }
    if (source.droppableId !== 'untaggedList') {
      if (sourceIds[1] !== destinationIds[1])
        return notify({ message: 'not same entity', type: 'error' });
    }
    const sourceSectionType: string = sourceIds[0];
    const sourceEntityId: string = sourceIds[1];
    const sourceSectionId: string = sourceIds[2];

    const sourceData: Document | null = getValues(draggableId);
    if (destination?.droppableId) {
      const destinationSection: DocsSection | null = getSection(
        destination.droppableId,
      );

      if (destinationSection == null || sourceData == null) return;
      const editSectionDetails: FileUplaodDetails = {
        uploadDetails: destinationSection,
        entityId: destinationIds[1],
        dropFiles: [sourceData],
        sourceSectionId: sourceSectionId,
        callMode: 'move',
      };
      modals.open({
        children: (
          <AddSectionUploadModal
            filesWithUploadDetails={editSectionDetails}
            uploadDocToSec={uploadDocToSec}
            cancelUploadDetails={cancelUploadDetails}
          />
        ),
        withCloseButton: false,
        yOffset: '200px',
        size: '1000',
        styles: {
          content: {
            height: '55vh',
            maxHeight: '65vh',
            overflowY: 'auto',
          },
        },
      });
    }
    if (!destination || source.droppableId == destination.droppableId) return;
  };

  const openAadharXmlModal = async (doc: Document) => {
    if (appformData == null) return;
    const aadahrXmlData = generateAadhaarData(appformData, doc);
    showLoader();
    try {
      const resp: AadhaarData = await getAadahrXmlData(aadahrXmlData);
      hideLoader();
      if (resp !== null) {
        modals.open({
          children: <XmlJsonModal xmlData={resp} />,
          withCloseButton: false,
          size: 'xl',
          styles: {
            content: {
              padding: '16px',
              maxHeight: '90vh'
            },
          },
        });
      }
    } catch (error: unknown) {
      if (error instanceof HttpClientException) {
        const errorMessage: any = error.getErrorResp();
        notify({ message: errorMessage['message'], type: 'error' });
      }
      hideLoader();
      return;
    }
  };

  const openFileNewTab = async (docS3Url: string) => {
    if (appformData == null) return;
    showLoader();
    try {
      const url_resp = await getUrlS3(docS3Url);
      window.open(url_resp, '_blank');
      hideLoader();
    } catch (error: unknown) {
      if (error instanceof HttpClientException) {
        const errorMessage: any = error.getErrorResp();
        notify({ message: errorMessage['message'], type: 'error' });
      }
      hideLoader();
    }
  };

  const filesUploaded = (
    newFiles: File | null,
    doc: DocsSection | null,
    entityId: string | undefined,
    isBusiness: boolean,
  ) => {
    if (doc == null) return;
    if (newFiles) {
      const uploadDetails: UploadResponse = {
        applicantId: entityId ? parseInt(entityId) : undefined,
        sectionId: doc.sectionId,
      };
      const localFileUploadDetails = filesWithUploadDetails;

      localFileUploadDetails.callMode = 'upload';
      localFileUploadDetails.files = [newFiles];
      localFileUploadDetails.uploadDetails = doc;
      localFileUploadDetails.entityId = entityId ?? null;
      localFileUploadDetails.uploadSectionDetails = uploadDetails;

      modals.open({
        children: (
          <AddSectionUploadModal
            filesWithUploadDetails={localFileUploadDetails}
            uploadDocToSec={uploadDocToSec}
            cancelUploadDetails={cancelUploadDetails}
          />
        ),
        withCloseButton: false,
        yOffset: '200px',
      });
    }
  };

  const updateEditSection = async (
    fileId: number | null,
    updateSectionOnEdit: DocumentMoveRequest,
  ) => {
    if (!appformData?.id) {
      console.error('AppForm ID is missing!');
      return;
    }

    if (!fileId) {
      console.error('File ID is missing!');
      return;
    }
    try {
      const copied = await attachFileToSection(
        appformData?.id,
        fileId,
        updateSectionOnEdit,
      );

      if (updateSectionOnEdit.destinationSectionId == null && updateSectionOnEdit.docTypeId == null){
        notify({ message: 'File has been untagged', type: 'success' });

      } else {
        notify({ message: 'File has been tagged', type: 'success' });
      }

      await refetchLoader();
    } catch (error: unknown) {
      if (error instanceof HttpClientException) {
        const errorMessage: any = error.getErrorResp();
        notify({ message: errorMessage['message'], type: 'error' });
      }
      await refetchLoader();
    }
  };

  const refetchLoader = async () => {
    showLoader();
    try {
      await appFormDocList.refetch();
    } finally {
      hideLoader();
    }
  };

  const uploadDocToSec = (sectionUpdate: FileUplaodDetails) => {
    modals.closeAll();

    if (
      sectionUpdate.callMode == 'edit' &&
      sectionUpdate.uploadSectionDetails
    ) {
      const updateSection: UploadResponse = sectionUpdate.uploadSectionDetails;
      const entityTypeid: number | null =
        sectionUpdate.uploadDetails?.sectionProperty.entityType.id ?? null;
      const updateSectionOnEdit: DocumentMoveRequest = {
        docTypeId: updateSection.docTypeId ?? null,
        entityId:
          sectionUpdate.entityId == 'appForm' ? null : sectionUpdate.entityId,
        entityTypeId: entityTypeid,
        osvStatus: updateSection.osvStatus ?? null,
        destinationSectionId: updateSection.sectionId ?? null,
        sourceSectionId: updateSection.sectionId ?? null,
      };

      const fileId: number | null =
        sectionUpdate.uploadDetails?.docs[0].id ?? null;
      updateEditSection(fileId, updateSectionOnEdit);
    }

    if (
      sectionUpdate.callMode == 'move' &&
      sectionUpdate.uploadSectionDetails
    ) {
      const updateSection: UploadResponse = sectionUpdate.uploadSectionDetails;
      const entityTypeid: number | null =
        sectionUpdate.uploadDetails?.sectionProperty?.entityType?.id ?? null;
      const updateSectionOnEdit: DocumentMoveRequest = {
        docTypeId: updateSection.docTypeId ?? null,
        entityId: sectionUpdate.entityId,
        entityTypeId: entityTypeid ?? null,
        osvStatus: updateSection.osvStatus ?? null,
        destinationSectionId: sectionUpdate.uploadDetails?.sectionId ?? null,
        sourceSectionId: updateSection.sectionId ?? null,
      };

      const file: Document | null = sectionUpdate.dropFiles?.[0] ?? null;
      if (file?.filename.includes('copy')) {
        updateSectionOnEdit.sourceSectionId = null;
      }
      const fileId: number | null = file?.id ?? null;
      showLoader();
      updateEditSection(fileId, updateSectionOnEdit);
    }

    if (
      sectionUpdate.callMode == 'upload' &&
      sectionUpdate.uploadSectionDetails &&
      sectionUpdate.files
    ) {
      file_UploadToS3(
        sectionUpdate.files[0],
        sectionUpdate.uploadSectionDetails,
        sectionUpdate.entityId,
      );
    }
  };

  const editDetails = (sectionPathId: string) => {
    const ids: string[] = sectionPathId.split(' ');
    if (ids.length < 4) return null;
    const sectionType: string = ids[0];
    const entityId: string = ids[1];
    const sectionId: string = ids[2];
    const DestinationSection: DocsSection | null = getSection(sectionPathId);

    if (DestinationSection == null) return null;
    const editSectionDetails: FileUplaodDetails = {
      uploadDetails: DestinationSection,
      entityId: entityId,
      dropFiles: DestinationSection.docs,
      callMode: 'edit',
    };

    modals.open({
      children: (
        <AddSectionUploadModal
          filesWithUploadDetails={editSectionDetails}
          uploadDocToSec={uploadDocToSec}
          cancelUploadDetails={cancelUploadDetails}
        />
      ),
      withCloseButton: false,
      yOffset: '200px',
    });
  };

  const viewActivity = ()=>{
    modals.open({
      children: (
        <ViewActivityModal
        />
      ),
      size: '100vw',
      yOffset: '100px',
    });
  }

  const addTagDetails = (
    linkType: string,
    index: number,
    linkedSection: LinkedEntity | null,
    appFormDetails?: DocsSection[] | null,
  ) => {
    if (linkedSection == null && linkType !== 'appForm') return;

    modals.open({
      children: (
        <AddCategoryToSection
          addSectionToCategory={tagListForSection}
          linkedType={linkType}
          appFormDetails={appFormDetails}
          addSectionToLinkedSection={addSectionToLinkedSection}
        />
      ),
      yOffset: '200px',
    });
  };

  return (
    <Box style={{ position: 'relative', minHeight: '100vh' }}>
      <Box>
        <LoadingOverlay
          visible={visibleLoader}
          zIndex={1000}
          overlayProps={{ radius: 'sm', blur: 2 }}
          loaderProps={{ color: 'pink', type: 'bars' }}
          style={{ position: 'fixed', inset: 0 }}
        />
        {appFormDocList.data && (
          <Grid
            justify="left"
            gutter={{ base: 5, xs: 'md', md: 'xl', xl: 50 }}
            p="md"
          >
            <Grid.Col span={2}>
              <ChecklistDocumentList
                documentData={getDocumentRecord()}
                appformData={appformData}
                appFormDocList={appFormDocList.data}
                applicantList={applicantList}
                approveDoc={approvedDocumentSection}
                file_UploadToS3={file_UploadToS3}
              />
            </Grid.Col>
            <Grid.Col span={10}>
             
              <Grid
                justify="space-between"
                align="flex-start"
                gutter={{ base: 5, xs: 'md', md: 'xl', xl: 50 }}
                m="m"
                p="md"
              >
                
                <DragDropContext onDragEnd={onDragEnd}>
                  <Grid.Col span={7}>
                    <Box className="text-right">
                      <Group gap={4} justify="end" align="center" style={{ display: 'inline-flex' }}>
                        <Text
                          className="font-stretch-extra-condensed font-semibold hover:underline cursor-pointer text-blue-600"
                          onClick={() => viewActivity()}
                          style={{ display: 'inline-flex', alignItems: 'center' }}
                        >
                          View Activity
                        </Text>
                        <CustomIcon
                          src={'MaterialIcon'}
                          name={'MdOutlineTimer'}
                          color="blue-600"
                          className='cursor-pointer text-blue-600'
                          size="20px"
                          style={{ cursor: 'pointer' }}
                        />
                      </Group>
                    </Box>

                    <DocumentUploadItem
                      taggedList={tagUntagList}
                      filesUploaded={filesUploaded}
                      deleteDocElement={deleteDocElement}
                      openAadharXmlModal={openAadharXmlModal}
                      openFileNewTab={openFileNewTab}
                      setTaggedList={(newList) =>
                        settagUntagList((prev: TaggedUnTaggedData) => ({
                          ...prev,
                          taggedList: newList,
                        }))
                      }
                      editDetails={editDetails}
                      addTagDetails={addTagDetails}
                    />
                  </Grid.Col>
                  <Grid.Col
                    span={4}
                    style={{
                      position: 'sticky',
                      top: '175px',
                      backgroundColor: '#f3f4f6',
                      padding: '1rem',
                      borderRadius: '12px',
                      boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
                    }}
                  >
                    <Box>
                      <UntaggedFilesMainComponent
                        openFileNewTab={openFileNewTab}
                        untaggedList={tagUntagList['untaggedList']}
                        deleteDocElement={deleteDocElement}
                        appFormDocList={appFormDocList.data}
                      />
                    </Box>
                  </Grid.Col>
                </DragDropContext>
              </Grid>
            </Grid.Col>
          </Grid>
        )}

        {appFormDocList.isError && (
          <Center h={100} pt={200}>
            <Card shadow="sm" padding="xl" radius="md" withBorder>
              <Stack align="center">
                <Text>Error: Request failed with {appFormDocList.status}.</Text>
                <Button
                  variant="filled"
                  color="blue"
                  onClick={() => refetchLoader()}
                >
                  Reload
                </Button>
              </Stack>
            </Card>
          </Center>
        )}
      </Box>
    </Box>
  );
}
