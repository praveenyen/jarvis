import '@mantine/core/styles.css';
import React, { ReactNode } from 'react';
import '@mantine/dates/styles.css';
import '@/app/globals.css';
import '@mantine/notifications/styles.css';
import '@mantine/spotlight/styles.css';
import DatadogInit from "@/app/datadog-init";
import { NavbarCustom } from '@/components/sidenav/NavBar';
import ConfigureAmplifyClientSide from '@/auth/ConfigureAmplifyClientSide';
import { figtree } from '@/components/fonts/fonts';
import Providers from '@/components/providers/Providers';
import type { Metadata } from 'next';
import type { Viewport } from 'next';

export const metadata: Metadata = {
  title: 'Apollo',
  description: 'Credit Saison India Internal dashboard',
  icons: {
    icon: '/favicon.ico',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  // Also supported but less commonly used
  // interactiveWidget: 'resizes-visual',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  function getNavBar(): React.ReactNode {
    return <NavbarCustom />;
  }

  return (
    <html lang="en">
      <head>
        {/*Taken from https://mantine.dev/guides/next/ . This causes hydration errors.
      https://github.com/mantinedev/next-app-template/issues/7.
      Removing this until we need
      */}
        {/* <ColorSchemeScript />*/}
        {/* <link rel="shortcut icon" href="/favicon.ico" />
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width, user-scalable=no"
        />
        <title>Apollo</title> */}
      </head>
      <body className={figtree.className}>
        <DatadogInit />
          <div className="flex h-screen">
            <div className="screen-width-full overflow-x-auto shrink-0">
                <div className="relative flex w-full justify-center overflow-auto overflow-y-auto w-auto">
                  <div className="h-screen w-full">{children}</div>
                </div>
            </div>
          </div>
        {/*    <Provider>
      <QueryClientProvider client={queryClient}>
        <ReactQueryStreamedHydration>
          <MantineProvider
            theme={theme}
            cssVariablesResolver={customCssVariableResolver}
          >

          </MantineProvider>
        </ReactQueryStreamedHydration>
      </QueryClientProvider>
    </Provider>*/}
      </body>
    </html>
  );
}
