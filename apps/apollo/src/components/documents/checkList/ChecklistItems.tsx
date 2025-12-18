`use client`;

import CustomIcon from '@/components/icons/CustomIcons';
import { Box, List, ThemeIcon } from '@mantine/core';

type Props = {
  ckycDocList: any[];
};

export default function ChecklistItems(props: Props) {
  const { ckycDocList } = props;

  return (
    <Box mt="xs" ta="left">
      {ckycDocList.length > 0 && (
        <List size="xs">
          {ckycDocList.map((ckycChcEle: any, index:number) => (
            <List.Item
              key={ckycChcEle.label + ckycChcEle + index}
              icon={
                ckycChcEle.passed == true ? (
                  <ThemeIcon color="white" size={16} radius="xl">
                    <CustomIcon
                      src={'MaterialIcon'}
                      name={'MdCheckCircle'}
                      color="green"
                      size="16px"
                      style={{ cursor: 'pointer' }}
                    />
                  </ThemeIcon>
                ) : ckycChcEle.passed == false ? (
                  <ThemeIcon color="white" size={16} radius="xl">
                    <CustomIcon
                      src={'MaterialIcon'}
                      name={'MdClose'}
                      color="red"
                      size="16px"
                      style={{ cursor: 'pointer' }}
                    />
                  </ThemeIcon>
                ) : (
                  <ThemeIcon color="white" size={16} radius="xl">
                    <CustomIcon
                      src={'MaterialIcon'}
                      name={'MdCloudUpload'}
                      color="grey"
                      size="16px"
                      style={{ cursor: 'pointer' }}
                    />
                  </ThemeIcon>
                )
              }
            >
              {ckycChcEle.label}
            </List.Item>
          ))}
        </List>
      )}
    </Box>
  );
}
