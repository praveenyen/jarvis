import { runWithAmplifyServerContext } from '@/auth/configureAmplifyServerSide';
import { cookies } from 'next/headers';
import { fetchAuthSession } from 'aws-amplify/auth/server';
import { RequestCookie } from 'next/dist/compiled/@edge-runtime/cookies';
import { User } from '@/lib/models/User';
import { JwtPayload } from 'aws-jwt-verify/jwt-model';
import AppException from '@/lib/exceptions/AppException';
import { decodeJWT, JWT } from 'aws-amplify/auth';

class ServerAuthHelper {
  getAuthHeader(token: string): Record<string, string> {
    if (process.env.USE_BASIC_AUTH === 'true') {
      return {
        Authorization: `${process.env.BASIC_AUTH}`,
      };
    } else {
      return {
        Authorization: `Bearer ${token}`,
      };
    }
  }

  parseJwtToken(token: string): User {
    /* TODO throw error*/
    const jwt: JWT = decodeJWT(token);
    const payload: JwtPayload = jwt.payload;
    return {
      email: payload.email as string,
      exp: payload.exp as number,
      name: payload.name as string,
      sub: payload.sub as string,
    };
  }

  async getTokenFromCookies(): Promise<string> {
    const cookieStore = await cookies();
    const allCookies = cookieStore.getAll();
    // get cookies which has a name idToken in it
    const idTokenCookie = allCookies.find((cookie: RequestCookie) => {
      return (
        cookie.name.startsWith('CognitoIdentityServiceProvider') &&
        cookie.name.endsWith('idToken')
      );
    });
    if (idTokenCookie === undefined) {
      throw new AppException('TOKEN_NOT_FOUND', 'Token not found in cookies');
    }
    return idTokenCookie.value;
  }

  async getTokenFromAmplify(): Promise<string | undefined> {
    const currentUserToken = await runWithAmplifyServerContext({
      nextServerContext: { cookies },
      operation: async (contextSpec) => {
        const session = await fetchAuthSession(contextSpec);
        return session.tokens?.idToken;
      },
    });
    if (currentUserToken) {
      return currentUserToken.toString();
    } else {
      throw new AppException(
        'TOKEN_NOT_FOUND',
        'Token not found from apmplify',
      );
    }
  }
}
export default new ServerAuthHelper();
