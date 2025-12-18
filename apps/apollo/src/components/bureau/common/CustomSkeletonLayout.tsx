'use client';

import { Skeleton, Group, Stack, Flex, Box } from '@mantine/core';

export default function CustomSkeletonLayout() {
  return (
    <Stack gap="md" align="start" w={'100%'}>
      <Flex gap="xs" w={'100%'}>
        <Box w={'50%'}>
          <Skeleton height={100} width={'100%'} radius="sm" />
        </Box>
        <Box w={'50%'}>
          <Skeleton height={'100%'} width={'100%'} radius="sm" />
        </Box>
      </Flex>

      <Stack gap="xs" w={'100%'}>
        <Skeleton height={20} width={'50%'} radius="sm" />
        <Skeleton height={20} width={'50%'} radius="sm" />
      </Stack>

      <Stack gap={24} w={'100%'}>
        <Skeleton height={50} width="90%" />
        <Skeleton height={20} width="85%" />
        <Skeleton height={20} width="95%" />
      </Stack>
    </Stack>
  );
}
