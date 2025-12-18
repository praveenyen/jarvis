import {
  Box,
  Button,
  Grid,
  LoadingOverlay,
  Select,
  SimpleGrid,
  Text,
} from '@mantine/core';
import {
  AddSectionProperty,
  DocsSection,
  DocumentSection,
  LinkedEntity,
  SectionProperty,
} from '@/components/documents/DocumentScreenType';
import { useAtomValue } from 'jotai';
import { getAppFormApplicantList } from '@/store/modules/appform';
import { getSectionDetails } from '@/lib/queries/drStrange/service';
import { useState } from 'react';
import { modals } from '@mantine/modals';
import { useDisclosure } from '@mantine/hooks';

type AddCategoryToSectionProps = {
  addSectionToCategory: AddSectionProperty[];
  linkedType: string;
  appFormDetails?: DocsSection[] | null | undefined;
  addSectionToLinkedSection: (sectionProperty: DocumentSection) => void;
};

export function AddCategoryToSection({
  addSectionToCategory,
  linkedType,
  appFormDetails,
  addSectionToLinkedSection,
}: AddCategoryToSectionProps) {
  const [selectedSectionId, setSelectedSectionId] = useState<string>('');

  const [visible, { open: showLoader, close: hideLoader }] =
    useDisclosure(false);

  const applicantList: any | null = useAtomValue(getAppFormApplicantList);

  const showAddTagToSectionList = () => {
    const addToSectionOptions: { id: number; value: string; label: string }[] =
      [];
    addSectionToCategory.forEach((sectionItem: AddSectionProperty) => {
      if (
        sectionItem.entityType.id === applicantTypeIndex(linkedType) &&
        !sectionItem.isChecklist &&
        !sectionItem.isAutoCreated &&
        (linkedType == 'appForm' ||
          sectionItem.customerType === null ||
          linkedType === sectionItem.customerType)
      ) {
        const canAddToSection: { id: number; value: string; label: string } = {
          id: sectionItem.id,
          value: sectionItem.id.toString(),
          label: sectionItem.sectionType.sectionType,
        };
        addToSectionOptions.push(canAddToSection);
      }
    });
    return addToSectionOptions;
  };

  const getDataForSection = async () => {
    if (selectedSectionId) {
      showLoader();
      const resp = await getSectionDetails(selectedSectionId);
      modals.closeAll();
      hideLoader();

      addSectionToLinkedSection(resp);
    }
  };

  const selectedSectionToAdd = async (selectedValue: string | null) => {
    if (selectedValue) {
      setSelectedSectionId(selectedValue);
    }
  };

  const applicantTypeIndex = (linkedType: string) => {
    if (linkedType == 'linkedIndividuals') return 1;
    if (linkedType == 'linkedBusiness') return 2;
    if (linkedType == 'appForm') {
      return 3;
    }
    return 2;
  };

  return (
    <>
      <Box>
        <LoadingOverlay
          visible={visible}
          zIndex={1000}
          overlayProps={{ radius: 'sm', blur: 2 }}
          loaderProps={{ color: 'pink', type: 'bars' }}
        />
        <SimpleGrid cols={1} spacing="xs" verticalSpacing="lg">
          <Box>
            <Select
              label="TAG CATEGORY"
              placeholder="Select One"
              data={showAddTagToSectionList()}
              onChange={(item) => {
                selectedSectionToAdd(item);
              }}
              clearable
            />
          </Box>
          <Box>
            <Grid justify="center" align="center">
              <Grid.Col span={3}>
                <Button variant="filled" onClick={() => getDataForSection()}>
                  Save
                </Button>
              </Grid.Col>
              <Grid.Col span={3}>
                <Button
                  variant="filled"
                  color="red"
                  onClick={() => {
                    modals.closeAll();
                  }}
                >
                  Cancel
                </Button>
              </Grid.Col>
            </Grid>
          </Box>
        </SimpleGrid>
      </Box>
    </>
  );
}
