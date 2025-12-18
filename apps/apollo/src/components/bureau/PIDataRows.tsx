import { Blockquote, Card, Flex, SimpleGrid, Stack, Text } from '@mantine/core';
import React from 'react';
export type TRowtype =
  | {
      label: string;
      data: {
        appForm: string | undefined;
        bureau: (string | undefined)[] | undefined;
      };
    }
  | {
      label: string;
      data: {
        appForm: React.JSX.Element;
        bureau: (string | undefined)[] | undefined;
      };
    }
  | {
      label: string;
      data: {
        appForm: string | undefined;
        bureau: (React.JSX.Element | undefined)[] | undefined;
      };
    }
  | {
      label: string;
      data: {
        appForm: React.JSX.Element;
        bureau: (React.JSX.Element | undefined)[] | undefined;
      };
    };
export const PIDataRows = ({ row }: { row: TRowtype }) => (
  <Stack gap={0} className="w-full">
    <Flex className="w-full" justify="flex-start">
      <Text fw={500}>{row.label}</Text>
    </Flex>
    <Flex
      direction={'row'}
      key={row.label}
      className="w-full rounded-md"
      justify="flex-start"
    >
      <Stack className="w-1/4" gap={0} p={12}>
        <Blockquote className="w-full">
          {/* <Card shadow="sm" p="sm" radius="md" withBorder> */}
          {React.isValidElement(row.data['appForm']) ? (
            row.data['appForm']
          ) : (
            <Text size="sm" fs="italic">
              {row.data['appForm']}
            </Text>
          )}

          {/* </Card> */}
        </Blockquote>
      </Stack>

      <SimpleGrid cols={3} className="w-3/4" verticalSpacing="xs">
        {row.data['bureau']?.map((element) => {
          return (
            <Stack className="h-full w-full" gap={0} p={12}>
              <Card
                shadow="sm"
                p="sm"
                radius="md"
                withBorder
                mih={30}
                h={'100%'}
              >
                {React.isValidElement(element) ? (
                  element
                ) : (
                  <Text size="sm">{element}</Text>
                )}
              </Card>
            </Stack>
          );
        })}
      </SimpleGrid>
    </Flex>
  </Stack>
);
