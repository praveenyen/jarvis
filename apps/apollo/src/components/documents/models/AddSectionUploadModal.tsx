import {
  Box,
  Button,
  Group,
  Select,
  Center,
  Grid,
  Text,
  Stack,
} from '@mantine/core';
import {
  Document,
  AllowedDocType,
  FileUplaodDetails,
  UploadResponse,
} from '@/components/documents/DocumentScreenType';
import { useEffect, useState } from 'react';
import { useAtomValue } from 'jotai';
import { getAppFormApplicantList } from '@/store/modules/appform';
import { AppAvatar } from '@/components/common/AppAvatar';
import iconColors from '@/components/icons/iconColors';

type Props = {
  filesWithUploadDetails: FileUplaodDetails;
  uploadDocToSec: (sectionUpdate: FileUplaodDetails) => void;
  cancelUploadDetails: () => void;
};

export function AddSectionUploadModal({
  filesWithUploadDetails,
  uploadDocToSec,
  cancelUploadDetails,
}: Props) {
  const [selectedSectionOvsType, setSelectedSectionOvsType] = useState<{
    docTypeId: number | null;
    osvStatus: boolean | null;
  }>({ docTypeId: null, osvStatus: null });

  const applicantList: any | null = useAtomValue(getAppFormApplicantList);

  const saveDocSectionOvs = () => {
    let localFilesWithUploadDetails: FileUplaodDetails = {
      ...filesWithUploadDetails,
    };

    if (
      allowed(localFilesWithUploadDetails?.callMode) &&
      localFilesWithUploadDetails.uploadDetails
    ) {
      const updateSection: UploadResponse = {
        sectionId: getSectionId(localFilesWithUploadDetails),
        docTypeId: selectedSectionOvsType.docTypeId,
        osvStatus: selectedSectionOvsType.osvStatus,
      };
      localFilesWithUploadDetails.uploadSectionDetails = updateSection;
      uploadDocToSec(localFilesWithUploadDetails);
    }
  };
  const allowed = (callMode: string | null | undefined) => {
    if (callMode == 'edit') return true;
    if (callMode == 'move') return true;
    if (callMode == 'upload') return true;
    return false;
  };

  const getSectionId = (localFilesWithUploadDetails: FileUplaodDetails) => {
    if (localFilesWithUploadDetails.callMode == 'edit')
      return localFilesWithUploadDetails?.uploadDetails?.sectionId;
    if (localFilesWithUploadDetails.callMode == 'move')
      return localFilesWithUploadDetails.sourceSectionId;
    if (localFilesWithUploadDetails.callMode == 'upload')
      return localFilesWithUploadDetails?.uploadDetails?.sectionId;
    return null;
  };

  const getAllowedDataType = (allowedData: AllowedDocType[]) => {
    return allowedData.map((docType) => ({
      label: docType.name,
      value: docType.id.toString(),
      id: docType.id,
    }));
  };

  const typeSelectChange = (selectedItem: string | null, type: string) => {
    if (type === 'type') {
      setSelectedSectionOvsType((prev) => ({
        ...prev,
        docTypeId: selectedItem ? parseInt(selectedItem) : null,
      }));
    }

    if (type === 'ovs') {
      setSelectedSectionOvsType((prev) => ({
        ...prev,
        osvStatus:
          selectedItem === 'OK'
            ? true
            : selectedItem === 'Not Ok'
              ? false
              : null,
      }));
    }
  };

  const allowedDocTypes =
    filesWithUploadDetails.uploadDetails?.sectionProperty?.allowedDocTypes ??
    [];

  useEffect(() => {
    const allowedData = getAllowedDataType(allowedDocTypes);
    if (allowedData.length > 0) {
      const firstItem = allowedData[0];
      setSelectedSectionOvsType((prev) => ({
        ...prev,
        docTypeId: parseInt(firstItem.value),
      }));
      typeSelectChange(firstItem.value, 'type');
    }
  }, [allowedDocTypes]);

  return (
    <>
      <Box>
        <Grid>
          <Grid.Col span={6}>
            <b>
              {filesWithUploadDetails.entityId == 'appForm'
                ? 'Others'
                : applicantList?.map((item: any, index: number) =>
                    item.id == filesWithUploadDetails.entityId ? (
                      <Group key={index} ml={20}>
                        <AppAvatar
                          size="md"
                          radius="sm"
                          name=""
                          color={iconColors[0]}
                          key={item.id}
                        >
                          {item.iconText}
                        </AppAvatar>
                        <Stack gap={3}>
                          <Text size="sm" fw={700}>
                            {item.name}
                          </Text>
                          <Text size="xs">{item.type}</Text>
                        </Stack>
                      </Group>
                    ) : null,
                  )}
            </b>
          </Grid.Col>
          <Grid.Col span={6}>*Required fields</Grid.Col>
        </Grid>

        <br />
        {filesWithUploadDetails.files?.[0]?.name}
        <br />
        {filesWithUploadDetails?.dropFiles?.[0].filename}
        {allowed(filesWithUploadDetails.callMode) && (
          <Group justify="center" gap="xl" pb={20} grow>
            <Select
              label="TYPE*"
              placeholder="Select one"
              data={getAllowedDataType(allowedDocTypes)}
              clearable
              value={selectedSectionOvsType.docTypeId?.toString() || null}
              onChange={(item) => {
                typeSelectChange(item, 'type');
              }}
            />
            <Select
              label="OSV STATUS"
              placeholder="Select one"
              data={['OK', 'Not Ok']}
              clearable
              onChange={(item) => {
                typeSelectChange(item, 'ovs');
              }}
            />
          </Group>
        )}

        <Group justify="center">
          <Button
            variant="filled"
            disabled={selectedSectionOvsType?.docTypeId === null}
            onClick={() => saveDocSectionOvs()}
          >
            Save
          </Button>
          <Button
            variant="filled"
            color="red"
            onClick={() => cancelUploadDetails()}
          >
            Cancel
          </Button>
        </Group>
      </Box>
    </>
  );
}
