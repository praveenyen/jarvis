import { NextRequest, NextResponse } from 'next/server';
import ServerAuthHelper from '@/auth/ServerAuthHelper';
import HttpClientException from '@/lib/exceptions/HttpClientException';
import { getLoanProductCodes } from '@/lib/queries/groot/services';
import { normalizeErrorObject } from '@/lib/utils/routeHandlerUtils';

export async function GET(request: NextRequest) {
  const token = await ServerAuthHelper.getTokenFromCookies();
  const authHeaders = ServerAuthHelper.getAuthHeader(token);
  try {
    const res = await getLoanProductCodes(authHeaders);
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
