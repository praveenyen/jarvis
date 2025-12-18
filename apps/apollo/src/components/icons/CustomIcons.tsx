'use client';

import React from 'react';
import { IconBaseProps, IconContext } from 'react-icons';

//optimize this plz don't add more librarys

// import * as FontAwesome from 'react-icons/fa';
// import * as AntIcon from 'react-icons/ai';
import * as MaterialIcon from 'react-icons/md';
// import * as BootstrapIcon from 'react-icons/bs';
// import * as RemixIcon from 'react-icons/ri';
// import * as RadixIcon from 'react-icons/rx';
// import * as IcoMoon5Icon from 'react-icons/io5';
// import * as IcoMoonIcon from 'react-icons/io';
// import * as Feather from 'react-icons/fi';
// import * as VSCIcon from 'react-icons/vsc';
// import * as FlatColor from 'react-icons/fc';
// import * as PiIcon from 'react-icons/pi';
// import * as SimpleLineIcon from 'react-icons/sl';
// import * as TablerIcon from 'react-icons/tb';
// import * as LucideIcon from 'react-icons/lu';
// import * as FaRegClipboard from 'react-icons/fa6';

// import * as SVGIcon from "./SVGIcons";
// import * as SVGIcon from "../Assets/SVGIcons"; // Uncomment if SVGIcons are available in your project

/**** size evariations for the icons */
// size="sm"
// size="lg"
// size="xl"
// size="xxl"
// size="3xl"
export type CustomIconSrc =
  // | 'FontAwesome'
  // | 'AntIcon'
  // |
  'MaterialIcon';
// | 'BootstrapIcon'
// | 'RemixIcon'
// | 'VSCIcon'
// | 'FlatColor'
// | 'IcoMoon5Icon'
// | 'IcoMoonIcon'
// | 'Feather'
// | 'PiIcon'
// | 'RadixIcon';
// | 'SimpleLineIcon'
// | 'TablerIcon'
// | 'FaRegClipboard'
// | 'Lucide';

type CustomIconProps = {
  src: CustomIconSrc;
  name: string;
  size?: string;
} & IconBaseProps;

function CustomIcon(props: CustomIconProps) {
  const { src, name, ...other } = props;

  return (
    <>
      <IconSrc src={src} name={name} {...other} />
    </>
  );
}

export default CustomIcon;

const IconSrc: React.FC<CustomIconProps> = (props) => {
  let IconComponent: React.ComponentType<IconBaseProps> | null = null;
  const { src, name } = props;
  switch (src) {
    // case 'FontAwesome':
    //   IconComponent = (FontAwesome as Record<string, any>)[name];
    //   break;
    // case 'AntIcon':
    //   IconComponent = (AntIcon as Record<string, any>)[name];
    //   break;
    case 'MaterialIcon':
      IconComponent = (MaterialIcon as Record<string, any>)[name];
      break;
    // case 'BootstrapIcon':
    //   IconComponent = (BootstrapIcon as Record<string, any>)[name];
    //   break;
    // case 'RemixIcon':
    //   IconComponent = (RemixIcon as Record<string, any>)[name];
    //   break;
    // case 'VSCIcon':
    //   IconComponent = (VSCIcon as Record<string, any>)[name];
    //   break;
    // case 'FlatColor':
    //   IconComponent = (FlatColor as Record<string, any>)[name];
    //   break;
    // case 'IcoMoon5Icon':
    //   IconComponent = (IcoMoon5Icon as Record<string, any>)[name];
    //   break;
    // case 'IcoMoonIcon':
    //   IconComponent = (IcoMoonIcon as Record<string, any>)[name];
    //   break;
    // case 'Feather':
    //   IconComponent = (Feather as Record<string, any>)[name];
    //   break;
    // case 'PiIcon':
    //   IconComponent = (PiIcon as Record<string, any>)[name];
    //   break;
    // case 'RadixIcon':
    //   IconComponent = (RadixIcon as Record<string, any>)[name];
    //   break;
    // case 'SimpleLineIcon':
    //   IconComponent = (SimpleLineIcon as Record<string, any>)[name];
    //   break;
    // case 'TablerIcon':
    //   IconComponent = (TablerIcon as Record<string, any>)[name];
    //   break;
    // case 'Lucide':
    //   IconComponent = (LucideIcon as Record<string, any>)[name];
    //   break;
    // case 'FaRegClipboard':
    //   IconComponent = (FaRegClipboard as Record<string, any>)[name];
    //   break;
    default:
      return null;
  }

  if (!IconComponent) {
    return <></>;
  }
  return (
    <IconContext.Provider
      value={{
        ...props.style,
        size: props.size,
        color: props.color,
        className: props.className,
      }}
    >
      {/*TODO gave removed div with flex*/}
      <IconComponent {...props} />
    </IconContext.Provider>
  );
  /*return (
    <IconContext.Provider
      value={{ ...props.style, size: props.size, className: props.className }}
    >
      <div style={{ display: 'flex' }}>
        {React.createElement(IconComponent, {
          onClick: props.onClick,
        })}
      </div>
    </IconContext.Provider>
  );*/
};
