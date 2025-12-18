import {
    Document
} from '@/components/documents/DocumentScreenType';

import { Box, Button, Center, Grid, Text } from '@mantine/core';

type props = {
    sourceData: Document,
    sourceEntityId: string,
    sourceSectionId: string,
    unTagFile: (sourceEntityId: string, sourceSectionId: string, fileId:number) => void;
    closeUnTagModal: ()=>void;
};
export function UntagCategory(props: props) {

    const { sourceData, sourceEntityId, sourceSectionId, unTagFile, closeUnTagModal } = props


    const moveFileToUntag = () => {
        unTagFile(sourceEntityId, sourceSectionId, sourceData.id)
    }

    return (
        <Box>
            <Center pb={15} style={{ flexDirection: 'column', textAlign: 'center' }}>
                <Text fw={700}>
                    Remove tag {sourceData.osvStatus && (<>and OSV </>)}from file?  <br />
                </Text>
                <Text mt={5}>{sourceData.filename}</Text>
            </Center>

            <Center>
                <Grid justify="center" align="center" gutter="md">
                    <Grid.Col span="auto">
                        <Button color="red" variant="filled" onClick={moveFileToUntag}>
                            Remove
                        </Button>
                    </Grid.Col>
                    <Grid.Col span="auto">
                        <Button variant="outline" color="gray" onClick={() => {/* handle cancel here */ }}>
                            Cancel
                        </Button>
                    </Grid.Col>
                </Grid>
            </Center>

        </Box>
    );
}
