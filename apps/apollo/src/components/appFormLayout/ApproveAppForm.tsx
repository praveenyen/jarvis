import { useNotification } from '@/lib/context/notifications/useNotifications';
import { useAppFormStatusUpdate, useUpdateMcuStatus } from '@/lib/queries';
import { getAppFormDataQKey } from '@/lib/queries/queryKeys';
import { TAppformData } from '@/lib/queries/shield/queryResponseTypes';
import { Button, Flex, Modal, Stack, Text, Textarea } from '@mantine/core';
import { useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';

export const ApproveAppForm = ({
  approveDialogClose,
  approveDialogOpen,
  approveDialogVisible,
  appId,
  appFormStatus,
  appFormData,
  headers,
}: {
  approveDialogClose: () => void;
  approveDialogOpen: () => void;
  approveDialogVisible: boolean;
  appId: string;
  appFormStatus: string | null;
  appFormData: TAppformData | null;
  headers: Record<string, string>;
}) => {
  const showCommentsSection = () => appFormStatus === '10';
  const [commentData, setCommentData] = useState<string | undefined>();
  const { notify } = useNotification();
  const queryClient = useQueryClient();

  const successMsgFunc = (msg: string) => () => {
    approveDialogClose();
    queryClient.invalidateQueries({
      queryKey: getAppFormDataQKey(appFormData?.id),
    });
    notify({
      title: 'Updated',
      message: msg,
      type: 'success',
    });
  };

  const { mutate: updateMCUStage } = useUpdateMcuStatus((error: Error) => {
    approveDialogClose();
    notify({ title: 'Error', message: error.message, type: 'error' });
  }, successMsgFunc('Updated successfully'));

  const postApproveAppform = useAppFormStatusUpdate(
    (error: Error) => {
      approveDialogClose();
      notify({ title: 'Error', message: error.message, type: 'error' });
    },
    successMsgFunc(`App ID ${appFormData?.id} has been successfully completed`),
    headers,
  );

  const onApprovalClick = () => {
    if (
      appFormData?.status === 'MCU_IN_PROGRESS' &&
      appFormData?.flowType === 'EAGG'
    ) {
      updateMCUStage({
        appFormId: appFormData?.id,
        reqData: {
          appFormId: appFormData?.id,
          status: 'FCU_IN_PROGRESS',
          stage: 'fcu',
        },
      });
      return;
    }
    if (
      appFormData?.status === 'CREDIT_COMPLETE' &&
      appFormData?.flowType === 'EAGG'
    ) {
      updateMCUStage({
        appFormId: appFormData?.id,
        reqData: {
          appFormId: appFormData?.id,
          status: 'NEGOTIATION_COMPLETE',
          stage: 'creditstage',
        },
      });
      return;
    }
    const appFormId = appFormData?.id;
    const nextStatus =
      appFormId === '10' || appFormData?.stage === 'fcu' ? '11' : '15';

    postApproveAppform.mutate({
      appFormId: appFormData?.id || '',
      reqData: {
        subStage:
          nextStatus === '11'
            ? appFormData?.stage === 'fcu' || appFormData?.loan.mcuStatus !== 0
              ? 'creditstage'
              : 'qcstage'
            : 'qcstage',
        status: nextStatus,
        comments: commentData,
      },
    });
  };
  return (
    <Modal
      opened={approveDialogVisible}
      onClose={() => approveDialogClose()}
      title={
        <Text size="lg" c="brandBlue.4">
          Approve Application
        </Text>
      }
      styles={{
        root: {
          zIndex: 1001,
        },
        header: {
          display: 'flex',
          justifyContent: 'center',
        },
      }}
    >
      <Stack>
        <Text size="sm">
          Are you sure you want to approve this Application ID :{' '}
          <strong>{appId}</strong>?
        </Text>
        {showCommentsSection() && (
          <Textarea
            minRows={2}
            maxRows={4}
            value={commentData}
            onChange={(event) => setCommentData(event.currentTarget.value)}
            label={<Text size="sm"> COMMENT</Text>}
          />
        )}
        <Flex
          w="100%"
          justify={'center'}
          gap={10}
          align={'center'}
          direction={'row'}
        >
          <Button
            size="xs"
            variant="outline"
            color="brandBlue.4"
            onClick={() => approveDialogClose()}
          >
            Cancel
          </Button>
          <Button
            variant="filled"
            size="xs"
            color="primary"
            onClick={onApprovalClick}
          >
            Yes
          </Button>
        </Flex>
      </Stack>
    </Modal>
  );
};
