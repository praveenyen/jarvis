'use client';

import { Draggable, Droppable } from '@hello-pangea/dnd';
import { Box, Card, Title, Text, Grid, Tooltip } from '@mantine/core';
import {
  DocumentDetails,
  TaggedUnTaggedData,
} from '@/components/documents/DocumentScreenType';
import { TAppformData } from '@/lib/queries/shield/queryResponseTypes';
import { useAtomValue } from 'jotai';
import { appFormRawData } from '@/store/atoms';
import CustomIcon from '@/components/icons/CustomIcons';

type Props = {
  untaggedList: DocumentDetails[];
  appFormDocList: any;
  openFileNewTab: (fileLink: string) => void;
  deleteDocElement: (
    doc: DocumentDetails,
    idPath: string,
    openType: string,
  ) => void;
};

export default function UntaggedFilesMainComponent(props: Props) {
  const { untaggedList, appFormDocList, deleteDocElement, openFileNewTab } =
    props;
  const appformData: TAppformData | null = useAtomValue(appFormRawData);

  const openLinkNewTab = async (s3Link: string) => {
    openFileNewTab(s3Link);
  };

  return (
    <Droppable droppableId="untaggedList">
      {(provided) => (
        <Box ref={provided.innerRef} {...provided.droppableProps}>
          <h2 className="mb-2 font-bold">Untagged Files</h2>
          <Text size="sm">
            Drag and drop files to tag them to categories on the left
          </Text>

          {/* Scrollable internal content */}
          <Box mt="sm">
            {untaggedList.map((untaggedElm: DocumentDetails, index: number) => (
              <Draggable
                key={untaggedElm.s3Url + index}
                draggableId={`untagged ${untaggedElm.id} ${index}`}
                index={index}
              >
                {(provided) => (
                  <Card
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    p="xs"
                    className="group mb-2 rounded-lg bg-white shadow-sm"
                    onClick={() => {
                      openLinkNewTab(untaggedElm.s3Url);
                    }}
                  >
                    <Tooltip label={untaggedElm.filename}>
                      <Grid justify="space-between" align="center">
                        <Grid.Col span="auto">
                          <Text size="xs" truncate>
                            {untaggedElm.filename}
                          </Text>
                        </Grid.Col>
                        <Grid.Col
                          span="content"
                          className="flex items-center justify-end"
                        >
                          <Tooltip label="Delete">
                            <CustomIcon
                              className="cursor-pointer opacity-0 transition-opacity duration-200 group-hover:opacity-100"
                              src="MaterialIcon"
                              name="MdDeleteOutline"
                              size="15px"
                              onClick={(event) => {
                                event.stopPropagation();
                                deleteDocElement(
                                  untaggedElm,
                                  `untagged ${untaggedElm.id}`,
                                  'modal',
                                );
                              }}
                            />
                          </Tooltip>
                        </Grid.Col>
                      </Grid>
                    </Tooltip>
                  </Card>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </Box>
        </Box>
      )}
    </Droppable>
  );
}
