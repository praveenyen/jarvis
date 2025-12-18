'use client';
import { theme } from '@/theme/theme';
import { Provider } from 'jotai';
import React, { ReactNode } from 'react';
import { MantineProvider } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import { customCssVariableResolver } from '@/theme/cssVariableResolver';
import ReactQueryClientProvider from '@/components/providers/ReactQueryClientProvider';
import ClientAuthHydrater from '@/components/providers/ClientAuthHydrater';
import { NotificationProvider } from '@/lib/context/notifications/useNotifications';
import { LoaderProvider } from '@/lib/context/loaders/useLoader';
import Loader from '@/lib/context/loaders/Loader';
import SpotLightSearch from '@/components/common/SpotLightSearch';
import { ModalsProvider } from '@mantine/modals';
export default function Providers({ children }: { children: ReactNode }) {
  return (
    <Provider>
      <ReactQueryClientProvider>
        <MantineProvider
          theme={theme}
          cssVariablesResolver={customCssVariableResolver}
        >
          <ModalsProvider>
            <ClientAuthHydrater>
              <NotificationProvider>
                <Notifications position="top-right" zIndex={1999} />
                <LoaderProvider>
                  <Loader />
                  <SpotLightSearch />
                  {children}
                </LoaderProvider>
              </NotificationProvider>
            </ClientAuthHydrater>
          </ModalsProvider>
        </MantineProvider>
      </ReactQueryClientProvider>
    </Provider>
  );
}
