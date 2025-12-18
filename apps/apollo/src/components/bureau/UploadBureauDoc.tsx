import {
  Box,
  Button,
  Card,
  Center,
  FileButton,
  Group,
  Stack,
  Text,
} from '@mantine/core';
import { useMemo, useState } from 'react';
import CustomIcon from '../icons/CustomIcons';
import { PreSignedUrlResp } from '../documents/DocumentScreenType';
import { ParamsType } from '@/lib/queries/drStrange/queryResponseTypes';
import { getPreSignedUrl } from '@/lib/queries/drStrange/service';
import { useNotification } from '@/lib/context/notifications/useNotifications';
import { getContentType } from '@/lib/rules/documentRules';
import { Bureau, BureauCreditReport } from './bureauType';
import {
  getPresignedBureauReport,
  uploadBureauDoc,
} from '@/lib/queries/bureauEngine/services';
import { useAtomValue } from 'jotai';
import {
  appFormRawData,
  getAppFormApplicantList,
} from '@/store/modules/appform';
import { TCreditResponse } from '@/lib/queries/bureauEngine/queryResponseTypes';
import { TBureauOptionsItem } from './BureauSelectDropdown';
import { useQueryClient } from '@tanstack/react-query';
import { getAppFormDataQKey, getCreditReportFileQKey } from '@/lib/queries/queryKeys';
import {
  COULD_NOT_RETRIEVE,
  NO_REPORT_FOUND,
  UNEXPECTED_REPORT_DOWNLOAD_ERROR,
  UPLOAD_FAILED,
} from '@/components/bureau/util/errorMessages';
import { useLoader } from '@/lib/context/loaders/useLoader';
import CustomChip from '../common/CustomChip';
import { formatDateObjToDDMMYYYY } from '@/lib/utils/utils';

type Props = {
  appFormId: string;
  applicantId: string;
  bureau: TBureauOptionsItem['value'] | undefined;
  bureauFiles: TCreditResponse | null | undefined;
  appFormStage: string | undefined;
  appStatus: string | undefined;
};

