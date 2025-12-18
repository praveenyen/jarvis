import {
  Paper,
  Flex,
  Text,
  Stack,
  SimpleGrid,
  useMantineTheme,
} from '@mantine/core';
import type { PaperProps, ElementProps } from '@mantine/core';
import CustomIcon from '../icons/CustomIcons';

export type TFields = {
  label: string;
  value?: string | Date | undefined | number | null;
  formattedValue?: string;
  key?: string;
  isEditable: boolean;
  editData?: Record<string, any>;
  resourcePath?: string;
  section?: string;
};

type TTitleCardInputProp = {
  title: string;
  header?: React.ReactNode | null;
  footer?: React.ReactNode | null;
  bgColor?: string;
  cols?: number;
  colSpan?: number;
  fields?: TFields[];
  width: string;
  editMode?: boolean;
  editBtnAction?: (f: TFields) => void;
} & PaperProps;

export const TitleCard = ({
  title,
  header,
  footer,
  bgColor,
  cols,
  colSpan,
  fields,
  width,
  editMode,
  editBtnAction,
  ...PaperProps
}: TTitleCardInputProp) => {
  const theme = useMantineTheme();
  return (
    <Stack gap={4} className={`${width}`}>
      <Text size="md">{title}</Text>
      <Paper {...PaperProps} className="w-full">
        <Stack>
          {header}
          <SimpleGrid cols={cols || 3}>
            {fields?.map((item) => (
              <Stack gap={0} p={0} key={item.label}>
                <Flex justify={'flex-start'} gap={5} align="center">
                  <Text size="xs">{item.label}</Text>{' '}
                  {editMode && item.isEditable && (
                    <CustomIcon
                      src="MaterialIcon"
                      name="MdOutlineCreate"
                      size={'12px'}
                      color={theme.colors.neutral[4]}
                      style={{ cursor: 'pointer' }}
                      onClick={() => editBtnAction && editBtnAction(item)}
                    />
                  )}{' '}
                </Flex>
                <Text
                  size="xs"
                  c="neutral.10"
                  style={{ whiteSpace: 'pre-wrap' }}
                >
                  {item.hasOwnProperty('formattedValue') && item.formattedValue
                    ? item.formattedValue
                    : item.value?.toString()}
                </Text>
              </Stack>
            ))}
          </SimpleGrid>
          {footer}
        </Stack>
      </Paper>
    </Stack>
  );
};
