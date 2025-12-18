import {
  Avatar,
  DefaultMantineColor,
  MantineSize,
  MantineRadius,
  AvatarVariant,
} from '@mantine/core';
import CustomIcon from '@/components/icons/CustomIcons';
import { CustomIconSrc } from '@/components/icons/CustomIcons';

interface TAvatarProps extends React.ComponentProps<typeof Avatar> {
  children: React.ReactNode;
  color?: DefaultMantineColor;
  name: string;
  variant?: AvatarVariant;
  radius?: MantineRadius | number;
  size?: number | MantineSize | (string & {});
  src?: string | null;
  icon?: string | null;
}

export const AppAvatar: React.FC<TAvatarProps> = ({
  children,
  color,
  name,
  variant,
  size,
  src,
  icon,
  ...props
}: TAvatarProps) => {
  const getIconSrc = (): CustomIconSrc =>
    (icon?.split('.')[0] as CustomIconSrc) || 'MaterialIcon';
  const getIconName = (): string =>
    icon?.split('.')[1] || 'MdOutlineAccountCircle';

  return (
    <Avatar
      color={color || 'secondary'}
      variant={variant || 'filled'}
      size={size || 'md'}
      name={name}
      src={src}
      {...props}
    >
      {(icon && <CustomIcon src={getIconSrc()} name={getIconName()} />) ||
        children}
    </Avatar>
  );
};