export default function UploadBureauDoc(props: Props) {
  const {
    appFormId,
    applicantId,
    bureau,
    bureauFiles,
    appFormStage,
    appStatus,
  } = props;

  const appFormData = useAtomValue(appFormRawData);
  const queryClient = useQueryClient();

  const [file, setFile] = useState<File | null>(null);
  const { notify } = useNotification();
  const { start, stop } = useLoader();

  const fileUploadToUntag = (file: File | null) => {
    if (file) {
      file_UploadToS3(file);
    }
  };

  const isUploadEnabled = useMemo(
    () => appFormStage === 'creditstage' && appStatus === 'CREDIT_IN_PROGRESS',
    [appFormStage],
  );

  const fileUploadToS3 = async (
    appformId: string,
    applicantId: string,
    filePreSignedUrl: PreSignedUrlResp,
    contentType: string,
    uploadFile: File,
  ) => {
    if (uploadFile == null) {
      notify({ message: 'No file to upload.', type: 'error' });
      return;
    }
    start();
    try {
      const uploadPromise = fetch(filePreSignedUrl.presignedUrl, {
        method: 'PUT',
        headers: {
          'Content-Type': contentType,
        },
        body: uploadFile,
      }).then((response) => {
        if (!response.ok) {
          throw new Error(
            `Error uploading file ${uploadFile.name}: ${response.status} ${response.statusText}`,
          );
        }
        return response;
      });

      await uploadPromise;

      const bureauType: Bureau = {
        pullType: 'HardPull',
        vendor: bureau,
      };

      const params: ParamsType = {
        method: 'GET',
        objectKey: `${appformId}/${applicantId}/${uploadFile.name}`,
        bucket: 'organizedBucket',
      };

      const preSignedURLGET: PreSignedUrlResp = await getPreSignedUrl(params);

      const bureauCreditReport: BureauCreditReport = {
        bureau: bureauType,
        loanType: appFormData?.loanType ?? '',
        lpc: appFormData?.loanProduct ?? '',
        source: 'Apollo',
        responseS3Url: preSignedURLGET.presignedUrl,
      };

      await updateMethodDetails(appformId, applicantId, bureauCreditReport);
      queryClient.invalidateQueries({
        queryKey: getCreditReportFileQKey(appFormId, applicantId)
      });
      queryClient.invalidateQueries({
        queryKey: getAppFormDataQKey(appFormId)
      })
      notify({ message: 'File uploaded successfully', type: 'success' });
      setFile(null);
    } catch (error: any) {
      console.error(`Upload failed for file ${uploadFile.name}:`, error);
      notify({
        message: `File upload failed: ${error.message || 'Unknown error'}`,
        type: 'error',
      });
    } finally {
      stop();
    }
  };

  const updateMethodDetails = async (
    appformId: string,
    applicantId: string,
    bureauCreditReport: BureauCreditReport,
  ) => {
    try {
      await uploadBureauDoc(appformId, applicantId, bureauCreditReport);
    } catch (error: any) {
      throw UPLOAD_FAILED;
    }
  };

  const getPreSignedUrlFromService = async (
    file: File,
    appformId: string,
    applicantId: string,
    methodType: string,
  ): Promise<PreSignedUrlResp | undefined> => {
    const params: ParamsType = {
      method: methodType,
      objectKey: `${appformId}/${applicantId}/${file.name}`,
      bucket: 'organizedBucket',
    };
    try {
      const preSignedURL: PreSignedUrlResp = await getPreSignedUrl(params);
      return preSignedURL;
    } catch (error) {
      notify({ message: 'error in generating s3 preSignURL', type: 'error' });
    }
  };

  const file_UploadToS3 = async (file: File) => {
    const fileName: string = file.name;
    try {
      const preSignedURL: PreSignedUrlResp | undefined =
        await getPreSignedUrlFromService(file, appFormId, applicantId, 'PUT');

      if (!preSignedURL?.presignedUrl) {
        console.error('Failed to get pre-signed URL');
        return;
      }

      let exe = fileName.slice(fileName.lastIndexOf('.') + 1);
      const contentType = getContentType(exe) || 'multipart/form-data';

      await fileUploadToS3(
        appFormId,
        applicantId,
        preSignedURL,
        contentType,
        file,
      );
    } catch (error) {
      notify({ message: 'Error in generating presign url', type: 'error' });
    }
  };

  const handleDownload = async () => {
    try {
      if (!(bureauFiles?.reports && bureauFiles.reports.length > 0))
        throw new Error(NO_REPORT_FOUND);

      const reportId = bureauFiles?.reports?.find((r) => r.bureauName === bureau)
        ?.creditReports[0].id;

      if (!reportId) {
        throw new Error(NO_REPORT_FOUND);
      }
      const data = await getPresignedBureauReport(reportId);

      if (data?.fileUrl) {
        window.open(data.fileUrl, '_blank');
      } else {
        throw new Error(COULD_NOT_RETRIEVE);
      }
    } catch (error) {
      let errorMessage = UNEXPECTED_REPORT_DOWNLOAD_ERROR;

      if (error instanceof Error) {
        errorMessage = error.message;
      } else if (typeof error === 'string') {
        errorMessage = error;
      }

      notify({ message: errorMessage, type: 'error' });
    }
  };

  const getCreatedAt = useMemo(() => {
    const reportId = bureauFiles?.reports?.find(
      (r) => r.bureauName === bureau,
    )?.createdAt;
    return reportId || '';
  }, [bureauFiles]);

  const creditReports = useMemo(() => {
    if (bureauFiles?.reports && bureauFiles.reports.length > 0) {
      return bureauFiles.reports?.find((r) => r.bureauName === bureau)
        ?.creditReports;
    }
  }, [bureauFiles, bureau, applicantId]);

  return (
    <Box>
      <Center pt={120}>
        <Stack style={{ alignItems: 'center', justifyContent: 'center' }}>
          {creditReports?.length ? (
            <>
              {' '}
              <Group gap={2}>
                <CustomChip
                  customProps={{
                    color: 'brandGreen',
                    size: 'sm',
                    value: 'success',
                    variant: 'light',
                  }}
                ></CustomChip>
                <Text size="sm" fs="italic">
                  Normal Response
                </Text>
              </Group>
              <Stack
                className="items-center justify-items-center rounded-md border-2 border-dashed"
                p={20}
                w="500px"
                gap={10}
              >
                <Text>Your file has been uploaded</Text>
                <Group gap={5}>
                  <CustomIcon
                    size={'25px'}
                    src={'MaterialIcon'}
                    name={'MdOutlineArticle'}
                  ></CustomIcon>
                  <Text size="xs">Bureau Report</Text>
                </Group>
                <Button variant="transparent" onClick={handleDownload}>
                  Download
                </Button>
              </Stack>
              <Group gap={5} mt={10}>
                <Text size="xs">Created at: {getCreatedAt && formatDateObjToDDMMYYYY(getCreatedAt)}</Text>
              </Group>
            </>
          ) : isUploadEnabled ? (
            <FileButton
              onChange={fileUploadToUntag}
              accept=".xlsx,.xls,.xml,.pdf,.html"
            >
              {(props) => (
                <div
                  className="flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 p-10 shadow-md transition duration-300 hover:bg-gray-50"
                  {...props}
                >
                  <CustomIcon
                    src={'MaterialIcon'}
                    name={'MdOutlineCloudUpload'}
                    color="teal"
                    size="3rem"
                    style={{ cursor: 'none' }}
                  />
                  <p className="mb-2 text-sm text-gray-700">
                    Drag and drop your report here or{' '}
                    <span className="text-blue-500">browse</span>
                  </p>
                  <p className="text-xs uppercase text-gray-500">
                    xlsx, xls, xml, pdf
                  </p>
                </div>
              )}
            </FileButton>
          ) : (
            <Stack
              className="items-center justify-items-center rounded-md border-2 border-dashed"
              p={20}
              w="500px"
              gap={10}
            >
              <CustomIcon
                src="MaterialIcon"
                name="MdOutlinePendingActions"
                size={'50px'}
              />
              <Text size="sm">Report pull pending...</Text>
            </Stack>
          )}
        </Stack>
      </Center>
    </Box>
  );
}
