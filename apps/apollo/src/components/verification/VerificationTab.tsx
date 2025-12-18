'use client';
import {
  Grid,
  Button,
  Group,
  Text,
  TextInput,
  Flex,
  Divider,
  Table,
  LoadingOverlay,
  Container,
  Space,
  ScrollArea,
  Paper,
  Stack,
  Box,
} from '@mantine/core';
import { ReactNode, useEffect, useState } from 'react';
import { Card, Modal } from '@mantine/core';
import { CiEdit } from 'react-icons/ci';
import classes from './VerificationTab.module.css';

import { formatCamelCase } from '@/lib/utils/utils';
import CustomChip from '@/components/common/CustomChip';
import {
  useUpdateKycStatus,
  useVerificationData,
} from '@/lib/queries/hulk/queries';
import { useQueryClient, UseQueryResult } from '@tanstack/react-query';
import { primaryBlue, primaryGreen } from '@/theme/colors';
import { useForm } from '@mantine/form';
import React from 'react';
import { DateInput } from '@mantine/dates';
import { appFormRawData } from '@/store/atoms';
import { useAtomValue } from 'jotai';
import { useParams, usePathname } from 'next/navigation';
import { getKyc } from '@/lib/queries/shield/services';
import {
  TComponentStatus,
  TComponentStatusResponseDto,
  TKycInfo,
} from '@/lib/queries/hulk/queryResponseTypes';
import { useResolveKyc } from '@/lib/queries/hulk/queries';
import { getVerificationDataQKey } from '@/lib/queries/queryKeys';
import { useDisclosure } from '@mantine/hooks';
import { showUanData } from '@/lib/rules/verificationRules';
import { ApplicantResp, Kyc } from '@/lib/queries/shield/queryResponseTypes';
import dayjs from 'dayjs';
import LoadingSkeleton from '../common/LoadingSkeleton';
import { useNotification } from '@/lib/context/notifications/useNotifications';
/*
* http://localhost:3000/application/4c136ff9-410a-4a94-8d1c-c933abda0bbe/verification

sample verification - https://jarvis.int.creditsaison.corp/application/4c136ff9-410a-4a94-8d1c-c933abda0bbe/verification
 * https://jarvis.uat.creditsaison.corp/application/a7e07b69-c13d-4a57-b51a-db8eb9f14a9a/verification
 * https://jarvis.uat.creditsaison.corp/application/47b09cd5-1325-40d9-85d9-51448bf5aa30/verification
 *
 * https://jarvis.int.creditsaison.corp/application/a73e4328-9456-46e4-924b-9078ccd099d1/verification
 * lots of nsdl data- https://jarvis.uat.creditsaison.corp/application/25a5bf01-acec-4438-9b4e-69c2399b0914/verification
 *
 * */
export const verificationStatusMap: { [key: string]: string } = {
  '-11': 'Rejected',
  '-1': 'Check',
  '-2': 'Check',
  0: 'None',
  '3M': 'Check',
  '3H': 'Check',
  1: 'Ok',
  2: 'Resolved',
};

type InitialKycEditValue = {
  id: string;
  kycType: string;
  kycValue: string;
  firstName: string;
  lastName: string;
  dob: Date | null;
  issuedCountry: string;
};
const initialKycValue: InitialKycEditValue = {
  id: '',
  kycType: '',
  kycValue: '',
  firstName: '',
  lastName: '',
  dob: null,
  issuedCountry: '',
};

