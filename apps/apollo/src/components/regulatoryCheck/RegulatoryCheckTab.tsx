'use client';
import {
  useApproveRegCheck,
  useRegCheckDetailed,
} from '@/lib/queries/deadpool/queries';
import {
  Grid,
  Paper,
  Text,
  Stack,
  Divider,
  Accordion,
  Flex,
  Badge,
  Button,
  Modal,
  Space,
  TextProps,
  Container,
  Group,
  Card,
} from '@mantine/core';
import { Fragment, ReactElement, ReactNode, useState } from 'react';
import {
  ApplicantStatus,
  RegCheckApplicantDetails,
  RegCheckMisc,
  RegCheckSources,
  UpdateRegCheckRequest,
  UpdateRegCheckResponse,
} from '@/lib/queries/deadpool/queryResponseTypes';
import { enableManualApproval } from '@/lib/rules/regCheckRules';
import { useDisclosure } from '@mantine/hooks';
import { useQueryClient } from '@tanstack/react-query';
import { getRegCheckDetailedQKey } from '@/lib/queries/queryKeys';
import { useAtomValue } from 'jotai/index';
import { appFormRawData } from '@/store/atoms';
import { useParams } from 'next/navigation';
import classes from './RegulatoryCheckTab.module.css';
import CustomSkeletonLayout from '../bureau/common/CustomSkeletonLayout';

const regulatoryStatus: { [key: string]: string } = {
  '-11': 'Reject',
  '3M': 'Check', //deprecated
  '3H': 'Check', //deprecated
  1: 'Ok',
  0: 'Pending',
  2: 'Resolved',
  failure: 'Failed',
};

/*http://localhost:3000/application/f6464db8-a3ce-43f4-962b-9d498eed2299/regulatoryCheck*/

