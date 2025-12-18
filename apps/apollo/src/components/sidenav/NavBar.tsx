'use client';
import { ReactElement } from 'react';
import CustomIcon, { CustomIconSrc } from '@/components/icons/CustomIcons';
import { Center, Stack, Tooltip, UnstyledButton } from '@mantine/core';
import classes from '@/components/sidenav/NavBar.module.css';
import BrandLogo from '@/components/common/BrandLogo';
import { useRouter } from 'next/navigation';
import { usePathname } from 'next/navigation';
import UserActionMenu from '@/components/sidenav/UserActionMenuItem';

type NavbarLinkProps = {
  name: string;
  src: CustomIconSrc;
  label: string;
  active: boolean;
  onClick?: () => void;
};

type NavigableMenuItem = {
  src: CustomIconSrc;
  name: string;
  label: string;
  path: string;
  enabled: boolean;
};

const navigableMenuItems: NavigableMenuItem[] = [
  {
    src: 'MaterialIcon',
    name: 'MdOutlineGridView',
    label: 'Dashboard',
    path: '/',
    enabled: true,
  },
  {
    src: 'MaterialIcon',
    name: 'MdFileCopy',
    label: 'Application',
    path: '/application',
    enabled: true,
  },
  {
    src: 'MaterialIcon',
    name: 'MdOutlineExitToApp',
    label: 'Disbursement',
    path: '/disbursement',
    enabled: true,
  },
  {
    src: 'MaterialIcon',
    name: 'MdLaptop',
    label: 'Allocation Dashboard',
    path: '/allocation',
    enabled: false,
  },
  {
    src: 'MaterialIcon',
    name: 'MdLogin',
    label: 'Loan Servicing',
    path: '/loanservicing',
    enabled: false,
  },
  {
    src: 'MaterialIcon',
    name: 'MdContentPasteSearch',
    label: 'Vendor Dashboard',
    path: '/vendor-dashboard',
    enabled: false,
  },
  {
    src: 'MaterialIcon',
    name: 'MdOutlineMenu',
    label: 'DSA',
    path: '/DSADashboard',
    enabled: false,
  },
  {
    src: 'MaterialIcon',
    name: 'MdOutlineBookmarks',
    label: 'Admin Portal',
    path: '/adminPortall',
    enabled: false,
  },
  {
    src: 'MaterialIcon',
    name: 'MdOutlineBatchPrediction',
    label: 'Batch',
    path: '/batch',
    enabled: false,
  },
  {
    src: 'MaterialIcon',
    name: 'MdCircleNotifications',
    label: 'Notification',
    path: '/notification',
    enabled: false,
  },
  {
    src: 'MaterialIcon',
    name: 'MdOutlineSettings',
    label: 'User Tools',
    path: '/tools',
    enabled: false,
  },
];

function NavbarLink(navbarLinkProps: NavbarLinkProps) {
  const { name, src, label, active, onClick } = navbarLinkProps;
  return (
    <Tooltip label={label} position="right" transitionProps={{ duration: 0 }}>
      <UnstyledButton
        onClick={onClick}
        className={classes.link}
        data-active={active || undefined}
        aria-label={name}
        title={name}
      >
        <CustomIcon name={name} src={src} size={'22px'} color="light.0" />
      </UnstyledButton>
    </Tooltip>
  );
}

export function NavbarCustom() {
  const router = useRouter();
  const pathname = usePathname();

  function isActive(navPath: string): boolean {
    return navPath === pathname;
  }

  return pathname !== '/login' ? (
    <nav className={classes.navbar} style={{ height: '100%' }} >
      <Center>
        <BrandLogo height={52} width={60} />
      </Center>

      <div className={classes.navbarMain}>
        <Stack justify="center" gap={16}>
          {navigableMenuItems.map(
            (menuItem: NavigableMenuItem, _index): ReactElement | null =>
              (menuItem.enabled && (
                <NavbarLink
                  src={menuItem.src}
                  name={menuItem.name}
                  label={menuItem.label}
                  key={menuItem.label}
                  active={isActive(menuItem.path)}
                  onClick={() => {
                    router.push(menuItem.path);
                  }}
                />
              )) ||
              null,
          )}
        </Stack>
      </div>
      <UserActionMenu />
    </nav>
  ) : (
    <></>
  );
}
