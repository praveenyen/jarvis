'use client';
import { Menu, Stack, Tooltip, UnstyledButton } from '@mantine/core';
import classes from '@/components/sidenav/NavBar.module.css';
import CustomIcon from '@/components/icons/CustomIcons';
import { isAuthenticated, user } from '@/store/modules/user';
import authHelper from '@/auth/ClientAuthHelper';
import { useAtom } from 'jotai/index';

function UserActionMenu() {
  const [userData, setUserDetails] = useAtom(user);
  const [, setIsAuthenticated] = useAtom(isAuthenticated);

  /*After user unauthenticated
   * Cognito redirects it to the logout page but the middleware intercepts it
   * and redirects him back to the login page
   * */
  function handleSignout() {
    setUserDetails(null);
    setIsAuthenticated(false);
    authHelper.signout();
  }
  return (
    <Stack justify="center" gap={12}>
      <Menu shadow="md" width={200}>
        <Menu.Target>
          <div>
            <Tooltip
              label={userData?.name || 'user'}
              position="right"
              transitionProps={{ duration: 0 }}
            >
              <UnstyledButton
                onClick={() => {}}
                className={classes.link}
                aria-label="userIconNavItem"
              >
                <CustomIcon
                  src={'MaterialIcon'}
                  name={'MdOutlinePerson2'}
                  size={'22px'}
                />
              </UnstyledButton>
            </Tooltip>
          </div>
        </Menu.Target>
        <Menu.Dropdown>
          <Menu.Item
            leftSection={
              <CustomIcon src={'MaterialIcon'} name={'MdOutlineLogout'} />
            }
            onClick={() => handleSignout()}
          >
            Log out
          </Menu.Item>
        </Menu.Dropdown>
      </Menu>
    </Stack>
  );
}

export default UserActionMenu;
