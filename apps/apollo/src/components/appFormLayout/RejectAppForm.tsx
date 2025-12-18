import {
  TAppformData,
  TLoanStatusUpdateReq,
  TLoanStatusUpdateResp,
  TStatusReason,
  TStatusReasonResp,
} from '@/lib/queries/shield/queryResponseTypes';
import { useDisclosure } from '@mantine/hooks';
import { Button, Modal, Select } from '@mantine/core';
import { Radio, Stack, Text, Flex } from '@mantine/core';
import { Textarea } from '@mantine/core';
import { usePathname } from 'next/navigation';
import React, { useMemo, useEffect, useState, useCallback } from 'react';
import {
  TSaveLoan,
  TSaveLoanResult,
} from '@/lib/queries/asgard/queryResponseTypes';
import { getLoanDetails } from '@/lib/queries/asgard/services';
import {
  getAppFormStatus,
  getStatusReasons,
} from '@/lib/queries/shield/services';
import {
  appformRejectReasons,
  appformRelookReasons,
  userRoles,
} from '@/store/atoms';
import { useAtomValue, useSetAtom } from 'jotai';
import { useAppFormStatusUpdate } from '@/lib/queries';
import { useQueryClient } from '@tanstack/react-query';
import { getAppFormDataQKey } from '@/lib/queries/queryKeys';
import { useLoader } from '@/lib/context/loaders/useLoader';
import { useNotification } from '@/lib/context/notifications/useNotifications';
import { isUpl } from '@/lib/rules/commonRules';

