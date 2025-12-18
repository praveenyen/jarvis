import { Loader, Center } from '@mantine/core';

export default function LoadingSkeleton({
  children,
}: {
  children?: React.ReactNode;
}) {
  return (
    <Center style={{ height: '60vh' }}>
      <Loader type="dots" size="md" color="primaryBlue">
        {children}
      </Loader>
    </Center>
  );
}
