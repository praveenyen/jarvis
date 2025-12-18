import { Title, Flex, Button, Tooltip, ActionIcon } from '@mantine/core';
import CustomIcon from '@/components/icons/CustomIcons';
import { useAtomValue } from 'jotai';
import constants from '@/lib/utils/constants';
import { userRoles } from '@/store/modules/user';
import { useMemo } from 'react';

export default function ApplicationDetailHeader({
  editMode,
  changeEditMode,
  revertAction,
  saveAction,
  viewHistory,
}: {
  editMode: boolean;
  changeEditMode: (editMode: boolean) => void;
  revertAction: () => void;
  saveAction: () => void;
  viewHistory: () => void;
}) {
  const userRolesData = useAtomValue<string[] | null>(userRoles);

  const isEditableRole = useMemo(() => {
    if (userRolesData && userRolesData.length > 0) {
      return userRolesData.some((role) =>
        constants.appForEditableRolesRegex.test(role),
      );
    }
    return false;
  }, [userRolesData]);

  return (
    <Flex
      direction={'row'}
      justify={'space-between'}
      align="center"
      className="w-full"
    >
      <Title order={4}> Application Details</Title>
      <Flex direction="row" justify={'space-evenly'} align={'center'} gap={10}>
        {!editMode && (
          <>
            <Button
              size="xs"
              disabled={!isEditableRole}
              color="primary"
              leftSection={
                <CustomIcon src="MaterialIcon" name="MdOutlineModeEdit" />
              }
              onClick={() => changeEditMode(!editMode)}
            >
              Edit
            </Button>
            <Button
              size="xs"
              color="primary"
              leftSection={
                <CustomIcon src="MaterialIcon" name="MdOutlineHistory" />
              }
              onClick={() => viewHistory()}
            >
              History
            </Button>
          </>
        )}
        {editMode && (
          <>
            <Tooltip label="save">
              <ActionIcon
                variant="light"
                aria-label="Settings"
                color="primary"
                size={'lg'}
                onClick={saveAction}
              >
                <CustomIcon
                  src="MaterialIcon"
                  name="MdSave"
                  size={'20px'}
                ></CustomIcon>
              </ActionIcon>
            </Tooltip>
            <Tooltip label="revert">
              <ActionIcon
                variant="light"
                aria-label="Settings"
                color="primary"
                size={'lg'}
                onClick={revertAction}
              >
                <CustomIcon
                  src="MaterialIcon"
                  name="MdUndo"
                  size={'20px'}
                ></CustomIcon>
              </ActionIcon>
            </Tooltip>
            <Tooltip label="exit">
              <ActionIcon
                variant="light"
                aria-label="Settings"
                color="primary"
                size={'lg'}
                onClick={revertAction}
              >
                <CustomIcon
                  src="MaterialIcon"
                  name="MdExitToApp"
                  size={'20px'}
                ></CustomIcon>
              </ActionIcon>
            </Tooltip>
          </>
        )}
      </Flex>
    </Flex>
  );
}
