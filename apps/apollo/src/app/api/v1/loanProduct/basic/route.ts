import ServerAuthHelper from '@/auth/ServerAuthHelper';
import { NextResponse } from 'next/server';
import HttpClientException from '@/lib/exceptions/HttpClientException';
import { getLoanProductConfigs } from '@/lib/queries/groot/services';
import { normalizeErrorObject } from '@/lib/utils/routeHandlerUtils';

/** TODO : @subiksha */

export async function GET(request: Request): Promise<NextResponse> {
  const token = await ServerAuthHelper.getTokenFromCookies();
  const authHeaders = ServerAuthHelper.getAuthHeader(token);
  try {
    const res = await getLoanProductConfigs(authHeaders,{
      revalidateSec: 3600 * 10,
    });
    return NextResponse.json(res);
  } catch (error: unknown) {
    let statusCode = 500;
    if (error instanceof HttpClientException) {
      statusCode = error.statusCode ? error.statusCode : 500;
      return NextResponse.json(
        {
          ...normalizeErrorObject(error.getErrorResp()),
        },
        { status: statusCode },
      );
    }
    return NextResponse.json(
      { message: (error as Error).message },
      { status: statusCode },
    );
  }
}
