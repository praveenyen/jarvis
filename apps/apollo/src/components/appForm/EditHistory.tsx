import { Modal, Stack, Code, Blockquote, Text, Flex, Box } from '@mantine/core';
import { TAppFormChangeSet } from '@/lib/queries/shield/queryResponseTypes';
import { useEffect } from 'react';
import { UsersResponse } from '@/lib/queries/heimdall/queryResponseTypes';
import CustomIcon from '../icons/CustomIcons';
import { formattedDateTime } from '../appFormLayout/appFormHelpers';
import { useAtomValue } from 'jotai';
import { allUsers } from '@/store/atoms/user';

export default function EditHistory({
  opened,
  open,
  close,
  historyItems,
}: {
  opened: boolean;
  open: () => void;
  close: () => void;
  historyItems: TAppFormChangeSet[] | undefined;
}) {
  const allUsersData = useAtomValue<UsersResponse | null>(allUsers);
  return (
    <Modal
      opened={opened}
      onClose={close}
      title="Edit History"
      size="lg"
      styles={{ header: { top: '-20px' } }}
    >
      <Stack>
        {historyItems && historyItems.length > 0 ? (
          historyItems.reverse().map(
            (item, index) =>
              item.changeSets && (
                <Flex justify={'flex-start'} align={'flex-start'} gap={8}>
                  <Box py={4}>
                    <CustomIcon
                      src="MaterialIcon"
                      name="MdOutlineHistory"
                      size="20px"
                    />
                  </Box>
                  <Flex
                    w={'100%'}
                    direction="column"
                    gap={6}
                    style={{ borderRadius: '4px' }}
                    bg="neutral.0"
                    p={6}
                  >
                    <Flex w={'100%'} justify={'space-between'}>
                      <Flex justify={'flex-start'} gap={6} align={'center'}>
                        {allUsersData && allUsersData.users?.length > 0 && (
                          <Text size="sm" fw={600} c="primary">
                            {' '}
                            {allUsersData.users.find(
                              (user) => user.id === item.updatedBy,
                            )?.email || (
                              <Text size="sm" fw={600} c="primary">
                                {item.updatedBy}
                              </Text>
                            )}{' '}
                          </Text>
                        )}
                      </Flex>
                      <Text size="xs">
                        {' '}
                        {formattedDateTime(item.updatedAt)}
                      </Text>
                    </Flex>
                    <Stack gap={6}>
                      {item?.changeSets?.map((changeSet, index) => {
                        return (
                          <Stack gap={2} key={`changeset${index}`} pb={6}>
                            <Flex direction={'column'}>
                              <Code>
                                Resource Path:{' '}
                                {JSON.stringify(
                                  changeSet.resourcePath,
                                  null,
                                  2,
                                )}
                              </Code>
                            </Flex>
                            <Flex direction={'column'} gap={4}>
                              <Text size="xs" fw={700}>
                                Edit Data
                              </Text>
                              <Blockquote
                                radius="xl"
                                styles={{
                                  root: {
                                    fontSize: '12px',
                                    padding: '9px',
                                  },
                                }}
                              >
                                <Code>
                                  {JSON.stringify(changeSet.editData, null, 2)}
                                </Code>
                              </Blockquote>
                            </Flex>
                            <Flex direction={'column'}>
                              <Text size="xs" fw={700}>
                                Original Data
                              </Text>
                              <Blockquote
                                radius="xl"
                                styles={{
                                  root: {
                                    fontSize: '12px',
                                    padding: '9px',
                                  },
                                }}
                              >
                                <Code>
                                  {JSON.stringify(
                                    changeSet.originalData,
                                    null,
                                    2,
                                  )}
                                </Code>
                              </Blockquote>
                            </Flex>
                          </Stack>
                        );
                      })}
                    </Stack>
                    {/* <Blockquote w={'35rem'}>
                <Code>{JSON.stringify(item.changeSets, null, 2)}</Code>
              </Blockquote> */}
                  </Flex>
                </Flex>
              ),
          )
        ) : (
          <Box style={{ justifyItems: 'center', alignItems: 'center' }}>
            <Text>No Data</Text>
          </Box>
        )}
      </Stack>
    </Modal>
  );
}
