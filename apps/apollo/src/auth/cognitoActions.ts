import { JWT, signInWithRedirect } from 'aws-amplify/auth';
import Cookies from 'js-cookie';
// import { createSession } from './session';

export async function handleSignIn() {
  try {
    const response = await signInWithRedirect();
  } catch (error) {
    console.log('ERROR from SIGNIN WITH REDIRECT', error);
    return;
  }
}
/**
 * @returns {Promise<void>} - A promise that resolves to void.
 */
export async function handleSignOut(): Promise<void> {
  try {
    const cookies = Cookies.get();
    for (const key in cookies) {
      if (cookies.hasOwnProperty(key)) {
        Cookies.remove(key);
      }
    }
    window.location.reload();
  } catch (error) {
    console.log(error);
  }
}

// export async function signup(token:JWT | "") {

//   await createSession(token)

// }