const VerificationTab = () => {
  const [showStatus, setShowStatus] = useState<boolean>(false);
  const [editType, setEditType] = useState<string>('');
  const [kycEditModalOpened, kycEditModalFn] = useDisclosure(false);
  const [editKycData, setEditKycData] = useState<Kyc | null>(null);
  const [confirmationModalOpened, confirmationModalFn] = useDisclosure(false);
  const [queryData, setQueryData] = useState<{
    applicantId: number;
    kycId: number;
  } | null>(null);

  const appFormData = useAtomValue(appFormRawData);
  const { notify } = useNotification();
  const params = useParams<{ appformid: string }>();
  const appFormId = params.appformid;

  const {
    data: verificationData,
    isSuccess: isGetVerificationSuccess,
    isError: isGetverificationError,
  } = useVerificationData(appFormId, {
    staleTime: 5 * 1000,
  });

  if (isGetverificationError) {
    notify({ message: 'Could not fetch verification data!', type: 'error' });
  }

  const queryClient = useQueryClient();

  const resolveKycSuccessFunc = async () => {
    await queryClient.invalidateQueries({
      queryKey: getVerificationDataQKey(appFormId),
    });
    notify({ message: 'Kyc resolve success' });
    setToInitialValues();
    /**TODO show info alert*/
  };

  const resolveKycErrorFunc = (error: Error) => {
    notify({ message: error.message, type: 'error' });
  };

  const resolveKyc = useResolveKyc(resolveKycErrorFunc, resolveKycSuccessFunc);

  console.log('ISSERVER2', typeof window === 'undefined');

  const onKycStatusUpdateSuccess = async () => {
    await queryClient.invalidateQueries({
      queryKey: getVerificationDataQKey(appFormId),
    });

    setToInitialValues();
    /**TODO show info alert*/
  };
  const onKycStatusUpdateError = () => {
    setToInitialValues();
    console.log('INVALIDATE 2 ERROR');
    /**TODO show info alert*/
  };

  const updateKycData = useUpdateKycStatus(
    onKycStatusUpdateError,
    onKycStatusUpdateSuccess,
  );

  const editKycform = useForm({
    mode: 'uncontrolled',
    initialValues: initialKycValue,
    validate: {},
  });

  const setToInitialValues = () => {
    kycEditModalFn.close();
    confirmationModalFn.close();
    setQueryData(null);
    setEditKycData(null);
  };

  function getVerificationStatusText(verificationStatus: string) {
    if (verificationStatus.length > 3) return verificationStatus;
    if (showStatus) {
      return verificationStatus;
    }
    return verificationStatusMap[verificationStatus];
  }

  function getVerificationStatusColor(verificationStatus: string): string {
    const verificationStatusText =
      verificationStatusMap[verificationStatus]?.toLowerCase();
    switch (verificationStatusText) {
      case 'ok':
      case 'resolved':
        return primaryGreen[7];
      case 'check':
        return 'red';
      case 'rejected':
        return '#238cb8';
      default:
        return primaryBlue[7];
    }
  }

  const isFieldLocked = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'ok':
      case 'resolved':
      case 'rejected':
      case 'none':
      case '1':
      case '0':
      case '-11':
      case '2':
        return true;
      case '-1':
      case '-2':
      case '3M':
      case '3H':
      case 'check':
        return false;
      default:
        return true;
    }
  };

  const isPrimaryApplicant = (id: string) => {
    const primaryApplicant = appFormData!.linkedIndividuals.find(
      (individual) =>
        individual.type === 'Primary' && individual.id === Number(id),
    );
    return primaryApplicant !== undefined;
  };

  const formatJson = (obj: object) => {
    return JSON.stringify(obj, undefined, 8);
  };

  const toggleShowStatus = () => {
    setShowStatus(!showStatus);
  };

  const fnPostKycRequest = (
    applicantId: string,
    kycId: string,
    applicantType: string,
  ) => {
    let container: ApplicantResp | null = null;
    switch (applicantType) {
      case 'individual':
        container = appFormData!.linkedIndividuals.find(
          (individual) => individual.id === Number(applicantId),
        )!;
        break;
      case 'coApplicant':
        container = appFormData!.coApplicants.find(
          (individual) => individual.id === Number(applicantId),
        )!;
        break;
      case 'beneficialOwner':
        container = appFormData!.beneficialOwners.find(
          (individual) => individual.id === Number(applicantId),
        )!;
        break;
      case 'business':
        container = appFormData!.linkedBusiness!;
        break;
      default:
        break;
    }

    if (container == null) {
      return;
      /**TODO throw info alert*/
    }

    const kyc = container.kyc.find((kyc) => kyc.id === Number(kycId))!;
    editKycform.setValues({
      id: kyc.id.toString(),
      kycType: kyc.kycType,
      kycValue: kyc.kycValue,
      firstName: kyc.firstName,
      lastName: kyc.lastName,
      dob: new Date(kyc.dob),
      issuedCountry: kyc.issuedCountry,
    });
    /*This is used to see if the user has changed anything, else it will comparte to initial value and alwasy give true
     *https://mantine.dev/form/status/
     * */
    editKycform.resetDirty();
    editKycform.resetTouched();
    setEditKycData(kyc);
    setQueryData({ applicantId: Number(applicantId), kycId: Number(kycId) });
    kycEditModalFn.open();
  };

  const rejectKyc = () => {
    const kycData = editKycform.getValues();
    updateKycData.mutate({
      applicantId: queryData!.applicantId,
      reqData: {
        kycType: kycData ? kycData.kycType : '',
        status: '-11',
        reason: 'manual entry',
      },
    });
  };

  const updateKyc = () => {
    /**TODO check date format*/
    const updatedKycData = { ...editKycData! };
    if (editKycform.isDirty()) {
      const formValues = editKycform.getValues();
      const kycFields = Object.keys(formValues);
      /*iterate over keys*/
      kycFields.forEach((kycField) => {
        if (editKycform.isDirty(kycField)) {
          switch (kycField) {
            case 'dob':
              updatedKycData!.dob = dayjs(
                formValues[kycField as keyof InitialKycEditValue],
              ).format('YYYY-MM-DD');
              break;
            case 'kycType':
            case 'kycValue':
            case 'firstName':
            case 'lastName':
            case 'issuedCountry':
              updatedKycData![kycField] = formValues[kycField];
              break;
            default:
              break;
          }
        }
      });
    }
    resolveKyc.mutate({
      applicantId: queryData!.applicantId,
      kycId: queryData!.kycId,
      reqData: updatedKycData,
    });
  };

  function editKyc() {
    if (editType === 'reject') {
      rejectKyc();
    } else {
      updateKyc();
    }
  }

  function getAppFormCard(): ReactNode {
    const verificationStatus = getVerificationStatusText(
      verificationData?.status || '',
    );
    const verificationStatusColor = getVerificationStatusColor(
      verificationData?.status || '',
    );
    return (
      <Paper
        withBorder
        shadow="sm"
        radius="md"
        flex={0.4}
        className="w-1/2"
        p={0}
      >
        <Stack p={0} className="rounded-md" gap={4}>
          <Group
            justify="space-between"
            bg="brandGreen.0"
            p="sm"
            className="rounded-md"
          >
            <Text fw={700} size="sm">
              App Form
            </Text>
            <CustomChip
              customProps={{
                variant: 'light',
                color: verificationStatusColor,
                size: 'sm',
                radius: 'sm',
                value: verificationStatus,
                CustomChipEvent: toggleShowStatus,
              }}
            />
          </Group>
          <Box p="xs">
            <Text mt="xs" c="#5e6066" size="sm" fw={700}>
              ID : {appFormId}
            </Text>
          </Box>
        </Stack>
      </Paper>
      // <Card withBorder shadow="sm" radius="md" flex={0.4} >
      //   <Card.Section
      //     withBorder
      //     inheritPadding
      //     // py="xs"
      //      bg="brandGreen.0"
      //     // style={{ backgroundColor: '#0000' }}
      //   >
      //     <Group justify="space-between" bg="brandGreen.0" >
      //       <Text fw={700} size="sm">
      //         App Form
      //       </Text>
      //       <CustomChip
      //         customProps={{
      //           variant: 'light',
      //           color: verificationStatusColor,
      //           size: 'sm',
      //           radius: 'sm',
      //           value: verificationStatus,
      //           CustomChipEvent: toggleShowStatus,
      //         }}
      //       />
      //     </Group>
      //   </Card.Section>

      //   <Text mt="xs" c="#5e6066" size="sm" fw={700}>
      //     ID : {appFormId}
      //   </Text>
      // </Card>
    );
  }

  function getTopSection(): ReactNode {
    return (
      <Group>
        {getAppFormCard()}
        {/* leaving space for consent container*/}
      </Group>
    );
  }

  function getCardTopSection(
    entityType: string,
    entityName: string,
    componentVerificationStatus: string,
  ): ReactNode {

    const verificationStatus = getVerificationStatusText(
      componentVerificationStatus,
    );

 
    const verificationStatusColor = getVerificationStatusColor(
      componentVerificationStatus,
    );
    return (
      // <Card.Section withBorder inheritPadding py="xs">
      <Group
        justify="space-between"
        bg="brandGreen.0"
        className="rounded-md"
        p="md"
      >
        <Group>
          <Text fw={700} size="sm" tt="capitalize">
            {entityType} :
          </Text>
          <Text fw={700} size="sm">
            {entityName}
          </Text>
        </Group>
        <CustomChip
          customProps={{
            variant: 'light',
            color: verificationStatusColor,
            size: 'sm',
            radius: 'sm',
            value: verificationStatus,
            CustomChipEvent: toggleShowStatus,
          }}
        />
      </Group>
      // </Card.Section>
    );
  }

  function getCardIdSection(entityId: string) {
    return (
      <Box mt="xs" pb="xs">
        <Text mt="xs" fw={700} c="#5e6066" size="sm">
          ID : {entityId}
        </Text>
      </Box>
    );
  }

  function getCardKycValue(
    kyc: TComponentStatusResponseDto,
    statusId: string,
    entityType: 'individual' | 'coApplicant' | 'beneficialOwner' | 'business',
    kycItemName?: string, // specifically added for Uan/Udyam as kyc.item is null for Uan
  ) {
    const verificationStatus = getVerificationStatusText(kyc.status);
    const verificationStatusColor = getVerificationStatusColor(kyc.status);

    const locked = isFieldLocked(verificationStatus);
    const itemName = kyc.item || kycItemName!;
    return (
      <Group justify="space-between" key={kyc.item}>
        <Text mt="xs" fw={500} c="#5e6066" size="sm">
          {formatCamelCase(itemName)} : {kyc.itemValue}
        </Text>
        <Group justify="align-start">
          {!locked && (
            <Button
              className={classes.editButton}
              size="sm"
              leftSection={<CiEdit size={14} />}
              variant="transparent"
              onClick={() => {
                fnPostKycRequest(statusId, kyc.componentSourceId, entityType);
              }}
            >
              edit
            </Button>
          )}
          <CustomChip
            customProps={{
              variant: 'light',
              color: verificationStatusColor,
              size: 'sm',
              radius: 'sm',
              value: verificationStatus,
              CustomChipEvent: toggleShowStatus,
            }}
          />
        </Group>
      </Group>
    );
  }
  function getCardKyc(
    kycList: TComponentStatusResponseDto[],
    statusId: string,
    entityType: 'individual' | 'coApplicant' | 'beneficialOwner' | 'business',
  ) {
    return (
      <Box mt="xs" pb="xs">
        <Group justify="space-between">
          <Text mt="xs" fw={700} c="#5e6066" size="sm">
            KYC Type/Value
          </Text>
          <Text mt="xs" fw={700} c="#5e6066" size="sm">
            Status
          </Text>
        </Group>

        {kycList.length > 0 &&
          kycList.map((kyc, _index) =>
            getCardKycValue(kyc, statusId, entityType),
          )}
      </Box>
    );
  }

  function getCardUan(
    uan: TComponentStatusResponseDto,
    statusId: string,
    entityType: 'individual' | 'coApplicant' | 'beneficialOwner' | 'business',
  ) {
    return (
      <Box mt="xs" pb="xs">
        <Group justify="space-between">
          <Text mt="xs" fw={700} c="#5e6066" size="sm">
            Uan/Udyam id :
          </Text>
          <Text mt="xs" fw={700} c="#5e6066" size="sm">
            Status
          </Text>
        </Group>
        {getCardKycValue(uan, statusId, entityType, 'Uan/Udayam id')}
      </Box>
    );
  }

  function getNSDLData(kycList: TComponentStatusResponseDto[]) {
    const tpResponses = kycList.map((kyc) => {
      const tpResponse = kyc.tpResponse;
      let tpResponseString = '';
      if (tpResponse == null || tpResponse.toString().length === 0) {
        tpResponseString = 'No Data';
      } else {
        tpResponseString = formatJson(tpResponse);
      }
      return (
        <Text mt="xs" fw={500} c="#5e6066" size="sm" key={kyc.item}>
          {formatCamelCase(kyc.item)} :{tpResponseString}
        </Text>
      );
    });

    return (
      <Box mt="xs" pb="xs">
        <Text fw={700} c="#5e6066" size="sm">
          NSDL Data
        </Text>
        <ScrollArea h={250}>
          <Flex>
            <Text style={{ whiteSpace: 'pre-wrap' }}>{tpResponses}</Text>
          </Flex>
        </ScrollArea>
      </Box>
    );
  }

  function getVerificationsCard(
    componentStatus: TComponentStatus,
    cardHeader: string,
    entityType: 'individual' | 'coApplicant' | 'beneficialOwner' | 'business',
  ): ReactNode {
    const showUan = showUanData(appFormData!, componentStatus);
    return (
      <Paper p={0}>
        {getCardTopSection(
          cardHeader,
          componentStatus.name,
          componentStatus.status,
        )}
        <Stack className="rounded-md" px="md" py="xs" gap={0}>
          {getCardIdSection(componentStatus.id)}
          <Divider orientation="horizontal" />
          {getCardKyc(componentStatus.kycList, componentStatus.id, entityType)}
          <Divider orientation="horizontal" />
          {showUan &&
            getCardUan(componentStatus.uan, componentStatus.id, entityType)}
          {getNSDLData(componentStatus.kycList)}
        </Stack>
      </Paper>
    );
  }

  function getBusinessSection(): ReactNode {
    if (verificationData?.businessStatus) {
      const text =
        appFormData!.linkedBusiness.type === 'Primary'
          ? 'Business Primary Applicant'
          : 'Business';
      return (
        <Grid.Col span={{ base: 12, md: 6, lg: 6 }}>
          {getVerificationsCard(
            verificationData?.businessStatus,
            text,
            'business',
          )}
        </Grid.Col>
      );
    }
    return <></>;
  }

  function getCoApplicantSection(): ReactNode {
    if (
      verificationData?.coApplicantStatus.length &&
      verificationData?.coApplicantStatus.length > 0
    ) {
      return verificationData?.coApplicantStatus.map((status) => {
        return (

          <Grid.Col span={4} key={status.id}>
            {getVerificationsCard(
              status,
              'Company Co-Applicant',
              'coApplicant',
            )}
          </Grid.Col>
        );
      });
    }
    return <></>;
  }

  function getLinkedIndividualSection(): ReactNode {
    if (
      verificationData?.individualStatus.length &&
      verificationData?.individualStatus.length > 0
    ) {
      return verificationData?.individualStatus.map((status) => {
        const text = isPrimaryApplicant(status.id)
          ? 'Individual Primary Applicant'
          : 'Individual Co-Applicant';
        return (
          <Grid.Col span={6} key={status.id}>
            {getVerificationsCard(status, text, 'individual')}
          </Grid.Col>
        );
      });
    }
    return <></>;
  }

  function getBeneficialOwnerSection(): ReactNode {
    if (
      verificationData?.beneficialOwnerStatus.length &&
      verificationData?.beneficialOwnerStatus.length > 0
    ) {
      return verificationData?.beneficialOwnerStatus.map((status) => {
        return (
          <Grid.Col span={6} key={status.id}>
            {getVerificationsCard(
              status,
              'Individual BeneficialOwner',
              'beneficialOwner',
            )}
          </Grid.Col>
        );
      });
    }
    return <></>;
  }

  function getKycEditModal() {
    return (
      <Modal
        opened={kycEditModalOpened}
        onClose={() => {
          kycEditModalFn.close();
        }}
        title="Edit KYC"
        size="auto"
        centered
      >
        <div>
          <TextInput
            disabled={true}
            label="Id"
            key={editKycform.key('id')}
            {...editKycform.getInputProps('id')}
          />
          <TextInput
            disabled={true}
            mt="md"
            label="Kyc Type"
            key={editKycform.key('kycType')}
            {...editKycform.getInputProps('kycType')}
          />
          <TextInput
            mt="md"
            label="Kyc Value"
            key={editKycform.key('kycValue')}
            {...editKycform.getInputProps('kycValue')}
          />
          <TextInput
            mt="md"
            label="First Name"
            key={editKycform.key('firstName')}
            {...editKycform.getInputProps('firstName')}
          />
          <TextInput
            mt="md"
            label="Last Name"
            key={editKycform.key('lastName')}
            {...editKycform.getInputProps('lastName')}
          />
          <DateInput
            mt="md"
            label="DOB"
            valueFormat="YYYY/MM/DD"
            key={editKycform.key('dob')}
            {...editKycform.getInputProps('dob')}
          />
          <TextInput
            mt="md"
            label="Issued Country"
            key={editKycform.key('issuedCountry')}
            {...editKycform.getInputProps('issuedCountry')}
          />

          <Group justify="right" mt="xl">
            <Button variant="outline" onClick={() => kycEditModalFn.close()}>
              Cancel
            </Button>
            <Button
              variant="light"
              color="red"
              onClick={() => {
                setEditType('reject');
                confirmationModalFn.open();
              }}
            >
              Reject
            </Button>
            <Button
              variant="light"
              onClick={() => {
                setEditType('resolve');
                confirmationModalFn.open();
              }}
            >
              Resolve
            </Button>
          </Group>
        </div>
      </Modal>
    );
  }

  function getKycEditChanges() {
    if (editKycform.isDirty() && editKycData) {
      const formValues = editKycform.getValues();
      const kycFields = Object.keys(formValues);
      /*iterate over keys*/
      const tableRows = kycFields.map((kycField) => {
        if (editKycform.isDirty(kycField)) {
          let newFieldValue = '';
          let oldFieldValue = '';
          if (kycField == 'dob') {
            newFieldValue = dayjs(
              formValues[kycField as keyof InitialKycEditValue],
            ).format('YYYY/MM/DD');
            oldFieldValue = dayjs(editKycData[kycField as keyof Kyc]).format(
              'YYYY/MM/DD',
            );
          } else {
            newFieldValue = formValues[
              kycField as keyof InitialKycEditValue
            ] as string;
            oldFieldValue = editKycData[kycField as keyof Kyc] as string;
          }
          return (
            <Table.Tr key={kycField}>
              <Table.Td>{kycField}</Table.Td>
              <Table.Td>{oldFieldValue}</Table.Td>
              <Table.Td>{newFieldValue}</Table.Td>
            </Table.Tr>
          );
        }
      });
      return (
        <Table>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Field</Table.Th>
              <Table.Th>Old Value</Table.Th>
              <Table.Th>New Value</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>{tableRows}</Table.Tbody>
        </Table>
      );
    }
    return <Text size="sm"> No Changes </Text>;
  }

  function getKycEditConfirmationModal() {
    return (
      <Modal
        opened={confirmationModalOpened}
        onClose={confirmationModalFn.close}
        title={formatCamelCase(editType) + ' KYC'}
        centered
      >
        <LoadingOverlay
          visible={resolveKyc.isPending || updateKycData.isPending}
          loaderProps={{ children: 'Loading...' }}
        />
        <div>
          <Text size="sm">
            Please confirm that you want to {editType} this KYC
            <br /> This is a Non Reversible Action
          </Text>

          <Divider my="xs" label="Changes" labelPosition="center" />
          {getKycEditChanges()}
          <Group justify="right" mt="xl">
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                confirmationModalFn.close();
              }}
            >
              Cancel
            </Button>
            <Button
              size="sm"
              color={editType === 'resolve' ? 'blue' : 'red'}
              variant="light"
              onClick={editKyc}
            >
              {formatCamelCase(editType)}
            </Button>
          </Group>
        </div>
      </Modal>
    );
  }

  /**TODO: error handling */
  if (isGetverificationError) {
    throw new Error('Could not get verification data!');
  }

  return (
    <Container fluid style={{ padding: '60px' }} w={'100%'}>
      {getTopSection()}
      <Space h="md" />
      <Grid>
        {getBusinessSection()}
        {/* {getBusinessSection()} */}
        {getCoApplicantSection()}
        {/* {getCoApplicantSection()} */}
        {getLinkedIndividualSection()}
        {getBeneficialOwnerSection()}
        {/* {getBeneficialOwnerSection()} */}
      </Grid>
      {getKycEditModal()}
      {getKycEditConfirmationModal()}
    </Container>
  );
};

export default VerificationTab;
