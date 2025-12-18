import {
  Box,
  Button,
  Divider,
  FileButton,
  SimpleGrid,
  Text,
  ThemeIcon,
  Title,
} from '@mantine/core';
import ChecklistItems from '@/components/documents/checkList/ChecklistItems';
import { TAppformData } from '@/lib/queries/shield/queryResponseTypes';
import CustomIcon from '@/components/icons/CustomIcons';
import { useState } from 'react';
import { UploadResponse } from '../DocumentScreenType';
import { enableApprove, QcApproveRole } from '@/lib/rules/documentRules';
import { useAtomValue } from 'jotai';
import { appFormRawData, userRoles } from '@/store/atoms';
import { modals } from '@mantine/modals';
import { ApproveDocumentsModal } from '../models/ApproveDocumentsModal';

type props = {
  documentData: any;
  appformData: TAppformData | null;
  appFormDocList: any;
  applicantList: any | null;
  approveDoc: () => void;
  file_UploadToS3: (
    file: File,
    uploadSection: UploadResponse | null,
    entityId: string | null,
  ) => Promise<void>;
  // deleteDocElement: (docId:number) => void;
};

export default function ChecklistDocumentList(props: props) {
  const roles = useAtomValue(userRoles);

  const {
    documentData,
    appformData,
    applicantList,
    approveDoc,
    file_UploadToS3,
    appFormDocList,
  } = props;

  const enableDisableUploadDropSection = () => {
    if (!appformData?.loanProduct) {
      return false;
    }
    if (
      !QcApproveRole(appformData.loanProduct, roles) &&
      appformData?.status == 'DEFERRAL_REVIEW_COMPLETED'
    ) {
      return true;
    } else {
      return false;
    }
  };
  // const appformData: TAppformData | null = useAtomValue(appFormRawData);

  const fileUploadToUntag = (file: File | null) => {
    if (file) {
      file_UploadToS3(file, null, null);
      // setFile(file);
    }
  };

  const generateCheckListItem = (allSectionsWithEntityId: any[]) => {
    let checkListItems: any[] = [];
    for (const item of allSectionsWithEntityId) {
      const checkListItem = {
        label:
          generateChecklistLabel(item.entityId) +
          item.section.sectionProperty.sectionType,
        passed: item.section.osvStatus,
      };
      checkListItems.push(checkListItem);
    }

    return checkListItems;
  };

  const generateChecklistLabel = (id: string) => {
    const firstName =
      applicantList.find((applicant: any) => applicant.id.toString() === id)
        ?.firstName || '';
    return firstName.length > 0 ? firstName + `'s ` : '';
  };

  const getCkycChekListData = () => {
    const allSectionsWithEntityId: {}[] = [];

    if (documentData == undefined || documentData.length == 0)
      return allSectionsWithEntityId;
    let applicantEntites: any[] = [...documentData['linkedIndividual']];
    documentData.linkedBusiness
      ? (applicantEntites = [
          ...applicantEntites,
          documentData['linkedBusiness'],
        ])
      : null;
    for (const entity of applicantEntites) {
      for (const section of entity.docsSections) {
        if (section.checklist) {
          allSectionsWithEntityId.push({ section, entityId: entity.entityId });
        }
      }
    }

    if (documentData.appForm && documentData.appForm.length >= 0) {
      for (const section of documentData.appForm) {
        if (section.checklist) {
          allSectionsWithEntityId.push({ section, entityId: null });
        }
      }
    }

    return generateCheckListItem(allSectionsWithEntityId).length > 0
      ? generateCheckListItem(allSectionsWithEntityId)
      : [];
  };

  const isRejected = () => {
    const status = appformData?.appFormStatus;
    if (!status) return false;
    const rejectedStatuses = ['-20'];
    return rejectedStatuses.indexOf(status) > -1;
  };

  const openModal = () => {
    modals.open({
      children: (
        <ApproveDocumentsModal
          appformData={appformData}
          approveDoc={approveDoc}
        />
      ),
      withCloseButton: false,
      yOffset: '200px',
    });
  };

  return (
    <Box
      style={{
        position: 'sticky',
        top: '120px',
      }}
    >
      <Title order={4}>KYC Checklist</Title>
      <ChecklistItems ckycDocList={getCkycChekListData()} />
      <Divider my="md" />
      <Box pt={5}>
        <SimpleGrid cols={1} spacing="sm">
          {!documentData.dmsComplete && !isRejected() && (
            <Button
              size="xs"
              disabled={enableApprove(
                appformData?.loanProduct,
                appformData?.stage,
                roles,
                documentData,
              )}
              onClick={openModal}
            >
              Approve
            </Button>
          )}
          {documentData.dmsComplete && !isRejected() && (
            <Button
              leftSection={
                <ThemeIcon color="white" size={16} radius="xl">
                  <CustomIcon
                    src={'MaterialIcon'}
                    name={'MdCheckCircle'}
                    color="green"
                    size="16px"
                    style={{ cursor: 'none' }}
                  />
                </ThemeIcon>
              }
              variant="light"
            >
              Approved
            </Button>
          )}
          {isRejected() && (
            <Button
              leftSection={
                <ThemeIcon color="white" size={16} radius="xl">
                  <CustomIcon
                    src={'MaterialIcon'}
                    name={'MdClose'}
                    color="red"
                    size="16px"
                    style={{ cursor: 'none' }}
                  />
                </ThemeIcon>
              }
              variant="light"
            >
              Rejected
            </Button>
          )}

          <FileButton onChange={fileUploadToUntag}>
            {(props) => (
              <Button
                size="xs"
                {...props}
                disabled={enableDisableUploadDropSection()}
              >
                Upload Document
              </Button>
            )}
          </FileButton>
        </SimpleGrid>
      </Box>
    </Box>
  );
}
