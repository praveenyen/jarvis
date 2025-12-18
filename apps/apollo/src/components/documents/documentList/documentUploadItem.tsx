import { Draggable, Droppable } from '@hello-pangea/dnd';
import {
  Badge,
  Box,
  Button,
  Card,
  Divider,
  FileButton,
  Flex,
  Grid,
  Group,
  Stack,
  Text,
  Tooltip,
} from '@mantine/core';
import {
  TAppformData,
} from '@/lib/queries/shield/queryResponseTypes';
import {
  DocsSection,
  LinkedEntity,
  Document,
  TaggedUnTaggedData,
} from '@/components/documents/DocumentScreenType';
import { truncateString } from '@/lib/utils/utils';
import CustomIcon from '@/components/icons/CustomIcons';
import { useNotification } from '@/lib/context/notifications/useNotifications';
import { AppAvatar } from '@/components/common/AppAvatar';
import iconColors from '@/components/icons/iconColors';
import { useAtomValue } from 'jotai';
import { getAppFormApplicantList } from '@/store/modules/appform';
import { QcApproveRole } from '@/lib/rules/documentRules';
import { appFormRawData, userRoles } from '@/store/atoms';
import React from 'react';

type Props = {
  taggedList: TaggedUnTaggedData;
  setTaggedList: (newList: TaggedUnTaggedData) => void;
  filesUploaded: (
    file: File | null,
    doc: DocsSection | null,
    entityId: string | undefined,
    isBusiness: boolean,
  ) => void;
  deleteDocElement: (docId: Document, pathId: string, openType: string) => void;
  editDetails: (sectionPathId: string) => void;
  addTagDetails: (
    linkType: string,
    index: number,
    linkedSection: LinkedEntity | null,
    appFormDetails?: DocsSection[],
  ) => void;
  openAadharXmlModal: (doc: Document) => void;
  openFileNewTab: (docS3Url: string) => void;
};

