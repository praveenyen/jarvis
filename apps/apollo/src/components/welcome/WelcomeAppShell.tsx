'use client';

import { Text, Stack, MantineTransition } from '@mantine/core';
import { use, useEffect, useState } from 'react';
import { atom, useAtom } from 'jotai';
import { LoadingOverlay } from '@mantine/core';
import { Box, Title } from '@mantine/core';
import BrandLogo from '@/components/common/BrandLogo';
import { user } from '@/store/atoms';
import { Transition } from '@mantine/core';
import { randomIntFromInterval } from '@/lib/utils/utils';

const transitionTypes: MantineTransition[] = [
  'pop',
  'fade-left',
  'fade-right',
  'scale-x',
  'fade-up',
];
export default function WelcomeAppShell() {
  // const [opened, { toggle }] = useDisclosure();
  // const [appFormData, setappFormData] = useAtom(appFormRawData);
  const [open, setOpened] = useState(false);
  const [userData, _] = useAtom(user);

  useEffect(() => {
    let stopenTimeout = setTimeout(() => {
      setOpened(true);
    }, 0);
    () => {
      clearTimeout(stopenTimeout);
    };
  }, []);

  return (
    <Box
      w="100%"
      h="100%"
      display="flex"
      flex="column"
      style={{ justifyContent: 'center', alignItems: 'center' }}
    >
      <LoadingOverlay
        visible={!userData}
        zIndex={1000}
        overlayProps={{ radius: 'sm', blur: 2, mt: '-50px' }}
        loaderProps={{ color: 'primary', type: 'dots' }}
      />
      {userData && (
        <Transition
          mounted={open}
          transition={transitionTypes[randomIntFromInterval(1, 5)]}
          duration={400}
          enterDelay={200}
          timingFunction="ease"
        >
          {(styles) => (
            <Stack
              style={{ marginLeft: '-5%', marginTop: '-10%', ...styles }}
              gap={2}
              justify="center"
              align="center"
              className="flex h-full items-center justify-center"
            >
              <BrandLogo height={200} width={100} />

              <Text size="3xl" c="primaryColor">
                Apollo
              </Text>
              <Text size="xl" c="neutral">
                Welcome {userData?.name}
              </Text>
              <Text size="xl" c="neutral">
                ({userData?.email})
              </Text>
            </Stack>
          )}
        </Transition>
      )}
    </Box>
  );
}
