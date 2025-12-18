import {
  isServer,
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

function makeQueryClient() {
  const isDev = process.env.NODE_ENV === 'development';
  return new QueryClient({
    defaultOptions: {
      queries: {
        retry: 2,
        refetchOnWindowFocus: false,
        // Taken from https://tanstack.com/query/latest/docs/framework/react/guides/advanced-ssr
        // With SSR, we usually want to set some default staleTime
        // above 0 to avoid refetching immediately on the client
        // Longer staleTime for development
        staleTime: isDev ? 60 * 1000 : 6 * 1000, // 1 min in dev, 6 secs in prod
      },
    },
  });
}

let browserQueryClient: QueryClient | undefined = undefined;

function getQueryClient() {
  if (isServer) {
    // Server: always make a new query client
    return makeQueryClient();
  } else {
    // Browser: make a new query client if we don't already have one
    // This is very important, so we don't re-make a new client if React
    // suspends during the initial render. This may not be needed if we
    // have a suspense boundary BELOW the creation of the query client
    if (!browserQueryClient) browserQueryClient = makeQueryClient();
    return browserQueryClient;
  }
}

export default function ReactQueryClientProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  // NOTE: Avoid useState when initializing the query client if you don't
  //       have a suspense boundary between this and the code that may
  //       suspend because React will throw away the client on the initial
  //       render if it suspends and there is no boundary
  const queryClient = getQueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <ReactQueryDevtools initialIsOpen={true} />
      {children}
    </QueryClientProvider>
  );
}
