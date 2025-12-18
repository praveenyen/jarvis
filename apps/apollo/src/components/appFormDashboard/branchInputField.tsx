import { useEffect, useState } from 'react';
import {
  Combobox,
  Group,
  Input,
  Pill,
  PillsInput,
  Checkbox,
  useCombobox,
} from '@mantine/core';

interface CondensedMultiSelectProps {
  dropdownData: { label: string; options: string[] }[]; // Dropdown data structure
  preselectedValues?: string[]; // Preselected values to populate
}

export function CondensedMultiSelect({
  dropdownData,
  preselectedValues = [],
}: CondensedMultiSelectProps) {
  const [selectedValues, setSelectedValues] = useState<string[]>([]); // State for selected values
  const [searchQuery, setSearchQuery] = useState(''); // State for search query
  const combobox = useCombobox();

  // Populate the selected values if `preselectedValues` is provided
  useEffect(() => {
    setSelectedValues(preselectedValues);
  }, [preselectedValues]);

  // Helper function to get all items in a category
  const getAllItems = (group: { label: string; options: string[] }) => [
    ...group.options,
  ];

  // Toggle selection for a category and its items
  const toggleCategory = (
    group: { label: string; options: string[] },
    isChecked: boolean,
  ) => {
    const allItems = getAllItems(group);
    setSelectedValues(
      (current) =>
        isChecked
          ? [...new Set([...current, ...allItems])] // Add all child items
          : current.filter((item) => !allItems.includes(item)), // Remove all child items
    );
  };

  // Toggle selection for an individual item
  const handleValueSelect = (item: string) => {
    const updatedValues = selectedValues.includes(item)
      ? selectedValues.filter((v) => v !== item) // Remove item
      : [...selectedValues, item]; // Add item
    setSelectedValues(updatedValues);
  };

  // Remove an individual item or parent category
  const handleValueRemove = (item: string) => {
    const group = dropdownData.find((group) => group.label === item);
    const updatedValues = group
      ? selectedValues.filter((v) => !getAllItems(group).includes(v)) // Remove all children of the category
      : selectedValues.filter((v) => v !== item); // Remove individual item
    setSelectedValues(updatedValues);
  };

  // Determine display values for PillsInput
  const getDisplayValues = () => {
    return dropdownData.reduce<string[]>((acc, group) => {
      const allItems = getAllItems(group);
      const allSelected = allItems.every((item) =>
        selectedValues.includes(item),
      );
      if (allSelected) {
        acc.push(group.label); // Show category title if all items are selected
      } else {
        acc.push(...selectedValues.filter((item) => allItems.includes(item))); // Show individual items
      }
      return acc;
    }, []);
  };

  const pills = getDisplayValues().map((item) => (
    <Pill key={item} withRemoveButton onRemove={() => handleValueRemove(item)}>
      {item}
    </Pill>
  ));

  const filteredCity = dropdownData
    .map((group) => {
      const isLabelMatch = group.label
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      const filteredOptions = group.options.filter((item) =>
        item.toLowerCase().includes(searchQuery.toLowerCase()),
      );

      return {
        ...group,
        options: isLabelMatch ? group.options : filteredOptions, // If label matches, include all options
      };
    })
    .filter((group) => group.options.length > 0);

  const options = filteredCity.map((group) => {
    const allItems = getAllItems(group);
    const isCategorySelected = allItems.every((item) =>
      selectedValues.includes(item),
    );
    const isCategoryIndeterminate =
      !isCategorySelected &&
      allItems.some((item) => selectedValues.includes(item));

    return (
      <div key={group.label} style={{ marginBottom: '8px' }}>
        {/* Category with Checkbox */}
        <Group gap="sm" style={{ marginBottom: '4px' }}>
          <Checkbox
            checked={isCategorySelected}
            indeterminate={isCategoryIndeterminate}
            onChange={(event) =>
              toggleCategory(group, event.currentTarget.checked)
            }
            size="xs"
          />
          <span style={{ fontWeight: 'bold' }}>{group.label}</span>
        </Group>

        {/* Child Items */}
        {group.options.map((item) => (
          <Combobox.Option
            value={item}
            key={item}
            active={selectedValues.includes(item)}
            onClick={() => handleValueSelect(item)} // Handle item selection
          >
            <Group gap="sm">
              <Checkbox
                checked={selectedValues.includes(item)}
                onChange={(event) => {
                  event.stopPropagation(); // Prevent Combobox default behavior
                  handleValueSelect(item); // Toggle item selection
                }}
                size="xs"
              />
              <span>{item}</span>
            </Group>
          </Combobox.Option>
        ))}
      </div>
    );
  });

  return (
    <Combobox store={combobox} withinPortal={false}>
      {/* PillsInput */}
      <Combobox.DropdownTarget>
        <PillsInput pointer onClick={() => combobox.toggleDropdown()}>
          <Pill.Group>
            {pills.length > 0 ? (
              pills
            ) : (
              <Input.Placeholder>Branch</Input.Placeholder>
            )}
            <Combobox.EventsTarget>
              <PillsInput.Field
                type="hidden"
                onKeyDown={(event) => {
                  if (event.key === 'Backspace') {
                    handleValueRemove(
                      selectedValues[selectedValues.length - 1],
                    ); // Remove last selected item on Backspace
                  }
                }}
              />
            </Combobox.EventsTarget>
          </Pill.Group>
        </PillsInput>
      </Combobox.DropdownTarget>

      {/* Dropdown */}
      <Combobox.Dropdown>
        <Input
          placeholder="Search..."
          value={searchQuery}
          onChange={(event) => setSearchQuery(event.currentTarget.value)}
          mb="sm"
        />
        <Combobox.Options>{options}</Combobox.Options>
      </Combobox.Dropdown>
    </Combobox>
  );
}
