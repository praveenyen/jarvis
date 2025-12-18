'use client';

import {
  Button,
  Group,
  Text,
  Card,
  ActionIcon,
  LoadingOverlay,
  Tabs,
  Stack,
  Paper,
  Select,
  Checkbox,
  Textarea,
  Avatar,
  Indicator,
  Menu,
  Autocomplete,
} from '@mantine/core';
import React, {
  useState,
  useEffect,
  useMemo,
  ReactNode,
  useCallback,
  memo,
} from 'react';
import '@/components/discrepancy/DiscrepancyManagement.css';
import CustomChip from '@/components/common/CustomChip';
import '@mantine/core/styles.css';
import { formatUTCtoIST } from '@/lib/utils/utils';
import { useAtomValue } from 'jotai';
import { appFormRawData } from '@/store/atoms';
import { allUsers, user } from '@/store/atoms/user';
import { useLoader } from '@/lib/context/loaders/useLoader';
import CustomIcon from '../icons/CustomIcons';
import {
  useDiscrepancyData,
  useNarrations,
  useAddDiscrepancy,
  useUpdateDiscrepancy,
} from '@/lib/queries/kaizen/queries';
import {
  DiscrepancyList,
  Narration,
  NarrationList,
} from '@/lib/queries/kaizen/queryResponseTypes';
import {
  UsersResponse,
  AppUser,
} from '@/lib/queries/heimdall/queryResponseTypes';
import { useNotification } from '@/lib/context/notifications/useNotifications';
import { useQueryClient } from '@tanstack/react-query';
import {
  getDiscrepancyDataQKey,
  getNarrationsQKey,
} from '@/lib/queries/queryKeys';
import { useAppFormPatch } from '@/lib/queries';
import {
  TAppFormEditData,
  TAppformData,
} from '@/lib/queries/shield/queryResponseTypes';

