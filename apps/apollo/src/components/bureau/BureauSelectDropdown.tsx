import {
  Input,
  InputBase,
  Combobox,
  useCombobox,
  CheckIcon,
  Group,
  Text,
} from '@mantine/core';

export type TBureauOptionsItem = {
  description: string;
  value:
    | 'ConsumerCibil'
    | 'ConsumerCrif'
    | 'ConsumerExperian'
    | 'CommercialCibil';
  pullType: 'HardPull' | 'SoftPull' | 'D2CRP' | 'D2CFP';
};

export const BureauSelectDropdown = ({
  bureauName,
  setBureauName,
  bureauOptions,
}: {
  bureauName: string;
  setBureauName: React.Dispatch<React.SetStateAction<string>>;
  bureauOptions: TBureauOptionsItem[];
}) => {
  const combobox = useCombobox({
    onDropdownClose: () => combobox.resetSelectedOption(),
    onDropdownOpen: (eventSource) => {
      if (eventSource === 'keyboard') {
        combobox.selectActiveOption();
      } else {
        combobox.updateSelectedOptionIndex('active');
      }
    },
  });

  const options = bureauOptions.map((item) => (
    <Combobox.Option
      value={item.value}
      key={item.description}
      active={bureauName === item.value}
    >
      <Group gap="xs">
        {bureauName === item.value && <CheckIcon size={12} />}
        <Text fz="xs">{item.description}</Text>
      </Group>
    </Combobox.Option>
  ));

  return (
    <Combobox
      store={combobox}
      resetSelectionOnOptionHover
      onOptionSubmit={(val) => {
        setBureauName(
          bureauOptions.find((o) => o.value === val)?.description || '',
        );
        combobox.updateSelectedOptionIndex('active');
        combobox.closeDropdown();
      }}
    >
      <Combobox.Target targetType="button">
        <InputBase
          size="md"
          p={0}
          component="button"
          type="button"
          pointer
          rightSection={<Combobox.Chevron />}
          rightSectionPointerEvents="none"
          onClick={() => combobox.toggleDropdown()}
          styles={{
            input: {
              border: 'none',
              background: 'transparent',
              fontWeight: 700,
            },
          }}
        >
          {bureauName || <Input.Placeholder>Bureau</Input.Placeholder>}
        </InputBase>
      </Combobox.Target>

      <Combobox.Dropdown>
        <Combobox.Options>{options}</Combobox.Options>
      </Combobox.Dropdown>
    </Combobox>
  );
};
