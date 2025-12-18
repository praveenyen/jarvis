import { Flex, Text, Button, Tooltip, ActionIcon, Menu } from '@mantine/core';
import { AppAvatar } from '../common/AppAvatar';
import CustomIcon from '@/components/icons/CustomIcons';
import { getAppFormApplicantList } from '@/store/modules/appform';
import { useAtom, useAtomValue } from 'jotai';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { appFormRawData } from '@/store/modules/appform';
import { TRiskCategoryResp } from '@/lib/queries/antmanLambda/services';
import {
  useQuery,
  useQueryClient,
  UseQueryResult,
} from '@tanstack/react-query';
import { useRiskCategory } from '@/lib/queries/antmanLambda/queries';
import { mainCustomerId } from '@/components/appFormLayout/appFormHelpers';
import constants, { appFormStatus } from '@/lib/utils/constants';
import { RejectAppForm } from '@/components/appFormLayout/RejectAppForm';
import { useDisclosure } from '@mantine/hooks';
import { ApproveAppForm } from './ApproveAppForm';
import { isFlowTypeSME } from '@/lib/rules/commonRules';
import { usePositiveConfirmationUpdate } from '@/lib/queries/kaizen/queries';
import { userRoles } from '@/store/atoms';
import { useNotification } from '@/lib/context/notifications/useNotifications';
import { TPositiveConfirmationRecordResponse } from '@/lib/queries/kaizen/queryResponseTypes';
import { getPositiveConfirmationRecordQKey } from '@/lib/queries/queryKeys';
import { getPositiveConfirmationRecord } from '@/lib/queries/kaizen/service';
import iconColors from '@/components/icons/CustomIcons';
import { randomIntFromInterval } from '@/lib/utils/utils';
import CustomChip from '@/components/common/CustomChip';
import { DiscrepancyStatus } from '@/lib/queries/kaizen/queryResponseTypes';
import { useMnrlFriFraudCheck } from '@/lib/queries/rogue/queries';
import {
  DataItem,
  FriData,
  MnrlData,
  MnrlFriDiuReq,
  MnrlFriDiuResponse,
} from '@/lib/queries/rogue/queryResponseTypes';

type CustomChipProps = {
  variant: string;
  color: string;
  radius: string;
  size: string;
  value: string;
};

