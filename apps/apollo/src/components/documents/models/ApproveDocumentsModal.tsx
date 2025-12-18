import { TAppformData } from '@/lib/queries/shield/queryResponseTypes';
import { Box, Button, Center, Grid, Text } from '@mantine/core';

type props = {
  appformData: TAppformData | null;
  approveDoc: () => void;
};
export function ApproveDocumentsModal(props: props) {
  const { appformData, approveDoc } = props;

  const approved = () => {
    approveDoc();
  };

  return (
    <Box>
      <Center pb={15} style={{ flexDirection: 'column', textAlign: 'center' }}>
        <Text fw={700}>
          Approve App ID {appformData?.id} <br />
          Documents KYC Check
        </Text>
        <Text mt={5}>Stage</Text>
      </Center>

      <Grid justify="center" align="flex-start">
        <Button variant="filled" onClick={() => approved()}>
          Approve
        </Button>
      </Grid>
    </Box>
  );
}
