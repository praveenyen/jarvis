import { Breadcrumbs, Anchor, Flex, Text } from '@mantine/core';
import CustomIcon, { CustomIconSrc } from '@/components/icons/CustomIcons';
import Link from 'next/link';

type BreadcrumbItem = {
  label: string;
  href?: string;
};

type TSeparator = {
  src: CustomIconSrc;
  name: string;
};

type BreadcrumbProps = {
  items: BreadcrumbItem[];
  separatorIcon?: TSeparator;
};

const AppBreadCrumb: React.FC<BreadcrumbProps> = ({ items, separatorIcon }) => {
  return (
    <Flex
      mih={40}
      justify="space-between"
      align="flex-start"
      direction="row"
      p={10}
    >
      <Breadcrumbs
        separator={
          separatorIcon ? (
            <CustomIcon src={separatorIcon?.src} name={separatorIcon?.name} />
          ) : (
            <Text size="md">/</Text>
          )
        }
      >
        {items.map((item, index) =>
          item.href ? (
            <Link href={item.href} as={item.href}>
              <Text td="underline" size="sm" c="secondary.9">
                {item.label}
              </Text>
            </Link>
          ) : (
            <Text key={index} size="sm">
              {item.label}
            </Text>
          ),
        )}
      </Breadcrumbs>
    </Flex>
  );
};

export default AppBreadCrumb;
