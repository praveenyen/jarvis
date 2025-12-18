import {
  AuthError,
  AuthSession,
  decodeJWT,
  fetchAuthSession,
  JWT,
  signInWithRedirect,
  signOut,
} from 'aws-amplify/auth';
import AppException from '@/lib/exceptions/AppException';
import { JwtPayload } from 'aws-jwt-verify/jwt-model';
import { User } from '@/lib/models/User';

export type Token = {
  idToken: string;
  accessToken: string;
  refreshToken?: string;
};

class ClientAuthHelper {
  constructor() {}

  /**This function will only execute if the user doesnt have tokens
   * as the user first lands on the middleware page.
   * If he has tokens then he is automatically redirected to
   * the home page
   * */

  /*https://docs.amplify.aws/nextjs/build-a-backend/auth/reference/*/
  async signIn() {
    try {
      await signInWithRedirect({ provider: 'Google' });
    } catch (error: unknown) {
      /**https://github.com/aws-amplify/amplify-js/issues/12727#issuecomment-2312871769*/
      if (error instanceof AuthError) {
        throw new AppException(error.name, error.message);
      }
      throw error;
    }
  }

  async getToken(): Promise<Token> {
    const response: AuthSession = await fetchAuthSession();
    const authTokens = response.tokens;
    const token: Token = {
      idToken: authTokens?.idToken?.toString() || '',
      accessToken: authTokens?.accessToken.toString() || '',
    };
    /*TODO try with different login email id*/
    return Promise.resolve(token);
  }

  parseJwtToken(token: string): User {
    try {
      const jwt: JWT = decodeJWT(token);
      const payload: JwtPayload = jwt.payload;
      return {
        email: payload.email as string,
        exp: payload.exp as number,
        name: payload.name as string,
        sub: payload.sub as string,
      };
    } catch (error: unknown) {
      throw new AppException('JWT_DECODE_ERROR', (error as Error).message);
    }
  }

  signout() {
    try {
      signOut();
    } catch (error: unknown) {
      if (error instanceof AuthError) {
        throw new AppException(error.name, error.message);
      }
      throw error;
    }
  }
}

const authHelper = new ClientAuthHelper();
export default authHelper;