export default function AppFormHeader({
  headers,
  discrepancyStatus,
}: {
  headers: Record<string, string>;
  discrepancyStatus: DiscrepancyStatus | undefined;
}) {
  const appFormData = useAtomValue(appFormRawData);
  const applicantList = useAtomValue(getAppFormApplicantList);

  const getPhoneNumber = () => {
    let mobileContact = null;
    let individual = null;
    if (appFormData == null) return null;
    if (appFormData.linkedIndividuals.length == 1) {
      individual = appFormData.linkedIndividuals[0];
    } else {
      const linkedIndividuals = appFormData!.linkedIndividuals;
      individual = linkedIndividuals.find(
        (linkInd) => linkInd.individual!.partyType === 'Primary Applicant',
      );
    }

    if (individual == null) return null;
    mobileContact = individual.contacts.find(
      (contact) => contact.type === 'phone' && contact.typeCode === 'MOBILE',
    );
    if (mobileContact?.value == undefined) return null;
    return '91' + mobileContact.value;
  };

  const mnrlFriReqBodyFunc = () => {
    const mobileNumber = getPhoneNumber();
    if (mobileNumber == null) {
      return null;
    }

    return {
      data: [
        {
          mobileNumber,
          entityId: appFormData!.id,
          entityType: 'appForm',
        },
      ],
    };
  };

  const mnrlFriReq: MnrlFriDiuReq | null = mnrlFriReqBodyFunc();
  const { data: mnrlFriResp } = useMnrlFriFraudCheck(mnrlFriReq, {
    enabled: !!mnrlFriReq,
  });

  const [positiveConfirmationToolTip, setPositiveConfirmationToolTip] =
    useState('');
  const [positiveConfirmation, setPositiveConfirmation] = useState('-');
  const [showPositiveConfirmation, setShowPositiveConfirmation] =
    useState(false);
  const [roles] = useAtom(userRoles);
  const { notify } = useNotification();

  const queryClient = useQueryClient();

  // const {
  //   data: postiveConfirmationRecord,
  //   isError: positiveConfirmationGetError,
  // } = usePositiveConfirmationRecordGet(appFormData?.id || '', headers);

  const {
    data: postiveConfirmationRecord,
    isError: positiveConfirmationGetError,
  } = useQuery<TPositiveConfirmationRecordResponse>({
    queryKey: getPositiveConfirmationRecordQKey(appFormData?.id || ''),
    queryFn: () =>
      getPositiveConfirmationRecord(appFormData?.id || '', headers),
    retry: false,
  });
  const onPCSuccess = (data: TPositiveConfirmationRecordResponse) => {
    notify({ message: 'Positive Confirmation Updated', type: 'success' });
    queryClient.invalidateQueries({
      queryKey: getPositiveConfirmationRecordQKey(appFormData?.id || ''),
    });
  };

  const onPCFail = (error: Error) => {
    notify({ message: error.message, type: 'error' });
  };
  const updatePositiveConfirmation = usePositiveConfirmationUpdate(
    onPCFail,
    onPCSuccess,
    headers,
  );

  const [
    approveDialogVisible,
    { open: approveDialogOpen, close: approveDialogClose },
  ] = useDisclosure(false);

  const mainHeadingApplicant = useMemo((): string => {
    if (
      applicantList[applicantList.length - 1]?.type.toLowerCase() === 'business'
    ) {
      return applicantList[applicantList.length - 1]?.name || '';
    }
    return applicantList[0]?.name || '';
  }, [applicantList]);

  const {
    data: riskCategoryData,
    isLoading: riskCatIsLoading,
    isSuccess: isRiskCatGetSuccess,
    status: getRiskcatStatus,
  }: UseQueryResult<TRiskCategoryResp> = useRiskCategory(
    mainCustomerId(appFormData),
    headers,
  );

  const appStatus = useMemo(() => {
    if (appFormData?.appFormStatus === null) return 'In Progress';
    if (
      appFormData?.appFormStatus &&
      appFormStatus.hasOwnProperty(appFormData.appFormStatus)
    )
      return appFormStatus[appFormData.appFormStatus];
    else return 'Loan Application Approved';
  }, [appFormData]);

  const getRiskCategory = useMemo((): string => {
    let createdAt: Date;
    if (appFormData != null && isRiskCatGetSuccess) {
      let riskCategory = riskCategoryData?.risk_category;
      createdAt = appFormData?.createdAt;
      const createdDate = new Date(createdAt);
      const targetDate = new Date(constants.RISK_CATEGORY_DATE);
      if (riskCategory === '' && createdDate < targetDate) {
        riskCategory = 'Low';
      }
      if (riskCategory !== '') {
        riskCategory = riskCategory + ' Risk';
      }
      return riskCategory;
    } else return '';
  }, [appFormData, isRiskCatGetSuccess]);

  const riskCategoryEnabled = useMemo((): boolean => {
    const appFormStatus = appFormData?.appFormStatus;
    if (appFormStatus) {
      const status = parseInt(appFormStatus);
      if (status >= 15) {
        return true;
      }
    }
    return false;
  }, [appFormData]);

  const getDataForPositiveConfirmationStatus = useCallback(() => {
    if (postiveConfirmationRecord) {
      setPositiveConfirmationToolTip(
        `SP Name: ${postiveConfirmationRecord?.spName}, AWB No: ${postiveConfirmationRecord?.awb}`,
      );
      if (postiveConfirmationRecord?.finalStatus == 'Delivered') {
        setPositiveConfirmation('Positive Confirmed');
      } else {
        setPositiveConfirmation('Undelivered');
      }
      setShowPositiveConfirmation(true);
    } else {
      setPositiveConfirmationToolTip(`SP Name: - , AWB No: -`);
      setPositiveConfirmation('-');
      setShowPositiveConfirmation(false);
      setPositiveConfirmation('Undelivered');
    }
  }, [positiveConfirmationGetError, postiveConfirmationRecord]);

  const positiveConfirmationSelect = useCallback((item: string) => {
    if (item == 'Positive Confirmed') {
      item = 'Delivered';
    }
    const data = { finalStatus: item };
    updatePositiveConfirmation.mutate({
      appFormId: appFormData?.id || '',
      reqData: data,
    });
  }, []);

  const roleToEditPositiveConfirmation = useMemo(
    () =>
      roles &&
      roles.length > 0 &&
      roles.some(
        (role) => role === 'superadmin' || role === 'positiveConfirmationRole',
      ),
    [roles],
  );

  const positiveConfirmationOptions = useMemo(() => {
    if (positiveConfirmation == 'Positive Confirmed') {
      return ['Undelivered'];
    }
    if (positiveConfirmation == 'Undelivered') {
      return ['Positive Confirmed'];
    }
    return [];
  }, [positiveConfirmation]);

  useEffect(() => {
    getDataForPositiveConfirmationStatus();
  }, [postiveConfirmationRecord]);

  const renderDiuChip = (item: DataItem) => {
    let labelText: string;
    const chipProps: CustomChipProps = {
      variant: 'filled',
      color: '',
      radius: 'sm',
      size: 'md',
      value: '',
    };

    if (item.diu_data_type === 'MNRL') {
      const mnrlData = item.data as MnrlData;
      labelText = mnrlData.disconnectionReason;
      chipProps.color = 'red';
      chipProps.value = 'MNRL';
    } else if (item.diu_data_type === 'FRI') {
      const friData = item.data as FriData;
      labelText = friData.fri;
      chipProps.color = 'orange';
      chipProps.value = 'FRI';
    } else {
      return null;
    }

    return (
      <Tooltip label={labelText || 'N/A'} key={`tooltip-${item.entityId}`}>
        <span>
          <CustomChip key={item.entityId} customProps={chipProps} />
        </span>
      </Tooltip>
    );
  };

  const showMnrlFriChips = (mnrlData: MnrlFriDiuResponse | undefined) => {
    if (mnrlData == null || mnrlData === undefined) return <></>;
    if (mnrlData.data.length === 1) {
      return mnrlData.data.map((item) => renderDiuChip(item));
    }

    if (mnrlData.data && mnrlData.data.length > 1) {
      const mnrl: DataItem | undefined = mnrlData.data.find(
        (item) => item.diu_data_type === 'MNRL',
      );

      if (mnrl == undefined) return <></>;

      return renderDiuChip(mnrl);
    }

    return <></>;
  };

  const showButtons = useMemo(() => {
    if (appFormData)
      return (
        appFormData.appFormStatus === '12' && discrepancyStatus?.appFormCanApprove
      );
    return false;
  }, [appFormData, discrepancyStatus]);

  return (
    <Flex
      justify={'space-between'}
      align={'center'}
      py={5}
      px={10}
      bg="white"
      style={{ position: 'sticky', top: 0, zIndex: 100 }}
    >
      <Flex justify={'flex-start'} align={'center'} gap={10}>
        <AppAvatar
          name={''}
          radius="sm"
          size={30}
          color={iconColors[randomIntFromInterval(0, 20)]}
        >
          {appFormData?.loan.loanProduct || ''}
        </AppAvatar>
        <Text c="primary.8" size="lg">
          {mainHeadingApplicant}
        </Text>
        <Text c="neutral" size="md">
          {' '}
          {appStatus}
        </Text>
        <Tooltip label="Customer 360">
          <ActionIcon
            variant="subtle"
            aria-label="Customer 360"
            color="primary"
            size={'lg'}
          >
            <CustomIcon
              src="MaterialIcon"
              name="MdOutlinePersonPin"
              size={'20px'}
            ></CustomIcon>
          </ActionIcon>
        </Tooltip>
        {showMnrlFriChips(mnrlFriResp)}

        <>
          <CustomChip
            customProps={{
              variant: 'light',
              color: 'yellow',
              radius: 'sm',
              size: 'md',
              value: discrepancyStatus?.ftrAndNftrStatus,
            }}
          ></CustomChip>
          <CustomChip
            customProps={{
              variant: 'light',
              color: appFormData?.reviewed ? 'green' : 'orange',
              radius: 'sm',
              size: 'md',
              value: appFormData?.reviewed
                ? 'Appform Reviewed'
                : 'Appform Review Pending',
            }}
          ></CustomChip>
        </>

        {showPositiveConfirmation && (
          <Tooltip label={positiveConfirmationToolTip} position="right">
            <Menu shadow="md">
              <Menu.Target>
                <Button
                  size="xs"
                  variant="outline"
                  color={
                    positiveConfirmation === 'Positive Confirmed'
                      ? 'brandGreen'
                      : 'error'
                  }
                  rightSection={
                    roleToEditPositiveConfirmation ? (
                      <CustomIcon src="MaterialIcon" name="MdEdit" />
                    ) : null
                  }
                >
                  {positiveConfirmation}
                </Button>
              </Menu.Target>

              {roleToEditPositiveConfirmation && (
                <Menu.Dropdown>
                  {positiveConfirmationOptions.map((option) => (
                    <Menu.Item
                      onClick={() => positiveConfirmationSelect(option)}
                    >
                      {option}
                    </Menu.Item>
                  ))}
                </Menu.Dropdown>
              )}
            </Menu>
          </Tooltip>
        )}
        {/* {riskCategoryEnabled && (
          <CustomChip
            customProps={{
              variant: 'outline',
              color: 'brandBlue',
              radius: 'xs',
              size: 'md',
              value: getRiskCategory || '',
            }}
          ></CustomChip>
        )} */}
      </Flex>

      {/* <Button variant="outline" color="#b82727" size="compact-sm" bg="white">
        Reject App
      </Button> */}
      <Flex
        direction={'row'}
        justify={'space-around'}
        align={'center'}
        gap={10}
      >
        {!isFlowTypeSME(appFormData?.flowType || '') && showButtons && (
          <Button
            variant="outline"
            color="brandGreen"
            size="compact-sm"
            bg="white"
            onClick={approveDialogOpen}
          >
            Approve
          </Button>
        )}
        {
          (discrepancyStatus?.appFormCanApprove && (
            <RejectAppForm appFormData={appFormData} headers={headers}>
              Reject App
            </RejectAppForm>
          ))}
      </Flex>
      <ApproveAppForm
        approveDialogClose={approveDialogClose}
        approveDialogOpen={approveDialogOpen}
        approveDialogVisible={approveDialogVisible}
        appId={appFormData?.id || ''}
        appFormStatus={appFormData?.appFormStatus || ''}
        headers={headers}
        appFormData={appFormData}
      />
    </Flex>
  );
}