export default function DocumentUploadItem(props: Props) {
  const appformData: TAppformData | null = useAtomValue(appFormRawData);
  const roles = useAtomValue(userRoles);

  const { notify } = useNotification();
  const {
    taggedList,
    setTaggedList,
    filesUploaded,
    deleteDocElement,
    editDetails,
    addTagDetails,
    openAadharXmlModal,
    openFileNewTab,
  } = props;

  const applicantList: any | null = useAtomValue(getAppFormApplicantList);

  const enableDisableUploadDropSection = () => {
    if (!appformData?.loanProduct) {
      return false;
    }
    if (
      !QcApproveRole(appformData.loanProduct, roles) &&
      appformData?.status == 'DEFERRAL_REVIEW_COMPLETED'
    ) {
      return true;
    } else {
      return false;
    }
  };

  const handleCopy = (
    copyComponent: DocsSection,
    doc: Document,
    linkedDocs: LinkedEntity | null,
    section: string,
  ): void => {
    const getCopiedName = (
      originalName: string,
      existingDocs: Document[],
    ): string => {
      let baseName = originalName.startsWith('copy-')
        ? originalName
        : `copy-${originalName}`;
      let newName = baseName;
      let counter = 2;

      while (existingDocs.some((d) => d.filename === newName)) {
        newName = `copy-${counter}-${originalName}`;
        counter++;
      }

      return newName;
    };

    const copyDocToSection = (docSec: DocsSection) => {
      const localDoc = { ...doc };
      localDoc.filename = getCopiedName(doc.filename, docSec.docs);
      docSec.docs.push(localDoc);
    };

    const updatedList = { ...taggedList };

    if (section === 'appForm') {
      updatedList.appForm =
        taggedList.appForm?.map((docSec) => {
          if (docSec.sectionId === copyComponent.sectionId) {
            copyDocToSection(docSec);
          }
          return docSec;
        }) || [];
    }

    if (section === 'linkedIndividuals' && linkedDocs) {
      updatedList.linkedIndividuals = taggedList.linkedIndividuals.map(
        (entity) => {
          if (entity.entityId === linkedDocs.entityId) {
            entity.docsSections = entity.docsSections.map((docSec) => {
              if (docSec.sectionId === copyComponent.sectionId) {
                copyDocToSection(docSec);
              }
              return docSec;
            });
          }
          return entity;
        },
      );
    }

    if (section === 'linkedBusiness' && taggedList.linkedBusiness) {
      updatedList.linkedBusiness = {
        ...taggedList.linkedBusiness,
        docsSections: taggedList.linkedBusiness.docsSections.map((docSec) => {
          if (docSec.sectionId === copyComponent.sectionId) {
            copyDocToSection(docSec);
          }
          return docSec;
        }),
      };
    }

    setTaggedList(updatedList);
  };

  const openLinkNewTab = async (document: Document) => {
    if (
      document.docType &&
      document.docType &&
      /^aadhaar(xml|json)?$/.test(document.docType.toLowerCase()) &&
      /\.(xml|json)$/i.test(document.filename)
    ) {
      openAadharXmlModal(document);
    } else {
      openFileNewTab(document.s3Url);
    }
  };

  const showDelete = (entityId: string, sectionId: string, doc: any) => {
    let result = true;
    if (!(entityId && sectionId && doc)) result = true;
    else if (
      appformData?.stage === 'disbursalstage' ||
      appformData?.stage === 'bookingstage' ||
      taggedList.dmsComplete
    ) {
      result = false;
    }

    return result;
  };

  const isDragAndDropEnablerOrEdit = (section: DocsSection) => {
    if (
      (taggedList.dmsComplete && section.checklist) ||
      appformData?.appFormStatus === '-20'
    ) {
      return true;
    }
    return false;
  };

  const getLeftBorderColor = (docSections: DocsSection): string => {
    if (docSections.osvStatus === true) return '#4caf50';
    if (docSections.osvStatus === false) return '#f44336';

    if (docSections.checklist == true) return '#2974db'; 

    return 'transparent'; 
  };

  return (
    <Box className="text-xs">
      <Stack justify="center" gap="md">
        {taggedList.linkedIndividuals.length > 0 &&
          taggedList.linkedIndividuals.map(
            (linkedDocs: LinkedEntity, linkedIndex: number) => (
              <Stack key={linkedDocs.entityId + linkedIndex} gap={40}>
                {applicantList?.map((item: any, index: number) =>
                  item.id == linkedDocs.entityId ? (
                    <Group key={index} ml={20}>
                      <AppAvatar
                        size="md"
                        radius="sm"
                        name=""
                        color={iconColors[0]}
                        key={item.id}
                      >
                        {item.iconText}
                      </AppAvatar>
                      <Stack gap={3}>
                        <Text size="sm" fw={700}>
                          {item.name}
                        </Text>
                        <Text size="xs">{item.type}</Text>
                      </Stack>
                    </Group>
                  ) : null,
                )}

                {linkedDocs.docsSections.map(
                  (docSections: DocsSection, index: number) => (
                        <Box key={linkedDocs.entityId + docSections.sectionId + index}>
                      
                          <Droppable
                            droppableId={`linkedIndividuals ${linkedDocs.entityId} ${docSections.sectionId} ${index}`}
                          >
                            
                            {(provided, snapshot) =>
                              docSections.docs.length === 0 ? (

                                <Box>
                              <Grid>
                                <Grid.Col span={2}>
                                  {docSections.section}
                                </Grid.Col>
                                <Grid.Col span={10}>
                                  <Box
                                    ref={provided.innerRef}
                                    {...provided.droppableProps}
                                    className={`relative rounded-md p-4 shadow-md transition-all ${snapshot.isDraggingOver
                                      ? 'border-2 border-blue-400 bg-blue-100'
                                      : 'bg-gray-100'
                                      }`}
                                    style={{
                                      borderLeft:
                                        '4px solid ' +
                                        getLeftBorderColor(docSections),
                                    }}
                                  >
                                    <Box
                                      style={{
                                        border: '1px dashed #ccc',
                                        borderRadius: 6,
                                        padding: '12px',
                                        textAlign: 'center',
                                        backgroundColor: '#f9f9f9',
                                      }}
                                    >
                                      <Text size="xs" color="dimmed">
                                        Drop file or{' '}
                                        <FileButton
                                          onChange={(file) =>
                                            filesUploaded(
                                              file,
                                              docSections,
                                              linkedDocs.entityId,
                                              true,
                                            )
                                          }
                                          accept="*"
                                        >
                                          {(props) => (
                                            <Button
                                              variant="subtle"
                                              size="xs"
                                              {...props}
                                              disabled={enableDisableUploadDropSection()}
                                            >
                                              upload
                                            </Button>
                                          )}
                                        </FileButton>
                                      </Text>
                                    </Box>
                                  </Box>
                                </Grid.Col>
                              </Grid>
                            </Box>
                              ) : (
                          <Box>
                                <Grid>
                                  <Grid.Col span={2}> {docSections.section}</Grid.Col>
                                  <Grid.Col span={10}>
                                    <div
                                      ref={provided.innerRef}
                                      {...provided.droppableProps}
                                      className={`group/list relative rounded-md p-4 shadow-md transition-all ${snapshot.isDraggingOver ? 'border-2 border-blue-400 bg-blue-100' : 'bg-gray-100'}`}
                                      style={{
                                        borderLeft:
                                          '4px solid ' +
                                          getLeftBorderColor(docSections),
                                      }}
                                    >
                                      <Box className="absolute right-2 top-2 z-50 pointer-events-none">
                                        <Flex
                                          align="center"
                                          justify="flex-end"
                                          gap="xs"
                                        >
                                          {docSections.osvStatus === true ? (
                                            <Badge color="green">OK</Badge>
                                          ) : docSections.osvStatus === false ? (
                                            <Badge color="red">NOT OK</Badge>
                                          ) : null}

                                          {docSections.docs.length > 0 &&
                                            !isDragAndDropEnablerOrEdit(
                                              docSections,
                                            ) && (
                                              <Tooltip label="Edit">
                                                <CustomIcon
                                                  className="pointer-events-auto cursor-pointer opacity-0 transition-opacity duration-200 group-hover/list:opacity-100"
                                                  src="MaterialIcon"
                                                  name="MdModeEditOutline"
                                                  size="15px"
                                                  onClick={(event) => {
                                                    event.stopPropagation();
                                                    editDetails(
                                                      `linkedIndividuals ${linkedDocs.entityId} ${docSections.sectionId} ${index}`,
                                                    );
                                                  }}
                                                />
                                              </Tooltip>
                                            )}
                                        </Flex>
                                      </Box>

                                      {/* Uploaded documents */}
                                      <Box mt={20}>
                                        {docSections.docs.map(
                                          (doc: Document, docIndex: number) => (
                                            <Draggable
                                              key={`${doc.id}-${docSections.sectionId}-${docIndex}`}
                                              draggableId={`linkedIndividuals ${linkedDocs.entityId} ${docSections.sectionId} ${index} ${docIndex}`}
                                              isDragDisabled={isDragAndDropEnablerOrEdit(
                                                docSections,
                                              )}
                                              index={docIndex}
                                            >
                                              {(provided) => (
                                                <Card
                                                  ref={provided.innerRef}
                                                  {...provided.draggableProps}
                                                  {...provided.dragHandleProps}
                                                  p={4}
                                                  className="group/card relative mb-2 rounded-lg bg-white shadow-sm hover:bg-gray-50 hover:shadow-md"
                                                  onClick={() => {
                                                    openLinkNewTab(doc);
                                                  }}
                                                >
                                                  <Box className="absolute right-2 top-2 z-10 flex gap-2 opacity-0 transition-opacity duration-200 group-hover/card:opacity-100" key={docIndex + 'linkedIndividuals'}>
                                                    <Tooltip label="Copy">
                                                      <CustomIcon
                                                        className="cursor-pointer"
                                                        src="MaterialIcon"
                                                        name="MdContentPaste"
                                                        size="15px"
                                                        onClick={(event) => {
                                                          event.stopPropagation();
                                                          handleCopy(
                                                            docSections,
                                                            doc,
                                                            linkedDocs,
                                                            'linkedIndividuals',
                                                          );
                                                        }}
                                                      />
                                                    </Tooltip>

                                                    {showDelete(
                                                      linkedDocs.entityId,
                                                      docSections.sectionId,
                                                      doc,
                                                    ) && (
                                                        <Tooltip label="Delete">
                                                          <CustomIcon
                                                            className="cursor-pointer"
                                                            src="MaterialIcon"
                                                            name="MdDeleteOutline"
                                                            size="15px"
                                                            onClick={(event) => {
                                                              event.stopPropagation();
                                                              deleteDocElement(
                                                                doc,
                                                                `linkedIndividuals ${linkedDocs.entityId} ${docSections.sectionId} ${index} ${docIndex}`,
                                                                'modal',
                                                              );
                                                            }}
                                                          />
                                                        </Tooltip>
                                                      )}
                                                  </Box>
                                                  <Text size="sm">
                                                    {truncateString(
                                                      30,
                                                      doc.filename,
                                                    )}
                                                  </Text>
                                                </Card>
                                              )}
                                            </Draggable>
                                          ),
                                        )}

                                        {/* Upload button under docs */}
                                        <Box mt="sm" ta="center">
                                          <FileButton
                                            onChange={(file) =>
                                              filesUploaded(
                                                file,
                                                docSections,
                                                linkedDocs.entityId,
                                                true,
                                              )
                                            }
                                            accept="*"
                                          >
                                            {(props) => (
                                              <Button
                                                variant="subtle"
                                                size="xs"
                                                {...props}
                                                disabled={enableDisableUploadDropSection()}
                                              >
                                                Upload Document
                                              </Button>
                                            )}
                                          </FileButton>
                                        </Box>
                                        {provided.placeholder}
                                      </Box>
                                    </div>
                                  </Grid.Col>
                                </Grid>
                             
                              
                              </Box>
                              )
                            }
                          </Droppable>
                        </Box>
                  ),
                )}

                <Button
                  variant="default"
                  style={{ width: '100px' }}
                  onClick={() =>
                    addTagDetails('linkedIndividuals', linkedIndex, linkedDocs)
                  }
                >
                  <CustomIcon
                    className="cursor-pointer"
                    src={'MaterialIcon'}
                    name={'MdAdd'}
                    size="20px"
                  />{' '}
                  Add Tag
                </Button>

                <Divider my="sm" />
              </Stack>
            ),
          )}
        <Box className="text-xs">
          <Stack justify="center" gap="md">
            {/* Updated `linkedBusiness` section with unified UI */}
            {taggedList.linkedBusiness &&
              Object.keys(taggedList.linkedBusiness).length > 0 && (
                <Box key={taggedList.linkedBusiness.entityId}>
                  {applicantList?.map((item: any, index: number) =>
                    item.id == taggedList.linkedBusiness?.entityId ? (
                      <Group key={index} ml={20}>
                        <AppAvatar
                          size="md"
                          radius="sm"
                          name=""
                          color={iconColors[0]}
                          key={item.id}
                        >
                          {item.iconText}
                        </AppAvatar>
                        <Stack gap={3}>
                          <Text size="sm" fw={700}>
                            {item.name}
                          </Text>
                          <Text size="xs">{item.type}</Text>
                        </Stack>
                      </Group>
                    ) : null,
                  )}

                  {taggedList.linkedBusiness.docsSections &&
                    taggedList.linkedBusiness.docsSections.map(
                      (docSections: DocsSection, index: number) => (
                            <Box className="group relative" key={taggedList.linkedBusiness?.entityId + docSections.sectionId + index}>
                              <Droppable
                                droppableId={`linkedBusiness ${taggedList.linkedBusiness?.entityId} ${docSections.sectionId} ${index}`}
                              >
                                {(provided, snapshot) =>
                                  docSections.docs.length === 0 ? (
                                <Grid>
                                    <Grid.Col span={2}>{docSections.section}</Grid.Col>
                                    <Grid.Col span={10}>
                                      <Box
                                      ref={provided.innerRef}
                                      {...provided.droppableProps}
                                      className={`relative rounded-md p-4 shadow-md transition-all ${snapshot.isDraggingOver ? 'border-2 border-blue-400 bg-blue-100' : 'bg-gray-100'}`}
                                      style={{
                                        borderLeft:
                                          '4px solid ' +
                                          getLeftBorderColor(docSections),
                                      }}
                                      >
                                        <Box
                                          style={{
                                            border: '1px dashed #ccc',
                                            borderRadius: 6,
                                            padding: '12px',
                                            textAlign: 'center',
                                            backgroundColor: '#f9f9f9',
                                          }}
                                        >
                                          <Text size="xs" color="dimmed">
                                            Drop file or{' '}
                                            <FileButton
                                              onChange={(file) =>
                                                filesUploaded(
                                                  file,
                                                  docSections,
                                                  taggedList.linkedBusiness
                                                    ?.entityId,
                                                  true,
                                                )
                                              }
                                              accept="*"
                                            >
                                              {(props) => (
                                                <Button
                                                  variant="subtle"
                                                  size="xs"
                                                  {...props}
                                                  disabled={enableDisableUploadDropSection()}
                                                >
                                                  upload
                                                </Button>
                                              )}
                                            </FileButton>
                                          </Text>
                                        </Box>
                                      </Box>
                                    </Grid.Col>
                                </Grid>
                                   
                                  ) : (
                                  <Grid>
                                    <Grid.Col span={2}>{docSections.section}</Grid.Col>
                                    <Grid.Col span={10}>
                                      <div
                                        ref={provided.innerRef}
                                        {...provided.droppableProps}
                                        className={`group/list relative rounded-md p-4 shadow-md transition-all ${snapshot.isDraggingOver ? 'border-2 border-blue-400 bg-blue-100' : 'bg-gray-100'}`}
                                        style={{
                                          borderLeft:
                                            '4px solid ' +
                                            getLeftBorderColor(docSections),
                                        }}
                                      >
                                        <Box className="absolute right-2 top-2 z-10">
                                          <Flex
                                            align="center"
                                            justify="flex-end"
                                            gap="xs"
                                          >
                                            {docSections.osvStatus === true ? (
                                              <Badge color="green">OK</Badge>
                                            ) : docSections.osvStatus ===
                                              false ? (
                                              <Badge color="red">NOT OK</Badge>
                                            ) : null}

                                            {docSections.docs.length > 0 &&
                                              !isDragAndDropEnablerOrEdit(
                                                docSections,
                                              ) && (
                                                <Tooltip label="Edit">
                                                  <CustomIcon
                                                  className="pointer-events-auto cursor-pointer opacity-0 transition-opacity duration-200 group-hover/list:opacity-100"
                                                    src="MaterialIcon"
                                                    name="MdModeEditOutline"
                                                    size="15px"
                                                    onClick={(event) => {
                                                      event.stopPropagation();
                                                      editDetails(
                                                        `linkedBusiness ${taggedList.linkedBusiness?.entityId} ${docSections.sectionId} ${index}`,
                                                      );
                                                    }}
                                                  />
                                                </Tooltip>
                                              )}
                                          </Flex>
                                        </Box>

                                        <Box mt={20}>
                                          {docSections.docs.map(
                                            (doc: Document, docIndex: number) => (
                                              <Draggable
                                                key={`${doc.id}-${docSections.sectionId}-${docIndex}`}
                                                draggableId={`linkedBusiness ${taggedList.linkedBusiness?.entityId} ${docSections.sectionId} ${index} ${docIndex}`}
                                                isDragDisabled={isDragAndDropEnablerOrEdit(
                                                  docSections,
                                                )}
                                                index={docIndex}
                                              >
                                                {(provided) => (
                                                  <Card
                                                    ref={provided.innerRef}
                                                    {...provided.draggableProps}
                                                    {...provided.dragHandleProps}
                                                    p={4}
                                                    className="group/card relative mb-2 rounded-lg bg-white shadow-sm hover:bg-gray-50 hover:shadow-md"
                                                    onClick={() =>
                                                      openLinkNewTab(doc)
                                                    }
                                                  >
                                                    <Box key={'linkedBusiness' + docIndex} className="absolute right-2 top-2 z-10 flex gap-2 opacity-0 transition-opacity duration-200 group-hover/card:opacity-100">
                                                      <Tooltip label="Copy">
                                                        <CustomIcon
                                                          className="cursor-pointer opacity-0 transition-opacity duration-200 group-focus-within:opacity-100 group-hover:opacity-100"
                                                          src={'MaterialIcon'}
                                                          name={'MdContentPaste'}
                                                          size={'15px'}
                                                          onClick={(event) => {
                                                            event.stopPropagation();
                                                            handleCopy(
                                                              docSections,
                                                              doc,
                                                              taggedList.linkedBusiness,
                                                              'linkedBusiness',
                                                            );
                                                          }}
                                                        />
                                                      </Tooltip>
                                                      {showDelete(
                                                        taggedList.linkedBusiness
                                                          ?.entityId ?? '',
                                                        docSections.sectionId,
                                                        doc,
                                                      ) && (
                                                          <Tooltip label="Delete">
                                                            <CustomIcon
                                                              className="cursor-pointer opacity-0 transition-opacity duration-200 group-focus-within:opacity-100 group-hover:opacity-100"
                                                              src={'MaterialIcon'}
                                                              name={
                                                                'MdDeleteOutline'
                                                              }
                                                              size={'15px'}
                                                              onClick={(event) => {
                                                                event.stopPropagation();
                                                                deleteDocElement(
                                                                  doc,
                                                                  `linkedBusiness ${taggedList.linkedBusiness?.entityId} ${docSections.sectionId} ${index} ${docIndex.toString()}`,
                                                                  'modal',
                                                                );
                                                              }}
                                                            />
                                                          </Tooltip>
                                                        )}
                                                    </Box>
                                                    <Text size="sm">
                                                      {truncateString(
                                                        30,
                                                        doc.filename,
                                                      )}
                                                    </Text>
                                                  </Card>
                                                )}
                                              </Draggable>
                                            ),
                                          )}

                                          <Box mt="sm" ta="center">
                                            <FileButton
                                              onChange={(file) =>
                                                filesUploaded(
                                                  file,
                                                  docSections,
                                                  taggedList.linkedBusiness
                                                    ?.entityId,
                                                  true,
                                                )
                                              }
                                              accept="*"
                                            >
                                              {(props) => (
                                                <Button
                                                  variant="subtle"
                                                  size="xs"
                                                  {...props}
                                                  disabled={enableDisableUploadDropSection()}
                                                >
                                                  Upload Document
                                                </Button>
                                              )}
                                            </FileButton>
                                          </Box>
                                          {provided.placeholder}
                                        </Box>
                                      </div>
                                    </Grid.Col>
                                    </Grid>
                                   
                                  )
                                }
                              </Droppable>
                            </Box>
                      ),
                    )}

                  <Button
                    variant="default"
                    style={{ width: '100px' }}
                    onClick={() =>
                      addTagDetails(
                        'linkedBusiness',
                        0,
                        taggedList.linkedBusiness,
                      )
                    }
                  >
                    <CustomIcon
                      className="cursor-pointer"
                      src={'MaterialIcon'}
                      name={'MdAdd'}
                    />{' '}
                    Add Tag
                  </Button>

                  <Divider my="sm" />
                </Box>
              )}
          </Stack>
        </Box>

        <Text>Others</Text>
        {taggedList?.appForm?.length > 0 &&
          taggedList?.appForm?.map((linkedDocs: DocsSection, index: number) => (
            <Box key={`appForm + ${index}`}>
              <Box key={`appFormInnder + ${index}`}>

                <Grid>
                  <Grid.Col span={2}>  <Text>{linkedDocs.section}</Text></Grid.Col>
                  <Grid.Col span={10}>
                    <Box className="group/appform relative">
                      <Droppable
                        droppableId={`appForm appForm ${linkedDocs.sectionId}`}
                      >
                        {(provided, snapshot) =>
                          linkedDocs.docs.length === 0 ? (
                            <Box
                              ref={provided.innerRef}
                              {...provided.droppableProps}
                              className={`relative rounded-md p-4 shadow-md transition-all ${snapshot.isDraggingOver ? 'border-2 border-blue-400 bg-blue-100' : 'bg-gray-100'}`}
                              style={{
                                borderLeft:
                                  '4px solid ' + getLeftBorderColor(linkedDocs),
                              }}
                            >
                              <Box
                                style={{
                                  border: '1px dashed #ccc',
                                  borderRadius: 6,
                                  padding: '12px',
                                  textAlign: 'center',
                                  backgroundColor: '#f9f9f9',
                                }}
                              >
                                <Text size="xs" color="dimmed">
                                  Drop file or{' '}
                                  <FileButton
                                    onChange={(file) =>
                                      filesUploaded(
                                        file,
                                        linkedDocs,
                                        'appForm',
                                        false,
                                      )
                                    }
                                    accept="*"
                                  >
                                    {(props) => (
                                      <Button
                                        variant="subtle"
                                        size="xs"
                                        {...props}
                                        disabled={enableDisableUploadDropSection()}
                                      >
                                        upload
                                      </Button>
                                    )}
                                  </FileButton>
                                </Text>
                              </Box>
                              {provided.placeholder}
                            </Box>
                          ) : (
                            <div
                              ref={provided.innerRef}
                              {...provided.droppableProps}
                                className={`group/list relative rounded-md p-4 shadow-md transition-all ${snapshot.isDraggingOver ? 'border-2 border-blue-400 bg-blue-100' : 'bg-gray-100'}`}
                              style={{
                                borderLeft:
                                  '4px solid ' + getLeftBorderColor(linkedDocs),
                              }}
                            >
                              <Box className="absolute right-2 top-2 z-10">
                                <Flex align="center" justify="flex-end" gap="xs">
                                  {linkedDocs.osvStatus === true ? (
                                    <Badge color="green">OK</Badge>
                                  ) : linkedDocs.osvStatus === false ? (
                                    <Badge color="red">Not OK</Badge>
                                  ) : null}

                                  {linkedDocs.docs.length > 0 &&
                                    !isDragAndDropEnablerOrEdit(linkedDocs) && (
                                      <CustomIcon
                                        className="pointer-events-auto cursor-pointer opacity-0 transition-opacity duration-200 group-hover/list:opacity-100"
                                        src={'MaterialIcon'}
                                        name={'MdModeEditOutline'}
                                        size={'15px'}
                                        onClick={(event) => {
                                          event.stopPropagation();
                                          editDetails(
                                            `appForm appForm ${linkedDocs.sectionId} ${index}`,
                                          );
                                        }}
                                      />
                                    )}
                                </Flex>
                              </Box>

                              <Box mt={20}>
                                {linkedDocs.docs.map(
                                  (doc: Document, docIndex: number) => (
                                    <Draggable
                                      key={`${doc.id}-${linkedDocs.sectionId}-${docIndex}`}
                                      draggableId={`appForm ${linkedDocs.sectionId} ${index} ${docIndex}`}
                                      isDragDisabled={isDragAndDropEnablerOrEdit(
                                        linkedDocs,
                                      )}
                                      index={docIndex}
                                    >
                                      {(provided) => (
                                        <Card
                                          ref={provided.innerRef}
                                          {...provided.draggableProps}
                                          {...provided.dragHandleProps}
                                          p={4}
                                          key={docIndex + index}
                                          className="group/card relative mb-2 rounded-lg bg-white shadow-sm hover:bg-gray-50 hover:shadow-md"
                                          onClick={() => {
                                            openLinkNewTab(doc);
                                          }}
                                        >
                                          <Box key={'appform' + docIndex} className="absolute right-2 top-2 z-10 flex gap-2 opacity-0 transition-opacity duration-200 group-hover/card:opacity-100">
                                            <Tooltip label="Copy">
                                              <CustomIcon
                                                className="cursor-pointer"
                                                src={'MaterialIcon'}
                                                name={'MdContentPaste'}
                                                size={'15px'}
                                                onClick={(event) => {
                                                  event.stopPropagation();
                                                  handleCopy(
                                                    linkedDocs,
                                                    doc,
                                                    null,
                                                    'appForm',
                                                  );
                                                }}
                                              />
                                            </Tooltip>
                                            {showDelete(
                                              linkedDocs.sectionId,
                                              linkedDocs.sectionId,
                                              doc,
                                            ) && (
                                                <Tooltip label="Delete">
                                                  <CustomIcon
                                                    className="cursor-pointer"
                                                    src={'MaterialIcon'}
                                                    name={'MdDeleteOutline'}
                                                    size="15px"
                                                    onClick={(event) => {
                                                      event.stopPropagation();
                                                      deleteDocElement(
                                                        doc,
                                                        `appForm ${linkedDocs.sectionId} ${linkedDocs.sectionId} ${docIndex}`,
                                                        'modal',
                                                      );
                                                    }}
                                                  />
                                                </Tooltip>
                                              )}
                                          </Box>
                                          <Text size="sm" key={'truncateStringAppform' + docIndex}>
                                            {truncateString(30, doc.filename)}
                                          </Text>
                                        </Card>
                                      )}
                                    </Draggable>
                                  ),
                                )}
                                <Box mt="sm" ta="center">
                                  <FileButton
                                    onChange={(file) =>
                                      filesUploaded(
                                        file,
                                        linkedDocs,
                                        'appForm',
                                        false,
                                      )
                                    }
                                    accept="*"
                                  >
                                    {(props) => (
                                      <Button
                                        variant="subtle"
                                        size="xs"
                                        {...props}
                                        disabled={enableDisableUploadDropSection()}
                                      >
                                        Upload Document
                                      </Button>
                                    )}
                                  </FileButton>
                                </Box>
                                {provided.placeholder}
                              </Box>
                            </div>
                          )
                        }
                      </Droppable>
                    </Box>
                  </Grid.Col>
                </Grid>
       
             
                 

              </Box>
            </Box>
          ))}

        <Button
          variant="default"
          w={100}
          onClick={() => addTagDetails('appForm', 0, null, taggedList.appForm)}
        >
          <CustomIcon
            className="cursor-pointer"
            src={'MaterialIcon'}
            name={'MdAdd'}
            size="20px"
          />{' '}
          Add Tag
        </Button>
        <Divider my="sm" />
      </Stack>
    </Box>
  );
}
