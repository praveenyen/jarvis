'use client';

import { useAtom } from 'jotai';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { user, isAuthenticated } from '@/store/atoms';
import authHelper, { Token } from '@/auth/ClientAuthHelper';
import { Center, Text, Stack } from '@mantine/core';
import AppException from '@/lib/exceptions/AppException';
import { User } from '@/lib/models/User';
import BeatLoader from 'react-spinners/BeatLoader';
import dynamic from 'next/dynamic';

const LoginPage = () => {
  const [, setUserDetails] = useAtom(user);
  const [, setIsAuthenticated] = useAtom(isAuthenticated);
  const router = useRouter();

  function clearStateUserData() {
    setUserDetails(null);
    setIsAuthenticated(false);
  }

  /**This function will only execute if the user doesnt have tokens
   * as the user first lands on the middleware page.
   * If he has tokens then he is automatically redirected to
   * the home page
   * */
  async function login(): Promise<void> {
    console.log('executing');
    try {
      await authHelper.signIn();
    } catch (error: unknown) {
      if (error instanceof AppException) {
        console.error('Error in sign in', error.name, error.message);
      } else {
        console.error(error);
      }
      /** TODO ABHISHEK: show error message on screen*/
    }
  }

  async function handleFirstLogin(): Promise<void> {
    const hash: string = window.location.hash;
    const params = new URLSearchParams(hash.substring(1));
    const accessToken = params.get('access_token');

    /*We can fetch from access token also but we have tried to use only
     * amplify functions to get tokens .
     * When the access token comes in the url (http://localhost:3000/login#access_token=abcd
     * the fetchAuthSession gives the correct details in the fronend
     *  */
    if (accessToken) {
      const token: Token = await authHelper.getToken();
      const user: User = authHelper.parseJwtToken(token.idToken);
      console.log(user);
      /* setIsAuthenticated(true)
      setUserDetails(user)*/

      window.history.replaceState(null, '', window.location.pathname);
      router.replace('/');
      return;
    }
  }

  useEffect(() => {
    /**TODO add comment*/
    const hash: string = window.location.hash;
    if (hash && hash.startsWith('#')) {
      handleFirstLogin();
    } else {
      clearStateUserData();
      login();
    }
  }, [router]);
  return (
    <Center style={{ height: '50vh' }}>
      <Stack gap={10} justify="center" align="center" w={'100%'}>
        <Text size={'xl'} c="black">
          Signing in...
        </Text>
        {/* <MantineLoader type="dots" size="lg" color="gray" /> */}
        <BeatLoader
          color="gray"
          loading={true}
          size={10}
          aria-label="Loading Spinner"
          data-testid="loader"
        />
      </Stack>
    </Center>
  );
};

export default LoginPage;