export default function RegulatoryCheckTab() {
  const [showRegCheckStatus, setShowRegCheckStatus] = useState<boolean>(false);
  const [opened, { open, close }] = useDisclosure(false);
  const queryClient = useQueryClient();
  const appFormData = useAtomValue(appFormRawData);

  /*replace with params*/
  const params = useParams<{ appformid: string }>();
  const appFormId = params.appformid;
  //const appFormId = '8448ed5e-4e9b-4bbc-b15a-b5ca11f815e2'; //qa2

  const regCheckDetailed = useRegCheckDetailed(appFormId, {
    staleTime: 5 * 1000,
  });
  const updateRegCheck = useApproveRegCheck(
    onRegCheckUpdateError,
    onRegCheckUpdateSuccess,
    afterRegCheckUpdateAttempt,
  );

  function onRegCheckUpdateError(error: Error) {
    /*TODD*/
    /*Throw error band saying failed to update*/
  }

  function onRegCheckUpdateSuccess(data: UpdateRegCheckResponse) {
    /*Throw success band saying  updated successfully*/
  }

  async function afterRegCheckUpdateAttempt(
    data: UpdateRegCheckResponse | undefined,
    error: Error | null,
    variables: { appFormId: string; newStatus: UpdateRegCheckRequest },
  ) {
    await queryClient.invalidateQueries({
      queryKey: getRegCheckDetailedQKey(variables.appFormId),
    });
    close();
  }

  function getRegCheckStatusColor(): string {
    const regCheckStatus = regCheckDetailed.data!.status;
    const badgeText = regulatoryStatus[regCheckStatus].toLowerCase();
    switch (badgeText) {
      case 'ok':
      case 'resolved':
        return 'green';
      case 'check':
      case 'reject':
        return 'red';
      case 'pending':
        return 'gray';
      case 'failure':
        return 'yellow';
      default:
        return 'gray';
    }
  }

  function getRegCheckStatusText(): string {
    const regCheckStatus = regCheckDetailed.data!.status;
    if (showRegCheckStatus) {
      return regCheckStatus;
    }
    return regulatoryStatus[regCheckStatus];
  }

  function onRegCheckStatusClick() {
    setShowRegCheckStatus(!showRegCheckStatus);
  }

  function getAppFormCard(): ReactNode {
    let failureText = <></>;
    let manualApprovalButtons = <></>;
    if (regCheckDetailed.data!.status === 'FAILURE') {
      failureText = (
        <Text fw={700} size="sm">
          Regulatory check has failed to run. Please contact tech dept
        </Text>
      );
    } else {
      manualApprovalButtons = getManualApprovalButtons();
    }

    return (
      // <Group>
      <Paper
        withBorder
        shadow="sm"
        radius="md"
        flex={0.4}
        p={0}
        // p={15}
        className="w-1/2"
        // pt={0}
      >
        {/* <Card.Section withBorder inheritPadding mt="xs" pb="lg" pt={2} > */}
        <Stack align="stretch" justify="center" className="rounded-md" gap={12}>
          <Flex
            justify="space-between"
            align="flex-start"
            direction="row"
            wrap="nowrap"
            bg="brandGreen.0"
            p={9}
            className="rounded-md"
          >
            <Text size="sm">AppForm</Text>
            <Badge
              onClick={onRegCheckStatusClick}
              color={getRegCheckStatusColor()}
              size="md"
            >
              {getRegCheckStatusText()}
            </Badge>
          </Flex>
          {/* <Divider orientation='horizontal'></Divider> */}
          <Flex
            justify="space-between"
            align="flex-start"
            direction="row"
            wrap="nowrap"
            p={9}
          >
            <Text size="xs" fw="700">
              ID: {appFormId}
            </Text>
            {failureText}
            {manualApprovalButtons}
          </Flex>
        </Stack>
        {/* </Card.Section> */}
      </Paper>
      // </Group>
    );
  }

  function getManualApprovalButtons() {
    if (enableManualApproval(appFormData!, regCheckDetailed.data!.status)) {
      return <Button onClick={open}>Resolve</Button>;
    }
    return <></>;
  }

  function getApplicantDetails(): React.ReactNode {
    if (regCheckDetailed.data!.status === 'FAILURE') {
      return <></>;
    }
    const regCheckSection = regCheckDetailed.data!.result?.regCheckSection;
    return regCheckSection?.map((section) => {
      return (
        <Fragment key={section.applicantDetails.applicantId}>
          <Space h="lg" />
          <Card
            shadow="sm"
            radius="md"
            key={section.applicantDetails.applicantId}
          >
            <Card.Section withBorder inheritPadding mt="xs" pb="xs">
              {getApplicantSummary(
                section.applicantDetails,
                section.applicantStatus,
              )}
              {getApplicantDetailed(section.source)}
              {/*<Divider my="xs" />*/}
            </Card.Section>
          </Card>
        </Fragment>
      );
    });
  }

  function getApplicantSummary(
    applicantDetails: RegCheckApplicantDetails,
    applicantStatus: ApplicantStatus,
  ): ReactNode {
    let statusColor = 'green';
    if (applicantStatus.toLowerCase() === 'rejected') {
      statusColor = 'red';
    }
    return (
      <Grid grow gutter="4">
        <Grid.Col span={4}>
          {getValueWithLabel('APPLICANTID', applicantDetails.applicantId)}
        </Grid.Col>
        <Grid.Col span={4}>
          {getValueWithLabel('NAME', applicantDetails.name)}
        </Grid.Col>
        <Grid.Col span={4}>
          {getValueWithLabel(
            'status',
            applicantStatus,
            {},
            { c: statusColor, tt: 'capitalize' },
          )}
        </Grid.Col>
        <Grid.Col span={4}>
          {getValueWithLabel('AGE', applicantDetails.age)}
        </Grid.Col>
        <Grid.Col span={4}>
          {getValueWithLabel('GENDER', applicantDetails.gender)}
        </Grid.Col>
        <Grid.Col span={4}>
          {getValueWithLabel('ADDRESS', applicantDetails.address)}
        </Grid.Col>
      </Grid>
    );
  }

  function getApplicantDetailed(sources: RegCheckSources): ReactNode {
    /*iterate over object*/

    return (
      <Accordion defaultValue={'regCheck'}>
        <Accordion.Item
          value={'Regulatory Check Match Details'}
          key={'regCheck'}
        >
          <Accordion.Control>
            <Text tt="uppercase" fw={700}>
              Regulatory Check Match Details
            </Text>
          </Accordion.Control>
          {Object.entries(sources).map(([key, value]) => {
            if (value != null && value.length > 0) {
              const sourceData = value[0];
              const scores = sourceData.applicantScore;
              const miscData = sourceData.misc;
              return (
                <>
                  <Divider orientation="horizontal"></Divider>
                  <Accordion.Panel key={key}>
                    <Text tt="uppercase" fw={700}>
                      {key}
                    </Text>
                    <Space h="md" />
                    <Grid>
                      <Grid.Col span={4} key={'name_match'}>
                        {getValueWithLabel('Name Match Score', scores.name)}
                      </Grid.Col>
                      <Grid.Col span={4} key={'age_match'}>
                        {getValueWithLabel('Age Match Score', scores.age)}
                      </Grid.Col>
                      <Grid.Col span={4} key={'gender_match'}>
                        {getValueWithLabel('Gender Match Score', scores.gender)}
                      </Grid.Col>
                      <Grid.Col span={4} key={'address_match'}>
                        {getValueWithLabel(
                          'Address Match Score',
                          scores.address,
                        )}
                      </Grid.Col>
                      {Object.keys(miscData).map((miscKey) => (
                        <Grid.Col span={4} key={miscKey}>
                          {getValueWithLabel(miscKey, miscData[miscKey])}
                        </Grid.Col>
                      ))}
                    </Grid>
                  </Accordion.Panel>
                </>
              );
            }
            return null;
          })}

          <Divider orientation="horizontal"></Divider>
          <Accordion.Panel>
            <Space h="md" />
            <Grid>
          {Object.entries(sources).map(([key, value]) => {
            
            if (!value.length) {
              return (
                   
                      
                <Grid.Col span={4} key={key}>
                      <Text tt="uppercase" fw={700}>
                        {key}
                      </Text>
                        No Match Found
                      </Grid.Col>

              );
            }
          })}
            </Grid>
          </Accordion.Panel>
        </Accordion.Item>
      </Accordion>
    );
  }

  function getValueWithLabel(
    label: string,
    value: string | number | null,
    labelProps: TextProps = {},
    valueProps: TextProps = {},
  ): ReactElement {
    return (
      <Stack align="stretch" justify="center" gap={4}>
        <Text tt="uppercase" size="xs" {...labelProps}>
          {label}
        </Text>
        <Text fw={700} size="sm" {...valueProps}>
          {value}
        </Text>
      </Stack>
    );
  }

  function getConfirmationModal() {
    return (
      <>
        <Modal opened={opened} onClose={close} title="Confirm Action">
          <Stack align="stretch" justify="center">
            <Text>Are you sure you want to approve?</Text>
            <Button onClick={onApprovalClick}> Approve</Button>
          </Stack>
        </Modal>
      </>
    );
  }

  function onApprovalClick() {
    close();
    updateRegCheck.mutate({
      appFormId,
      newStatus: {
        status: '2',
        payload: {
          workflowId: appFormData?.workflowId as string,
          loanProduct: appFormData?.loanProduct as string,
        },
      },
    });
  }

  /**TODO: error handling */
  // if (regCheckDetailed.isError) {
  //   console.log('ERRORS');
  //   return <div>Error</div>;
  // }
  if (regCheckDetailed.isLoading) {
    console.log('loading');
    return (
      <div>
        <CustomSkeletonLayout />
      </div>
    );
  }
  // if (regCheckDetailed.isPending) {
  //   console.log('pending');
  //   return <div>pending</div>;
  // }

  if (regCheckDetailed.isSuccess) {
    return (
      <Container fluid style={{ padding: '60px' }}>
        {getAppFormCard()}
        {getApplicantDetails()}
        {getConfirmationModal()}
      </Container>
    );
  }
}
