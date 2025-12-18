import { useDisclosure } from '@mantine/hooks';
import {
  Modal,
  Stack,
  Flex,
  Text,
  TextInput,
  Button,
  Select,
  ComboboxItem,
  Textarea,
} from '@mantine/core';
import { Input } from '@mantine/core';
import { DateInput } from '@mantine/dates';
import { ElementType, useCallback, useEffect, useState } from 'react';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
dayjs.extend(customParseFormat);

export type TEditModalInput = {
  label: string;
  value: any;
  key: string;
  type: string;
  misc: {
    resourcePath: string | undefined;
    options?: ComboboxItem[];
    section?: string;
  };
};
export const EditModal = ({
  opened,
  modalAction,
  modalContent,
  onSaveModalFunc,
}: {
  opened: boolean;
  modalAction: { open: () => void; close: () => void };
  modalContent: TEditModalInput[] | undefined;
  onSaveModalFunc: (modalData: TEditModalInput[] | undefined) => void;
}) => {
  //   const [opened, { open, close }] = useDisclosure(false);
  const [modalContentTemp, setModalContentTemp] = useState<TEditModalInput[]>();

  const changeModalItemVal = (value: any, index: number) => {
    let content = JSON.parse(JSON.stringify(modalContentTemp));
    content[index]['value'] = value;
    setModalContentTemp(content);
  };
  useEffect(() => {
    if (modalContent)
      setModalContentTemp(JSON.parse(JSON.stringify(modalContent)));
  }, [modalContent]);

  const getDateString = useCallback((dateString: string | Date) => {
    if (typeof dateString === 'string') {
      if (dateString.split('-').map(Number)[0].toString().length === 4) {
      const [year, month, day] = dateString.split('-').map(Number);
      return new Date(year, month - 1, day);
      }
      if (dateString.split('-').map(Number)[0].toString().length <= 2) {
        const [day, month, year] = dateString.split('-').map(Number);
      return new Date(year, month - 1, day);
      }
    } else return dateString;
  }, []);

  return (
    <Modal opened={opened} onClose={modalAction.close} title="" centered>
      <Stack>
        {modalContentTemp?.map((item, index) => {
          return (
            <Flex
              p={10}
              gap={20}
              justify={'flex-start'}
              align={'center'}
              key={'inputItem' + index}
              className="w-full"
            >
              <Text className="w-1/5">{item.label}</Text>
              {item.type === 'text' && (
                <TextInput
                  value={item.value}
                  onChange={(event) =>
                    changeModalItemVal(event.currentTarget.value, index)
                  }
                  className="w-4/5"
                ></TextInput>
              )}
              {item.type === 'textarea' && (
                <Textarea
                  value={item.value}
                  onChange={(event) =>
                    changeModalItemVal(event.currentTarget.value, index)
                  }
                  className="w-4/5"
                  rows={3}
                ></Textarea>
              )}
              {item.type === 'date' && (
                <DateInput
                  clearable
                  value={
                    item.value && item.value !== '-'
                      ? getDateString(item.value)
                      : null
                  }
                  valueFormat="DD-MM-YYYY"
                  onChange={(value) => 
                    changeModalItemVal(value, index)}
                  className="w-4/5"
                />
              )}
              {item.type === 'select' && (
                <Select
                  clearable
                  data={item.misc.options}
                  value={item.value}
                  onChange={(_value) => changeModalItemVal(_value, index)}
                  className="w-4/5"
                />
              )}
            </Flex>
          );
        })}
        <Button onClick={() => onSaveModalFunc(modalContentTemp)}>
          save draft
        </Button>
      </Stack>
    </Modal>
  );
};