export const RejectAppForm = ({
  appFormData,
  headers,
  children,
}: {
  appFormData: TAppformData | null;
  headers: Record<string, string>;
  children: React.ReactNode;
}) => {
  const [bookingFailedDetails, setBookingFailedDetails] =
    useState<TSaveLoanResult>();
  const [showBookingFailCase, setShowBookingFailCase] = useState<boolean>();
  const [freezeAppformOnStatuses] = useState<string[]>(['-20']);
  const [returnText, setReturnText] = useState<string>();
  const [rejectionReason, setRejectReason] =
    useState<TStatusReasonResp['reason']>();
  const [selectedReason, setSelectedReason] = useState<string | null>();
  const [stageSelect, setStageSelect] = useState<string>('');
  const [commentData, setCommentData] = useState<string | undefined>();
  const [
    filteredAppformRejectReasonsIdCode,
    setfilteredAppformRejectReasonsIdCode,
  ] = useState<TStatusReason[]>([]);

  const queryClient = useQueryClient();
  const pathname = usePathname();
  const [rejectDialogVisible, { open: dialogOpen, close: dialogClose }] =
    useDisclosure(false);

  const setAppFormRejectReasons = useSetAtom(appformRejectReasons);
  const setAppFormRelookReasons = useSetAtom(appformRelookReasons);
  const appFormRejectAllReasons = useAtomValue(appformRejectReasons);
  const roles = useAtomValue(userRoles);
  const { start, stop } = useLoader();
  const { notify } = useNotification();

  const onRejectSuccess = (data: TLoanStatusUpdateResp) => {
    closeDialogBox();
    notify({ message: 'Appform Rejected', type: 'success' });
    queryClient.invalidateQueries({
      queryKey: getAppFormDataQKey(appFormIDPath),
    });
    fetchRejectReason();
    stop();
  };

  const onRejectFail = (error: Error) => {
    closeDialogBox();
    stop();
    notify({ message: error.message, type: 'error' });
  };
  
  //mutation
  const postRejectAppForm = useAppFormStatusUpdate(
    onRejectFail,
    onRejectSuccess,
    headers,
  );

  const appFormIDPath = pathname.split('/').filter(Boolean)[1];
  const rolesForInProgressStage: Record<string, string[]> = {
    dsaStage: ['DSA'],
    camStage: ['CAM'],
    creditReviewStage: ['creditReview'],
    creditApproveStage: ['creditApprove'],
    termsStage: ['terms'],
    manualActivity: ['terms'],
    fcu: ['creditFcuRole'],
    qcReviewStage: ['qcReview', 'qcadmin'],
    qcApproveStage: ['qcApprove', 'qcadmin'],
    salesDeskStage: ['terms'],
    loginDeskStage: ['loginDesk'],
    sanctionLetterInitiationStage: ['sanctionLetterInitiationRole'],
    disbursalRequestMakerStage: ['disbursalRequestMakerRole'],
    disbursalRequestCheckerStage: ['disbursalRequestCheckerRole'],
    disbursalRequestApproverStage: ['disbursalRequestApproverRole'],
    disbursalRequestAuthorizerStage: ['disbursalAuthorizationRole'],
    sanctionApprovalStage: ['creditReview'],
  };

  const hasRole = (roleName: string) =>
    roles?.includes(roleName) || roles?.includes('superadmin');

  const hasStageRole = (requiredRoles: string[]) => {
    if (roles?.includes('superadmin')) return true;
    if (roles) {
      for (const role of roles) {
        if (requiredRoles.includes(role)) return true;
      }
      return false;
    }
    return false;
  };

  const showRejectButton = useMemo<boolean | null | undefined>(() => {
    if (appFormData?.flowType !== 'SME') {
      return (
        appFormRejectAllReasons != null &&
        appFormData &&
        freezeAppformOnStatuses.indexOf(appFormData.appFormStatus) === -1
      );
    }
    if (appFormData.stage === 'fulfilment') {
      return (
        Boolean(isUpl(appFormData?.loanProduct)) &&
        hasRole('terms') &&
        appFormData.appFormStatus !== '-20'
      );
    }
    if (appFormData.stage === 'salesDeskStage') {
      return (
        (hasRole('DSA') || hasRole('terms')) &&
        appFormData.appFormStatus !== '-20'
      );
    }

    if (hasStageRole(rolesForInProgressStage[appFormData?.stage])) {
      return (
        appFormRejectAllReasons != null &&
        appFormData &&
        freezeAppformOnStatuses.indexOf(appFormData.appFormStatus) === -1
      );
    } else {
      return false;
    }
  }, [appFormData, appFormRejectAllReasons]);

  const getAppformRejectReasons = (status: string) => {
    getStatusReasons(status).then((rejectReasons) => {
      console.log(rejectReasons, 'rejectReasons');
      if (status === '0') setAppFormRelookReasons(rejectReasons);
      else setAppFormRejectReasons(rejectReasons);
    });
  };

  const getBookedFailedReason = useCallback(() => {
    getLoanDetails(appFormData?.id).then((res) => {
      console.log(res);
      setBookingFailedDetails(res);
      if (res.createCustomerFailed) {
        setShowBookingFailCase(res.createCustomerFailed);
        res.createCustomerResult.forEach((data: TSaveLoan) => {
          setReturnText(
            returnText + '(' + data.applicantId + ')' + data.returnText + '\n',
          );
        });
      } else {
        if (res.createFinanceFailed) {
          setShowBookingFailCase(res.createFinanceFailed);
          setReturnText(res.createFinanceResult.returnText);
        }
      }
    });
  }, [appFormData]);

  function fetchRejectReason() {
    getAppFormStatus(appFormData?.id).then((res) => {
      if (res && res[0]) {
        const reasons = res[0].reasons;
        setRejectReason(reasons[0].reason);
      }
    });
  }

  useEffect(() => {
    if (appFormData?.stage === 'bookingstage') {
      getBookedFailedReason();
    }
  }, [appFormData]);

  useEffect(() => {
    getAppformRejectReasons('0');
    if (
      appFormData &&
      freezeAppformOnStatuses.includes(appFormData.appFormStatus)
    )
      fetchRejectReason();
    if (!appFormRejectAllReasons) {
      getAppformRejectReasons('-20');
    }
  }, []);

  const filteredAppformRejectReasons = useMemo(() => {
    setSelectedReason(null);
    let filtered = null;
    if (stageSelect) {
      filtered =
        appFormRejectAllReasons && appFormRejectAllReasons[stageSelect];
      if (filtered != null) {
        filtered.filter((val) => val.isActive);
      }
    }
    setfilteredAppformRejectReasonsIdCode(filtered || []);
    return filtered?.reduce((acc: string[], curr) => {
      acc.push(curr.reason);
      return acc;
    }, []);
  }, [stageSelect]);

  const closeDialogBox = useCallback(() => {
    setStageSelect('');
    setSelectedReason(null);
    setCommentData(undefined);
    dialogClose();
  }, []);

  const showCommentsSection = useMemo(() => {
    return appFormData && appFormData.appFormStatus === '10';
  }, []);

  const onReject = () => {
    // console.log(
    //   filteredAppformRejectReasonsIdCode?.reduce((nArr: number[], curr) => {
    //     if (curr.reason === selectedReason) nArr.push(curr?.id);
    //     return nArr;
    //   }, []),
    // );
    let payload: TLoanStatusUpdateReq = {
      reasonIds: filteredAppformRejectReasonsIdCode?.reduce(
        (nArr: number[], curr) => {
          if (curr.reason === selectedReason) nArr.push(curr?.id);
          return nArr;
        },
        [],
      ),
      subStage: stageSelect,
      comments: commentData || '',
      status: '-20',
    };
    if (appFormData) {
      start();
      postRejectAppForm.mutate({
        appFormId: appFormIDPath,
        reqData: payload,
      });
    }

    // updateAppFormStatus(appFormData.id,payload);
  };

  const showRejectionReason = useMemo(
    () =>
      appFormData &&
      freezeAppformOnStatuses.indexOf(appFormData.appFormStatus) > -1,
    [appFormData],
  );

  return (
    <>
      <Modal
        opened={rejectDialogVisible}
        onClose={() => closeDialogBox()}
        title={
          <Text size="lg" c="brandBlue.4">
            Reject Application
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
          <Stack gap={0}>
            <Text size="sm">Are you sure you want to reject </Text>
            <Text size="sm">
              App ID <strong>{appFormData?.id}</strong>?
            </Text>
          </Stack>
          <Radio.Group
            value={stageSelect}
            onChange={setStageSelect}
            name="favoriteFramework"
            label={
              <Text size="sm">
                {' '}
                STAGE <span style={{ color: 'red' }}>*</span>
              </Text>
            }
          >
            <Stack top="md">
              <Radio value="loginreject" label="Login" />
              <Radio value="mcu" label="MCU" />
              <Radio value="fcu" label="FCU" />
              <Radio value="verification" label="Verification" />
              <Radio value="regulatory" label="Reg. check" />
              <Radio value="documents" label="Documents" />
              <Radio value="credit" label="Credit Stage" />
            </Stack>
          </Radio.Group>
          <Select
            label={
              <Text size="sm">
                {' '}
                REASON <span style={{ color: 'red' }}>*</span>
              </Text>
            }
            value={selectedReason}
            onChange={setSelectedReason}
            data={filteredAppformRejectReasons}
            disabled={!stageSelect}
            clearable
          />
          {showCommentsSection && (
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
              onClick={() => closeDialogBox()}
            >
              Cancel
            </Button>
            <Button
              variant="light"
              size="xs"
              color="error"
              onClick={onReject}
              disabled={!selectedReason || !stageSelect}
            >
              Reject
            </Button>
          </Flex>
        </Stack>
      </Modal>
      {showRejectButton &&
      // showButtons &&
      appFormData?.stage !== 'bookingstage' ? (
        <Button
          variant="outline"
          color="#b82727"
          size="compact-sm"
          bg="white"
          onClick={dialogOpen}
        >
          {children}
        </Button>
      ) : null}

      {showRejectionReason ? (
        <Flex
          direction={'row'}
          gap={10}
          justify={'space-between'}
          align={'center'}
        >
          <Text size="md" fw={500}>
            Rejected
          </Text>
          <Text size="sm">Rejection reason: {rejectionReason}</Text>
        </Flex>
      ) : null}
    </>
  );
};