const DiscrepancyManagement = ({
  appFormId,
  setAppFormData,
  fnRefetchDiscrepancyStatus,
}: {
  appFormId: string;
  setAppFormData: Function;
  fnRefetchDiscrepancyStatus: Function;
}) => {
  const [openDiscrepancyModal, setOpenDiscrepancyModal] =
    useState<boolean>(false);
  const [view, setView] = useState('dashboard');
  const [dashboardAction, setDashboardAction] = useState('logview');

  const { notify } = useNotification();

  const appFormData = useAtomValue(appFormRawData);
  const userData = useAtomValue(user);
  const queryClient = useQueryClient();

  const { data: discrepancyData } = useDiscrepancyData(appFormId);
  const { data: narrationList } = useNarrations();

  const addDiscrepancyErrorFunc = () => {
    notify({ message: 'Failed to add discrepancy', type: 'error' });
  };
  const addDiscrepancySuccessFunc = async () => {
    notify({ message: 'Discrepancy added successfully', type: 'success' });
    fnRefetchDiscrepancyStatus();
    resetData();
  };

  const updateDiscrepancyErrorFunc = () => {
    notify({ message: 'Failed to update discrepancy', type: 'error' });
  };
  const updateDiscrepancySuccessFunc = async () => {
    notify({ message: 'Discrepancy updated successfully', type: 'success' });
    fnRefetchDiscrepancyStatus();
    resetData();
  };

  const updateDiscrepancy = useUpdateDiscrepancy(
    updateDiscrepancyErrorFunc,
    updateDiscrepancySuccessFunc,
  );
  const addDiscrepancy = useAddDiscrepancy(
    addDiscrepancyErrorFunc,
    addDiscrepancySuccessFunc,
  );

  const onAppFormPatchError = () => {
    notify({ message: 'Failed to update appform', type: 'error' });
  };
  const onAppFormPatchSuccess = async (data: TAppformData) => {
    setAppFormData(data);
    notify({
      message: 'Appform updated successfully',
      type: 'success',
    });
  };

  const appFormPatch = useAppFormPatch(
    onAppFormPatchError,
    onAppFormPatchSuccess,
    { requestingSub: userData?.sub || '' },
  );

  const [pendingDiscrepancies, setPendingDiscrepancies] = useState<
    DiscrepancyList[] | undefined
  >([]);
  const [resolvedDiscrepancies, setResolvedDiscrepancies] = useState<
    DiscrepancyList[] | undefined
  >([]);
  const [droppedDiscrepancies, setDroppedDiscrepancies] = useState<
    DiscrepancyList[] | undefined
  >([]);
  const [editComment, setEditComment] = useState<string>('');
  const [selectedAction, setSelectedAction] = useState<string>('');
  const [selectedDiscrepancy, setSelectedDiscrepancy] =
    useState<DiscrepancyList | null>();
  const [selectedNarrations, setSelectedNarrations] = useState([]);

  const narrations = useMemo(() => {
    return narrationList?.map((narration) => {
      return {
        ...narration,
        remarks: narration?.narration,
      };
    });
  }, [discrepancyData,narrationList]);


  useEffect(() => {
    prepareDiscrepancyList();
  }, [discrepancyData]);

  const stageString: Object = {
    bookingstage: 'Booking',
    qcstage: 'Qc Stage',
    creditstage: 'Credit Stage',
    disbursalstage: 'Disbursal',
  };

  const getBadgeColor = useCallback(function (status: string | undefined) {
    if (!status) return 'primary';
    switch (status) {
      case 'RESOLVED':
        return 'green';
      case 'PENDING':
        return '#a8352e';
      case 'DROPPED':
        return 'orange';
      default:
        return 'primary';
    }
  }, []);

  const prepareDiscrepancyList = () => {
    const discrepancies = discrepancyData?.flatMap(
      (d) => d?.discrepancyDetails,
    );
    setPendingDiscrepancies(
      discrepancies?.filter((d) => d?.status === 'PENDING'),
    );
    setResolvedDiscrepancies(
      discrepancies?.filter((d) => d?.status === 'RESOLVED'),
    );
    setDroppedDiscrepancies(
      discrepancies?.filter((d) => d?.status === 'DROPPED'),
    );
  };

  const fnAssignDiscrepancy = async () => {
    const addDiscrepancyData = selectedNarrations.map((narration) => ({
      commentText: narration?.remarks,
      createdBy: userData?.sub,
      taggedUsers: [],
      status: 'PENDING',
      stage: appFormData?.stage,
      narrationId: narration?.id,
      remarks: narration?.remarks,
      lpc: appFormData?.loanProduct,
      narrationText: narration?.narration,
    }));

    addDiscrepancy.mutate({
      appFormId: appFormId,
      reqData: addDiscrepancyData,
    });
  };

  const fnUpdateAppForm = async () => {
    let editRequests: TAppFormEditData[] = [];
    editRequests = [
      {
        resourcePath: '',
        editData: {
          reviewed: !appFormData?.reviewed,
        },
      },
    ];
    appFormPatch.mutate({
      appFormId: appFormId,
      checkAppFormStatus: true,
      reRunCpcChecks: false,
      validationRequired: false,
      reqData: { editRequests },
    });
  };

  const getUserName = (mailId: string) => {
    if (!mailId) return 'Unknown User';
    const emailName = mailId.split('@')[0];
    const names = emailName.split('.');
    return names
      .map((name: string) => name.charAt(0).toUpperCase() + name.slice(1))
      .join(' ');
  };

  const getInitials = (name: string) => {
    if (!name) return '??';
    const parts = name.split(' ');
    if (parts.length > 1) {
      return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  const onDiscrepancyCardClick = (card: DiscrepancyList) => {
    setSelectedDiscrepancy(card);
    setView('details');
  };

  const fnResolveOrDrop = (status: string) => {
    if (!editComment.trim()) {
      notify({ message: 'Failed to update discrepancy', type: 'error' });
      return;
    }
    const payload = [
      {
        id: selectedDiscrepancy?.id,
        commentText: editComment,
        createdBy: userData?.sub,
        taggedUsers: [],
        status: selectedDiscrepancy?.status,
        stage: appFormData?.stage,
        remarks: editComment,
        lpc: appFormData?.loanProduct,
        narrationText: selectedDiscrepancy?.narration,
      },
    ];
    if (status != 'ADD') {
      payload.push({
        id: selectedDiscrepancy?.id,
        commentText: status,
        createdBy: userData?.sub,
        taggedUsers: [],
        status: status,
        stage: appFormData?.stage,
        remarks: status,
        lpc: appFormData?.loanProduct,
        narrationText: selectedDiscrepancy?.narration,
      });
    }
    updateDiscrepancy.mutate({ appFormId: appFormId, reqData: payload });
  };

  const resetData = async () => {
    setView('dashboard');
    setSelectedDiscrepancy(null);
    setEditComment('');
    setSelectedNarrations([]);
    await queryClient.invalidateQueries({
      queryKey: getDiscrepancyDataQKey(appFormId),
    });
    await queryClient.invalidateQueries({
      queryKey: getNarrationsQKey(),
    });
  };

  const DiscrepancyHeader = memo(function DiscrepancyHeader(): ReactNode {
    return (
      <div className="discrepancy-header-container bg-[#1058ad]">
        {
          view !== 'dashboard' ? (
            <ActionIcon variant="transparent">
              <CustomIcon
                src={'MaterialIcon'}
                name={'MdKeyboardBackspace'}
                size="20px"
                style={{ cursor: 'pointer', color: 'white' }}
                onClick={() => {
                  resetData();
                }}
              />
            </ActionIcon>
          ) : (
            <div className="w-8"></div>
          ) /* Spacer */
        }
        <Text fw={700} size="lg" c="white">
          Discrepancy
        </Text>
        <ActionIcon variant="transparent">
          <CustomIcon
            src={'MaterialIcon'}
            name={'MdHighlightOff'}
            size="20px"
            style={{ cursor: 'pointer', color: 'white' }}
            onClick={() => {
              setOpenDiscrepancyModal((prev) => (prev = false));
              resetData();
            }}
          />
        </ActionIcon>
      </div>
    );
  });

  const RenderNoDiscrepancies = memo(
    function RenderNoDiscrepancies(): ReactNode {
      return (
        <div className="flex h-96 flex-col items-center justify-center text-gray-500">
          <Text mt="md">No discrepancies found</Text>
        </div>
      );
    },
  );

  function DashboardView(): ReactNode {
    return (
      <>
        <div className="flex-grow overflow-y-auto p-0">
          <Tabs defaultValue="Pending">
            <Tabs.List grow>
              <Tabs.Tab value="Pending">
                Pending ({pendingDiscrepancies?.length || 0})
              </Tabs.Tab>
              <Tabs.Tab value="Resolved">
                Resolved ({resolvedDiscrepancies?.length || 0})
              </Tabs.Tab>
              <Tabs.Tab value="Dropped">
                Dropped ({droppedDiscrepancies?.length || 0})
              </Tabs.Tab>
            </Tabs.List>
            <div className="border-b-2 border-gray-200 p-2">
              <Group grow mt="xs" mb="xs">
                <Button onClick={() => setView('add')}>Add Discrepancy</Button>
                <Button variant="outline" onClick={() => fnUpdateAppForm()}>
                  {appFormData?.reviewed
                    ? 'Mark as Unreviewed'
                    : 'Mark as Reviewed'}
                </Button>
              </Group>
            </div>

            <Tabs.Panel value="Pending" pt="xs">
              {pendingDiscrepancies?.length ? (
                pendingDiscrepancies?.map((card) => DiscrepancyCard(card))
              ) : (
                <RenderNoDiscrepancies />
              )}
            </Tabs.Panel>
            <Tabs.Panel value="Resolved" pt="xs">
              {resolvedDiscrepancies?.length ? (
                resolvedDiscrepancies?.map((card) => DiscrepancyCard(card))
              ) : (
                <RenderNoDiscrepancies />
              )}
            </Tabs.Panel>
            <Tabs.Panel value="Dropped" pt="xs">
              {droppedDiscrepancies?.length ? (
                droppedDiscrepancies?.map((card) => DiscrepancyCard(card))
              ) : (
                <RenderNoDiscrepancies />
              )}
            </Tabs.Panel>
          </Tabs>
        </div>
      </>
    );
  }

  function AddView(): ReactNode {
    return (
      <>
        <div className="flex-grow overflow-y-auto p-4">
          <Stack>
            <Select
              label="Select the narration"
              allowDeselect={false}
              searchable={true}
              withCheckIcon={true}
              placeholder="Select narrations"
              style={{ flex: 1, zIndex: 150 }}
              data={narrations?.map((narration) => narration?.narration)}
              onChange={(value: string | null, option) => {
                let isNarrationPresent = selectedNarrations?.find(
                  (currentValue) => currentValue?.narration == value,
                );
                if (isNarrationPresent) {
                  notify({ message: 'Narration already added', type: 'error' });
                } else {
                  let obj = narrations?.find((filterNarration) => filterNarration?.narration == value);
                  setSelectedNarrations((prevNarrations) => [
                    ...prevNarrations,
                    obj,
                  ]);
                }
              }}
            />
            {selectedNarrations &&
              selectedNarrations?.map((selectedNarration, index) => (
                <Stack gap="sm" key={index}>
                  <Group justify="space-between">
                    <Text>{selectedNarration?.narration}</Text>
                    <ActionIcon variant="transparent">
                      <CustomIcon
                        src={'MaterialIcon'}
                        name={'MdOutlineClose'}
                        size="20px"
                        style={{ cursor: 'pointer' }}
                        onClick={() => {
                          selectedNarration.remarks =
                            selectedNarration?.narration;
                          setSelectedNarrations(
                            selectedNarrations.filter((s, i) => i != index),
                          );
                        }}
                      />
                    </ActionIcon>
                  </Group>

                  <Textarea
                    key={index}
                    autosize
                    className="mt-2"
                    value={selectedNarration?.remarks}
                    onChange={(event) => {
                      setEditComment(event.currentTarget.value);
                      selectedNarration.remarks = event.currentTarget.value;
                    }}
                    required
                  />
                </Stack>
              ))}
          </Stack>
        </div>
        <div className="border-t border-gray-200 p-4">
          <Button fullWidth onClick={fnAssignDiscrepancy}>
            Submit
          </Button>
        </div>
      </>
    );
  }
  function DetailsView(): ReactNode {
    return (
      <>
        {dashboardAction == 'logview' && (
          <div
            className="absolute left-0 right-0 top-14 z-10 flex items-center justify-center"
            style={{
              backgroundColor: getBadgeColor(selectedDiscrepancy?.status),
              height: '25px',
            }}
          >
            <Text size="sm" c="white" fw={600}>
              {selectedDiscrepancy?.status}
            </Text>
          </div>
        )}
        {selectedDiscrepancy?.status === 'PENDING' && dashboardAction == 'actionview'  && (
          <>
            {view === 'details' && DiscrepancyCard(selectedDiscrepancy)}
            <div className="mt-4 border-t border-gray-200 bg-white p-4">
              <Textarea
                placeholder="Write something here..."
                size={'md'}
                resize="vertical"
                label="Enter Comments"
                value={editComment}
                rightSection={
                  <ActionIcon variant="white" disabled={!editComment.trim()}>
                    <CustomIcon
                      src={'MaterialIcon'}
                      name={'MdSend'}
                      size="20px"
                      style={{ cursor: 'pointer', color: 'brandBlue' }}
                      onClick={() => {
                        fnResolveOrDrop('ADD');
                      }}
                    />
                  </ActionIcon>
                }
                onChange={(e) => setEditComment(e.currentTarget.value)}
              />
              <Group grow mt="md">
                <Button
                  onClick={() => fnResolveOrDrop(selectedAction)}
                  disabled={!editComment.trim()}
                >
                  {selectedAction === 'DROPPED' ? 'Drop' : 'Resolve'}
                </Button>
              </Group>
            </div>
          </>
        )}
        <div className="flex-grow overflow-y-auto p-4 pt-12">
          <Stack gap="lg">
            {selectedDiscrepancy?.comments.map((comment) => (
              <Group key={comment.id} align="flex-start">
                <Avatar color="blue" radius="xl">
                  {getInitials(getUserName(comment.createdBy))}
                </Avatar>
                <div className="flex-grow">
                  <Text size="sm" fw={500}>
                    {getUserName(comment.createdBy)}
                  </Text>
                  <Text size="xs" c="dimmed">
                    {formatUTCtoIST(comment?.createdAt)}
                  </Text>
                  {['RESOLVED', 'DROPPED', 'PENDING'].includes(
                    comment.commentText,
                  ) ? (
                    <CustomChip
                      customProps={{
                        variant: 'filled',
                        color: getBadgeColor(comment?.commentText),
                        size: 'sm',
                        radius: 'sm',
                        value: comment?.commentText,
                      }}
                    />
                  ) : (
                    <Text className="mt-1 whitespace-pre-wrap text-gray-700">
                      {comment.commentText}
                    </Text>
                  )}
                </div>
              </Group>
            ))}
          </Stack>
        </div>
      </>
    );
  }

  function DiscrepancyCard(card: DiscrepancyList): ReactNode {
    return (
      <Card
        shadow="sm"
        padding="xs"
        m="xs"
        radius="md"
        withBorder
        className="cursor-pointer hover:bg-gray-50"
        key={card.id}
        // onClick={() => onDiscrepancyCardClick(card)}
      >
        <Stack gap="xs">
          <Group justify="space-between" gap="xs">
            <Text fw={600} c="blue">
              {card.narration}
            </Text>
            <Group>
              <CustomChip
                customProps={{
                  variant: 'filled',
                  color: 'brandBlue',
                  size: 'xs',
                  radius: 'sm',
                  value: stageString[card.originStage] || card?.originStage,
                }}
              />
              <CustomChip
                customProps={{
                  variant: 'filled',
                  color: getBadgeColor(card?.status),
                  size: 'xs',
                  radius: 'sm',
                  value: card?.status,
                }}
              />
            </Group>
            {view === 'dashboard' && card?.status == 'PENDING' && (
              <Menu shadow="md" width={80}>
                <Menu.Target>
                  <ActionIcon variant="transparent" color="gray">
                    <CustomIcon
                      src={'MaterialIcon'}
                      name={'MdMoreVert'}
                      style={{ cursor: 'pointer' }}
                      onClick={() => {}}
                    />
                  </ActionIcon>
                </Menu.Target>
                <Menu.Dropdown>
                  <Menu.Item
                    onClick={() => {
                      setSelectedAction('RESOLVED');
                      setDashboardAction('actionview');
                      onDiscrepancyCardClick(card);
                    }}
                  >
                    Resolve
                  </Menu.Item>
                  <Menu.Item
                    onClick={() => {
                      setSelectedAction('DROPPED');
                      setDashboardAction('actionview');
                      onDiscrepancyCardClick(card);
                    }}
                  >
                    Drop
                  </Menu.Item>
                </Menu.Dropdown>
              </Menu>
            )}
          </Group>

          <Group justify="space-between">
            <div>
              <Text size="sm" fw={600}>
                {getUserName(card.createdBy)}
              </Text>
              <Text size="xs">
                {formatUTCtoIST(card.createdAt)}
              </Text>
            </div>
            {view === 'dashboard' && (
              <ActionIcon variant="transparent" color="gray" size="xs">
                <CustomIcon
                  src={'MaterialIcon'}
                  name={'MdOutlineArrowForwardIos'}
                  style={{ cursor: 'pointer' }}
                  onClick={() => {                      
                    setDashboardAction('logview')
;                  onDiscrepancyCardClick(card)}}
                />
              </ActionIcon>
            )}
          </Group>
        </Stack>
      </Card>
    );
  }

  return (
    <>
      <div className="discrepancy-button-container">
        <Indicator
          inline
          label={pendingDiscrepancies?.length}
          color="#a8352e"
          size={16}
          radius="sm"
        >
          <ActionIcon variant="filled" size="60px" radius="xl">
            <CustomIcon
              src={'MaterialIcon'}
              name={'MdOutlineAssignment'}
              size="25px"
              style={{ cursor: 'pointer', color: 'white' }}
              onClick={() => {
                setOpenDiscrepancyModal((prev) => (prev = true));
              }}
            />
          </ActionIcon>
        </Indicator>
      </div>

      {openDiscrepancyModal && (
        <Paper p="0" className="discrepancy-container">
          <div className="flex h-[90vh] flex-col p-0">
            <LoadingOverlay
              visible={false}
              zIndex={1000}
              overlayProps={{ radius: 'sm', blur: 2, mt: '-50px' }}
              loaderProps={{ color: 'primary', type: 'dots' }}
            />
            {<DiscrepancyHeader />}
            {view === 'dashboard' && DashboardView()}
            {view === 'add' && AddView()}
            {view === 'details' && DetailsView()}
          </div>
        </Paper>
      )}
    </>
  );
};

export default DiscrepancyManagement;
