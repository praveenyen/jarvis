import { Box, Button, Center, Grid, Text } from '@mantine/core';
import { Document } from '@/components/documents/DocumentScreenType';

export function DeleteDocModel({
  doc,
  idPath,
  deleteDocElement,
  cancelUploadDetails,
}: {
  doc: Document;
  idPath: string;
  deleteDocElement: (doc: Document, idPath: string, openType: string) => void;
  cancelUploadDetails: () => void;
}) {
  return (
    <Box>
      <Center pb={15}>
        {' '}
        <Text fw={700}>
          Do you want to proceed deleting document '{doc.filename}'
        </Text>
      </Center>
      <Grid justify="center" align="flex-start">
        <Grid.Col span={3}>
          <Button
            variant="filled"
            onClick={() => deleteDocElement(doc, idPath, 'delete')}
          >
            Yes
          </Button>
        </Grid.Col>
        <Grid.Col span={3}>
          <Button
            variant="filled"
            color="red"
            onClick={() => cancelUploadDetails()}
          >
            No
          </Button>
        </Grid.Col>
      </Grid>
    </Box>
  );
}
